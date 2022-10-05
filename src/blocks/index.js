import { defineAsyncComponent } from 'vue'
import loadingComponent from './Loading.vue'
import errorComponent from './Error.vue'

const blocks = {
  html: {
    name: 'HTML',
    block: () => import('./HTML.vue'),
    panel: () => import('./HTMLPanel.vue'),
    template: { html: '<p>This is a paragraph!</p>' }
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
  if (b.block) b.block = defineAsyncComponent({ loader: b.block, errorComponent, loadingComponent })
  if (b.panel) b.panel = defineAsyncComponent({ loader: b.panel, errorComponent, loadingComponent })
}

export default blocks