$(function(){
    Object.keys(chartColors).forEach(item => {
        $('#lineChart .'+(item.replace(/\s/g, ''))).css('color',chartColors[item])
        if(item == 'AC Couple') {
            $('#barChart .'+(item.replace(/\s/g, ''))).css('color',chartColors[item])
        }
    })
    Object.keys(energyChartColors).forEach(item => {
        $('#barChart .'+(item.replace(/\s/g, ''))).css('color',energyChartColors[item])
    })
})

var checkedValue = null
function getParams() {
    let data =  sessionChartValue[(!currentDeviceType&&currentDeviceType!=0?'-1':currentDeviceType) + '_' + (!currentSubDeviceType&&currentSubDeviceType!=0?'-1':currentSubDeviceType) + '_' + (!currentPhase&&currentPhase!=0?'-1':currentPhase) + '_' + (!currentDtc && currentDtc != 0?'-1':currentDtc)]
    if(!data) {
        let formParams = {
            barAcCouple: false,
            barBattery: true,
            barConsumption: true,
            barExportToGrid: true,
            barImportToUser: true,
            barSolarProduction: true,
            barBattCharge: false,
            barNetEnergy: false,
            eChgDay: true,
            lineAcCouple: false,
            lineBattery: true,
            lineConsumption: true,
            lineGrid: true,
            lineSOC: true,
            lineSolarPV: true
        }
        if(currentDeviceType == 7) {
            formParams.barImportToUser = false
            formParams.barExportToGrid = false
            $("#barExportToGrid").attr('checked',false)
            $("#barImportToUser").attr('checked',false)
        } else {
            if(isSnaSeries()) {
                formParams.barExportToGrid = false
                $("#barExportToGrid").attr('checked',false)
            } else {
                formParams.barImportToUser = false
                $("#barImportToUser").attr('checked',false)
            }
        }
        data = formParams
    }
    return data
}
function getChecked() {
    let params = getParams()
    if(params) {
        checkedValue = params
        Object.keys(params).forEach(key => {
            if($('.chartDialog #' + key)) {
                let checkbox = document.getElementById(key);
                checkbox && (checkbox.checked = params[key])
            }
        });
    } else {
        $('#barChart input[type="checkbox"]').prop('checked', true);
        $('#lineChart input[type="checkbox"]').prop('checked', true);
    }
}

async function settingLineChart() {
    await saveRecord()
    getChecked()
    $('#lineChart').dialog('close')
    getLineChartData()
}

async function settingBarChart() {
    await saveRecord()
    getChecked()
    $('#barChart').dialog('close')
    getBarChartData()
}

function saveRecord() {
    return new Promise((resolve) => {
        let allData = $('input[name=lineChartGroup]').map(function() {
            return this.value;
        }).get();
        allData = allData.concat($('input[name=barChartGroup]').map(function() {
            return this.value;
        }).get())
        let checkedData = $('input[name=lineChartGroup]:checked').map(function() {
            return this.value;
        }).get();
        checkedData = checkedData.concat($('input[name=barChartGroup]:checked').map(function() {
            return this.value;
        }).get())
        let obj = {}
        allData.forEach(item => {
            obj[item] = checkedData.includes(item)
        })
        obj.serialNum = currentSerialNum
        $.post(baseUrl + '/api/userChartRecord/saveUserChartRecord', obj, function(response) {
            response = JSON.parse(response)
            if(response.success) {
                alert(successText);
                sessionChartValue[(!currentDeviceType&&currentDeviceType!=0?'-1':currentDeviceType) + '_' + (!currentSubDeviceType&&currentSubDeviceType!=0?'-1':currentSubDeviceType) + '_' + (!currentPhase&&currentPhase!=0?'-1':currentPhase) + '_' + (!currentDtc && currentDtc != 0?'-1':currentDtc)] = JSON.parse(JSON.stringify(obj))
            } else {
                alert(failedText);
            }
            resolve(response)
        })
    })

}

