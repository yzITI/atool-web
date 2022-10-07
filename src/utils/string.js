export function T (template, data) {
  let res = template
  const regexp = /{{(((?!{{).)*?)}}/g
  while (regexp.test(res)) {
    const keys = res.match(regexp).map(x => x.substring(2, x.length - 2))
    for (const k of keys) res = res.replaceAll('{{' + k + '}}', data[k.trim()])
  }
  return res
}