<template lang="pug">
  .d3-bar-chart(@mousemove.prevent="moveLine")
    svg(v-if='bars.length' :width="w" :height="h")
      //- Bars
      g(v-if='bars' v-for="d,i in bars" class="bars")
        //- visible bar  
        rect(:width="d.w" :height="d.y" :x='barX(d)' :y='barY(d)' :style='barStyle(d)' class="bar" @click='barClick($event,d)')
        //- dummy bar to capture mouse events
        rect( v-if='opts.value || opts.line' :width="d.w" :height="h" :x="barX(d)" y='0' class="dummy-bar"
          @mouseover.prevent='startMove($event,d)'
          @mouseleave='stopMove($event,d)' 
          @click='barClick($event,d)'
          )
        //- Rulers
        g(v-if='opts.rulers' class="rulers")
          rect(:x='d.x + margin + d.w / 2' :y='h -4' width='1' height='4' class="rulers-dot")
          rect(x='0' :y='h - d.y - fontSize' width='4' height='1' class="rulers-dot")
        //- Labels
        g(v-if='opts.labels' class="labels")
          text(:font-size="fontSizeFixed" class="bar-text x-axis" :x="txtX(d)" :y="h") {{d.yv}}
          text(:font-size="fontSizeFixed" class="bar-text y-axis" x="0" :y="h - d.y") {{d.xv}}
      //- Curve
      g(v-if='opts.curve' class="curve")
        path(:d='curve')
      //-Curve point
      g(v-if='opts.points' class="points")
        circle(v-for="d,i in bars" :r='pointRadius' :cx='barX(d) + barW /2' :cy='barY(d)' :style='pointStyle(d)' class="point")
      //- Axis
      g(v-if='opts.axis' class="axis")
       line(x1='0' :x2='w' :y1='h-2' :y2='h-2' class="x-axis")
       line(x1='2' x2='2' y1='0' :y2='h' class="y-axis")
      //- Line
      g(v-if="opts.line" v-show='over' class="chart-line")
        line(:x1='lineX' :x2='lineX' :y1='0' :y2='h - margin' class="line" )
      //- Value  
      g(v-if="opts.value" v-show='over' class="chart-line")
        text(:font-size='fontSizeFixed' :x='lineX + fontSizeFixed' :y='fontSizeFixed' class="label") {{over.xv + " "+ opts.yUnits}}
        
