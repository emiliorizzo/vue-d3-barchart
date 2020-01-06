import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Curve'
const options = {
  marks: {
    type: 'square',
    size: 5
  },
  bars: false,
  axis: {
    valuesY: true,
    linesY: true,
    linesX: true,
    valuesX: true
  },
  curve: {
    type: 'Step',
    stroke: colors.red,
    style: {
      stroke: colors.red,
      'stroke-width': 1,
      opacity: 0.2
    }
  },
  curveBack: {
    close: true,
    style: {
      stroke: 'none',
      opacity: 0.2
    },
    gradient: {
      stroke: false,
      fill: true
    }
  },
  domain: {
    min: 0
  },
  colors: {
    20: colors.red,
    10: colors.blue,
    0: colors.yellow
  }
}
const controls = {
  marks: {
    type: 'checkbox'
  }
}
export default createExampleData({ title, options, controls })
