<template lang="pug">
  svg.d3-bar-chart(v-if='bars.length' :width='w' :height='h')
    //- Gradient
    defs(v-if='renderGradient')
      linearGradient(:id='gradientId' x1="0" x2="100%" y1="0" y2="0")
        stop(v-for='d,i in bars' :offset='d.percentX + "%"' :key='i' :stop-color='d.color')
    
    //- Lines Y
    g.lines(v-if='opts.axis.linesY')
      line.line-y(v-for='a,i in axisY' :x1='margin' :x2='w' :y1='a.y' :y2='a.y' )
    //- Axis
    g.axis(v-if='opts.axis')
      line.x-axis(:x1='oX' :x2='w' :y1='hh' :y2='hh')
      line.y-axis(:x1='oX' :x2='oX ' y1='0' :y2='hh')
      //- Axis labels
      g.axis-labels
        template(v-for='a,i in axisY')
          text.axis-label(v-if='opts.axis.valuesY' x='0' :y='a.y' ) {{a.value}}
    //- Back Curve
    g.curve-back(v-if='opts.curveBack')
      path(:d='curve(opts.curveBack)' :stroke='curveBackStyle.stroke' :style='curveBackStyle' :fill='curveBackStyle.fill')     
    //- Bars
    g.bars
      template(v-for="d,i in bars")
        //- visible bar  
        rect.bar(v-if='opts.bars' :width="d.w" :height="d.y" :x='barX(d)' :y='barY(d)' :style='barStyle(d)'
          @click='barClick($event,d)')

    //- Curve
    g.curve(v-if='opts.curve')
      path(:d='curve(opts.curve)' :stroke='curveStyle.stroke' :style='curveStyle' :fill='curveStyle.fill')
    //-
    //- dummy bars to capture mouse events
    g.dummies
      template(v-for="d,i in bars")
        rect.dummy-bar( v-if='(opts.tip || opts.line) && d.yv > 0' :width="d.w" :height="h" :x="barX(d)" y='0' 
          :class='(opts.bars) ? "has-bars":""'
          @mouseover.prevent='startMove($event,d)'
          @mouseleave='stopMove($event,d)' 
          @click='barClick($event,d)'
          @touchstart='barClick($event,d)'
          )
    //-
    //-Marks
    g(v-if='opts.marks' class="marks")
      rect.mark(v-if='opts.marks.type === "square"' 
        v-for="d,i in bars" :key='i' :x='barX(d) + (barW /2) - (markSize /2)' :y='barY(d)-(markSize /2)' :width='markSize' :height='markSize' :style='markStyle(d)')
      circle.mark(v-if='opts.marks.type !=="square"' v-for="d,i in bars" :key='i' :r='markSize / 2' :cx='barX(d) + barW /2' :cy='barY(d)' :style='markStyle(d)')
    //- Line
    g.chart-line(v-if="opts.line" v-show='over')
      line.line(:x1='lineX' :x2='lineX' :y1='0' :y2='h - margin')
    
    //- Value  
    g.chart-tip(v-if="opts.tip && over" )
      rect.chart-tip-back( v-if='opts.tipBack' 
        :x='lineX + fontSize/2' :y='0' :width='labelW + "ex"' :height='label.length + .25 + "em"' 
        :rx='labelW / 5' :ry='label.lenght'
        @touchstart='barClick(over)'
        )
      text.label( :x='lineX + fontSize' y='0' :font-size='fontSize')
        tspan.label-line(v-for='txt,index in label' 
          :key='index' :x='lineX + fontSize' dy='1.2em' :class='"l-" + index ' ) {{txt}}
      
