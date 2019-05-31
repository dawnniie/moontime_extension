(function() {

    window.addEventListener("moontime:updated", function(e) {
        document.querySelector("#section_1>.time").setAttribute("visible", "")
        document.querySelector("#section_1 .time .time").innerHTML = moon.formatMoonString("%MS:%MM:%M")
        document.querySelector("#section_1 .time .date").innerHTML = moon.formatMoonString("%MdT %MeMT, %MAT, %MC")
    })

    window.addEventListener("moontime:offset_updated", function(e) {
        console.log("Offset: " + e.detail)
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

})();