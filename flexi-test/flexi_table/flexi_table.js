'use strict';
(function() {

    let removeEventListener;
    let filteredColumns = [];

    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            const savedSheetName = "D3 DATA"
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


    

})();
