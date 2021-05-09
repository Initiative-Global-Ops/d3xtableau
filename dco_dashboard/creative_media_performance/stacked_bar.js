'use strict';
(function() {

    let removeEventListener;
    let filteredColumns = [];

    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            const savedSheetName = "D3 DATA"
            // const savedSheetName = 'Partner Display Performance'
            loadSelectedMarks(savedSheetName);

        }, function(err) {
            // Something went wrong in initialization.
            console.log('Error while Initializing: ' + err.toString());
        });
    });


    function loadSelectedMarks(worksheetName) {
        if (removeEventListener) {
            removeEventListener();
        }

        const worksheet = demoHelpers.getSelectedSheet(worksheetName);
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
         for (let i=0; i < worksheets.length; i++){
           console.log(worksheets[i].name)
         }
         worksheet.getSummaryDataAsync().then(function(sumdata) {
             const worksheetData = sumdata;
             console.log(worksheetData)


             let newArr = [];
             var dataJson;
             var cols = [];


             worksheetData.columns.map(d => {
                 cols.push(d.fieldName);
             })
             worksheetData.data.map(d => {
                 dataJson = {};
                 for (let i = 0; i < cols.length; i++) {
                     if (cols[i].includes("AGG(Conversion Rate)") || cols[i].includes("SUM(Impressions)")) {
                         dataJson[cols[i]] = !isNaN(d[i].value) ? d[i].value : 0;
                     } else {
                         dataJson[cols[i]] = d[i].value;
                     }
                 }


                 if (dataJson['Tactic'] == ['Lookalike'] ||
                     dataJson['Tactic'] == ['Behavioral'] ||
                     dataJson['Tactic'] == ['In Market']) {
                     newArr.push(dataJson);
                 }





             });


             let sums = {};
             let i;
             for (i = 0; i < newArr.length; i++) {

                 // assign new names to fieldnames
                 var impressions = newArr[i]["SUM(Impressions)"]
                 var conv_rate = newArr[i]["AGG(Conversion Rate)"]
                 var date = newArr[i]["Date"]
                 var tactic = newArr[i]["Tactic"]

                 var tactic_date = tactic + '_' + date

                 if (tactic_date in sums) {
                     sums[tactic_date]['impressions'] += impressions
                     sums[tactic_date]['conv_rate'] += conv_rate



                 } else {
                     sums[tactic_date] = {
                         "impressions": impressions,
                         "conv_rate": conv_rate,
                         "tactic": tactic,
                         "date": date
                     }
                 }
             }


             var sumsArr = []
             for (const [key, value] of Object.entries(sums))
                 sumsArr.push(value)


             sumsArr.sort((a, b) => (a.date > b.date) ? 1 : -1)

             drawDotChart(sumsArr);

         });

        worksheet.getSelectedMarksAsync().then((marks) => {
            demoHelpers.populateDataTable(marks, filterByColumn);
        });

        const marksSelectedEventHandler = (event) => {
            loadSelectedMarks(worksheetName);
        }
        // removeEventListener = worksheet.addEventListener(
        //     tableau.TableauEventType.MarkSelectionChanged, marksSelectedEventHandler);

        removeEventListener = worksheet.addEventListener(
            tableau.TableauEventType.FilterChanged, marksSelectedEventHandler);
    }

    function saveSheetAndLoadSelectedMarks(worksheetName) {
        tableau.extensions.settings.set('sheet', worksheetName);
        tableau.extensions.settings.saveAsync();
        loadSelectedMarks(worksheetName);
        console.log('hi')

    }

    function filterByColumn(columnIndex, fieldName) {
        const columnValues = demoHelpers.getValuesInColumn(columnIndex);
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        const worksheet = demoHelpers.getSelectedSheet(tableau.extensions.settings.get('sheet'));
        // console.log(worksheets)
        // console.log(worksheet)

        worksheets[0].applyFilterAsync(fieldName, columnValues, tableau.FilterUpdateType.Replace);

        filteredColumns.push(fieldName);
    }

    function resetFilters() {
        const worksheet = demoHelpers.getSelectedSheet(tableau.extensions.settings.get('sheet'));
        filteredColumns.forEach((columnName) => {
            worksheet.clearFilterAsync(columnName);
        });

        filteredColumns = [];
    }


    function drawDotChart(arr) {
        $('#wrapper').empty();
        const dateParser = d3.timeParse("%Y-%m-%d")
        const formatDate = d3.timeFormat("%b %-d, %y")
        const formatDate2 = d3.timeFormat("%b %d")
        const xAccessor = d => dateParser(d.date)
        const yAccessor = d => d.impressions
        const y2Accessor = d => d.conv_rate
        const add_commas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const tactic = d => d.tactic
        const capitalizeFirstLetter = d => d.charAt(0).toUpperCase() + d.slice(1)
        var colors = ["#A3294A","#4e79a7","#5EC7EB","#3F7F91"];
 
   

        var current_tactics = []
        for (let i=0; i < arr.length; i++){
            let c = arr[i].tactic
            current_tactics.push(c)
        }
        // console.log("current_tactics", current_tactics)

        var tactic_list = [...new Set(current_tactics)]

        // console.log("tactic_list", tactic_list)

        var arrs = []
        for (let j=0; j < tactic_list.length ; j++){
            arrs.push([])
        }
        

        for ( let i=0; i < arr.length ; i++){
            for (let j=0; j < tactic_list.length ; j++){
                 if (arr[i].tactic == tactic_list[j] ){
                    arrs[j].push(arr[i])
                  
                 }
             }
        }
        // arrs.push([])
        // for ( let i=0; i < arr.length ; i++){
        //     if (arr[i].tactic == tactic_list[0] ){
        //         arrs[arrs.length-1].push(arr[i])

        //     }
        // }
        
        var firstDates = [];
        var lastDates = [];
        for ( let i=0; i < arrs.length; i++){
            firstDates.push(new Date(arrs[i][0].date).getTime())
            lastDates.push(new Date(arrs[i][arrs[i].length-1].date).getTime())
        }

        
        let firstDate = new Date(Math.min.apply(Math, firstDates))
        let lastDate = new Date(Math.max.apply(Math, lastDates))
        console.log(firstDate, lastDate)

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }  

        function getDates(startDate, stopDate) {
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                dateArray.push(new Date (currentDate));
                currentDate = currentDate.addDays(1);
            }
            return dateArray;
        }

        var date_list = getDates(firstDate, lastDate)

        // console.log(dateParser(arrs[0][0].date))
        console.log(date_list)
        date_list[1].setHours(0,0,0,0)
        console.log(date_list[1])


        console.log("date_list", date_list)

        function dateFormatter(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        
            return [year, month, day].join('-');
        }

        var date_list_1 = [];
        var arrs_date = [];
        for(let x = 0; x < arrs.length; x++){  
            for(let i = 0; i < arrs[x].length; i++){  
            let c = arrs[x][i].date
            arrs_date.push(c)
            }
        }

        for(let i = 0; i < date_list.length; i++){  
            let c = dateFormatter(date_list[i])
            date_list_1.push(c)
        }

    
        // console.log("date_list", date_list)

        // console.log("arrs_date", arrs_date)
        // console.log("date_list_1", date_list_1)

        console.log(date_list_1[1] == arrs_date[0])
        console.log(date_list_1.length , arrs_date.length)
        console.log(date_list_1, arrs_date)

        // var arr1_idx = 0; var arr2_idx = 0; var arr3_idx = 0;
        // var arr1_imp; var arr2_imp; var arr3_imp;

        // let arr_imp = [];
        //     for (let i = 1; i < arrs.length + 1 ; i++){
        //         let c = "arr" + i + "_idx"
        //         let v = "arr" + i + "_imp"
        //         arr_idx.push(c)
        //         arr_imp.push(v)
        //     }

            console.log("date_list", date_list[[0]])
            console.log("arrs", arrs)
            console.log("arr_imp", arr_imp)

        for(let i = 0; i < arrs.length; i++){  
            console.log(arrs[i][0].date)
        }

        let arr_idx = [];
        for ( let i =0; i < arrs.length; i++){
            arr_idx.push(0)
        }

        var imp_tac = [];
        var arr_imp;
        for(let i = 0; i < date_list_1.length; i++){  
            arr_imp = []
            for( let j = 0; j < arrs.length; j++){ 
                if (date_list_1[i] == arrs[j][arr_idx[j]].date){
                    arr_imp.push(arrs[j][arr_idx[j]].impressions)
                    arr_idx[j]++;
                } else {
                    arr_imp.push(0)
                }     
            }

            let imp_tac_json = {};
            imp_tac_json['date'] = date_list_1[i]
            for( let j = 0; j < arrs.length; j++){ 
                imp_tac_json['imp'+(j+1)] = arr_imp[j]
            }
            imp_tac.push(imp_tac_json)
    }

        console.log("imp_tac",imp_tac)



       var subgroups = ['imp1', 'imp2', 'imp3']
       var data = imp_tac;
       var groups = d3.map(data, function(d){return(d.date)}).keys()

        const width = d3.min([
            window.innerWidth * 0.95,
        ])
        const height = d3.min([
            window.innerHeight * 0.9,
        ])

        let dimensions = {
            width: width,
            height: height,
            margin: {
                top: 30,
                right: 50,
                bottom: 40,
                left: 50,
            },
        }
        dimensions.boundedWidth = dimensions.width -
            dimensions.margin.right -
            dimensions.margin.left
        dimensions.boundedHeight = dimensions.height -
            dimensions.margin.top -
            dimensions.margin.bottom


            // LEGEND // 

     
        var legends = d3.select("#legend")
        .append("div")
        .attr("class", "legend_container")

        var legend_div = legends.append("svg")
        .attr("width", dimensions.width)
        .attr("height", "30px")



        var legend_keys = tactic_list

        var legend_colorScale = d3.scaleOrdinal()
        .domain(legend_keys)
        .range(colors)

        var txt_width_so_far = 0
        var txt_width = [0];
        for ( let i=0 ; i < legend_keys.length ; i++){
            let c = legend_keys[i].length
            txt_width_so_far += c + 2
            txt_width.push(txt_width_so_far)
        }

        let area_ids = []
        let checkbox_ids = [] 

        for (let i = 0; i < arr.length; i++){
            let checkbox_id = "checkbox_" + i
            checkbox_ids.push(checkbox_id)
        }
    
     

        let dim = 10
        legend_div.selectAll("keys")
        .data(legend_keys)
        .enter()
        .append("rect")
            .attr("x",function(d, i){ return 25 + txt_width[i]* 6})
            .attr("y", 10) 
            .attr("width", dim)
            .attr("height", dim)
            .attr("id",function(d, i){checkbox_ids[i]})
            .attr("class", "legend_container")
            .attr("fill", legend_colorScale);
    

        legend_div.selectAll("labels")
        .data(legend_keys)
        .enter()
        .append("text")
        .attr("y", 19)
        .attr("x",function(d, i){ return 38 + txt_width[i] * 6})
            .style("fill", "#1b261c")
            .text(function(d){ return capitalizeFirstLetter(d)})    
            .attr("text-anchor", "left")
            .attr("class", "legend_label")

        const wrapper = d3.select("#wrapper")
            .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        const bounds = wrapper.append("g")
            .style("transform", `translate(${
           dimensions.margin.left
         }px,${
           dimensions.margin.top
         }px)`)

        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const xxScale = d3.scaleTime()
            .domain(d3.extent(arr, xAccessor))
            .range([0, dimensions.boundedWidth])

        const xScale = d3.scaleBand()
            .range([0, dimensions.boundedWidth])
            .padding(0.1)

        const logScale = d3.scaleLog()
            .domain([10, 100000])
            .range([0, 600]);

        const yScale = d3.scaleLinear()
            .range([dimensions.boundedHeight, 0])

        const y2Scale = d3.scaleLinear()
            .domain(d3.extent(arr, y2Accessor))
            .range([dimensions.boundedHeight, 0])

            xScale.domain(groups);
            yScale.domain([0, 6e6]);

            var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#d93251','#4e79a7','#5EC7EB'])
            // (red, dark-blue, light-blue)
            // (in-market, behavioral,lookalike )

          //stack the data? --> stack per subgroup
          var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        function x_gridlines() {
            return d3.axisBottom(xxScale)
                .ticks(0)
        }

        function y_gridlines() {
            return d3.axisLeft(yScale)
                .ticks(10)
        }

        function y2_gridlines() {
            return d3.axisRight(y2Scale)
                .ticks(0)
        }

        bounds.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + dimensions.boundedHeight + ")")
            .call(x_gridlines()
                .tickSize(-dimensions.boundedHeight)
                .tickFormat("")
            )

        bounds.append("g")
            .attr("class", "grid")
            .call(y_gridlines()
                .tickSize(-dimensions.boundedWidth)
                .tickFormat("")
            )

        bounds.append("g")
            .attr("class", "grid_y2")
            // .attr("stroke-dasharray", "4px 4px")
            .call(y2_gridlines()
                .tickSize(dimensions.boundedWidth)
                .tickFormat("")
            )

        const curve = d3.curveLinear

        var tooltip = d3.select("#wrapper")
           .append("div")
           .style("opacity", 0)
           .attr("class", "tooltip")
           .style("background-color", "#1b2326")
           .style("border-radius", "5px")
           .style("padding", "8px")

        var mouseover = function(d) {
          d3.select(this)
              .style("opacity", 0.8)
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];
            tooltip
                .html("Impressions: " + add_commas(subgroupValue))
                .style("opacity", 0.95)
          }
          var mousemove = function(d) {
            tooltip
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY -40) + "px");
          }
          var mouseleave = function(d) {
            tooltip
              .style("opacity", 0)
            d3.select(this)
                .style("opacity", 0.95)
          }


        function mouseOn(d) {
          var test = [];
          for ( let i = 0; i < imp_tac.length ; i++ ){
            test = imp_tac[i].date
          }
            div.transition()
                .duration(200)
                .style("opacity", 0.95)
            d3.select(this)
                .style("opacity", 0.6)
            div.html("Impressions: " + d.date + "</br>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        };

        function mouseOut(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
            d3.select(this)
                .style("opacity", 1)
        };


        // var clip = bounds.append("defs").append("svg:clipPath")
        //     .attr("id", "clip")
        //     .append("svg:rect")
        //     .attr("width", dimensions.boundedWidth)
        //     .attr("height", dimensions.boundedHeight)
        //     .attr("stroke","none")
        //     .attr("x", 0)
        //     .attr("y", 0);

        // var brush = d3.brushX()
        //     .extent([
        //         [0, 0],
        //         [dimensions.boundedWidth, dimensions.boundedHeight]
        //     ])
        //     .on("end", updateChart)

        var area = bounds.append("g")
            .attr("class","areas")
            // .attr("clip-path", "url(#clip)")

        const curve2 = d3.curveLinear

        const line1 = d3.line()
            .x(d => xxScale(xAccessor(d)))
            .y(d => y2Scale(y2Accessor(d)))
            .curve(curve2)

        area.append("path")
            .data(arr)
            .attr("fill", 'none')
            .attr("stroke-width","0.5px")
            .attr("stroke", "#1B2326")
            .attr("d", line1(arr))

        area.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return color(d.key); })
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(function(d) { return d; })
          .enter().append("rect")
          .attr("class", "bars")
            .attr("x", function(d) { return xScale(d.data.date); })
            .attr("y", function(d) { return yScale(d[1]); })
            .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width",xScale.bandwidth())

        area.selectAll("rect")
        .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

          // area
          //     .append("g")
          //     .attr("class", "brush")
          //     .call(brush);
        //
        // var idleTimeout
        //
        // function idled() {
        //     idleTimeout = null;
        // }
        //
        // function updateChart() {
        //     // What are the selected boundaries?
        //     var extent = d3.event.selection
        //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
        //     if (!extent) {
        //         if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        //         xxScale.domain([4, 8])
        //     } else {
        //         xxScale.domain([xxScale.invert(extent[0]), xxScale.invert(extent[1])])
        //         area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        //     }
        //     // Update axis and area position
        //     xAxis.transition().duration(1000).call(
        //         d3.axisBottom(xxScale)
        //         .ticks(5)
        //         .tickFormat(formatDate2))
        //
        //     area
        //     .select('.bars')
        //     .transition()
        //     .duration(1000)
        //     .attr("x", function(d) { return xScale(d.data.date); })
        //     .attr("y", function(d) { return yScale(d[1]); })
        //     .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        //     .attr("width",xScale.bandwidth())
        //
        // }
        //
        // bounds.on("dblclick", function() {
        //     xScale.domain(d3.extent(arr, xAccessor))
        //     xAxis.transition().call(d3.axisBottom(xScale)
        //         .ticks(9)
        //         .tickFormat(formatDate))
        //     area
        //         .select('.bars1')
        //         .transition()
        //         .attr("x", function(d) { return xScale(d.data.date); })
        //         .attr("y", function(d) { return yScale(d[1]); })
        //         .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        //         .attr("width",xScale.bandwidth())
        //
        // });
        const remove_zero = d => (d / 1e6) + "M";

        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickFormat(remove_zero);

        const yAxis = bounds.append("g")
            .attr("class","axisLine")
            .call(yAxisGenerator)
            .attr("font-family", "Arial")
            .attr("font-size", "10")
            .attr("text-align", "left")



        const y2AxisGenerator = d3.axisRight()
            .scale(y2Scale)
            .ticks(4)
            // .tickFormat(d => (d * 10) + "%");

        const y2Axis = bounds.append("g")
            .attr("class","axisLine")
            .call(y2AxisGenerator)
            .style("transform", `translateX(${
              dimensions.boundedWidth
            }px)`)
            .attr("font-family", "Arial")
            .attr("font-size", "10")
            .attr("text-align", "left")



        const xAxisGenerator = d3.axisBottom()
            .scale(xxScale)
            .ticks(5)
            .tickFormat(formatDate);


        const xAxis = bounds.append("g")
            .attr("class","axisLine")
            .call(xAxisGenerator)
            .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)
            .attr("font-family", "Arial")
            .attr("font-size", "10")

        const xAxisLabel = xAxis.append("text")
            .attr("x", dimensions.boundedWidth / 2)
            .attr("y", dimensions.margin.bottom)
            .style("font-family", "Arial")
            .style("font-size", "10")
            .style("font-weight", "bold")
            .html("")
            .attr("fill", "#1B2326")

        const yAxisLabel = yAxis.append("text")
            .attr("x", -dimensions.boundedHeight / 2)
            .attr("y", -dimensions.margin.left + 10)
            .style("font-family", "Arial")
            .style("font-size", "10")
            .style("font-weight", "bold")
            .html("Impressions")
            .style("transform", "rotate(-90deg)")
            .style("text-anchor", "middle")
            .style("fill", "#1B2326")

        const y2AxisLabel = y2Axis.append("text")
            .attr("x", dimensions.boundedHeight / 2)
            .attr("y", -dimensions.margin.right + 10)
            .style("font-family", "Arial")
            .style("font-size", "10")
            .style("font-weight", "bold")
            .html("Conversion Rate")
            .style("transform", "rotate(90deg)")
            .style("text-anchor", "middle")
            .attr("fill", "#1B2326")

    }

})();