</template>
<script>
import * as d3array from 'd3-array'
import * as d3scale from 'd3-scale'
import * as d3Shape from 'd3-shape'
const d3 = Object.assign({}, d3array, d3scale, d3Shape)
const defaultOptions = {
  labels: false, // render labels
  axis: false, // render axis
  rulers: false, // render rules
  padding: 0.1, // bar padding
  colors: ['orangered', 'lightgreen'], // colors [max, min] or null
  colorInterpol: null, // color Interpolator
  getY: null, // function to get / format Y value
  getX: null, // function to get / format X value
  line: true, // render value line
  xUnits: '', // x  suffix
  yUnits: '', //  y suffix
  domain: { min: null, max: null }, // graph domain, nulls are evaluated as default
  points: {
    radius: 0,
    style: null
  },
  curve: {
    type: 'curve'
  },
  bars: true,
  value: true,
  autoSize: {
    w: 180,
    h: 60
  }
}
export default {
  name: 'D3-bar-chart',
  props: {
    data: {
      type: Array
    },
    options: {
      type: Object,
      default: () => {
        return Object.assign({}, defaultOptions)
      }
    }
  },
  data () {
    return {
      w: 800,
      h: 500,
      cInterpol: null,
      mouseX: 30,
      mouseOffset: {
        x: 0,
        y: 0
      },
      over: false,
      getY: Math.abs,
      opts: Object.assign({}, defaultOptions)
    }
  },
  created () {
    for (let op in this.options) {
      this.opts[op] = this.options[op]
    }

    // conditional color interpolator
    let ci = this.opts.colorInterpol
    if (ci) {
      if (typeof (ci) === 'function') {
        this.cInterpol = ci
      } else {
        if (typeof (d3[ci]) === 'function') {
          this.cInterpol = d3[ci]
        }
      }
    }
    // Y get / format
    let getY = this.options.getY
    if (getY && typeof (getY) === 'function') {
      this.getY = getY
    }
    // X get / format
    let getX = this.options.getX
    if (getX && typeof (getX) === 'function') {
      this.getX = getX
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    options (newValue) {
      this.onResize()
    }
  },
  computed: {
    bars () {
      let h = this.h - this.margin
      let w = this.w - this.margin
      let data = this.mappedData

      // Domain
      let dom = this.opts.domain
      let min = this.min
      let max = this.max

      let scaleX = d3.scaleBand()
        .domain(d3.range(data.length))
        .paddingInner(this.opts.padding)
        .rangeRound([0, w])

      let scaleY = d3.scaleLinear()
        .domain([min, max])
        .rangeRound([0, h])

      // default color function
      let colors = (c) => { return '' }

      // color with interpolator
      if (this.cInterpol) {
        colors = d3.scaleSequential()
          .domain([max, min])
          .interpolator(this.cInterpol)
        // color with max, min
      } else if (this.opts.colors) {
        colors = d3.scaleLinear()
          .domain([max, min])
          .range(this.opts.colors)
      }

      return data.map((d, i) => {
        return {
          xv: d,
          yv: i,
          x: scaleX(i),
          y: scaleY(d) + 1,
          color: colors(d),
          w: scaleX.bandwidth()
        }
      })
    },
    curve () {
      if (this.opts.curve) {
        let data = this.mappedData
        let margin = this.margin
        let barw = this.barW / 2
        let h = this.h - margin / 2
        let w = this.w - barw

        let x = d3.scaleLinear()
          .rangeRound([barw + margin, w])

        let y = d3.scaleLinear()
          .rangeRound([h, 0])
        let curve = d3.line()
          .x((d, i) => {
            return x(i)
          })
          .y((d) => {
            return y(d)
          })

        // curve type
        if (this.opts.curve.type) {
          curve.curve(this.curveType(this.opts.curve.type))
        }

        x.domain(d3.extent(data, (d, i) => { return i }))
        y.domain(d3.extent(data, (d) => { return d }))

        return curve(data)
      }
      return
    },
    pointRadius () {
      return this.opts.curve.pointRadius || (this.barW / 10)
    },
    barW () {
      return this.bars[0].w || 0
    },
    min () {
      let dom = this.opts.domain
      let data = this.mappedData
      return (dom.min === null) ? d3.min(data) : dom.min
    },
    max () {
      let dom = this.opts.domain
      let data = this.mappedData
      return (dom.max === null) ? d3.max(data) : dom.max
    },
    mappedData () {
      let data = this.data.map((d) => {
        return this.getY(d)
      })
      return data
    },
    fontSize () {
      let maxChars = d3.max(this.data.map((d) => {
        return String(d).length
      }))
      return this.w / (maxChars * this.data.length * 2)
    },
    fontSizeFixed () {
      return (this.fontSize >= 10) ? this.fontSize : 10
    },
    margin () {
      return this.fontSize * 2
    },
    lineX () {
      let over = this.over
      if (over) return over.x + this.margin + (over.w / 2)
      return 0
    }
  },
  methods: {
    onResize () {
      let w, h
      if (!this.options.size) {
        w = this.$el.clientWidth
        h = this.$el.clientHeight
      } else {
        w = this.options.size.w
        h = this.options.size.h
      }
      this.w = (w > 0) ? w : this.opts.autoSize.w
      this.h = (h > 0) ? h : this.opts.autoSize.h
    },
    barX (d) {
      let x = d.x + this.margin
      return (x > -1) ? x : 0
    },
    barY (d) {
      let y = this.h - d.y - this.margin / 2
      return (y > -1) ? y : 0
    },
    txtX (d) {
      return d.x + d.w / 2 - String(d.x).length * this.fontSize / 2 + this.margin
    },
    barStyle (d) {
      return (this.opts.colors) ? 'fill: ' + d.color : ''
    },
    pointStyle (d) {
      return this.opts.points.style || this.barStyle(d)
    },
    curveType (type) {
      if (type) {
        if (typeof (type) === 'function') return type
        // ex Linear
        let func = d3['curve' + type]
        if (typeof (func) === 'function') return func
        // ex curveLinear
        func = d3[type]
        if (typeof (func) === 'function') return func
      }
      return d3.curveNatural
    },
    startMove (event, bar) {
      let x = 0
      let y = 0
      if (event && bar) {
        x = event.pageX - this.barX(bar)
        y = event.pageY - this.barY(bar)
      }
      this.mouseOffset = { x, y }
      this.over = bar
    },
    moveLine (event) {
      this.mouseX = event.pageX - this.mouseOffset.x
    },
    stopMove (event, d) {
      let vm = this
      setTimeout(() => {
        if (vm.over.x === d.x) vm.over = false
      }, 500)
    },
    barClick (event, bar) {
      this.$emit('barClick', { bar, event })
    }
  }
}
</script>
<style lang="stylus">
.d3-bar-chart
  max-height: 100%
.bar
  fill: lightblue
  stroke: none

.dummy-bar
  fill: none
  stroke: none
  pointer-events: all
  &:hover
    fill: alpha(black,.1)

.bar-text
  fill: gray

.rulers
  stroke-width: 1px
  stroke: black

.axis
  stroke-width: 1px
  stroke: gray

.line
  stroke: alpha(black,.5)
  stroke-width: 2px
.curve
  stroke: black
  stroke-width : 3px
  fill: none
.curve-point
  fill:gray
  stroke: black  

</style>
