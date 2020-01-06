import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Curve with points'
const options = {
  marks: {
    type: 'circle',
    size: 9
  },
  bars: false,
  axis: {
    valuesY: true,
    linesY: true,
    linesX: true,
    valuesX: true
  },
  curve: {
    style: {
      stroke: colors.red,
      'stroke-width': 2,
      opacity: 0.5
    }
  },
  domain: {
    min: 0
  },
  colors: [
    colors.red
  ]
}
const controls = {
  marks: {
    type: 'checkbox'
  }
}
export default createExampleData({ title, options, controls })
