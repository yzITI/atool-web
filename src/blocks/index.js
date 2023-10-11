import { defineAsyncComponent } from 'vue'
import loadingComponent from './Loading.vue'
import errorComponent from './Error.vue'

const blocks = {
  code: {
    name: 'Code',
    block: () => import('./Code.vue'),
    panel: () => import('./CodePanel.vue'),
    template: { code: 'const S = ctx.state\nS.hi = \'hello!\'', editable: true, visible: true, height: 'auto' }
  },
  html: {
    name: 'HTML',
    block: () => import('./HTML.vue'),
    panel: () => import('./HTMLPanel.vue'),
    template: { html: '<p>This is a paragraph!</p>' }
  },
  input: {
    name: 'Input',
    block: () => import('./Input.vue'),
    panel: () => import('./InputPanel.vue'),
    template: { key: 'input', label: 'label', type: 'text', placeholder: 'placeholder', hint: '' }
  },
  textarea: {
    name: 'Textarea',
    block: () => import('./Textarea.vue'),
    panel: () => import('./TextareaPanel.vue'),
    template: { key: 'textarea', label: 'label', rows: 5, placeholder: 'placeholder', hint: '' }
  },
  select: {
    name: 'Select',
    block: () => import('./Select.vue'),
    panel: () => import('./SelectPanel.vue'),
    template: { key: 'select', label: 'label', options: [], hint: '' }
  },
  table: {
    name: 'Table',
    block: () => import('./Table.vue'),
    panel: () => import('./TablePanel.vue'),
    template: { key: 'data', label: 'Table Title', columns: [{ key: 'name', label: 'Name' }] }
  }
}

for (const k in blocks) {
  const b = blocks[k]
  if (b.block) b.block = defineAsyncComponent({ loader: b.block, errorComponent, loadingComponent })
  if (b.panel) b.panel = defineAsyncComponent({ loader: b.panel, errorComponent, loadingComponent })
}

export default blocks