var powerChart = false;

function initPowerChart() {
	powerChart = new Highcharts.Chart({
		chart: {
			renderTo: 'powerLineHolder',
			type: 'spline',
			zoomType: 'x'
		},
		title: {
			floating: true,
        	align: 'left',
        	text: lineChartTitle
		},
		
		legend: {
			align: 'right',
			verticalAlign: 'top'
        },
        // colors: chartColors,
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: { // don't display the dummy year
				hour:"%H:%M",
		        day:"%m-%e",
		        month:"%Y-%m",
			}
		},
		yAxis: [{
			title: 'Power(W)'
		}, {
			title: 'SOC(%)',
			opposite: true,
			min: 0,
			max: 120,
			labels: {
				formatter: function() {
					return (this.value > 100 ? '%' : this.value);
				}
			}
		}],
		tooltip: {
			headerFormat: '<b>' + dayChartSeriesName + ': </b><span>{point.key}</span><br/>',
//            pointFormat: '<b>{series.name}: </b>' + '<span style="padding:0">{point.y} W</span><br/>',
            pointFormatter: function() {
            	var seriesName = this.series.name;
            	if(seriesName.indexOf('Battery') >= 0) {
            		if(this.y > 0) {
            			seriesName = 'Battery Discharging';
            		} else if(this.y  < 0) {
            			seriesName = 'Battery Charging';
            		}
            	} else if(seriesName.indexOf('Grid') >= 0) {
            		if(this.y > 0) {
            			seriesName = 'Export Grid Power';
            		} else if(this.y < 0) {
            			seriesName = 'Import Grid Power';
            		} else {
            			seriesName = 'Grid Power';
            		}
            	}
            	
            	var unit = ' W';
            	if(seriesName == 'SOC') {
					unit = '%';
				}
            	
            	return '<b>' + seriesName + ': </b><span style="padding:0">' + Math.abs(this.y) + unit + '</span><br/>';
            },
            xDateFormat: '%Y-%m-%d %H:%M',
			shared: true,
            useHTML: true
		},
		plotOptions: {
			series: {
				cursor: 'pointer',
				marker: {
					radius: 2,
					enabled: false
				},
				point: {
					events: {
						click: function(event) {
							if(showParallelData) {
								clickPoint(this.x, this.y)
							}
						}
					}
				}
			}
		},
		
		series: []
	});
	
	$('#dayLineChartDate').change(reloadLineChart);
}

function reloadLineChart() {
	$.post(baseUrl + '/api/analyze/chart/dayMultiLine' + (showParallelData ? 'Parallel' : ''), { serialNum: getChartTargetSerialNum(), dateText: $('#dayLineChartDate').val() }, function(response) {
		getLineVisible(response, powerChart)
	}, 'json');
}