
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
    let yearString = '2015-19';
    let yearStringBuffer = '2015-19';
    let curOpacity = 0.0;
    let map_initialized=0;


    
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

    const filterfun = (educData, attrib, index=false) => {
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

    const convertObjToArray = (inObj) => {
        
        if(inObj instanceof Object){
            return Object.values(inObj)
        }
        else{
            return inObj
        }
    }

    const addIndextoObjects = (inArr) => {
        let outArr = [...inArr];
        outArr.forEach((element,index) => {
            outArr[index].index = index
        });
        return outArr
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


    const get_map_data = (data) => {
        if(!!data){
            mapData = data[0]
            educationData = convertObjToArray(data[1]);
            educationData = addIndextoObjects(educationData);
        }
    }
    const initialize_map = () => {
        const svg = d3.select("#d3chart")
                            .append("svg")
                            .attr('id','svg')
                            .attr("width", width)
                            .attr("height", height)
        
        let tooltip = d3.select('#d3chart')
                .append("div")
                .attr('id', 'tooltip')
    }            
            
    

    const draw_map = (data) => {   
            //d3.selectAll("path").remove(); 
                    
            console.log(mapData);
            console.log(educationData);
            //const svg = 
            let path = d3.geoPath();
            let path2 = d3.geoPath();
            

            let map = d3.select("#svg")
                        .append('g')
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


            let statemap = d3.select("#svg")
                            .append('g')
                              .selectAll('path')
                              .data(topojson.feature(mapData, mapData.objects.states).features)
                              .enter()
                              .append('path')
                              .attr('class', 'state')
                              .attr('d', path2)
          
            
            let legWidth = 300;
            let legRectWidth = 1;
            let legRectHeight = 15;
            let legPadding=0;
            d3.select('#legend')
              .html("")
            d3.select("#svg").append('g')
               .attr('id', 'legend')
               .attr('transform', 'translate(' + 500 + ', ' + 0 + ')')
               
            let legend = d3.select('#legend')

                
            legend.append('text')
                  .attr('transform', 'translate(100, 25)')
                  .attr('class','legend-text')
                  .style('font-size','24px')
                  .text('Legend')
                  
            
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
                       .attr('height', legRectHeight)
                       .attr('width', legRectWidth)
                       .style('fill', (d, i) => colorsAxis(d))
               //.attr("class", "dot")

            // create a tooltip
            let tooltip = d3.select('#tooltip')
                .style('opacity', 0)
                .style('background-color', 'aquamarine')
                .style('border', 'solid')
                .style('border-width', '5px')
                .style('padding', '2px')
                .attr('data-fips', null)
                .attr('data-education', null)

            const mouseover = (event, d) => {
                curOpacity = 0.7;
                tooltip.style('opacity', curOpacity)
            }

            const mousemove = (event, d) => {
                let curindex = filterfun(educationData,'index')(d)
                let area_name = ''
                console.log()
                if(educationData[curindex]==undefined){
                console.log('state boundary')
                }
                else{
                    if(educationData[curindex].hasOwnProperty('area_name')){
                        area_name = educationData[curindex]['area_name']
                        tooltip.html('County: '  + area_name + '<br/>' 
                                    + 'State: ' + educationData[curindex]['state'] + '<br/>'
                                    + attrib + ': ' + parseFloat(educationData[curindex][attrib]).toFixed(1) + '<br/>')
                               .style('left', (d3.pointer(event)[0]+ 30) + 'px')
                               .style('top', (d3.pointer(event)[1] + 30) + 'px')
                               .style('position', 'absolute')
                               .attr('data-fips', d.id)
                               .attr('data-education',parseFloat(educationData[curindex][attrib]))
                    }
                }


                
            }

            const mouseleave = (event, d) => {
                curOpacity = 0//curOpacity - 0.1;
                console.log(curOpacity);
                tooltip.style('opacity', curOpacity)
            }

            d3.selectAll("path").on('mouseover', mouseover)
            .on('mousemove', mousemove)
            //.on('mouseleave', mouseleave)

            d3.selectAll('.state').on('mouseleave', mouseleave)

        
    }





//for_user_education.json
//counties.json


    const getData = (yearstring) => {
        if(yearstring==yearString & map_initialized!=0){
            draw_map();
        }
        else{
            
            Promise.all([d3.json('counties.json'), d3.json('education' + yearstring + '.json')])
                .then((data) => {
                    if(map_initialized==0){
                        console.log('initalizing')
                        initialize_map();
                    }
                    get_map_data(data);
                    draw_map();
                    map_initialized = map_initialized + 1;
                    yearString = yearstring;
                })    
        }

    }
    onMount(() => {
        //d3.json('for_user_education.json')
        console.log('start')
        getData(yearString)
        console.log('mount finished')
            })

</script>
<body>

    
    <h1 id="title"> FCC - Data Visualization Project 4: Chloropleth Map</h1>
    <h2 id="description">Educational Attainment - {yearString} {attrib}</h2>

    <select bind:value={yearStringBuffer} on:change="{
        () => {
            getData(yearStringBuffer)
            console.log('asdf')
        }
        }">
        <option>1970</option>
        <option>1980</option>
        <option>1990</option>
        <option>2000</option>
        <option>2015-19</option>
    </select>
    
    <select bind:value={attrib} on:change="{
            () => {
                getData(yearString)
                console.log('asdf')
            }
        }">
        <option>noHighSchool</option>
        <option>highSchool</option>
        <option>someCollege</option>
        <option>bachelorsOrHigher</option>
    </select>

    <div id='d3chart'>
    </div>
    <div>Source: <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">USDA Economic Research Service</a></div>
</body>


