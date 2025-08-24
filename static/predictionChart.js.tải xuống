var predictionChart = false;
var predictionCategories = new Array();

for(var i = 0; i <= 23; i++) {
    predictionCategories.push(i);
}

function initPredictionChart() {
    predictionChart = new Highcharts.Chart({
        chart: {
            renderTo: 'predictionLine',
            type: 'spline',
            zoomType: 'x'
        },
        title: {
            floating: true,
            align: 'left',
            text: predictionLineChartTitle
        },

        legend: {
            align: 'right',
            verticalAlign: 'top'
        },
        tooltip: {
            headerFormat: '',
            pointFormatter: function() {
                let tooltipContent = ''
                var seriesName = this.series.name;
                if(seriesName === 'Today Solar Energy') {
                    const hour = fillZeros(this.x, 2) + ':00';
                    tooltipContent = `<b>Time:</b> <span>${hour}</span><br/>`;
                }
                tooltipContent +=' <b>' +seriesName + ': </b><span style="padding:0">' + this.y + ' kWh</span><br/>';
                return tooltipContent;
            },
            shared: true,
            useHTML: true
        },
        xAxis: {
            categories: predictionCategories
        },
        yAxis: [{
            title: 'Energy(kWh)'
        }],
        series: [{
            name: 'Today Solar Energy',
            data: [],
            color: '#1e81b0'
        }, {
            name: 'Tomorrow Solar Energy',
            data: [],
            color: '#76b5c5'
        }
        ]
    })
    const url = showParallelData? 'dayPredictColumnParallel' : 'dayPredictColumn'
    $.post(baseUrl + '/api/predict/solar/' + url, { serialNum: currentModuleInverterSn}, function(response) {
        response = JSON.parse(response)
        if(response.success) {
            $('.predictionLineComponent').fadeIn()
            let predictionCategories = []
            let todaySolarEnergy = []
            let tomorrowSolarEnergy = []
            response.solarEnergys && response.solarEnergys.forEach(item => {
                predictionCategories.push(item.hour)
                todaySolarEnergy.push({ y: Math.abs(item.todaySolarEnergy / 10) })
                tomorrowSolarEnergy.push({ y:Math.abs(item.tomorrowSolarEnergy / 10) })
            })
            predictionChart.xAxis[0].setCategories(predictionCategories);
            predictionChart.series[0].setData(todaySolarEnergy)
            predictionChart.series[1].setData(tomorrowSolarEnergy)
        } else {
            $('.predictionLineComponent').fadeOut()
        }
    })
}