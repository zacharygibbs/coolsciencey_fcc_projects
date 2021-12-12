



<svelte:head>
    <title> fcc_vis5_treemap</title>    
    <link rel='stylesheet' href='proj5.css'/>
</svelte:head>
<style>



</style>
<script>
    //reference - https://www.d3-graph-gallery.com/graph/treemap_json.html
    //reference - https://observablehq.com/@d3/treemap
    import * as d3 from 'd3';//'../../node_modules/.pnpm/d3@7.1.1/node_modules/d3';
    import { onMount } from "svelte";
    

    const width = 1000;
    const height = 700;
    const padding = 50;
    const paddingTop = 100;
    const paddingLeft = 100;


    const colorFun = (curV, color_items, justFun=false) => {
        let itemLength = color_items.length
        let hslLevels = color_items.map((item, index) => {
            return 'hsl(' + 240 / itemLength * index + ', 80%, 80%)'
        })
        const colors = d3.scaleOrdinal()
                         .domain(color_items)
                         .range(hslLevels)
        if(justFun){
            return colors
        }
        else{
            return colors(curV)
        }
    }


    const rollUpData = (data, returnFlat = false) => {
        let dataOut = [...data];
        let dataFlat = [];
        dataOut.forEach((console, index) => {
            let valTotal = console.children.reduce((val, curVal)=>{
                return val + parseFloat(curVal.value)
            }, 0.0);
            dataOut[index].value = valTotal;
            dataOut[index].children.forEach((game, index2)=>{
                dataFlat.push(game)
            }) 
        });
        if(returnFlat){
            return dataFlat
        }
        let grandTotal = dataOut.reduce((val, curVal) =>{
            return val + parseFloat(curVal.value)
        }, 0.0)
        dataOut.forEach((console, index) => {
            dataOut[index].percent = dataOut[index].value / grandTotal * 100
            dataOut[index].children.forEach((game, indexgame) =>{
                dataOut[index].children[indexgame].value = parseFloat(dataOut[index].children[indexgame].value)
                dataOut[index].children[indexgame].percent = parseFloat(dataOut[index].children[indexgame].value) / dataOut[index].value * 100
            })
        })
        return {data: dataOut, total: grandTotal}
    }


    const draw_map = (data) => {   
            //d3.selectAll("path").remove(); 
        const svg = d3.select("#d3chart")
                      .append("svg")
                      .attr('id','svg')
                      .attr("width", width)
                      .attr("height", height)
        
        let tooltip = d3.select('#d3chart')
                        .append("div")
                        .attr('id', 'tooltip')                    
        let dataName = data.name
        
        //data = rollUpData(data.children, true);
        var data = d3.hierarchy(data)
                     .sum(d=>d.value)
                     .sort((a, b) => {return b.value - a.value});
                     
        console.log(data);
        console.log(data.leaves())
        let lvls = data.children.map((item, index)=> {
            return item.data.name
        })
        console.log(lvls)
        const colors = colorFun(0, lvls, true)
        console.log(colors('DS'))
        
    

        let treemap = d3.treemap()
                    .tile(d3.treemapBinary)
                    .size([width - 2*padding, height - paddingTop - padding])
                    .paddingInner(1)
                    .paddingTop(10)
                    .paddingBottom(0)
                    .paddingLeft(0)
                    .paddingRight(10)
                    
        treemap(data)
        
        svg.selectAll('rect')
           .data(data.leaves())
           .enter()
           .append('rect')
           .attr('x', (d) => d.x0)
           .attr('y', (d)=> d.y0)
           .attr('width', (d) => d.x1 - d.x0)
           .attr('height', (d) => d.y1 - d.y0)
           .attr('class', 'tile')
           .attr('data-name', (d) => d.data.name)
           .attr('data-category', (d) => d.data.category)
           .attr('data-value', (d) => d.data.value)
           .attr('fill', (d) => colors(d.data.category)); 

        svg.selectAll('text')
           .data(data.leaves())
           .enter()
           .append('text')
           .attr('x', (d) => (d.x1 + d.x0)/2)
           .attr('y', (d) => (d.y1 + d.y0)/2)
           .text((d) => d.data.name)
           .attr('class', 'rect-label')
           .attr('font-size',(d) => {
            let lengthStr = d.data.name.length
            let origVal = (d.x1 - d.x0) / lengthStr * 1.7
            let chosenVal = Math.min(origVal, 25) 
            if(chosenVal < 4){
                //chosenVal = 0
            }
            return chosenVal
           })

        svg.selectAll('text2')
           .data(data.leaves())
           .enter()
           .append('text')
           .attr('x', (d) => (d.x1 + d.x0)/2)
           .attr('y', (d) => (d.y1) - 5)
           .text((d) => d.data.value)
           .attr('class', 'rect-label')
           .attr('font-size',(d) => {
            let lengthStr = d.data.name.length
            let origVal = (d.x1 - d.x0) / lengthStr * 1.7
            let chosenVal = Math.min(origVal, 16) 
            if(chosenVal < 4){
                chosenVal = 0
            }
            return chosenVal
           })
        
        let legWidth = 600;
        let legHeight = 150;
        let legRectWidth = 20;
        let legRectHeight = 20;
        let legPadding=40;
        let legPaddingY=55;
        let nrows = 2;
        //d3.select('#legend')
        //    .html("")
        let legend = d3.select("#legend")
                       .attr('width', legWidth)
                       .attr('height', legHeight)
            
        legend.append('text')
                .attr('transform', 'translate(45, 30)')
                .attr('class','legend-text')
                .style('font-size','24px')
                .text('Legend')
                
        legend.selectAll('rect')
                    .data(lvls)
                    .enter()
                    .append('rect')
                    .attr("x", (d, i) => {
                        let nrow = parseInt(1 + i / lvls.length * nrows)
                        let adjIndex = nrow==1 ? i : i - parseInt(lvls.length / nrows)
                        return 75 + adjIndex*(legRectWidth + legPadding)
                    })//i * 30)
                    .attr("y", (d, i) => {
                        let nrow = parseInt(1 + i / lvls.length * nrows)
                        let adjIndex = nrow==1 ? i : i - parseInt(lvls.length / nrows)
                        return (nrow -1) * legPaddingY + 60
                    })
                    .attr('height', legRectHeight)
                    .attr('width', legRectWidth)
                    .style('fill', (d, i) => {
                        return colors(d)
                    })
                    .attr('class', 'legend-item')
                   
        legend.selectAll('legtext')
                    .data(lvls)
                    .enter()
                    .append('text')
                    .attr('class','legend-text')
                    .attr("x", (d, i) => {
                        let nrow = parseInt(1 + i / lvls.length * nrows)
                        let adjIndex = nrow==1 ? i : i - parseInt(lvls.length / nrows)
                        return 75 + adjIndex*(legRectWidth + legPadding + 0)
                    })//i * 30)
                    .attr("y", (d, i) => {
                        let nrow = parseInt(1 + i / lvls.length * nrows)
                        let adjIndex = nrow==1 ? i : i - parseInt(lvls.length / nrows)
                        return (nrow -1) * legPaddingY + 60 - 5
                    })
                    .text((d) => d)
                    .style('font-size',18)
            //.attr("class", "dot")

        // create a tooltip
        
        tooltip.style('opacity', 0)
               .style('background-color', 'aquamarine')
               .style('border', 'solid')
               .style('border-width', '5px')
               .style('padding', '2px')
               .attr('data-value', null)
               .attr('data-category', null)
               .attr('data-name', null)

        const mouseover = (event, d) => {
            tooltip.style('opacity', 0.7)
        }

        const mousemove = (event, d) => {            
            tooltip.html('data-name: '  + d.data.name + '<br/>' 
                        + 'data-category: ' + d.data.category + '<br/>'
                        + 'data-value' + ': ' + d.data.value + '<br/>')
                    .style('left', (d3.pointer(event)[0]) + 70 + 'px')
                    .style('top', (d3.pointer(event)[1]) + 200 + 'px')
                    .style('position', 'absolute')
                    .attr('data-name', d.data.name)
                    .attr('data-category', d.data.category)
                    .attr('data-value', d.data.value)

        }

        const mouseleave = (event, d) => {
            tooltip.style('opacity', 0)
        }

        d3.selectAll(".tile").on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
        d3.selectAll(".rect-label").on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
        
    }




    
    onMount(() => {
        //d3.json('for_user_education.json')
        console.log('start')
        d3.json('video-game-sales-data.json')
              .then((data) => {
                  draw_map(data);
                })    
        console.log('mount finished')
            })

</script>
<body>

    
    <h1 id="title"> FCC - Data Visualization Project 5: TreeMap Diagram</h1>
    <h2 id="description"> Tree map for Top 100 Video Game Sales</h2>
    <svg id='legend'></svg>
    <div id='d3chart'>
    </div>

    <div>Source: <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">USDA Economic Research Service</a></div>
</body>


