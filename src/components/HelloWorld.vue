<template>
  <div id="main" style="width: 100%; height: 700px; border: 1px solid #ccc">
    
  </div>
</template>

<script>
// import * as d3 from 'd3';
import GraphEarth from '../js/earth';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted () {
    this.init();

  },
  methods: {
    init () {
      this.graph = new GraphEarth("main");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.graticule {
  fill: none;
  stroke: #777;
  stroke-width: .5px;
  stroke-opacity: .5;
  pointer-events: all;
}
.land {
  fill: none;
  stroke: #000;
  stroke-width: 1;
}

</style>