var barChart = null
var solarPredictData = new Array();
var solarProductionData = new Array();
var batteryDischargingData = new Array();
var export2GridData = new Array();
var import2UserData = new Array();
var consumptionData = new Array();
var barBattChargeData = new Array();
var barAcCoupleData = new Array();
var barNetEnergyData = new Array();
function getBarVisible(response, chart, currentDeviceType, chartType) {
    barChart = chart
    solarPredictData = []
    solarProductionData = [];
    batteryDischargingData = [];
    export2GridData = [];
    import2UserData = [];
    consumptionData = [];
    barBattChargeData = [];
    barAcCoupleData = [];
    barNetEnergyData = [];
    barNetEnergyDataAbs = [];
    response.data && $.each(response.data, function(index, obj) {
        if(showParallelData) {
            solarProductionData.push(obj.ePvDay / 10);
            batteryDischargingData.push(obj.eDisChgDay / 10);
            export2GridData.push(obj.eExportDay / 10);
            import2UserData.push(obj.eImportDay / 10);
            consumptionData.push(obj.eConsumptionDay / 10);
            barBattChargeData.push(obj.eChgDay / 10);
            barAcCoupleData.push(obj.eGenDay / 10);
            if(obj.eNetEnergyDay || obj.eNetEnergyDay == 0) {
                barNetEnergyData.push(obj.eNetEnergyDay / 10);
                barNetEnergyDataAbs.push(Math.abs(obj.eNetEnergyDay / 10));
            }
        } else {
            if(isAdmin && currentModuleInverterSn == '0022005021' && chartType == 'monthColumn') {
            	solarPredictData.push(obj.ePredictSolarDay / 10);
            }
            solarProductionData.push((obj.ePv1Day + obj.ePv2Day + obj.ePv3Day) / 10);
            batteryDischargingData.push(obj.eDisChgDay / 10);
            export2GridData.push(obj.eToGridDay / 10);
            import2UserData.push(obj.eToUserDay / 10);
            barBattChargeData.push(obj.eChgDay / 10);
            consumptionData.push(obj.eConsumptionDay / 10);
            barAcCoupleData.push(obj.eGenDay / 10);
            if(obj.eNetEnergyDay || obj.eNetEnergyDay == 0) {
                barNetEnergyData.push(obj.eNetEnergyDay / 10);
                barNetEnergyDataAbs.push(Math.abs(obj.eNetEnergyDay / 10));
            }
        }
    });
    getBarChartData()
    chart.setTitle({ text: energyChartTtle + ' (' + $('#plantYearColumnChartDate').val() + ')' });
}

function getBarChartData() {
    for(let i = barChart.series.length - 1; i > -1; i--) {
        barChart.series[i].remove()
    }
    
    // if(!(currentDeviceType == 3 || currentDeviceType == 11)) {
    //     $("#barAcCouple").parent().show()
    // } else {
    //     $("#barAcCouple").parent().hide()
    // }
    $("#barAcCouple").parent().hide()

    if(currentDeviceType == 0 && currentPhase == 3 && barNetEnergyData.length > 0) {
        $("#barNetEnergy").parent().show()
    } else {
        $("#barNetEnergy").parent().hide()
        checkedValue.barNetEnergy = false
    }

    if(checkedValue) {
        if(isAdmin && currentModuleInverterSn == '0022005021' && solarPredictData.length > 0) {
        	barChart.addSeries({name: 'Solar Energy Predict',data: solarPredictData, color: 'darkgreen'}, false)
        }
        checkedValue.barSolarProduction && barChart.addSeries({name: solarProductionText,data: solarProductionData, color: energyChartColors['Solar Production']}, false)
        checkedValue.barBattery && barChart.addSeries({name: batteryDischargingText,data: batteryDischargingData, color: energyChartColors['Battery']}, false)
        checkedValue.barBattCharge && barChart.addSeries({name: barBattChargeText,data: barBattChargeData, color: energyChartColors['BattCharge']}, false)
        checkedValue.barExportToGrid && barChart.addSeries({name: export2GridText,data: export2GridData, color: energyChartColors['Export to Grid']}, false)
        checkedValue.barImportToUser && barChart.addSeries({name: import2UserText,data: import2UserData, color: energyChartColors['Import to User']}, false)
        checkedValue.barConsumption && barChart.addSeries({name: consumptionText,data: consumptionData, color: energyChartColors['Consumption']}, false)
        checkedValue.barAcCouple && barChart.addSeries({name: eGenDayText,data: barAcCoupleData, color: chartColors['AC Couple']}, false)
        checkedValue.barNetEnergy && barChart.addSeries({name: netEnergyText,data: barNetEnergyDataAbs, color: energyChartColors['Net Energy']}, false)
    }
    barChart.redraw()
}

