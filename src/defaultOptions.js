export default {
  labels: {
    x: false,
    y: false
  }, // render labels
  axis: false, // render axis
  padding: 0.1, // bar padding
  colors: ['orangered', 'lightgreen'], // colors [max, min] or null
  colorInterpol: null, // color Interpolator
  getY: null, // function to get / format Y value
  getX: null, // function to get / format X value
  line: true, // render value line
  xUnits: '', // x  suffix
  yUnits: '', //  y suffix
  domain: { min: null, max: null }, // graph domain, nulls are evaluated as default
  marks: {
    type: 'point',
    size: 10,
    style: null
  },
  curve: null,
  debug: false,
  axisTicks: 5,
  bars: {
    gradient: false
  },
  tip: true,
  fontSize: 10,
  tipBack: true,
  autoSize: {
    w: 180,
    h: 60
  }
}
