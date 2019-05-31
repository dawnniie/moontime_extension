(function() {

    window.addEventListener("moontime:updated", function(e) {
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

})();