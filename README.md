# Work in progress

## vue-d3-barchart 
 > Vue component to draw bar charts using d3 v4

## Demo

[Demo](https://emiliorizzo.github.io/vue-d3-barchart/)

## Installation

``` bash
npm install vue-d3-barchart --save

```

## Usage


```xml
  ...  
  <d3-barchart :net-nodes="nodes" :net-links="links" :options="options" />
  ...

```
``` javascript  
import D3BarChart from 'vue-d3-barchart'
...
  components: {
    D3BarChart
  },
....
```
``` html

<style src="vue-d3-barchart/dist/vue-d3-barchart.css"></style>

```

Or: *import source component from:* 'vue-d3-barchart/src/vue-d3-barchart.vue'
*And install devDependencies.* (d3-scale, stylus and pug) 
See: [package.json](https://github.com/emiliorizzo/vue-d3-barchart/blob/master/package.json))


## Props
  
- **options**:
  
  - labels: Boolean
      Show axis labels
  
  - axis: Boolean
      render axis
  
  - rulers: Boolean
      render rules
  
  - padding: 0.1 
    bar padding
  
  - colors: [ maxValueColor, minValueColor ], null to no colors

  - colorInterpol: Function | name of D3 function | null
  
  - line: Boolean
    render line
  
  - xUnits: '', // x  suffix
  - yUnits: ''//  y suffix
  - curve: Boolean | Object:
    - type: String | Function
      - String, name of d3 curve Types *ex: 'linearClosed' or 'curveLinearClosed'*
    
    - points: Boolean | Object
      - Object: 
        - style: Object *ex:{ fill:'red' }*

     


    


## Events




