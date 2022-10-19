export function T (template, data) {
  let res = template
  const regexp = /{{(((?!{{).)*?)}}/g
  while (regexp.test(res)) {
    const keys = res.match(regexp).map(x => x.substring(2, x.length - 2))
    for (const k of keys) res = res.replaceAll('{{' + k + '}}', data[k.trim()])
  }
  return res
}

const LS = window.localStorage
let locale = LS.locale || 0

export function setLocale (l) {
  LS.locale = l
  window.location.reload()
}
if (!LS.locale) setLocale(navigator.language.indexOf('zh') === 0 ? 1 : 0)

export function I (template, choice = locale) {
  let res = template
  const regexp = /\[\[(((?!\[\[).)*?)\]\]/g
  while (regexp.test(res)) {
    const keys = res.match(regexp).map(x => x.substring(2, x.length - 2))
    for (const k of keys) res = res.replaceAll('[[' + k + ']]', k.split('|').length > choice ? k.split('|')[choice] : (k.split('|')[0] || ''))
  }
  return res
}

export function IT (template, data, choice = locale) {
  return I(T(template, data), choice)
}
