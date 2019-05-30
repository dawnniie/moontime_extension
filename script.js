window.setTimeout(() => {
    document.body.removeAttribute("preload")
}, 10)

window.addEventListener("moontime:updated", function(e) {
    document.querySelector("#section_1>.time").removeAttribute("invisible")
    document.querySelector("#section_1 .time .time").innerHTML = moon.formatMoonString("%MS:%MM:%M")
    document.querySelector("#section_1 .time .date").innerHTML = moon.formatMoonString("%MdT %MeMT, %MAT, %MC")
})

window.addEventListener("moontime:offset_updated", function(e) {
    console.log("Offset: " + e.detail)
})