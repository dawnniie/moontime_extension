(function() {

    let now = new Date()
    if (now.getFullYear() === 2019 && now.getMonth() === 5 && now.getDate() === 3) {
        chrome.storage.sync.get(["push"], (res) => {
            if (res.push !== "stable") {
                document.querySelector("html").setAttribute("epic", "")
            }
        })
    }


    window.addEventListener("moontime:updated", function() {
        document.querySelector("#section_1>.time").setAttribute("visible", "")
        document.querySelector("#section_1 .time .time").innerHTML = moon.formatMoonString("%MS:%MM:%M")
        document.querySelector("#section_1 .time .date").innerHTML = moon.formatMoonString("%MdT %MeMT, %MAT, %MC")
    })

    window.addEventListener("moontime:offset_updated", function(e) {
        document.querySelector(".info-overlay.sync .offset").innerHTML = "<strong>Offset: </strong>" + Math.round(e.detail * 100) / 100 + "m"
    })

    window.addEventListener("moontime:api_status_changed", function(e) {
        document.querySelector(".info-overlay.sync .status").innerHTML = "<strong>Status: </strong><span style='color: " + (e.detail ? "green'>Operational" : "red'>Disconnected") + "</span>"
        if (!e.detail) document.querySelector(".info-overlay.sync .offset").innerHTML = ""
        document.querySelector("#bottom-toolbar .icons-container .sync").innerHTML = e.detail ? "cloud_done" : "cloud_off"
        document.querySelector("#bottom-toolbar .icons-container .sync").style.color = e.detail ? "" : "red"
    })

    moon.init()

    let pageleft = () => {
        if (document.querySelector("#section_1").getAttribute("pinned") === "" && document.querySelector("#section_2").getAttribute("focused") === "") {
            document.querySelector("#paddle-right").removeAttribute("disabled")
            document.querySelector("#hover-detect-right").removeAttribute("disabled")
            document.querySelector("#section_2").removeAttribute("focused")
            window.setTimeout(() => {
                document.querySelector("#section_1").removeAttribute("pinned")
            }, 200)
        } else if (document.querySelector("#section_1").getAttribute("pinned") !== "") {
            document.querySelector("#paddle-left").setAttribute("disabled", "")
            document.querySelector("#hover-detect-left").setAttribute("disabled", "")
            document.querySelector("#section_1").setAttribute("pinned", "")
            window.setTimeout(() => {
                document.querySelector("#section_0").setAttribute("focused", "")
            }, 200)
        }
    }

    document.querySelector("#hover-detect-left").addEventListener("click", pageleft)
    document.querySelector("#paddle-left").addEventListener("click", pageleft)

    let pageright = () => {
        if (document.querySelector("#section_1").getAttribute("pinned") === "" && document.querySelector("#section_0").getAttribute("focused") === "") {
            document.querySelector("#paddle-left").removeAttribute("disabled")
            document.querySelector("#hover-detect-left").removeAttribute("disabled")
            document.querySelector("#section_0").removeAttribute("focused")
            window.setTimeout(() => {
                document.querySelector("#section_1").removeAttribute("pinned")
            }, 200)
        } else if (document.querySelector("#section_1").getAttribute("pinned") !== "") {
            document.querySelector("#paddle-right").setAttribute("disabled", "")
            document.querySelector("#hover-detect-right").setAttribute("disabled", "")
            document.querySelector("#section_1").setAttribute("pinned", "")
            window.setTimeout(() => {
                document.querySelector("#section_2").setAttribute("focused", "")
            }, 200)
        }
    }

    document.querySelector("#hover-detect-right").addEventListener("click", pageright)
    document.querySelector("#paddle-right").addEventListener("click", pageright)

    window.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") {
            e.preventDefault()
            pageleft()
            document.querySelector("#paddle-left").className = "is-active"
        } else if (e.key === "ArrowRight") {
            e.preventDefault()
            pageright()
            document.querySelector("#paddle-right").className = "is-active"
        }
    })

    window.addEventListener("keyup", e => {
        if (e.key === "ArrowLeft") {
            e.preventDefault()
            document.querySelector("#paddle-left").className = ""
        } else if (e.key === "ArrowRight") {
            e.preventDefault()
            document.querySelector("#paddle-right").className = ""
        }
    })

    new Array("sync", "version", "help").forEach(overlay => {
        document.querySelector("#bottom-toolbar .icons-container ." + overlay).onclick = () => {
            console.log("yeah clicked")
            new Array("sync", "version", "help").forEach(ol => document.querySelector(".info-overlay." + ol).removeAttribute("is-active"))
            document.querySelector(".info-overlay." + overlay).setAttribute("is-active", "")
            document.querySelector("#bottom-toolbar").setAttribute("is-active", "")
        }
        document.querySelector(".info-overlay." + overlay + " .close").onclick = e => {
            e.path[0].parentElement.removeAttribute("is-active")
            document.querySelector("#bottom-toolbar").removeAttribute("is-active")
        }
    })

    // converter
    let converterSolar = new Date()
    let converterMoon = moon.solarToMoon(converterSolar.getTime())

    function changeConverterSolar(seconds) {
        converterSolar.setTime(converterSolar.getTime() + seconds * 1000)
        converterMoon = moon.solarToMoon(converterSolar.getTime())
        updateConverters()
    }

    function changeConverterMoon(mini_moon_moments) {
        converterMoon += mini_moon_moments * 200
        converterSolar.setTime(moon.moonToSolar(converterMoon))
        updateConverters()
    }

    let padZero = x => (String(x).length == 1) ? "0" + x : x

    function updateConverters() {
        // solar
        let values = [padZero(converterSolar.getHours()), ":", padZero(converterSolar.getMinutes()), ":", padZero(converterSolar.getSeconds()), "", converterSolar.getDate(), "/", converterSolar.getMonth() + 1, "/", String(converterSolar.getFullYear()).substring(2)]

        let elms = document.querySelectorAll("#converter_solar .values td")
        for (var i = 0; i < elms.length; i++) elms[i].innerHTML = values[i]
        document.querySelector("#solar_indicator_mon").innerHTML = ["Janrary", "Febrary", "March", "April", "May", "June", "July", "Augest", "September", "Octeober", "November", "Deecember"][converterSolar.getMonth()]

        // moon
        let fm = moon.formatMoonTime(converterMoon)
        let m_values = [padZero(fm["MS"]), ":", padZero(fm["MM"]), ":", padZero(fm["M"]), "", fm["Md"], "/", fm["MeM"], "/", fm["MA"], "/", fm["MC"]]
        let m_elms = document.querySelectorAll("#converter_moon .values td")
        for (var i = 0; i < m_elms.length; i++) m_elms[i].innerHTML = m_values[i]
        document.querySelector("#moon_indicator_mem").innerHTML = fm["MeMT"]
        document.querySelector("#moon_indicator_ann").innerHTML = fm["MAT"]

    }

    updateConverters()

    let elms = document.querySelectorAll("#solar_adjust_up td i")
    for (var i = 0; i < elms.length; i++) {
        elms[i].onclick = function(e) {
            changeConverterSolar(e.path[0].getAttribute("adjust-len"))
        }
    }

    elms = document.querySelectorAll("#solar_adjust_down td i")
    for (var i = 0; i < elms.length; i++) {
        elms[i].onclick = function(e) {
            changeConverterSolar(e.path[0].getAttribute("adjust-len") * -1)
        }
    }

    elms = document.querySelectorAll("#moon_adjust_up td i")
    for (var i = 0; i < elms.length; i++) {
        elms[i].onclick = function(e) {
            changeConverterMoon(e.path[0].getAttribute("adjust-len"))
        }
    }

    elms = document.querySelectorAll("#moon_adjust_down td i")
    for (var i = 0; i < elms.length; i++) {
        elms[i].onclick = function(e) {
            changeConverterMoon(e.path[0].getAttribute("adjust-len") * -1)
        }
    }


    document.querySelector("#section_2 .age").addEventListener("click", () => {
        let annuals = (moon.formatMoonTime(moon.currentSmoothTime(), false)["MC"] - moon.formatMoonTime(converterMoon, false)["MC"]) * 11 + (moon.formatMoonTime(moon.currentSmoothTime(), false)["MA"] - moon.formatMoonTime(converterMoon, false)["MA"])

        notify("Your moon age is " + annuals + "!")
    })
    

    function notify(t) {
        document.querySelector("#notification p").innerHTML = t
        document.querySelector("#notification").setAttribute("is-active", "")
    }

    document.querySelector("#notification i").addEventListener("click", () => document.querySelector("#notification").removeAttribute("is-active"))

    chrome.storage.sync.get(["moon3"], function(res) {
        if (!res.moon3) {
            notify("Welcome to Moon 3")
            document.querySelector("#notification i").addEventListener("click", () => chrome.storage.sync.set({ 'moon3': true }))
        }
    })

})();
