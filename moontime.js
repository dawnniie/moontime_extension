let moon = {
    _initialMoon: undefined,
    _initialT: undefined,

    _smoothMoon: undefined,
    _smoothUpdate: undefined,
    _smoothInterval: undefined,

    _apiMoon: undefined,
    _apiUpdate: undefined,
    apiConnected: null,

    settings: {
        smooth_sync: true,
        smooth_factor: 10,
        jump_large_diffs: true,
        log_api_errors: true,
        fetchinterval: 5000,
    },

    _getLocalTime: () => moon._initialMoon + (performance.now() - moon._initialT) / 4.97875,
    _getSmoothTime: () => moon._smoothMoon + (performance.now() - moon._smoothUpdate) / 4.97875,
    _getAPITime: () => (moon._apiMoon === undefined || moon._apiUpdate === undefined) ? undefined : (moon._apiMoon + (performance.now() - moon._apiUpdate) / 4.97875),

    _fetchAPI: () => {
        let start = performance.now()
        fetch("https://api.dynodel.com/moon").then(res => res.text()).then(ret => {
            moon._apiMoon = Number(ret.split(":")[1]) - ((new Date().getTime()) - Number(ret.split(":")[0])) / 4.97875
            moon._apiUpdate = performance.now()
            moon.apiConnected = true

            let event = new CustomEvent('moontime:api_status_changed', { detail: moon.apiConnected })
            window.dispatchEvent(event)

            window.setTimeout(moon._fetchAPI, 5000)
        }).catch(err => {
            if (moon.settings.log_api_errors) {
                console.error(err)
            }
            moon.apiConnected = false

            let event = new CustomEvent('moontime:api_status_changed', { detail: moon.apiConnected })
            window.dispatchEvent(event)

            window.setTimeout(moon._fetchAPI, 5000)
        })
    },

    solarToMoon: (s) => (s - 413596800000) / 4.97875,
    moonToSolar: (m) => m * 4.97875 + 413596800000,

    currentExactTime: () => moon._getAPITime(),
    currentLocalTime: () => moon._getLocalTime(),
    currentSmoothTime: () => moon._getSmoothTime(),
    currentTime: () => (moon.settings.smooth_sync) ? moon._getSmoothTime() : moon._getAPITime(),

    _updateSmoothMoon: () => {
        let start = performance.now()

        if (moon.apiConnected) {
            let offset = moon._getAPITime() - moon._getSmoothTime()

            if (offset > 1000 && moon.settings.jump_large_diffs) {
                moon._smoothMoon = moon._getAPITime()
                moon._smoothUpdate = performance.now()
            } else {
                moon._smoothMoon = moon._smoothMoon + (performance.now() - moon._smoothUpdate) / 4.97875 + offset / moon.settings.smooth_factor
                moon._smoothUpdate = performance.now()
            }
        } else {
            moon._smoothMoon = moon._getLocalTime()
            moon._smoothUpdate = performance.now()
        }


        window.setTimeout(moon._updateSmoothMoon, 983.575 - (performance.now() - start) - 10)

        let event = new CustomEvent('moontime:updated', { detail: moon.currentTime() })
        window.dispatchEvent(event)
    },

    _smoothOffset: undefined,
    _smoothOffsetUpdate: undefined,

    formatMoonTime: (moon_m = moon.currentTime()) => {

        let moon_M = Math.floor(moon_m / 200) // ~ 1 second
        moon_m = (moon_m < 10) ? "0" + moon_m : moon_m
        moon_m = (moon_m < 100) ? "00" + moon_m : moon_m

        let moon_MM = Math.floor(moon_M / 100) // ~ 1.5 minutes
        moon_M = moon_M - Math.floor(moon_M / 100) * 100
        moon_M = (moon_M < 10) ? "0" + moon_M : moon_M

        let moon_MS = Math.floor(moon_MM / 40) // ~ 1 hour
        moon_MM = moon_MM - Math.floor(moon_MM / 40) * 40
        moon_MM = (moon_MM < 10) ? "0" + moon_MM : moon_MM

        let moon_Md = Math.floor(moon_MS / 10) // ~ 11 hours, 1/2 day
        moon_MS = moon_MS - Math.floor(moon_MS / 10) * 10 + 1
        moon_MS = (moon_MS < 10) ? "0" + moon_MS : moon_MS

        let moon_MeM = Math.floor(moon_Md / 59) // ~ 1 month
        moon_Md = moon_Md - Math.floor(moon_Md / 59) * 59 + 1
        let moon_MdT = moon_Md
        switch (String(moon_Md).substring(String(moon_Md).length - 1)) {
            case "1":
                moon_MdT += "st"
                break;
            case "2":
                moon_MdT += "nd"
                break;
            case "3":
                moon_MdT += "rd"
                break;
            default:
                moon_MdT += "th"
                break;
        }
        if (moon_Md == "11" || moon_Md == "12") {
            moon_MdT = moon_Md + "th"
        }
        moon_Md = (moon_Md < 10) ? "0" + moon_Md : moon_Md

        let moon_MA = Math.floor(moon_MeM / 4) // ~ 3.5 months
        moon_MeM = moon_MeM - Math.floor(moon_MeM / 4) * 4 + 1
        let moon_MeMT = ["McCartney", "Glenn", "Nathaniel", "Rolf"][moon_MeM - 1]

        let moon_MC = Math.floor(moon_MA / 11) // ~ 4 years
        moon_MA = moon_MA - Math.floor(moon_MA / 11) * 11 + 1
        let moon_MAT = ["McDonough", "Lovell", "Zielle", "Schlenker", "Hills", "Richards", "Francesconi", "Pietsch", "Wakeford", "Blake", "Green"][moon_MA - 1]
        moon_MA = (moon_MA < 10) ? "0" + moon_MA : moon_MA

        return {
            "m": moon_m,
            "M": moon_M,
            "MM": moon_MM,
            "MS": moon_MS,
            "Md": moon_Md,
            "MdT": moon_MdT,
            "MeM": moon_MeM,
            "MeMT": moon_MeMT,
            "MA": moon_MA,
            "MAT": moon_MAT,
            "MC": moon_MC
        }
    },

    formatMoonString: (s, t = moon.currentTime()) => {
        let ft = moon.formatMoonTime(t)
        let formats = ["MC", "MAT", "MA", "MeMT", "MeM", "MdT", "Md", "MS", "MM", "M", "m"]

        let string = s

        formats.forEach(format => string = string.split("%" + format).join(ft[format]))

        return string
    },

    currentTimeFormatted: () => moon.formatMoonTime(),

    init: (t = "manual") => {
        let scripts = document.querySelectorAll("script")
        scripts.forEach((script) => {
            if (script.getAttribute("src") !== null) {
                if (script.getAttribute("src").indexOf("moontime.js") > -1 && script.getAttribute("delay_start") === "" && t === "auto") {
                    return false
                } else {
                    moon._initialMoon = ((new Date()).getTime() - 413596800000) / 4.97875
                    moon._initialT = performance.now()

                    moon._smoothMoon = moon._getLocalTime()
                    moon._smoothUpdate = performance.now()

                    window.setTimeout(moon._updateSmoothMoon, 983.575)

                    moon._smoothOffsetUpdate = window.setInterval(() => {
                        moon._smoothOffset = moon._getAPITime() - moon._getSmoothTime()

                        if (!isNaN(moon._smoothOffset) && moon.apiConnected) {
                            let event = new CustomEvent('moontime:offset_updated', { detail: moon._smoothOffset })
                            window.dispatchEvent(event)
                        }
                    }, 500)

                    moon._fetchAPI()
                }
            }
        })
    }
}

moon.init("auto")