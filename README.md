
[![GitHub issues](https://img.shields.io/github/issues/emiliorizzo/vue-d3-barchart.svg)](https://github.com/emiliorizzo/vue-d3-barchart/issues) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/emiliorizzo/vue-d3-barchart/master/LICENSE) [![npm](https://img.shields.io/npm/v/vue-d3-barchart.svg)](https://www.npmjs.com/package/vue-d3-barchart)

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

  - **data**: Array of values or objects *(see options: getX,getY)*

- **options**:
- 
  - **size**:{w,h} 
  - **getX**: function(d)
  - **getY**: function(d)
  
  - **labels**: Boolean *show axis labels*
  
  - **axis**: { valuesY:Boolean, valuesX:boolean, linesX:boolean, linesY:boolean }
      render axis
  - **axisTicks**
  - **padding**: 0.1 bar padding
  
  - **colors**: Array | Object 
    - Array: (range) [ maxValueColor, minValueColor ]
    - Object { key(value): color} , max values first 

  - **colorInterpol**: Function | name of D3 function 
  - **colorScale**: Function | name of D3 function 
      *(colorInterpol Overrides this option)*
  - **colorFunc**: Color Function: (d) => {return color}, *Overrides colorScale and colorInterpol*
  
  - **line**: Boolean
    render line
  
  - **formatX**: Function(x) --> x
  - **formatY**: Function(y) --> y
  - **formatLabel**(d, formatX, formatY) -> Array, one value per line

*default:*
```javasctipt
      formatLabel (bar, formatX, formatY) {
        return [
          'x: ' + formatX(bar.xv),
          'y: ' + formatY(bar.yv)
        ]
      },
```
  - **bars**: Boolean : show bars | Object: 
    - gradient: Boolean | Object : { sroke:Boolean, fill:Boolean }
  
  - **curve**: Boolean | Object:
    - type: String | Function
      
      - String, name of d3 curve Types 
        *ex: 'linearClosed' or 'curveLinearClosed'* (default: MonotoneX)
        see [d3-shape#curves](https://github.com/d3/d3-shape#curves)
      
      - Fuction: custom curve function
    - style: Object: {css-prop: value} 
    - gradient: Boolean | Object : { sroke:Boolean, fill:Boolean }
    - **close**: Boolean, close curve to chart limits
  
  - **curveBack**: render another curve, with same settings as default. 
  
  - **marks**: Boolean | Object: {type: point | square  style:{ fill , stroke }, size }


## d object
 
  - **xv**: *original x value*
  - **yv**: *original y value*
  - **x**: *computed chart x value*
  - **y**: computed chart y value
  - **color**: *computed chart color*
  - **percentX**: percent of x
  - **percentY**: percent of y
  - **w**: *computed bar width*,
  - **d**: original data

## Events

- barClick: fired on click/touch bar, emits bar,event

## Dependencies

- d3-scale
- d3-array
- d3-shape


