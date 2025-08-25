var pvDailyPieChart = false;

function initPvDailyPieChart() {
	pvDailyPieChart = new Highcharts.chart({
	    chart: {
	    	renderTo: 'pvDailyPieChartContainer',
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: {
	        text: ''
	    },
	    tooltip: {
	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	    },
	    legend: {
            enabled: false
        },
        colors: ['#FF718F', '#5CC9A0', '#F2A474'],
	    accessibility: {
	        point: {
	            valueSuffix: '%'
	        }
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: false
	            }
	        }
	    },
	    series: [{
	        name: 'pv',
	        colorByPoint: true,
	        data: [{
	            name: pvLoadTodayText,
	            y: 0
	        }, {
	            name: pvChargeTodayText,
	            y: 0
	        }, {
	            name: pvExportTodayText,
	            y: 0
	        }]
	    }]
	});
}

function reloadPvTodayPieChart(pvLoadToday, pvChargeToday, pvExportToday) {
	var data = new Array();
	data.push({ name: pvLoadTodayText, y: pvLoadToday / 10 });
	data.push({ name: pvChargeTodayText, y: pvChargeToday / 10 });
	data.push({ name: pvExportTodayText, y: pvExportToday / 10 });
	if(pvDailyPieChart) {
		pvDailyPieChart.series[0].setData(data);
	}
}