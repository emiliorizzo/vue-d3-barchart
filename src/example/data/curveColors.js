import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Curve Gradient'
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
    type: 'Bundle',
    style: {
      stroke: 'none'
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
    colors.red, colors.yellow
  ],
  colorScale: 'Linear'
}
const controls = {
  marks: {
    type: 'checkbox'
  }
}
export default createExampleData({ title, options, controls })
