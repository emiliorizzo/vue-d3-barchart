import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Points'
const options = {
  marks: {
    type: 'point',
    size: 10,
    color: 'red'
  },
  bars: false,
  axis: {
    valuesY: true,
    linesY: true,
    linesX: true,
    valuesX: true
  },
  domain: {
    min: 0
  },
  colors: [
    colors.red, colors.color
  ]
}
const controls = {
  marks: {
    type: 'checkbox'
  }
}
export default createExampleData({ title, options, controls })
