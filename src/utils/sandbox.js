export function run (fcode, ctx) {
  const instance = {}
  const iframe = document.createElement('iframe')
  iframe.sandbox = 'allow-scripts'
  iframe.width = iframe.height = 0
  iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(`<script>const c=${JSON.stringify(ctx)},o='${window.location.origin}',r=()=>parent.postMessage(c,o),f=e=>parent.postMessage(e,o);(async ctx=>{${fcode}})(c).then(r).catch(f)</script>`)
  instance.iframe = iframe
  instance.onReturn = () => {}
  const listener = e => {
    if (e.target !== window && e.origin !== 'null') return
    instance.status = 'done'
    instance.result = e.data
    document.body.removeChild(iframe)
    instance.onReturn(e.data)
    window.removeEventListener('message', listener)
  }
  window.addEventListener('message', listener)
  document.body.appendChild(iframe)
  instance.status = 'running'
  return instance
}
