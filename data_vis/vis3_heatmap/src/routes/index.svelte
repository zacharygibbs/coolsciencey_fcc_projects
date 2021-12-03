
<svelte:head>
    <title> fcc_vis3_heatmap</title>    
    <!-- <script src="../../node_modules/d3/dist/d3.min.js"></script> -->
    <link rel='stylesheet' href='proj3.css'/>
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
    const width = 1000;
    const height = 500;
    const padding = 50;
    const paddingLeft = 190;
    const paddingBottom = 150;
    let minVal = 0.;
    let maxVal = 0.0;
    const CIRLCESIZE = 7;
    let baseTemp = null;
    
    const convTime = (timeObj) => {
        //let time0 = timeStr.split(':');//RGX.exec(data[i].Time);
        return(new Date(timeObj.year, timeObj.month-1))
    }
    


    const colorFun = (curV, minV ,maxV, justFun=false) => {
        const colors = d3.scaleQuantize()
                         .domain([0, 1])
                         .range([
                             'hsl(240, 100%, 50%)',
                             'hsl(210, 100%, 50%)',
                             'hsl(180, 100%, 50%)',
                             'hsl(120, 100%, 50%)',
                             'hsl(60, 100%, 50%)',
                             'hsl(45, 100%, 50%)',
                             'hsl(30, 100%, 50%)',
                             'hsl(15, 100%, 50%)',
                             'hsl(0, 100%, 50%)',
                         ])
        if(justFun){
            return colors
        }
        else{
            return colors((curV - minV)/ (maxV - minV))
        }
            
        //scaleSequential - can also use d3.interpolateRainbow for range.

        //const colors = d3.scaleLinear()
        //       .domain([0,1])
               //.range(['blue', 'red']);
        //console.log((curV - minV)/ (maxV), colors((curV - minV)/ (maxV)))
        //return colors((curV - minV)/ (maxV - minV))
               //return "rgb(" + colors((curV - minV)/ (maxV)))+")"
        //       .range([180, 360])
        //return "hsl(" + colors((curV - minV)/ (maxV-minV)) + ",100%,50%)"
    }

    const draw_row = (svg, data, month, xScale, yScaleTop) => {
        let data2 = data.filter((d) => {
            return(d.month==month)
        })
        //debugger
        
        let g = svg.selectAll(".rect")
                   .append("g")
                   .attr('id', 'row-month-' + month)
        

        let newg = svg.selectAll('#row-month-'+month)
                    .data(data2)
                   .enter()
         .append('rect')
         .attr("x", (d, i) => paddingLeft + i / data2.length * (width - paddingLeft - padding) )//i * 30)
         .attr("y", (d, i) => yScaleTop(month))//padding + (month-1) / 12 *(height - paddingBottom - padding))//)//h - 3 * d)
         .attr('height', (height - padding - paddingBottom) / 12)
         .attr('width', (width - paddingLeft - padding) / data2.length)
         .attr('class', 'cell')
         .style("fill", (d,i) => colorFun(d.variance, minVal, maxVal))
         .attr('data-month', (d, i) => d.month)
         .attr('data-year', (d, i) => d.year)
         .attr('data-temp', (d, i) => d.Temp);
         console.log(padding + (month-1) / 12 *(height - paddingBottom - padding))//)//h - 3 * d))
    }

    const draw_chart = (data) => {
        
        if(!!data){
            console.log(data)
            baseTemp = data['baseTemperature'];
            data = data['monthlyVariance'];

            for(let i=0; i<data.length; i++){
                data[i].Time = convTime(data[i]);
                data[i].Temp = baseTemp + data[i].variance;

            }
            minVal = data.reduce((mn, d) => { if(mn>=d.variance){return d.variance}else{return mn}}, 999999)
            maxVal = data.reduce((mx, d) => { if(mx<=d.variance){return d.variance}else{return mx}}, -999999)
            //console.log(data);

            const svg = d3.select("#d3chart")
                            .append("svg")
                            .attr("width", width)
                            .attr("height", height)

            svg.append('text')
                .attr('x',width/2)
                .attr('y', padding-25)
                .text('Cool Sciencey Heat Map - Global Temperatures')
                .attr('id', 'title')
                .attr('class', 'txt')
                .style('font-size', 24)
                .style('font-weight','bold')
                .style("text-anchor", "middle")
                //.style('font-size',100)

            svg.append('text')
                .attr('x',width/2)
                .attr('y', padding-5)
                .text('Global Temperature Variability; Base T = 8.66C')
                .attr('id', 'description')
                .attr('class', 'txt')
                .style('font-size', 18)
                .style('font-weight','bold')
                .style("text-anchor", "middle")
                //.style('font-size',100)
            


            const xScale = d3.scaleLinear()
                .domain([d3.min(data, (d) => d.year)-1, d3.max(data, (d) => d.year)+1])
                .range([paddingLeft, width - padding]);
            
            const date1 = new Date('January 1')
            const date2 = new Date('December 1')
            const yScale = d3.scaleTime()
                .domain([date1, date2])
                .range([height - paddingBottom - (height - paddingBottom - padding) / 2 / 12,
                         padding + 1 / 12 / 2 *(height - paddingBottom - padding)])

            
            const yScaleTop = d3.scaleLinear()
                .domain([1, 12])
                .range([height - paddingBottom - (height - paddingBottom - padding) / 12,
                         padding])


            for(let i=1; i<=12;i++){
                draw_row(svg, data, i, xScale, yScaleTop);
            }
            //padding + (month-1) / 12 *(height - paddingBottom - padding))//)//h - 3 * d)
//            debugger

            const xAxis = d3.axisBottom(xScale)
                            //.tickValues(d3.range(d3.min(data, (d) => d.year), d3.max(data, (d) => d.year), 50))                
                            .tickFormat(d3.format('.0f'));

    

            const yAxis = d3.axisLeft(yScale)
                            .ticks(d3.timeMonth.every(1))
                            .tickFormat(d3.timeFormat('%B'))


            svg.append("g")
                .attr("transform", "translate(0," + (height - paddingBottom) + ")")
                .attr('id', 'x-axis')
                .call(xAxis)
                .selectAll('.tick')
                .attr('class','ticklabels')
                

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
                .text("Month");
            

            svg.append('g')
               .attr('id', 'legend')
               .attr('transform', 'translate(' + (padding*1.5) + ', ' + (height-padding*1.8) + ')')
               
            let legend = d3.select('#legend')

            legend.append('rect')
                  .style('stroke', 'black')
                  .style('stroke-width', '3px')
                  .style('padding', '1px')
                  .style('width', 600)
                  .style('height', 90);
                
            legend.append('text')
                  .attr('transform', 'translate(100, 25)')
                  .attr('class','legend-text')
                  .style('font-size','24px')
                  .text('Legend')
                  
               
            let colorsRes = colorFun(0,0,0, true)
            let colorsAxis = d3.scaleQuantize()
                            .domain([minVal, maxVal])
                            .range(colorsRes.range())
            
            let colorLegendAxis = d3.scaleLinear()
                            .domain([minVal, maxVal])
                            .range([0, 50*colorsRes.range().length])
                            //.ticks()

            let data_legend = [colorsAxis.domain()[0], ...colorsAxis.thresholds(), colorsAxis.domain()[1]]
            data_legend = data_legend.map((d) => {return d-0.001})
            const legAxis = d3.axisTop(colorLegendAxis)
                            .tickValues(data_legend)
                            //.tickValues(d3.range(d3.min(data, (d) => d.year), d3.max(data, (d) => d.year), 50))                
                            .tickFormat(d3.format('.1f'));
            //debugger;
            
            console.log(legAxis.tickValues())

            legend.append("g")
                .attr("transform", "translate(50, 50)")
                .attr('id', 'leg-axis')
                .call(legAxis)
                .selectAll('.tick')
                .attr('class','ticklabels')
            

            let newg = legend.selectAll('rect')
                       .data(data_legend)
                       .enter()
                       .append('rect')
                       .attr("x", (d, i) => i*50)//i * 30)
                       .attr("y", 50)//)//h - 3 * d)
                       .attr('height', 25)
                       .attr('width', 50)
                       .style('fill', (d, i) => colorsAxis(d))
               //.attr("class", "dot")
               
            




            // create a tooltip
            let tooltip = d3.select('#d3chart')
                .append("div")
                .attr('id', 'tooltip')
                .style('opacity', 0)
                .style('background-color', 'aquamarine')
                .style('border', 'solid')
                .style('border-width', '5px')
                .style('padding', '2px')
                .attr('data-year', null)

            const mouseover = (event, d) => {
                tooltip.style('opacity', 0.7)
            }

            const mousemove = (event, d) => {
                tooltip.html('Month: ' + d.month + '<br/>' 
                        + 'Year: ' + d.year + '<br/>'
                        + 'Temp: ' + d.Temp + '<br/>')
                    .style('left', (d3.pointer(event)[0]) + 'px')
                    .style('top', (d3.pointer(event)[1] + 150) + 'px')
                    .style('position', 'absolute')
                    .attr('data-year', d.Year)
            }

            const mouseleave = (event, d) => {
                tooltip.style('opacity', 0)
            }

            d3.selectAll(".cell").on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        }
    }





    onMount(() => {
        fetch('global-temperature.json')
	        .then(response => response.json())
	        .then(data => {
                    draw_chart(data);
            })
    });
</script>
<body>
    <h1> FCC - Data Visualization</h1>
    <h2> Project 3: Heat Map - D3</h2>
    <div id='d3chart'>
    </div>
    <div class='txt'></div>
    <div class='bar'></div>
    <div class='bar'></div>

</body>


