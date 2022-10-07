export function run (fcode, ctx) {
  const instance = {}
  const iframe = document.createElement('iframe')
  iframe.sandbox = 'allow-scripts'
  iframe.width = iframe.height = 0
  iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(`<script>const c=${JSON.stringify(ctx)};(async ctx=>{${fcode}})(c).then(()=>parent.postMessage(c,'${window.location.origin}'))</script>`)
  instance.iframe = iframe
  instance.onReturn = () => {}
  window.onmessage = e => {
    if (e.target !== window && e.origin !== 'null') return
    instance.status = 'done'
    instance.result = e.data
    document.body.removeChild(iframe)
    instance.onReturn(e.data)
  }
  document.body.appendChild(iframe)
  instance.status = 'running'
  return instance
}
