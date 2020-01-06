<template lang="pug">
  .example
    .charts
      .chart(v-for='chart,chartName in charts')
        .title {{chart.title || chartName}}
        .bar-chart
          d3-barchart(:data='chart.chartData' :options='chart.options' :key='chartName')
        textarea {{chart.options}}
</template>
<script>
import copyIcon from '../assets/copy.svg?raw'
import d3Barchart from '../vue-d3-barchart.vue'
import bars from './data/bars'
import curve from './data/curve'
import points from './data/points'
import curvePoints from './data/curvePoints'
import curveColors from './data/curveColors'
import curveRect from './data/curveRect'

export default {
  name: 'bar-chart-example',
  components: {
    d3Barchart
  },
  data () {
    return {
      copyIcon,
      charts: { bars, curve, points, curvePoints, curveColors, curveRect }
    }
  }
}
</script>
<style lang="stylus">
  @import '../vars.styl'

  .example
    display flex
    max-width 100%

  .charts
    display flex
    flex 1 1 100%
    max-width 90%
    flex-flow row wrap
    justify-content center
    margin auto

  .title
    display flex
    flex 1
    margin 0.5em 0em

  .chart
    display flex
    flex-flow column wrap
    margin 1em
    align-self flex-start

    textarea
      font-size 0.5em
      margin-top 0.5em
      resize vertical

    button
      width auto !important
      flex 1
      display flex
      background none
      margin 0
      padding 0
      align-self flex-end

  .bar-chart
    border 1px solid $txt-color
    height 150px
    width 400px
    padding 1em
    box-shadow 2px 2px 8px alpha($color, 0.2)
</style>
