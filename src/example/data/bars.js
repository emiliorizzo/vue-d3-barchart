import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Bars'
const options = {
  marks: false,
  axis: true,
  margin: 0,
  domain: {
    min: 0
  },
  colors: [
    colors.red, colors.yellow
  ]
}
export default createExampleData({ title, options })
