
<svelte:head>
    <title> fcc_vis1_barchart</title>    
    <!-- <script src="../../node_modules/d3/dist/d3.min.js"></script> -->
    <link rel='stylesheet' href='proj1.css'/>
</svelte:head>
<style>



</style>
<script>
    import * as d3 from '../../node_modules/d3';
    import { onMount } from "svelte";
import { style, svg } from '../../node_modules/d3';
import { attr } from 'svelte/internal';
    
    //let dataset = null;
    let dates = null;
    let ydata = null;
    let data = null;
    const w = 800;
    const h = 500;
    const padding = 50;
    

    const draw_chart = (data) => {
        if(!!data){
            data = data.map((d) => {
                return([new Date(d[0]), d[1]])
            })
        const svg = d3.select("#d3chart")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)

        const xScale = d3.scaleTime()
            .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
            .range([padding, w - padding]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d[1])])
            .range([h - padding, padding]);

        const yScaleFill = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d[1])])
            .range([0, h-2*padding]);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(d[0]))//i * 30)
            .attr("y", (d, i) => yScale(d[1]))//)//h - 3 * d)
            .attr("width", w / data.length)
            .attr("height", (d, i) => yScaleFill(d[1]))//yScale(d))//yScale(d))//d * 3)
            .attr("fill", "navy")
            .attr("class", "bar")
            .attr('data-date', (d, i) => d[0])
            .attr('data-gdp', (d, i) => d[1])
            //.append("title")
            //.text((d) => d[1])

        /*svg.selectAll("text")
            .data(ydata)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => xScale(i)+4)//i * 30)
            .attr("y", (d, i) => yScale(d) - 5)//h - (d * 3 + 3))
            .attr('class', 'txt')
            */

        svg.append('text')
                        .attr('x',w/2-200)
                        .attr('y', padding-25)
                        .text('Cool Sciencey Bar Chart - GDP over Time')
                        .attr('id', 'title')
                        .attr('class', 'txt')
                        .style('font-size', 24)
                        .style('font-weight','bold')
                        //.style('font-size',100)

        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale)
                        .tickArguments([10,""])
                        .tickFormat(d3.format(".2s"));
        

        svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .attr('id', 'x-axis')
            .call(xAxis)
            .selectAll('.tick')
            .attr('class','tick')
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr('id', 'y-axis')
            .call(yAxis)
            .selectAll('ticks')
            .attr('class','tick');
        

        // create a tooltip
        let tooltip = d3.select('#d3chart')
            .append("div")
            .html('asdf')
            .attr('id', 'tooltip')
            .style('opacity', 0)
            .style('background-color', 'aquamarine')
            .style('border', 'solid')
            .style('border-width', '5px')
            .style('padding', '2px')
            .attr('datadate', null)

        const mouseover = (event, d) => {
            tooltip.style('opacity', 0.6)
        }

        const mousemove = (event, d) => {
            tooltip.html('value of this cell is: ' + d[1])
                   .style('left', (d3.pointer(event)[0] + 70) + 'px')
                   .style('top', (d3.pointer(event)[1]) + 'px')
                   .style('position', 'absolute')
                   .attr('data-date', d[0])
        }

        const mouseleave = (event, d) => {
            tooltip.style('opacity', 0)
        }

        d3.selectAll("rect").on('mouseover', mouseover)
           .on('mousemove', mousemove)
           .on('mouseleave', mouseleave)

        }
    }





    onMount(() => {
        fetch('GDP-data.json')
	        .then(response => response.json())
	        .then(data => {
                    draw_chart(data['data']);
            })
            




    });
</script>
<body>
    <h1> FCC - Data Visualization</h1>
    <h2> Project 1: Bar Chart - d3</h2>
    <div id='d3chart'>
    </div>
    <div class='txt'></div>
    <div class='bar'></div>
    <div class='bar'></div>

</body>


