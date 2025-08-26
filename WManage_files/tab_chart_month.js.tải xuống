tabPlantChart.initMonthColumnChart = function () {
	var dayMax = moment().daysInMonth();
	var categories = new Array();
	for(var i = 1; i <= dayMax; i++) {
		categories.push(i);
	}
	
	var chart = new Highcharts.Chart({
        chart: {
        	renderTo: 'plantMonthColumnHolder',
            type: 'column'
        },
        title: {
        	floating: true,
        	align: 'left',
            text: energyChartTtle + ' (' + $('#plantMonthColumnChartDate').val() + ')'
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
            categories: categories
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
        series: []
    });

    var monthResponse = null
	$('#plantMonthColumnChartDate').change(function() {
		var monthDate = moment($('#plantMonthColumnChartDate').val(), 'YYYY-MM');
		$.post(baseUrl + '/api/inverterChart/monthColumn' + (showParallelData ? 'Parallel' : ''), { serialNum: getChartTargetSerialNum(), year: monthDate.year(), month: monthDate.month() + 1 }, function(response) {
			var responseCategories = new Array();
			for(var i = 1; i <= response.dayMax; i++) {
				responseCategories.push(i);
			}
			chart.xAxis[0].setCategories(responseCategories);
			getBarVisible(response, chart, currentDeviceType, 'monthColumn')
            monthResponse = response
		}, 'json');
	});

    $('#monthButton').click(function() {
        monthResponse && getBarVisible(monthResponse, chart, currentDeviceType, 'monthColumn')
    })
};