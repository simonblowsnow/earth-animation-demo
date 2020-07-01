import * as d3 from 'd3';
import * as topojson from 'topojson';

class GraphEarth {
    constructor(id) {
        this.id = id;
        this.svg = null;
        this.group = null;
        this.world = null;
        this.projection = null;
        this.geoPath = null;
        this.graticule = null;
        this.scale = 200;
        this.scaleE = 120;
        this.size = {width: 1000, height: 650};
        this.origin = {x: -90, y: -25};
        this.index = 0;
        
        this.init();
        this.loadWorld();

        // this.run();
        this.play();
    }

    init() {
        let scale = this.scale = 200;
        this.origin = { x: -50, y: -25 }; // x: -90, y: -25
        let [width, height] = [this.size.width, this.size.height];

        // TODO: 自动获取div尺寸
        // let div = document.getElementById(this.id);
        let svg = this.svg = d3.select('#' + this.id).append('svg')
            .attr('width', width)
            .attr('height', height);
        let group = this.group = svg.append("g");

        // 定义投影坐标系统
        this.setProjection();
        // 加载地理投影路径 和 地球网格
        this.loadGeo();

        // 给地球添加网格并定义样式
        group.append('path')
            .datum(this.graticule)
            .attr('class', 'graticule')
            .attr('d', this.geoPath);
    
    }

    loadWorld () {
        // 加载全球json数据，绘制陆地
        let $this = this;
        d3.json("/json/vis-demos/earth/world-110m.json").then(function(worldJSON) {
            let world = $this.world = topojson.feature(worldJSON, worldJSON.objects.land);
            $this.group.append("path")
                .datum(world)
                .attr("class", "land")
                .attr("d", $this.geoPath);   
        });
    }

    // 设置投影
    setProjection (style) {
        if (style) {
            this.projection = d3.geoEqualEarth().rotate([-10, 0]).scale(this.scaleE);
        } else {
            this.projection = d3.geoOrthographic()
                .scale(this.scale)
                .translate([this.size.width / 2, this.size.height / 2])
                .rotate([this.origin.x, this.origin.y])
                .center([0, 0])
                .clipAngle(90);
        }
        return this.projection;
    }

    // 基于投影加载网格
    loadGeo () {
        // 生成地理投影路径
        this.geoPath = d3.geoPath().projection(this.projection);
        // 创建地球网格
        this.graticule = d3.geoGraticule();
    }

    // 更改投影方式
    changeProjection (style) {
        this.setProjection(style);
        this.loadGeo();
    }

    test () {

    }

    play () {
        let $this = this;
        let tarOrigin = [-120, -35], tarScale = 260, tarScaleE = 175;
        let scaleI = d3.interpolateNumber(this.scale, tarScale);
        let scaleIE = d3.interpolateNumber(this.scaleE, tarScaleE);
        let originI = d3.interpolateNumberArray([this.origin.x, this.origin.y], tarOrigin);

        let initProjE = false;
        let run = () => {
            $this.changeProjection();
            initProjE = false;
            d3.transition()
                .duration(1050)
                .ease(d3.easeLinear)
                .tween("render", () => t => {
                    let o = originI(t);
                    $this.projection.rotate([o[0], o[1], 0]).scale(scaleI(t));
                    $this.update();
                })
                .transition()
                .duration(1500)
                .ease(d3.easeBack)
                .tween("render", () => t => {
                    if (!initProjE) initProjE = $this.changeProjection(1);
                    $this.projection.scale(scaleIE(t));
                    $this.update();
                })
                .on('end', run);
        }
        run();
    }

    update () {
        let $this = this;
        $this.group.selectAll("path")
            .datum($this.world)
            .attr("class", "land")
            .attr("d", $this.geoPath);
        
        $this.group.select("path")
            .datum($this.graticule)
            .attr("class", "graticule")
            .attr("d", $this.geoPath);
    }

    // 旋转动效
    run () {
        let $this = this;
        function redraw () {
            let proj = $this.projection.rotate([0.4 * $this.index, 0, 0]);
            $this.update();

            $this.index++;
            window.requestAnimationFrame(redraw);
        }

        redraw();
    }
}


export default GraphEarth;