</template>
<script>
import * as d3array from 'd3-array'
import * as d3scale from 'd3-scale'
import * as d3Shape from 'd3-shape'
const d3 = Object.assign({}, d3array, d3scale, d3Shape)
const defaultOptions = {
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
      colorInterpol: null,
      mouseX: 30,
      mouseOffset: {
        x: 0,
        y: 0
      },
      over: false,
      getY: Math.abs,
      gradientId: 'svgGradient',
      colorScale: d3.scaleLinear,
      curveBack: null,
      curveBackStyle: {},
      curveStyle: {},
      // default label formatter, -> array, one value per line
      formatLabel (bar, formatX, formatY) {
        return [
          'y: ' + formatY(bar.yv),
          'x: ' + formatX(bar.xv)
        ]
      },
      // default x  formatter
      formatX (x) {
        return x
      },
      // default y formatter
      formatY (y) {
        return y
      },
      opts: Object.assign({}, defaultOptions)
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.onResize()
  },
  watch: {
    options (newValue) {
      this.init()
      this.onResize()
    }
  },
  computed: {
    scaleX () {
      return d3.scaleBand()
        .domain(d3.range(this.mappedData.length))
        .paddingInner(this.opts.padding)
        .rangeRound([0, this.ww])
    },
    scaleY () {
      return d3.scaleLinear()
        .domain([this.min, this.max])
        .rangeRound([0, this.hh])
    },
    percentX () {
      return d3.scaleLinear()
        .domain([0, this.mappedData.length - 1])
        .range([0, 100])
    },
    percentY () {
      return d3.scaleLinear()
        .domain([this.min, this.max])
        .range([0, 100])
    },
    renderGradient () {
      let curve = this.opts.curve
      let bars = this.opts.bars
      let curveBack = this.opts.curveBack
      return (bars && bars.gradient) || (curve && curve.gradient) || (curveBack && curveBack.gradient)
    },
    colors () {
      if (this.opts.colorFunc) return this.opts.colorFunc
      let colors = (d) => { return 'red' }
      // color with interpolator
      if (this.colorInterpol) {
        colors = d3.scaleSequential()
          .domain([this.max, this.min])
          .interpolator(this.colorInterpol)
        // color with max, min
      } else if (this.opts.colors) {
        let uColors = this.opts.colors

        let range
        let domain = [this.max, this.min]
        if (Array.isArray(uColors)) {
          range = uColors
        } else if (typeof (uColors) === 'object') {
          range = Object.values(uColors)
          domain = Object.keys(uColors)
        }
        colors = this.colorScale()
          .domain(domain)
          .range(range)
      }
      return colors
    },
    axisY () {
      let ticks = this.opts.axisTicks
      ticks = (ticks <= this.max) ? ticks : this.max
      let axis = []

      let scaleV = d3.scaleLinear()
        .domain([0, ticks])
        .rangeRound([this.min, this.max])

      let scaleY = d3.scaleLinear()
        .domain([0, ticks])
        .rangeRound([this.hh, 0])

      for (let i = 0; i <= ticks; i++) {
        let v = scaleV(i)
        axis.push({
          v: v,
          value: this.formatY(v),
          y: scaleY(i)
        })
      }
      return axis
    },
    bars () {
      return this.mappedData.map((d, i) => {
        return {
          xv: i,
          yv: d,
          x: this.scaleX(i),
          y: this.scaleY(d) + 1,
          color: this.colors(d),
          percentX: parseInt(this.percentX(i)),
          percentY: parseInt(this.percentY(d)),
          w: this.scaleX.bandwidth(),
          d: this.data[i]
        }
      })
    },
    oX () {
      return this.margin + (this.barW / 2)
    },
    oY () {
      return this.margin / 2
    },
    hh () {
      return this.h - (this.margin / 2)
    },
    ww () {
      return this.w - this.margin
    },
    barW () {
      return this.scaleX.bandwidth()
    },
    barStep () {
      return this.scaleX.step()
    },
    barPad () {
      return this.scaleX.padding()
    },
    markSize () {
      if (this.opts.marks && this.opts.marks.size) return this.opts.marks.size
      if (this.barW) return this.barW / 10
      return 5
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
      return this.opts.fontSize
    },
    fontSizeComp () {
      let maxChars = d3.max(this.data.map((d) => {
        return String(d).length
      }))
      return this.w / (maxChars * this.data.length * 2)
    },
    margin () {
      return this.opts.margin || this.h / 10
      // return this.fontSize * 2
    },
    lineX () {
      let over = this.over
      if (over) return over.x + this.margin + (over.w / 2)
      return 0
    },
    label () {
      return this.createLabel(this.over)
    },
    // calculates label with by max line chars (ex)
    labelW () {
      let maxLen = d3.max(this.label.map((l) => {
        return l.toString().length
      }))
      return (maxLen) ? maxLen + 1 : 0
    }
  },
  methods: {
    curve (opts) {
      let data = this.mappedData
      let barw = this.barW
      let h = this.hh
      let x = d3.scaleLinear()
        .range([this.barX(this.bars[0]) + barw / 2, this.barX(this.bars[this.bars.length - 1]) + barw / 2])
      let y = d3.scaleLinear()
        .range([h, 0])

      let curve = d3.line()
        .x((d, i) => {
          return x(i)
        })
        .y((d) => {
          return y(d)
        })
      // curve type
      if (opts.type) {
        curve.curve(this.curveType(opts.type))
      }
      x.domain(d3.extent(data, (d, i) => { return i }))
      y.domain(d3.extent(data, (d) => { return d }))
      let d = curve(data)
      if (opts.close) d += this.closeCurve()
      return d
    },
    closeCurve () {
      let fp = this.bars[0]
      let lp = this.bars[this.bars.length - 1]
      let fpx = this.barX(fp) + fp.w / 2
      let lpx = this.barX(lp) + lp.w / 2
      let d = [
        ' L' + lpx,
        this.hh,
        'L' + fpx,
        this.hh,
        'Z'
      ]
      return d.join(' ')
    },
    createLabel (bar) {
      return this.formatLabel(bar, this.formatX, this.formatY)
    },
    init () {
      let opts = this.opts
      let options = this.options

      for (let op in options) {
        opts[op] = options[op]
      }
      let props = ['formatLabel', 'formatX', 'formatY']
      for (let prop of props) {
        if (options[prop]) this[prop] = options[prop]
      }
      if (!options.marks) opts.marks = null

      // conditional color interpolator
      this.setFucntion('colorInterpol')
      // Color Scale function
      this.setFucntion('colorScale')

      // Y get / format
      let getY = options.getY
      if (getY && typeof (getY) === 'function') {
        this.getY = getY
      }
      // X get / format
      let getX = options.getX
      if (getX && typeof (getX) === 'function') {
        this.getX = getX
      }
      this.gradientId = this.randomName('svgGrad-')

      // copy curve settings to curveBack
      let curve = this.opts.curve
      let curveBack = this.opts.curveBack
      if (curveBack) {
        curveBack.type = curve.type || null
      }
      // sets styles
      this.curveStyle = this.gradientStyle('curve')
      this.curveBackStyle = this.gradientStyle('curveBack')
    },
    setFucntion (name, value) {
      let f = this.opts[name]
      if (f) {
        if (typeof (f) === 'function') {
          this[name] = f
        } else {
          if (typeof (d3[f]) === 'function') {
            this[name] = d3[f]
          }
        }
      }
    },
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
    gradientStyle (name) {
      let style = {}
      let e = this.opts[name]
      if (e) {
        style = e.style || {}
        let strokeUrl = 'url(#' + this.gradientId + ')'
        if (e.gradient) {
          if (e.gradient.stroke) {
            style.stroke = strokeUrl
          }
          if (e.gradient.fill) {
            style.fill = strokeUrl
          }
        }
      }
      return style
    },
    barX (d) {
      let x = d.x + this.margin
      return x
      // return (x > -1) ? x : 0
    },
    barY (d) {
      let y = this.h - d.y - this.margin / 2
      return y
      // return (y > -1) ? y : 0
    },
    txtX (d) {
      return d.x + d.w / 2 - String(d.x).length * this.fontSize / 2 + this.margin
    },
    barStyle (d) {
      let style = this.gradientStyle('bars')
      if (!style.fill) style.fill = (this.opts.colors) ? d.color : ''
      return style
    },
    markStyle (d) {
      return this.opts.marks.style || this.barStyle(d)
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
      return d3.curveMonotoneX
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
      this.over = false
    },
    randomName (prefix) {
      let rnd = prefix || ''
      rnd += Math.random().toString(36).substring(7)
      return rnd
    },
    barClick (event, bar) {
      this.over = (this.over === bar) ? false : bar
      this.$emit('barClick', { bar, event })
    }
  }
}
</script>
<style lang="stylus">
.d3-bar-chart
  max-height: 100%
  max-width 100%
  svg
    overflow: visible
.bar
  fill: cyan
  stroke: none


.dummy-bar
  fill: none
  stroke: none
  pointer-events: all

.dummy-bar.has-bars
  &:hover
    fill: alpha(black,.1)

.bar-text
  fill: gray

.rulers
  stroke-width: 1px
  stroke: black
.lines
  stroke gray
  stroke-width 1px
  stroke-opacity .3
.axis
  stroke-width: 1px
  stroke: gray
.axis-label 
  fill: gray
  stroke: none
  font-size: 8px
.line
  stroke: alpha(black,.5)
  stroke-width: 2px
.curve, .curve-back
  stroke: black
  stroke-width : 3px
  fill: none 
.curve-point
  fill:gray
  stroke: black  
.chart-tip-back
  fill: black
  stroke-width 1px
  stroke gray
  opacity .5

  
</style>
