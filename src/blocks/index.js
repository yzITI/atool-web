import { defineAsyncComponent } from 'vue'
import loadingComponent from './Loading.vue'
import errorComponent from './Error.vue'

const blocks = {
  html: {
    name: 'HTML',
    block: () => import('./HTML.vue'),
    // panel: () => import('./HTMLPanel.vue'),
    template: { html: 'html content' }
  }/*,
  input: {
    name: 'Input',
    block: () => import('./Input.vue'),
    // panel: () => import('./InputPanel.vue'),
    template: { title: 'title', placeholder: 'placeholder' }
  },
  select: {
    name: 'Selector',
    block: () => import('./Select.vue'),
    // panel: () => import('./SelectPanel.vue'),
    template: { title: 'title', options: ['Option 1', 'Option 2'] }
  } */
}

for (const k in blocks) {
  const b = blocks[k]
  b.block = defineAsyncComponent({ loader: b.block, errorComponent, loadingComponent })
  // b.panel = defineAsyncComponent({ loader: b.panel, errorComponent, loadingComponent })
}

export default blocks