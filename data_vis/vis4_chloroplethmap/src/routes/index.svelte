
<svelte:head>
    <title> fcc_vis4_chloroplethmap</title>    
    <!-- <script src="../../node_modules/d3/dist/d3.min.js"></script> -->
    <link rel='stylesheet' href='proj4.css'/>
</svelte:head>
<style>



</style>
<script>
    import * as d3 from 'd3';//'../../node_modules/.pnpm/d3@7.1.1/node_modules/d3';
    import * as topojson from 'topojson';//'../../node_modules/.pnpm/d3@7.1.1/node_modules/d3';
    import { onMount } from "svelte";
    
    

    const width = 1000;
    const height = 700;
    const padding = 50;
    let mapData = null;
    let educationData = null;
    let attrib = 'bachelorsOrHigher';


    
    const convTime = (timeObj) => {
        //let time0 = timeStr.split(':');//RGX.exec(data[i].Time);
        return(new Date(timeObj.year, timeObj.month-1))
    }
    

    


    const colorFun = (curV, justFun=false) => {
        const colors = d3.scaleSequential()
                         .domain([0, 100])
                         .interpolator(d3.interpolateCool);
        if(justFun){
            return colors
        }
        else{
            return colors(curV)
        }
    }

    const filterfun = (educData, attrib) => {
        const res = (d)=>{
            let theOne = educData.filter((d2, index) => {
                return d.id==d2.fips
            })
            if(theOne.length>0){
                return theOne[0][attrib] //just the first one
            }
            else{
                return []
            }
        }
        return res

    }
    
    function makeArr(startValue, stopValue, cardinality) {
        //https://stackoverflow.com/questions/40475155/does-javascript-have-a-method-that-returns-an-array-of-numbers-based-on-start-s
        var arr = [];
        var step = (stopValue - startValue) / (cardinality - 1);
        for (var i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i));
        }
        return arr;
    }   


    const draw_map = (data) => {
        if(!!data){
            mapData = data[0]
            educationData = data[1]
            console.log(mapData);
            console.log(educationData);
            const svg = d3.select("#d3chart")
                            .append("svg")
                            .attr("width", width)
                            .attr("height", height)

            svg.append('text')
                .attr('x',width/2)
                .attr('y', padding-25)
                .text('Cool Sciencey Chloropleth Map - Educational Attainment')
                .attr('id', 'title')
                .attr('class', 'txt')
                .style('font-size', 24)
                .style('font-weight','bold')
                .style("text-anchor", "middle")
                

            svg.append('text')
                .attr('x',width/2)
                .attr('y', padding-5)
                .text('Education')
                .attr('id', 'description')
                .attr('class', 'txt')
                .style('font-size', 18)
                .style('font-weight','bold')
                .style("text-anchor", "middle")
                //.style('font-size',100)
            
            let path = d3.geoPath();
            let path2 = d3.geoPath();
            
            let map = svg.append('g')
                         .attr('class', 'map')
                         .selectAll('path')
                         .data(topojson.feature(mapData, mapData.objects.counties).features)
                         .enter()
                         .append('path')
                         .attr('class', 'county')
                         .attr('d', path)
                         .attr('data-fips', (d)=>{return d.id})
                         .attr('data-education', filterfun(educationData, attrib))
                         .attr('fill', (d) => {
                            let res = filterfun(educationData, attrib) 
                            return colorFun(res(d))
                         })


            let statemap = svg.append('g')
                              .selectAll('path')
                              .data(topojson.feature(mapData, mapData.objects.states).features)
                              .enter()
                              .append('path')
                              .attr('class', 'state')
                              .attr('d', path2)

                         
                         




            

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
                  
            let legWidth = 500;
            let legRectWidth = 1;
            let colorsAxis = colorFun(0,true);//d3.scaleQuantize()
                            //.domain([0, 100])
                            //.range(colorsRes.range())
            
            let colorLegendAxis = d3.scaleLinear()
                            .domain([0, 100])
                            .range([0, legWidth])

            let dataLegendAxis = [0, 20, 40, 60, 80, 100];
            let dataLegend = makeArr(0,100,legWidth / legRectWidth);
            //dataLegendAxis = dataLegendAxis.map((d) => {return d-0.001})
            const legAxis = d3.axisTop(colorLegendAxis)
                            .tickValues(dataLegendAxis)
                            //.tickValues(d3.range(d3.min(data, (d) => d.year), d3.max(data, (d) => d.year), 50))                
                            .tickFormat(d3.format('.0f'));
            //debugger;
            
            console.log(legAxis.tickValues())

            legend.append("g")
                .attr("transform", "translate(50, 50)")
                .attr('id', 'leg-axis')
                .call(legAxis)
                .selectAll('.tick')
                .attr('class','ticklabels')
            

            let newg = legend.selectAll('rect')
                       .data(dataLegend)
                       .enter()
                       .append('rect')
                       .attr("x", (d, i) => 50 + i*legRectWidth)//i * 30)
                       .attr("y", 50)//)//h - 3 * d)
                       .attr('height', 25)
                       .attr('width', legRectWidth)
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
                .attr('data-fips', null)
                .attr('data-education', null)

            const mouseover = (event, d) => {
                tooltip.style('opacity', 0.7)
            }

            const mousemove = (event, d) => {
                
                tooltip.html('County: '  + filterfun(educationData,'area_name')(d) + '<br/>' 
                        + 'State: ' + filterfun(educationData,'state')(d) + '<br/>'
                        + attrib + ': ' + filterfun(educationData,attrib)(d) + '<br/>')
                    .style('left', (d3.pointer(event)[0]) + 'px')
                    .style('top', (d3.pointer(event)[1] + 150) + 'px')
                    .style('position', 'absolute')
                    .attr('data-fips', (d)=>d.id)
                    .attr('data-education', filterfun(educationData,attrib))
            }

            const mouseleave = (event, d) => {
                tooltip.style('opacity', 0)
            }

            d3.selectAll("path").on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        }
    }





//for_user_education.json
//counties.json
    onMount(() => {
        //d3.json('for_user_education.json')
        console.log('start')
        Promise.all([d3.json('counties.json'), d3.json('for_user_education.json')])
                .then((data) => {draw_map(data)})    
        console.log('mount finished')
            })

</script>
<body>
    <h1> FCC - Data Visualization</h1>
    <h2> Project 4: Chloropleth Map - D3</h2>
    <div id='d3chart'>
    </div>
    <div class='txt'></div>
    <div class='bar'></div>
    <div class='bar'></div>

</body>


