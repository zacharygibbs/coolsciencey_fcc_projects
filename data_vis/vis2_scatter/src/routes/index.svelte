
<svelte:head>
    <title> fcc_vis1_barchart</title>    
    <!-- <script src="../../node_modules/d3/dist/d3.min.js"></script> -->
    <link rel='stylesheet' href='proj2.css'/>
</svelte:head>
<style>



</style>
<script>
    import * as d3 from 'd3';//'../../node_modules/.pnpm/d3@7.1.1/node_modules/d3';
    import { onMount } from "svelte";
    
    //let dataset = null;
    let dates = null;
    let ydata = null;
    let data = null;
    const width = 800;
    const height = 500;
    const padding = 50;
    const paddingLeft = 150;
    const paddingBottom = 150;
    const CIRLCESIZE = 7;
    
    const convTime = (timeStr) => {
        let time0 = timeStr.split(':');//RGX.exec(data[i].Time);
        return(new Date(0, 0, 0, 0, time0[0], time0[1], 0))
    }

    const draw_chart = (data) => {
        if(!!data){
            for(let i=0; i<data.length; i++){
                data[i].Time = convTime(data[i].Time);
            }
            //console.log(data);

            
            const svg = d3.select("#d3chart")
                            .append("svg")
                            .attr("width", width)
                            .attr("height", height)

            const xScale = d3.scaleLinear()
                .domain([d3.min(data, (d) => d.Year)-1, d3.max(data, (d) => d.Year)+1])
                .range([paddingLeft, width - padding]);
            
            const yScale = d3.scaleTime()
                .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
                .range([height - paddingBottom, padding]);
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", (d, i) => xScale(d.Year))//i * 30)
                .attr("cy", (d, i) => yScale(d.Time))//)//h - 3 * d)
                .attr('r', CIRLCESIZE)
                .attr("class", "dot")
                .attr('data-xvalue', (d, i) => d.Year)
                .attr('data-yvalue', (d, i) => d.Time)
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
                            .attr('x',width/2)
                            .attr('y', padding-25)
                            .text('Cool Sciencey Bar Chart - Cycling - Fastest Times and Doping')
                            .attr('id', 'title')
                            .attr('class', 'txt')
                            .style('font-size', 24)
                            .style('font-weight','bold')
                            .style("text-anchor", "middle")
                            //.style('font-size',100)


            const xAxis = d3.axisBottom(xScale)
                            .tickFormat(d3.format('.0f'));

            const yAxis = d3.axisLeft(yScale)
                            .tickArguments([10,""])
                            .tickFormat(d3.timeFormat("%M:%S"));
            

            svg.append("g")
                .attr("transform", "translate(0," + (height - paddingBottom) + ")")
                .attr('id', 'x-axis')
                .call(xAxis)
                .selectAll('.tick')
                .attr('class','ticklabels');
            svg.append("g")
                .attr("transform", "translate(" + paddingLeft + ",0)")
                .attr('id', 'y-axis')
                .call(yAxis)
                .selectAll('.tick')
                .attr('class','ticklabels')

            svg.append('text')
                .attr('id', 'xlabel')
                .attr("x", (width + paddingLeft)/2)
                .attr("y", height - paddingBottom*0.65)
                .style("text-anchor", "middle")
                .attr('class', 'axislabel')
                .text("Year");

            svg.append('text')
                .attr('id', 'ylabel')
                .attr('transform', 'translate(' + (paddingLeft)/2+',' + (height - paddingBottom) / 2 + ')rotate(270)')
                .style("text-anchor", "middle")
                .attr('class', 'axislabel')
                .text("Time (mm:ss)");
            

            svg.append('g')
               .attr('id', 'legend')
               .attr('transform', 'translate(600, 200)')
               
            let legend = d3.select('#legend')

            legend.append('rect')
                  .style('stroke', 'black')
                  .style('stroke-width', '3px')
                  .style('padding', '2px')
                  .style('width', 200)
                  .style('height', 100);
                
            legend.append('text')
                  .attr('transform', 'translate(100, 25)')
                  .attr('class','legend-text')
                  .style('font-size','24px')
                  .text('Legend')
                  
               
            legend.append('circle')
               .attr("cx", 30)//i * 30)
               .attr("cy", 50)//)//h - 3 * d)
               .attr('r', CIRLCESIZE)
               .attr("class", "dot")
               
            legend.append('text')
                  .attr('transform', 'translate(90, 53)')
                  .attr('class','legend-text')
                  .text('Data')



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
                tooltip.style('opacity', 0.7)
            }

            const mousemove = (event, d) => {
                tooltip.html('Name: ' + d.Name + '<br/>' 
                        + 'Doping: ' + d.Doping + '<br/>'
                        + 'Nationality: ' + d.Nationality + '<br/>'
                        + 'URL: <a href="' + d.URL + '">Wikipedia</a>')
                    .style('left', (d3.pointer(event)[0]) + 'px')
                    .style('top', (d3.pointer(event)[1] + 150) + 'px')
                    .style('position', 'absolute')
                    .attr('data-year', d.Year)
            }

            const mouseleave = (event, d) => {
                tooltip.style('opacity', 0)
            }

            d3.selectAll("circle").on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        }
    }





    onMount(() => {
        fetch('cyclist-data.json')
	        .then(response => response.json())
	        .then(data => {
                    draw_chart(data);
            })
            




    });
</script>
<body>
    <h1> FCC - Data Visualization</h1>
    <h2> Project 2: Scatter Chart - D3</h2>
    <div id='d3chart'>
    </div>
    <div class='txt'></div>
    <div class='bar'></div>
    <div class='bar'></div>

</body>


