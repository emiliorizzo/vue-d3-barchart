<template lang="pug">
  #app
    .header
      .title
        h1 {{ app.name }}
      .subtitle
        h2 {{ app.des }}
    .row
      bar-chart-example
    .footer
      .gh
        a(:href='app.repo')
          .icon(v-html='icons.gitHub')
</template>

<script>
import ghIcon from '../assets/github.svg?raw'
import BarChartExample from './BarChartExample.vue'

export default {
  name: 'example',
  components: {
    BarChartExample
  },
  data () {
    return {
      icons: {
        gitHub: ghIcon
      },
      app: process.env.APP
    }
  }
}
</script>
<style lang="stylus">
  @import '../vars.styl'
  @import './html.styl'
  @import './app.styl'

</style>
