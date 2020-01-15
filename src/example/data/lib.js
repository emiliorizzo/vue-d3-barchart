
import defaultOptions from '../../defaultOptions'
export const dataObject = (v, d = '') => { return { v, d } }
export const randomValue = (f = 1, t = 20) => Math.floor(Math.random() * t) + f
export const randomData = ({ q, f, t } = { q: 30, f: 1, t: 20 }) => {
  return [...Array(q)].map(() => dataObject(randomValue(f, t)))
}
export const createExampleData = ({ title, chartData, options, controls }) => {
  title = title || 'example'
  chartData = chartData || randomData()
  options = options || defaultOptions
  options = (!options.getY) ? Object.assign(options, { getY: (d) => d.v }) : options
  return { title, chartData, options, controls }
}
