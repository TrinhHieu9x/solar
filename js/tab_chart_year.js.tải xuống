tabPlantChart.initYearColumnChart = function () {
	var chart = new Highcharts.Chart({
        chart: {
        	renderTo: 'plantYearColumnHolder',
            type: 'column'
        },
        title: {
        	floating: true,
        	align: 'left',
            text: energyChartTtle + ' (' + $('#plantYearColumnChartDate').val() + ')'
        },
        legend: {
//        	layout: 'vertical',
            align: 'left',
            x: 0,
            verticalAlign: 'top',
            y: 24,
//            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        // colors: energyChartColors,
        xAxis: {
            categories: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
        },
        yAxis: {
            min: 0,
            title: {
                text: energyAxisTitleY + '(kWh)'
            }
        },
        tooltip: {
            headerFormat: '<b>' + monthChartSeriesName + ': </b><span>{point.key}</span><br/>',
            pointFormatter: function() {
                let seriesName = this.series.name;
                if(seriesName == 'Net Energy') {
                    console.log(this.index)
                    seriesName += barNetEnergyData[this.index] > 0? `(${importText})` : barNetEnergyData[this.index] < 0? `(${exportText})` : ""
                }
                return '<b>'+seriesName+': </b>' + '<span style="padding:0">'+Math.abs(this.y.toFixed(1))+' kWh</span><br/>'
            },
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: solarProductionText,
            data: [ ]
        }, {
            name: batteryDischargingText,
            data: [ ]
        }, {
            name: export2GridText,
            data: [ ]
        }, {
            name: import2UserText,
            data: [ ]
        }, {
            name: consumptionText,
            data: [ ]
        }]
    });

    var yearResponse = null
	$('#plantYearColumnChartDate').change(function() {
		var yearDate = moment($('#plantYearColumnChartDate').val(), 'YYYY');
		$.post(baseUrl + '/api/inverterChart/yearColumn' + (showParallelData ? 'Parallel' : ''), { serialNum: getChartTargetSerialNum(), year: yearDate.year() }, function(response) {
            getBarVisible(response,chart, currentDeviceType)
            yearResponse = response
        }, 'json');
	}).change();

    $('#yearButton').click(function() {
        yearResponse && getBarVisible(yearResponse, chart, currentDeviceType)
    })
};