var lineChart = null
var data0 = new Array();
var data1 = new Array();
var data2 = new Array();
var data3 = new Array();
var data4 = new Array();
var data5 = new Array();
var hasAcCoupleData = false;
function getLineVisible(response, powerChart) {
    lineChart = powerChart
    data0 = []
    data1 = []
    data2 = []
    data3 = []
    data4 = []
    data5 = []
    hasAcCoupleData = false
    if(response.success) {
        response.data && $.each(response.data, function(index, obj) {
            data0.push(new Array(Date.UTC(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second), obj.solarPv));
            data1.push(new Array(Date.UTC(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second), obj.batteryDischarging));
            data2.push(new Array(Date.UTC(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second), obj.gridPower));
            data3.push(new Array(Date.UTC(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second), obj.consumption));
            data4.push(new Array(Date.UTC(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second), obj.soc));
            if(obj.acCouplePower >= 0) {
                hasAcCoupleData = true;
                data5.push(new Array(Date.UTC(obj.year, obj.month, obj.day, obj.hour, obj.minute, obj.second), obj.acCouplePower));
            }
        });
    }
    getLineChartData()
}

function getLineChartData() {
    for( let i = lineChart.series.length - 1; i > -1; i--) {
        lineChart.series[i].remove()
    }
    if(isEG4Platform && currentBatteryType == 'LEAD_ACID') {
        $("#lineSOC").parent().hide()
    } else {
        $("#lineSOC").parent().show()
    }
    if(checkedValue) {
        checkedValue.lineSolarPV && lineChart.addSeries({type: 'line', name: solarPvLabel,data: data0, color: chartColors['Solar PV']}, false)
        checkedValue.lineBattery && lineChart.addSeries({type: 'line',name: batteryLabel,data: data1, color: chartColors['Battery']}, false)
        checkedValue.lineGrid && lineChart.addSeries({type: 'line',name: gridLabel,data: data2, color: chartColors['Grid']}, false)
        checkedValue.lineConsumption && lineChart.addSeries({type: 'line',name: consumptionLabel,data: data3, color: chartColors['Consumption']}, false)
        !(isEG4Platform && currentBatteryType == 'LEAD_ACID') && checkedValue.lineSOC && lineChart.addSeries({type: 'line',name: 'SOC',data: data4, yAxis: 1, color: chartColors['SOC']}, false)
    }
    if(hasAcCoupleData) {
        $('#lineAcCouple').parent().show()
        checkedValue.lineAcCouple && lineChart.addSeries({			//RGB: 59,49,245
            type: 'line',
            name: 'AC Couple/Gnerator',
            data: data5,
            color: chartColors['AC Couple']
        }, false)
    } else {
        $('#lineAcCouple').parent().hide()
    }
    lineChart.redraw()
}

function settingColor() {
    let chartColor = $('input[name="color"]:checked').val()
    $.post(baseUrl + '/api/userChartRecord/saveOrUpdateChartColor', {chartColor}, function(response) {
        response = JSON.parse(response)
        if(response.success) {
            alert(successText);
            $('#colorBox').dialog('close')
            window.location.reload();
        } else {
            alert(failedText);
        }
    })
}