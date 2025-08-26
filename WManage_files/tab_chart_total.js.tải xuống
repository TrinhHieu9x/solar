var totalColumnChartInited = false;
tabPlantChart.initTotalColumnChart = function () {
	var year = moment().year();
	var categories = new Array();
    var totalResponse = null
	for(var i = 7 - 1; i >= 0; i--) {
		categories.push(year - i);
	}
	
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'plantTotalColumnHolder',
            type: 'column',
            events: {
                load: function() {
                	var series = this.series;
    				$.post(baseUrl + '/api/inverterChart/totalColumn' + (showParallelData ? 'Parallel' : ''), { serialNum: getChartTargetSerialNum() }, function(response) {
                        getBarVisible(response, chart, currentDeviceType)
                        totalResponse = response
                        totalColumnChartInited = true;
    				}, 'json');
                }
            }
        },
	    title: {
	    	floating: true,
	    	align: 'left',
	        text: energyChartTtle
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

    $('#totalButton').click(function() {
        totalResponse && getBarVisible(totalResponse, chart, currentDeviceType)
    })
};