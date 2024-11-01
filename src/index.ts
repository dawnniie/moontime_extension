import { Moon } from '../lib/moontime/moontime.js'
const moon = new Moon()

moon.addEventListener('update', () => {
    document.querySelector('#section_1>.time')!.setAttribute('visible', '')
    document.querySelector('#section_1 .time .time')!.innerHTML = moon.formatMoonString('%MSP:%MMP:%MP')
    document.querySelector('#section_1 .time .date')!.innerHTML = moon.formatMoonString('%MdT %MeMT, %MAT, %MC')
})

moon.addEventListener('offset_update', e => {
    document.querySelector('#bottom-widget .sync-on strong')!.innerHTML = `${Math.round(e.offset * 100) / 100}`
})

moon.addEventListener('api_status_update', function(e) {
    document.querySelector<HTMLDivElement>('#bottom-widget .sync-off')!.style.display = e.connected ? 'none' : 'block'
    document.querySelector<HTMLDivElement>('#bottom-widget .sync-on')!.style.display = e.connected ? 'block' : 'none'
})

const paddle = { left: document.querySelector<HTMLDivElement>('.paddle.left')!, right: document.querySelector<HTMLDivElement>('.paddle.right')! }
const hover = { left: document.querySelector<HTMLDivElement>('.hover-detect.left')!, right: document.querySelector<HTMLDivElement>('.hover-detect.right')! }
const setDisabled = (side: 'left' | 'right', disabled: boolean) => [paddle, hover].forEach(type => type[side].setAttribute('data-disabled', String(disabled)))

let section: 0 | 1 | 2 = 1
let transition: number | null = null
const sections = [0, 1, 2].map(s => document.querySelector(`#section_${s}`)) as [HTMLDivElement, HTMLDivElement, HTMLDivElement]
const page = (direction: 1 | -1) => {
    const target = (section + direction) as 0 | 1 | 2
    if (target < 0 || target > 2) return

    if (transition !== null) clearTimeout(transition)
    setDisabled('left', target === 0)
    setDisabled('right', target === 2)
    document.querySelector('#overlay')!.setAttribute('data-showing', String(target !== 1))

    if (target === 1) {
        sections.filter((_, i) => i !== 1).forEach(section => section.removeAttribute('focused'))
        transition = setTimeout(() => sections[1].removeAttribute('pinned'), 200)
    } else {
        sections[1].setAttribute('pinned', '')
        transition = setTimeout(() => sections[target].setAttribute('focused', ''), 200)
    }

    section = target
}

hover.left.addEventListener('click', () => page(-1))
paddle.left.addEventListener('click', () => page(-1))
hover.right.addEventListener('click', () => page(1))
paddle.right.addEventListener('click', () => page(1))

window.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    page(e.key === 'ArrowLeft' ? -1 : 1)
    paddle[e.key === 'ArrowLeft' ? 'left' : 'right'].classList.add('is-active')
})

window.addEventListener('keyup', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    paddle[e.key === 'ArrowLeft' ? 'left' : 'right'].classList.remove('is-active')
})

// converter
let converterSolar = new Date()
let converterMoon = moon.solarToMoon(converterSolar.getTime())

const padZero = (num: number) => String(num).padStart(2, '0')
function updateConverters() {
    // solar
    const values = [padZero(converterSolar.getHours()), ':', padZero(converterSolar.getMinutes()), ':', padZero(converterSolar.getSeconds()), '', converterSolar.getDate(), '/', converterSolar.getMonth() + 1, '/', String(converterSolar.getFullYear()).substring(2)]
    const elms = document.querySelectorAll('.converter.solar .values td')
    for (var i = 0; i < elms.length; i++) elms[i]!.innerHTML = String(values[i])
    document.querySelector('.converter.solar .hint.month')!.innerHTML = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][converterSolar.getMonth()]!

    // moon
    const fm = moon.formatMoonTime(converterMoon)
    const m_values = [fm.moonSegmentsPadded, ':', fm.moonMomentsPadded, ':', padZero(fm.miniMoonMoments), '', fm.moonDays, '/', fm.megaMoonMoment, '/', fm.moonAnnual, '/', fm.moonChunk]
    const m_elms = document.querySelectorAll('.converter.moon .values td')
    for (var i = 0; i < m_elms.length; i++) m_elms[i]!.innerHTML = String(m_values[i])
    document.querySelector('.converter.moon .hint.moment')!.innerHTML = fm.megaMoonMomentByName
    document.querySelector('.converter.moon .hint.annual')!.innerHTML = fm.moonAnnualByName
}

updateConverters()

document.querySelectorAll('.solar-adjust td[data-dir]').forEach(e => e.addEventListener('click', () => {
    const functions = { get: `get${e.getAttribute('data-unit')}` as 'getSeconds', set: `set${e.getAttribute('data-unit')}` as 'setSeconds' }
    const dir = Number(e.getAttribute('data-dir'))
    converterSolar[functions.set](converterSolar[functions.get]() + dir)
    converterMoon = moon.solarToMoon(converterSolar.getTime())
    updateConverters()
}))

document.querySelectorAll('.moon-adjust td[data-size]').forEach(e => e.addEventListener('click', () => {
    const size = Number(e.getAttribute('data-size'))
    converterMoon += (size * 200)
    converterSolar = new Date(moon.moonToSolar(converterMoon))
    updateConverters()
}))

document.querySelector('#section_2 .age')!.addEventListener('click', () => {
    const annuals = (moon.formatMoonTime().moonChunk - moon.formatMoonTime(converterMoon).moonChunk) * 11 + (moon.formatMoonTime().moonAnnual - moon.formatMoonTime(converterMoon).moonAnnual)
    document.querySelector('#section_2 .age')!.innerHTML = document.querySelector('#section_2 .age')!.innerHTML.split(' - ')[0] + ` - your moon age is ${annuals} annuals!`
})
