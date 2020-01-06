import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Curve'
const options = {
  marks: false,
  bars: false,
  axis: {
    valuesY: true,
    linesY: true,
    linesX: true,
    valuesX: true
  },
  curve: {
    type: 'monotoneX',
    stroke: colors.red,
    style: {
      stroke: colors.color,
      'stroke-width': 2,
      size: 1
    }
  },
  curveBack: {
    close: true,
    style: {
      stroke: 'none',
      opacity: 0.5
    },
    gradient: {
      stroke: false,
      fill: true
    }
  },
  domain: {
    min: 0
  },
  colors: [
    colors.color
  ]
}
const controls = {
  marks: {
    type: 'checkbox'
  }
}
export default createExampleData({ title, options, controls })
