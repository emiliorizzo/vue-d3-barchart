import { createExampleData, randomValue } from './lib'
import colors from '../../colors.json'
const title = 'Bars'
const chartData = [2, 7, 10, 11, 12, 14, 15, 21, 30, 31, 39, 50].map(x => {
  let y = randomValue(1, 30)
  return { x, y }
})
const options = {
  marks: false,
  axis: {
    valuesY: true,
    linesY: true,
    linesX: true,
    valuesX: true
  },
  margin: 0,
  domain: {
    min: 0
  },
  getX: (d) => d.x,
  getY: (d) => d.y,
  colors: [
    colors.red, colors.blue
  ]
}
export default createExampleData({ title, options, chartData })
