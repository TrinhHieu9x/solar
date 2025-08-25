var pvTotalPieChart = false;

function initPvTotalPieChart() {
	pvTotalPieChart = new Highcharts.chart({
	    chart: {
	    	renderTo: 'pvTotalPieChartContainer',
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
	        name: 'Brands',
	        colorByPoint: true,
	        data: [{
	            name: 'Chrome',
	            y: 61.41,
	            sliced: true,
	            selected: true
	        }, {
	            name: pvLoadTotalText,
	            y: 0
	        }, {
	            name: pvChargeTotalText,
	            y: 0
	        }, {
	            name: pvExportTotalText,
	            y: 0
	        }]
	    }]
	});
}

function reloadPvTotalPieChart(pvLoadTotal, pvChargeTotal, pvExportTotal) {
	var data = new Array();
	data.push({ name: pvLoadTotalText, y: pvLoadTotal / 10 });
	data.push({ name: pvChargeTotalText, y: pvChargeTotal / 10 });
	data.push({ name: pvExportTotalText, y: pvExportTotal / 10 });
	if(pvTotalPieChart) {
		pvTotalPieChart.series[0].setData(data);
	}
}
