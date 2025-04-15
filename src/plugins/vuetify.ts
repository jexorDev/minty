/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { VDateInput } from 'vuetify/labs/components'

const appTheme: ThemeDefinition = {
  dark: true,
  colors: {    
    primary: '#6C3BAA',
    'primary-darken-1': '#3700B3',
    secondary: '#5411AB',
    'secondary-darken-1': '#3CAE63',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDateInput
  },
  theme: {
    defaultTheme: 'appTheme',    
    themes: {
      appTheme
    }
  },
})
