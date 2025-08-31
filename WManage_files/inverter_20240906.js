var currentSerialNum = false;

var lastLoadInfoPlantId = -1;
var alreadyInitPowerChart = false;
var alreadyInitEnergyChart = false;
var alreadyInitPvDailyPieChart = false;
var alreadyInitPvTotalPieChart = false;

var parallelMidboxSn = false;

var showParallelData = false;

var lastTimeCheckViewerOnlineDatalogPlantId = -1;

var firstTimeShowMaxCurrHolder = true;

function onPlantChanged() {
	if(needCheckCluster && lastTimeCheckViewerOnlineDatalogPlantId != selectPlantId) {
		lastTimeCheckViewerOnlineDatalogPlantId = selectPlantId;
		searchOnlineDeviceAtClusters();
	}
}

function hideAutoParallelButton() {
	$('#autoParallelButton').fadeOut();
}
var inverterImgSrc = false
var is12TripAndPowerGH50_positive = 0
var is12TripAndPowerGH50_negative = 0
async function onDeviceChanged(serialNum) {			//New inverter selected
	if(currentDeviceType == 0 && currentPhase == 3) {
		$('.isPhase3').show()
		$('.noPhase3').hide()
		$('.phase3ParallelGridTextHolder').show()
	} else {
		$('.isPhase3').hide()
		$('.noPhase3').show()
		$('.phase3ParallelGridTextHolder').hide()
	}
	$('.genRunTimeBtn').hide()
	if(currentDeviceType == 3 || currentDeviceType == 11 || currentDeviceType == 6 || currentDeviceType == 9 || isFlexBoss18() || isFlexBoss21()) {
		$('.genRunTimeBtn').show()
	}
	is12TripAndPowerGH50_positive = currentDeviceType == 0 && currentPhase == 3 && platform == 'LUX_POWER'? 99.99 : 0
	is12TripAndPowerGH50_negative = currentDeviceType == 0 && currentPhase == 3 && platform == 'LUX_POWER'? -99.99 : 0
	checkedValue = null
	getChecked()
	if(currentDeviceType == 5) {
		window.location.href = baseUrl + '/web/monitor/lsp/inverter?serialNum=' + serialNum;
	} else if(currentDeviceType == 100) {
		window.location.href = baseUrl + '/web/monitor/micro/inverter';
	} else if(currentDeviceType == 200) {
		window.location.href = baseUrl + '/web/monitor/battery/zrgp';
	} else if(currentSubDeviceType == 201) {
		window.location.href = baseUrl + '/web/monitor/battery/zrgpAio';
	}
	
	if(((currentDeviceType == '9' || currentParallelEnabled) && $('#midboxContainer').length <= 0) 
			|| (currentWithbatteryData && $('#batteryDetailHolder').length <= 0) 
			|| (currentBindTigoInfo && $('#microPanelContainer').length <= 0) 
			|| (currentBindPhnixInfo && $('#phnixInfoContainer').length <= 0)
			|| (currentBindChargePoint && $('#cloudFastChargingInfoContainer').length <= 0)) {
		location.reload()
	}
	
	if(currentBindPhnixInfo) {
		$('#phnixInfoContainer').show()
		getPanixInfo(serialNum)
	} else {
		$('#phnixInfoContainer').hide()
	}
	if(currentBindChargePoint) {
		$('#cloudFastChargingInfoContainer').show()
		refreshChargeData(serialNum);
		setInterval(() => {
			refreshChargeData(serialNum);
		},(showParallelData || isSecondCluster) ? (150 * 1000) : (3 * 60 * 1000))
		getCloudFastChargingInfo(serialNum)
	} else {
		$('#cloudFastChargingInfoContainer').hide()
	}

	// if(currentShowAutoParallelButton) {
	// 	$('#autoParallelButton').fadeIn();
	// 	setTimeout(hideAutoParallelButton, 30000);
	// }

	firstTimeShowMaxCurrHolder = true;

	$('.ctrlBtnHolder').hide();
	$('.quickDisChgCtrlBtnHolder').hide();

	$('.batteryBackupModeBtnHolder').hide();

	$('#epsLnTextHolder').hide();

	$('.epsOverloadRecoveryTimeHolder').hide();

	$('.consumptionPhase3SingleTextHolder').hide();

	handleType6_9PvView(checkShowPv3ViewByDevice());

	if(currentDeviceType == 7) {
		$('#importExportEnergyHolder').hide();
	} else {
		$('#importExportEnergyHolder').show();
	}
	
	if(currentDeviceType == 13) {
		$('.getaNotShow').hide()
	}

	if(lastLoadInfoPlantId != selectPlantId) {
		lastLoadInfoPlantId = selectPlantId;
//		loadPlantInfo();
	}

	currentSerialNum = serialNum;
	$('#monitorHolder').attr('chartTarget', currentSerialNum);

	if(currentDeviceType == 9) {
		parallelMidboxSn = currentSerialNum;
	} else {
		parallelMidboxSn = false;
	}
	
	if (typeof (updateMidboxFlowChartStatus) == "function") {
		updateMidboxFlowChartStatus();
	}

	if(!showParallelData) {
		$('.consumptionPowerrTextHolder').show();

		if(currentDeviceType == 2) {				//AC Charger
			$('.pvTextHolder').hide();
			$('.pvImg').hide();
			$('img.pvArrowImg').hide();
			$('.acPvTextHolder').show();
			$('.acPvImg').show();
		} else {
			$('.acPvTextHolder').hide();
			$('.acPvImg').hide();
			$('img.acPvArrowImg').hide();
			$('.pvTextHolder').show();
			$('.pvImg').show();
		}
	} else {
		handleType6_9PvView(false);
	}

	if(platform != 'HUAYU' && inverterImgSrc) {
		$('#inverterFlowContainer .inverterImg').attr('src', inverterImgSrc);
	}
	$('#monitorHolder .batteryImg').removeData('batteryType');

	if(currentPowerRating > 0) {
		var currentPowerRatingText = (currentPowerRating / 1000).toFixed(1) + 'kW';
		if(currentDeviceType == 0 && currentPhase != 3) {
			$('#inverterTypeText').text('Hybrid ' + currentPowerRatingText);
		} else if(currentDeviceType == 2) {
			$('#inverterTypeText').text('AC ESS ' + currentPowerRatingText);
		} else {
			$('#inverterTypeText').text('');
		}
	} else {
		$('#inverterTypeText').text('');
	}

	await getParallelGroupDetails();
	refreshInverterEnergy();

	refreshInverterInformation(currentSerialNum);
	initPredictionChart()
	if(!alreadyInitPowerChart) {
		alreadyInitPowerChart = true;
		initPowerLintChart();
	}
	if(!alreadyInitPvDailyPieChart) {
		alreadyInitPvDailyPieChart = true;
		initPvDailyPieChart();
	}
	if(!alreadyInitPvTotalPieChart) {
		alreadyInitPvTotalPieChart = true;
		initPvTotalPieChart();
	}
	reloadAllCharts();

	//Battery information
	$('#batteryDetailHolder .subBatHolder').remove();
	if(currentWithbatteryData) {
		$('#batteryInfoContainer').fadeIn();
		$('#batteryDetailHolder').fadeIn();

		if(isSecondCluster) {
			$('#showAllBatParamCheckbox').click();
		}
	} else {
		$('#batteryInfoContainer').hide();
		$('#batteryDetailHolder').hide();
	}

	//Bind tigo info...
	if (typeof (updateTigoAfterDeviceChanged) == "function") {
		updateTigoAfterDeviceChanged();
	}
	
	typeof getWeatherForecast == 'function' && getWeatherForecast(serialNum);
}

function pvHoldClick1() {
	$('#pvInnerHolder1').hide();
	$('#pvInnerHolder3').hide();
	$('#pvInnerHolder2').show();
}

function pvHoldClick2() {
	$('#pvInnerHolder1').hide();
	$('#pvInnerHolder2').hide();
	$('#pvInnerHolder3').show();
}

function pvHoldClick3() {
	$('#pvInnerHolder2').hide();
	$('#pvInnerHolder3').hide();
	$('#pvInnerHolder1').show();
}

function batteryHoldClick() {
	if($('#batteryDischargeHolder').is(':visible')) {
		$('#batteryDischargeLabel').hide();
		$('#batteryDischargeHolder').hide();
		$('#batteryChargeLabel').show();
		$('#batteryChargeHolder').show();
	} else {
		$('#batteryChargeLabel').hide();
		$('#batteryChargeHolder').hide();
		$('#batteryDischargeLabel').show();
		$('#batteryDischargeHolder').show();
	}
}

function importExportHoldClick() {
	if($('#exportHolder').is(':visible')) {
		if(hasCustomPlatformImg) {
			$('#importExportHolder img.luxpower').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_import.png');
		} else {
			$('#importExportHolder img.luxpower').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_import.png');
		}
		$('#importExportHolder img.tecloman').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_import.png');
		$('#exportHolderLabel').hide();
		$('#exportHolder').hide();
		$('#importHolderLabel').show();
		$('#importHolder').show();
	} else {
		if(hasCustomPlatformImg) {
			$('#importExportHolder img.luxpower').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_feed_in_energy.png');
		} else {
			$('#importExportHolder img.luxpower').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_feed_in_energy.png');
		}
		$('#importExportHolder img.tecloman').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_feed_in_energy.png');
		$('#importHolderLabel').hide();
		$('#importHolder').hide();
		$('#exportHolderLabel').show();
		$('#exportHolder').show();
	}
}

function initPageWhenReady() {
	$('#alertBox').on('close.bs.alert', function () {
		window.sessionStorage.setItem('notShowNotification',1)
	});
	if(window.sessionStorage.getItem('notShowNotification')) {
		$('#alertBox').hide()
	} else {
		$('#alertBox').show()
	}
	refreshPageAt1Minute();

	tabPlantChart.initialize();

	$('#refreshSingleButton').click(function() {
		$('#refreshSingleButton').button('loading');
		refreshInputData();
	});

	$('#singleRadioBtnLabel').click(function(e) {
		showParallelData = false;
		refreshDataForSingleParallelChanged();
	});
	$('#parallelRadioBtnLabel').click(function(e) {
		showParallelData = true;
		refreshDataForSingleParallelChanged();
	});

	$('#monitorHolder .batteryImg').click(function() {
		if($('#maxCurrHolder').is(':visible') || $('#batteryCapacityHolder').is(':visible')) {
			$('#maxCurrHolder').removeData('showTime').fadeOut();
			$('#batteryCapacityHolder').removeData('showTime').fadeOut();
		} else {
			checkBatteryFlowHolderShow();
		}
	});
//	checkBatteryFlowHolderNeedHide();

	$('#noficeTable').datagrid({
		onBeforeLoad: function (param) {
			if(currentDeviceType >= 0) {
				param.deviceType = currentDeviceType;
			}
			param.page = 1;
			param.rows = 10;
		}
	});

	$('#showAllBatParamCheckbox').change(function() {
		if($('#showAllBatParamCheckbox').is(':checked')) {
			$('#batteryDetailHolder .subBatHolder .batDetailParamCheck').removeClass('noShow');
		} else {
			$('#batteryDetailHolder .subBatHolder .batDetailParamCheck').addClass('noShow');
		}
	});

//	$(window).scroll(function() {
//		var $html = $('html');
//		if(!alreadyInitPowerChart && $html.scrollTop() > 500) {
//			alreadyInitPowerChart = true;
//			initPowerLintChart();

//			reloadLineChart();
//		}
//		if(!alreadyInitEnergyChart && $html.scrollTop() > 900) {
//			alreadyInitEnergyChart = true;
//			tabPlantChart.initMonthColumnChart();
//		}
//	});
}

function searchOnlineDeviceAtClusters() {
	$.post(baseUrl + '/api/system/cluster/search/viewerFindOnlineDevice', { plantId: selectPlantId }, function(response) {
		if(response.success) {
			if(response.msg == 'otherCluster') {
				window.location.href = response.clusterForwardUrl.replace('http://', 'https://');
			} else if(response.msg == 'next') {						//Next check in 15 seconds...
				setTimeout(searchOnlineDeviceAtClusters, 15000);
			}
		} else {
			//Invalid request or current cluster - Do nothing...
		}
	}, 'json');
}

function checkBatteryFlowHolderShow() {
	var batteryType = $('#monitorHolder .batteryImg').data('batteryType');
	if(batteryType) {
		if(batteryType == 'LITHIUM') {
			$('#batteryCapacityHolder').hide();
			$('#maxCurrHolder').data('showTime', new Date().getTime()).fadeIn();
		} else if(batteryType == 'LEAD_ACID') {
			$('#maxCurrHolder').hide();
			$('#batteryCapacityHolder').data('showTime', new Date().getTime()).fadeIn();
		}
	}
}

function checkBatteryFlowHolderNeedHide() {
	var maxCurrHolderShowTime = $('#maxCurrHolder').data('showTime');
	if(maxCurrHolderShowTime && new Date().getTime() - maxCurrHolderShowTime > 10000) {
		$('#maxCurrHolder').removeData('showTime').hide();
	}
	var batteryCapacityHolderShowTime = $('#batteryCapacityHolder').data('showTime');
	if(batteryCapacityHolderShowTime && new Date().getTime() - batteryCapacityHolderShowTime > 10000) {
		$('#batteryCapacityHolder').removeData('showTime').hide();
	}

	setTimeout(checkBatteryFlowHolderNeedHide, 1000);
}

function refreshDataForSingleParallelChanged() {
	if(showParallelData) {
//		$('#refreshSingleButton').fadeOut();
		$('#inverterFlowContainer .inverterImg').attr('src', resourceBaseUrl + parallelInverterImgPath);
		$('.parallelHide').hide();
		$('.parallelShow').show();

		$('#monitorHolder .batParallelNumHolder .monitorDataText').text('--');
		$('#monitorHolder .batCapacityHolder .monitorDataText').text('--');

		if(checkShowPv3ViewByDevice()) {
			$('#parallelDeviceTableHolder ._12KParallelPv3Column').show();
		} else {
			$('#parallelDeviceTableHolder ._12KParallelPv3Column').hide();
		}
		$('#parallelDeviceTableHolder').fadeIn();

		if(!clickParallelRadioBtnLabelAuto) {
			getParallelGroupDetails();
		} else {
			clickParallelRadioBtnLabelAuto = false;
		}

		handleType6_9PvView(false);
	} else {
		initNotParallelFlowPanel();
	}

	// refreshInverterEnergy();
	//
	// refreshInverterInformation(currentSerialNum);
	//
	// reloadAllCharts();


	$('#monitorHolder .batteryImg').removeData('batteryType');
}

function initNotParallelFlowPanel() {
//		$('#refreshSingleButton').fadeIn();
	$('#inverterFlowContainer .inverterImg').attr('src', inverterImgSrc);
	$('.parallelShow').hide();
	$('.parallelHide').show();

	if(currentDeviceType == 2) {
		$('.pvTextHolder').hide();
	}

	$('.phase1ParallelGridTextHolder').hide();
	if(currentPhase == 3 && currentDeviceType == 0) {
		$('.phase3ParallelGridTextHolder').show();
		$('.phase3ParallelGridTextHolder .phase3VactTextHolder').show();

		$('.flowChartHolder .gridTextHolder').hide();
		$('.flowChartHolder .vacTextHolder').hide();
		$('.flowChartHolder .facTextHolder').hide();

		$('.epsPhase3TextHolder').show();
	} else {
		$('.phase3ParallelGridTextHolder').hide();

		$('.epsPhase3TextHolder').hide();
	}

	$('.consumptionPhase3TextHolder').hide();
	$('#parallelDeviceTableHolder').fadeOut();

	handleType6_9PvView(checkShowPv3ViewByDevice());
}

function handleType6_9PvView(show) {
	if(show) {
		$('.type6_9PvShow').show();
		$('.pvTextHolder').css('top', currentWithbatteryData ? '2px' : '-12px');
	} else {
		$('.type6_9PvShow').hide();
		$('.pvTextHolder').css('top', '2px');
	}
}

var clickParallelRadioBtnLabelAuto = false;

function getParallelGroupDetails() {
	return new Promise(resolve => {
		$('#noPrimaryH4').hide();

		if(currentSerialNum) {
			$.post(baseUrl + '/api/inverterOverview/getParallelGroupDetails', { serialNum: currentSerialNum }, function(response) {
				if(response.success) {
//				$('#singleParallelNavTabs').fadeIn();

					clickParallelRadioBtnLabelAuto = true;
					$('#parallelRadioBtnLabel').click();

					if(response.parallelMidboxSn) {
						parallelMidboxSn = response.parallelMidboxSn;
						if (typeof (updateMidboxFlowChartStatus) == "function") {
							updateMidboxFlowChartStatus();
						}
					}

					if(showParallelData) {
						$('#parallelDeviceTableHolder tbody').empty();
						$.each(response.devices, function(index, element) {
							var trHtml = '<tr>';
							trHtml += '<td>' + element.serialNum + '</td>';
							trHtml += '<td>' + (element.lost || (!element.vpv1 && element.vpv1 != 0) ? '' : (element.vpv1 ) + 'V') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.ppv1 && element.ppv1 != 0) ? '' : element.ppv1 + 'W') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.vpv2 && element.vpv2 != 0) ? '' : (element.vpv2 ) + 'V') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.ppv2 && element.ppv2 != 0) ? '' : element.ppv2 + 'W') + '</td>';

							if(checkShowPv3ViewByDevice()) {
								trHtml += '<td class="_12KParallelPv3Column">' + (element.lost || (!element.vpv3 && element.vpv3 != 0) ? '' : (element.vpv3 /10) + 'V') + '</td>';
								trHtml += '<td class="_12KParallelPv3Column">' + (element.lost || (!element.ppv3 && element.ppv3 != 0) ? '' : element.ppv3toFix(2) + 'W') + '</td>';
							}

							trHtml += '<td>' + (element.lost || (!element.soc && element.soc != 0) ? '' : element.soc + '%') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.vBat && element.vBat != 0) ? '' : (element.vBat ) + 'V') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.pCharge && element.pCharge != 0) ? '' : element.pCharge + 'W') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.pDisCharge && element.pDisCharge != 0) ? '' : element.pDisCharge + 'W') + '</td>';
							trHtml += '<td>' + (element.lost || (!element.peps && element.peps != 0) ? '' : element.peps + 'W') + '</td>';
							trHtml += '<td>' + element.parallelNumText + '</td>';
							trHtml += '<td>' + element.roleText + '</td>';
							trHtml += '</tr>';
							$('#parallelDeviceTableHolder tbody').append(trHtml);
						});
					}
				} else {
					if(showParallelData && response.msg == 'notParallel') {
						$('#singleRadioBtnLabel').click();
					}

//				$('#refreshSingleButton').fadeIn();
					$('#singleParallelNavTabs').fadeOut();
					$('#parallelDeviceTableHolder').fadeOut();
				}
				resolve(true)
			}, 'json');
		} else {
			showParallelData = false;
			initNotParallelFlowPanel();
			resolve(true)
		}
	})
}

function reloadAllCharts() {
	reloadLineChart();

	if(!alreadyInitEnergyChart) {
		alreadyInitEnergyChart = true;
		tabPlantChart.initMonthColumnChart();
	}
	$('#chartContainer .dateInput').change();

	if(totalColumnChartInited) {
		tabPlantChart.initTotalColumnChart();
	}
}

function getChartTargetSerialNum() {
	return currentSerialNum;
}

function readInput1() {
	$.post(baseUrl + '/web/maintain/remoteTransfer/sendReadInputCommand', { inverterSn: currentSerialNum, index: 1 }, function(response) {
		if(response.success) {
			setTimeout(readInput2, 500);
		} else {
			doneRefreshManually();
		}
	}, 'json');
}

function readInput2() {
	$.post(baseUrl + '/web/maintain/remoteTransfer/sendReadInputCommand', { inverterSn: currentSerialNum, index: 2 }, function(response) {
		if(response.success) {
			setTimeout(readInput3, 500);
		} else {
			doneRefreshManually();
		}
	}, 'json');
}

function readInput3() {
	$.post(baseUrl + '/web/maintain/remoteTransfer/sendReadInputCommand', { inverterSn: currentSerialNum, index: 3 }, function(response) {
		setTimeout(doneRefreshManually, 3000);
	}, 'json');
}

function refreshInputData() {
	$.post(baseUrl + '/web/maintain/remoteTransfer/refreshInputData', { inverterSn: currentSerialNum }, function(response) {
		if(response.success) {
			setTimeout(doneRefreshManually, 3000);
		}
	}, 'json');
}

function doneRefreshManually() {
	$('#refreshSingleButton').button('reset');

	if(showParallelData) {
		getParallelGroupDetails();
	}

	refreshInverterEnergy();

	refreshInverterInformation(currentSerialNum);

	reloadLineChart();
}

function refreshPageAt1Minute() {			//Refresh page information every minute...
	refreshInverterEnergy();

	if(showParallelData) {
		getParallelGroupDetails();
	}
	refreshInverterInformation(currentSerialNum);

	if (typeof (refreshTigoDataIfSystemLayoutValid) == "function") {
		refreshTigoDataIfSystemLayoutValid();
	}

	setTimeout(refreshPageAt1Minute, (showParallelData || redisRunning) ? (60 * 1000) : (3 * 60 * 1000));
}

//Site information
function refreshInverterEnergy() {
	if(currentSerialNum && currentSerialNum.length == 10) {
		$.post(baseUrl + '/api/inverter/getInverterEnergyInfo' + (showParallelData ? 'Parallel' : ''), { serialNum: currentSerialNum }, function(response) {
			if(response.success && response.hasRuntimeData) {
				$('#todayYieldingText').text(response.todayYieldingText);
				$('#totalYieldingText').text(response.totalYieldingText);
				$('#todayDischargingText').text(response.todayDischargingText);
				$('#totalDischargingText').text(response.totalDischargingText);
				$('#todayChargingText').text(response.todayChargingText);
				$('#totalChargingText').text(response.totalChargingText);
				$('#todayExportText').text(response.todayExportText);
				$('#totalExportText').text(response.totalExportText);
				$('#todayImportText').text(response.todayImportText);
				$('#totalImportText').text(response.totalImportText);
				$('#todayUsageText').text(response.todayUsageText);
				$('#totalUsageText').text(response.totalUsageText);

				$('#todayIncomeText').text(response.todayIncomeText);
				$('#totalIncomeText').text(response.totalIncomeText);
				$('#todaySavingText').text(response.todaySavingText);
				$('#totalSavingText').text(response.totalSavingText);

				$('#totalCo2ReductionText').text(response.totalCo2ReductionText);
				$('#totalCoalReductionText').text(response.totalCoalReductionText);

				$('#pvLoadTodaySpan').text((response.pvPieUsageTodayRate / 10.0) + "%");
				$('#pvChargeTodaySpan').text((response.pvPieChargeTodayRate / 10.0) + "%");
				$('#pvExportTodaySpan').text((response.pvPieExportTodayRate / 10.0) + "%");
				$('#dailyAllPvEnergyText').text(response.todayYieldingText + ' kWh');

				$('#pvLoadTotalSpan').text((response.pvPieUsageTotalRate / 10.0) + "%");
				$('#pvChargeTotalSpan').text((response.pvPieChargeTotalRate / 10.0) + "%");
				$('#pvExportTotalSpan').text((response.pvPieExportTotalRate / 10.0) + "%");
				$('#totalAllPvEnergyText').text(response.totalYieldingText + ' kWh');

				reloadPvTodayPieChart(response.pvPieUsageTodayRate, response.pvPieChargeTodayRate, response.pvPieExportTodayRate);
				reloadPvTotalPieChart(response.pvPieUsageTotalRate, response.pvPieChargeTotalRate, response.pvPieExportTotalRate);
			} else {
				clearInverterEnergy();
			}
		}, 'json');
	} else {
		clearInverterEnergy()
	}
}

function refreshChargeData(serialNum) {
	$.post(baseUrl + '/api/chargePoint/getChargePointRunTime', { inverterSn: serialNum, clientType: 'WEB'}, function(response) {
		if(response.success) {
			if(response.status == 'Preparing') {
				$('#charge').show()
				$('#stopCharge').hide()
			} else if(response.status == 'Charging') {
				$('#charge').hide()
				$('#stopCharge').show()
			} else {
				$('#charge').hide()
				$('#stopCharge').hide()
				// $('#chargeBtnBox').hide()
			}
		}
	}, 'json');
}

function clearInverterEnergy() {
	$('.energyInfoDataText').text('--');
	$('#totalCo2ReductionText').text('-- kG');
	$('#totalCoalReductionText').text('-- kG');
	reloadPvTodayPieChart(0, 0, 0);
	reloadPvTotalPieChart(0, 0, 0);
}

function clickStatusImg(img) {
	if($(img).attr('src').indexOf('error') > 0 || $(img).attr('src').indexOf('warning') > 0 ) {
		window.location.href = baseUrl + '/web/analyze/event'
	}
}

function clickStatusImgAtParallel(img) {
	if($(img).attr('src').indexOf('error') > 0 || $(img).attr('src').indexOf('warning') > 0 ) {
		var serialNum = $(img).parents('.flowChartHolder').attr('chartTarget');
		$.post(baseUrl + '/api/userVisit/update', { plantId: (plantId ? plantId : -1), serialNum: serialNum }, function(response) {
			window.location.href = baseUrl + '/web/analyze/event'
		}, 'json');
	}
}

function clearInverterPower(serialNum) {
	var targetSelector = (serialNum ? ('.flowChartHolder[chartTarget=' + serialNum + ']') : '#monitorHolder');
	$(targetSelector + ' .batteryPowerLabel').text(batteryPowerLabel);
	$(targetSelector + ' .monitorDataText').text('--');
	$(targetSelector + ' .standByLine').hide();
	$(targetSelector + ' .epsPowerText').text('--');
	$(targetSelector + ' .epsPowerLine').hide();
//	$(targetSelector + ' .importPowerLabel').hide();
//	$(targetSelector + ' .exportPowerLabel').hide();
	$(targetSelector + ' .monitorArrayImg').hide();
	$(targetSelector + ' .phase1ParallelGridTextHolder').hide();
	$(targetSelector + ' .phase3ParallelGridTextHolder').hide();
	$('#powerDetail').hide()
	if(currentDeviceType == 2) {
		$(targetSelector + ' .pvParallelTextHolder').hide();
	} else {
		$(targetSelector + ' .acPvImg').hide();
		$(targetSelector + ' .pvTextHolder').css('left', (screen.width < 800 ? (395 - 86) : 395) + 'px');
	}
	$(targetSelector + ' ._12kAcPvTextHolder').hide();
	$(targetSelector + ' .trip12kAcPvTextHolder').hide();

	$('#localTimeLabel').text('');

	$('.ctrlBtnHolder').hide();
	$('.quickDisChgCtrlBtnHolder').hide();

	$('.genDryContactTextHolder').hide();
	$('.genDryContactText').text('--');

	$('.batteryBackupModeBtnHolder').hide();

	$('.epsLnTextHolder .epsL1nText').text('');
	$('.epsLnTextHolder .epsL2nText').text('');
	$('.epsLnTextHolder').hide();

	$('.epsOverloadRecoveryTimeHolder').hide();
}

//Inverter information
function refreshInverterInformation(snForRefreshInfo) {
	$('.bmsInfoBtn').hide()
	if(parallelMidboxSn) {
		refreshMidboxInformation()
	} else {
		if(showParallelData) {
			refreshInverterInformationParallel(snForRefreshInfo);
		} else {
			refreshInverterInformationSingle(snForRefreshInfo);
		}
	}

	if(currentWithbatteryData) {
		refreshBatteryInfo(snForRefreshInfo);
	}
}

var currentEpsOverloadRecoveryTime = 0;
var epsOverloadIntervalBox = 0;

function countDownEpsOverloadRecoveryTimeEverySecond() {
	if(currentEpsOverloadRecoveryTime > 0) {
		currentEpsOverloadRecoveryTime--;
		$('.epsOverloadRecoveryTimeHolder span').text(handleSecondText(currentEpsOverloadRecoveryTime));
	} else {
		$('.epsOverloadRecoveryTimeHolder').hide();
	}
	epsOverloadIntervalBox = setTimeout(countDownEpsOverloadRecoveryTimeEverySecond, 1000);
}

function queryEpsOverloadRecoveryTime(inverterSn) {
	$.post(baseUrl + '/api/inverter/queryEpsOverloadRecoveryTime', { inverterSn: inverterSn }, function (response) {
		if(response.success) {
			currentEpsOverloadRecoveryTime = parseInt(response.msg);
			$('.epsOverloadRecoveryTimeHolder span').text(handleSecondText(currentEpsOverloadRecoveryTime));
			$('.epsOverloadRecoveryTimeHolder').fadeIn();
			clearInterval(epsOverloadIntervalBox);
			epsOverloadIntervalBox = setTimeout(countDownEpsOverloadRecoveryTimeEverySecond, 1000);
		} else {
			$('.epsOverloadRecoveryTimeHolder').hide();
		}
	}, 'json');
}

var currentRemainTimeBeforeGenStop = 0;
var genStopIntervalBox = 0;

function countDownRemainTimeBeforeGenStopEverySecond() {
	if(currentRemainTimeBeforeGenStop > 0) {
		currentRemainTimeBeforeGenStop--;
		$('.genQuickStartBtnHolder p span').text(handleSecondText(currentRemainTimeBeforeGenStop));
	} else {
		$('.genQuickStartBtnHolder p').hide();
	}
	genStopIntervalBox = setTimeout(countDownRemainTimeBeforeGenStopEverySecond, 1000);
}

async function getBmsStatusText(params) {
	return new Promise(resolve => {
		$.post(baseUrl + '/web/inverter/debugqna/startAnalyse', params, function (response) {
			if (response.answers) {
				resolve(response.answers)
			} else {
				resolve("")
			}
		}, 'json')
	})
}

var message;
$(function () {
	message = new Message();
})

async function showBmsChargeStatus (val, selectNum) {
	let currentSerialNum = selectNum || getChartTargetSerialNum()
	let bmsStatusText = await getBmsStatusText({ serialNum: currentSerialNum, debugQuestionType: val })
	if (!bmsStatusText || bmsStatusText == null) {
		return
	}
	message.setOption({
		message: bmsStatusText.join(),
		duration: 3000,
	});
}

function refreshInverterInformationParallel(snForRefreshInfo) {
	$('.consumptionPhase3SingleTextHolder').hide()
	if(!snForRefreshInfo || snForRefreshInfo.length != 10) {
		clearInverterPower(snForRefreshInfo);
		return;
	}

	$.post(baseUrl + '/api/inverter/getInverterRuntimeParallel', { serialNum: snForRefreshInfo }, function (response) {
		if(response.success) {
			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .statusImg').attr('src', resourceBaseUrl + '/web/img/monitor/inverter/status/' + response.statusText + ".png");
			if(response.statusText == 'error' || response.statusText == 'warning') {
				$('.doubtIcon').show()
			} else {
				$('.doubtIcon').hide()
			}
		} else {
			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .statusImg').attr('src', resourceBaseUrl + '/web/img/monitor/inverter/status/offline.png');
		}

		var isType6Series = checkType6Series();
		if(!response.success || response.lost || (!response.hasRuntimeData)) {
			clearInverterPower(snForRefreshInfo);
		} else {
			showPowerDetail(response)
			$('#localTimeLabel').text(response.deviceTime);

			if(response.hasEpsOverloadRecoveryTime) {
				queryEpsOverloadRecoveryTime(snForRefreshInfo);
			}

			if(response.batPower > is12TripAndPowerGH50_positive) {								//Battery power
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerLabel').text(chargePowerLabel);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerText').text(response.batPower);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.batteryArrowImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_left.gif').show();
			} else if(response.batPower < is12TripAndPowerGH50_negative) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerLabel').text(dischargePowerLabel);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerText').text(-response.batPower);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.batteryArrowImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_right.gif').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerLabel').text(batteryPowerLabel);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerText').text('0');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.batteryArrowImg').hide();
			}

			if(isEG4Platform && currentBatteryType == 'LEAD_ACID') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .socHolder').hide().find('.monitorDataText').text('--');
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .socHolder').show().find('.monitorDataText').text(response.soc);
			}

			if(response.batteryType == 'LEAD_ACID') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vbatHolder').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vbatHolder').hide();
			}
			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vbatText').text(response.vBat );

			var hasCustomBatteryEnergyIcon = false;
			if(response.batteryType == 'LITHIUM') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxChgCurrText').text(response.maxChgCurrValue);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxDischgCurrText').text(response.maxDischgCurrValue);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').show().text(response.bmsCharge ? 'Allowed' : 'Forbidden');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').show().text(response.bmsDischarge ? 'Allowed' : 'Forbidden');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsForceChargeText').show().text(response.bmsForceCharge ? 'ON' : 'OFF');

				response.bmsCharge ? $('.allowedHideBmsChargeTitle').hide() : $('.allowedHideBmsChargeTitle').show();
				response.bmsDischarge ? $('.allowedHideBmsDischargeTitle').hide() : $('.allowedHideBmsDischargeTitle').show();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').addClass("pointer");
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').addClass("pointer");
				
				if(response.batParallelNum && response.batParallelNum != '0') {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batParallelNumHolder').show().find('.monitorDataText').text(response.batParallelNum);
					if(!response.batShared) {
						$('.bmsInfoBtn').show()
					}
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batParallelNumHolder').hide().find('.monitorDataText').text('--');
				}
				
				if(response.batCapacity && response.batCapacity != '0') {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batCapacityHolder').show().find('.monitorDataText').text(response.batCapacity + ' Ah');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batCapacityHolder').hide().find('.monitorDataText').text('--');
				}
				
				$('#monitorHolder .batteryImg').data('batteryType', response.batteryType);

				if(isFortressPlatform) {
					if(response.maxDischgCurrValue % 60 == 0) {
						hasCustomBatteryEnergyIcon = true;
						$('#customBatteryEnergyIcon').attr('src', resourceBaseUrl + '/web/platform/FORTRESS/img/monitor/plant/eflex_96.png');
					} else if(response.maxChgCurrValue % 250 == 0) {
						hasCustomBatteryEnergyIcon = true;
						$('#customBatteryEnergyIcon').attr('src', resourceBaseUrl + '/web/platform/FORTRESS/img/monitor/plant/evault_96.png');
					}
				}
			} else if(response.batteryType == 'LEAD_ACID' && response.batteryCapacity) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryCapacityText').text(response.batteryCapacity);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxChgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxDischgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsForceChargeText').hide().text('--');
				$('#monitorHolder .batteryImg').data('batteryType', response.batteryType);
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxChgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxDischgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsForceChargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryCapacityText').hide().text('--');
				$('#monitorHolder .batteryImg').removeData('batteryType');
			}

			if(isFortressPlatform && !hasCustomBatteryEnergyIcon) {
				$('#customBatteryEnergyIcon').attr('src', resourceBaseUrl + '/web/platform/FORTRESS/img/monitor/plant/icon_battery_discharging.png');
			}

			if(firstTimeShowMaxCurrHolder) {
				firstTimeShowMaxCurrHolder = false;
//				$('#monitorHolder .batteryImg').click();
				checkBatteryFlowHolderShow();
			}

			if(platform == 'TECLOMAN') {
				if(response.soc >= 95) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_10.png');
				} else if(response.soc >= 85) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_9.png');
				} else if(response.soc >= 75) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_8.png');
				} else if(response.soc >= 65) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_7.png');
				} else if(response.soc >= 55) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_6.png');
				} else if(response.soc >= 45) {								//Battery SOC
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_5.png');
				} else if(response.soc >= 35) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_4.png');
				} else if(response.soc >= 25) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_3.png');
				} else if(response.soc >= 15) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_2.png');
				} else if(response.soc >= 5) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_1.png');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_0.png');
				}
			} else if(hasCustomPlatformImg) {
				var customPlatromBattColor = response.batteryColor;
				if(isEG4Platform && currentBatteryType != 'LEAD_ACID') {
					if(response.soc <= 10) {
						customPlatromBattColor = 'red';
					}
				}

				if(response.soc >= 90) {								//Battery SOC
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_5_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 70) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_4_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 50) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_3_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 30) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_2_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 10) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_1_' + customPlatromBattColor + '.png');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_0_' + customPlatromBattColor + '.png');
				}
			} else {
				if(response.soc >= 90) {								//Battery SOC
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_5_' + response.batteryColor + '.png');
				} else if(response.soc >= 70) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_4_' + response.batteryColor + '.png');
				} else if(response.soc >= 50) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_3_' + response.batteryColor + '.png');
				} else if(response.soc >= 30) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_2_' + response.batteryColor + '.png');
				} else if(response.soc >= 10) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_1_' + response.batteryColor + '.png');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_0_' + response.batteryColor + '.png');
				}
			}

			if(response.masterIsAcCharger) {				//AC Charger
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.pvArrowImg').hide();

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvPowerText').text(response.ppv);
				if(response.ppv < 30) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.acPvArrowImg').hide();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.acPvArrowImg').show();
				}
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .pvParallelTextHolder').hide();
			} else {
				if((isType6Series || isSnaSeries()) && response._12KAcCoupleInverterFlow) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvArrowImg').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvArrowImg').hide();
				}

				//Clear Trip 12K AC Couple Data Panel...
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowerrText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowersText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowertText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvTextHolder').hide();

				//Clear 12K AC Couple Data Panel...
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvPowerText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvTextHolder').hide();

				if(currentDeviceType == 0 && currentPhase == 3 && response._12KAcCoupleInverterData) {				//Trip 12K
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvImg').show();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowerrText').text(response.acCouplePower);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowersText').text(response.acCouplePowers);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowertText').text(response.acCouplePowert);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvTextHolder').show();
					$('.pvParallelTextHolder').css('left', '30px');
				} else if((isType6Series || isSnaSeries()) && response._12KAcCoupleInverterData) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvImg').show();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvPowerText').text(response.acCouplePower);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvTextHolder').show();
					$('.pvParallelTextHolder').css('left', '30px');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvImg').hide();
					$('.pvParallelTextHolder').css('left', (screen.width < 800 ? (395 - 86) : 395) + 'px');
				}

				var ppv = response.ppv;
				if(ppv > is12TripAndPowerGH50_positive) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.pvArrowImg').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.pvArrowImg').hide();
				}
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .pvParallelPowerText').text(response.ppv);
			}

			$('.phase1ParallelGridTextHolder').hide();
			$('.phase3ParallelGridTextHolder').hide();
			$('.consumptionPhase3TextHolder').hide();
			$('.epsPhase3TextHolder').hide();
			var gridPower = 0;

			var usingGenerator = false;
			var $gridImage = $('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridImg');
			var gridImageDirPath = $gridImage.attr('imgDirPath');
			if(response._12KUsingGenerator) {
				$gridImage.attr('src', gridImageDirPath + 'generator.png');

				if(isType6Series) {
					usingGenerator = true;
				}
			} else {
				$gridImage.attr('src', gridImageDirPath + 'icon_grid.png');
			}

			var showGenDryContact = false;
			var showGenQuickStartBtn = false;
			if(isType6Series || isSnaSeries()) {
				if(response.genDryContact) {
					showGenDryContact = true;
					$('.genDryContactText').text(response.genDryContact);
					$('.genDryContactTextHolder').show();

					if((currentDeviceType == 6 && (currentStandard == 'EAAB' || currentStandard == 'eAAB' || currentStandard == 'FAAB' || currentStandard == 'fAAB') && currentSlaveVersion >= 0x18 && currentFwVersion >= 0x18)
						|| (currentDeviceType == 0 && currentPhase == 3) || currentDeviceType == 3 && (currentStandard == 'cbaa' && currentSlaveVersion >= 0x24 || currentStandard == 'cBaa' && currentSlaveVersion >= 0x8D || currentStandard == 'cBAA' && currentSlaveVersion >= 0x8D || currentDtc == 1 && currentStandard == 'ccaa' && currentSlaveVersion >= 0x12) || currentDeviceType == 11 && (currentDtc == 1 && currentStandard == 'ceaa' && currentSlaveVersion >= 0x06 || currentStandard == 'cfaa' && currentSlaveVersion >= 0x06)) {
						showGenQuickStartBtn = true;
					}
				}
			}
			if(!showGenDryContact) {
				$('.genDryContactTextHolder').hide();
				$('.genDryContactText').text('--');
			}
			if(showGenQuickStartBtn) {
				if(response.genDryContact == 'OFF') {
					$('.genQuickStartBtnHolder p').hide();
					$('#genQuickStopButton').hide();
					$('#genQuickStartButton').show();
				} else {
					$('#genQuickStartButton').hide();

					if(response.remainTimeBeforeGenStop && response.remainTimeBeforeGenStop > 0) {
						currentRemainTimeBeforeGenStop = response.remainTimeBeforeGenStop;
						$('.genQuickStartBtnHolder p span').text(handleSecondText(currentRemainTimeBeforeGenStop));
						clearInterval(genStopIntervalBox);
						genStopIntervalBox = setTimeout(countDownRemainTimeBeforeGenStopEverySecond, 1000);

						$('.genQuickStartBtnHolder p').show();
						$('#genQuickStopButton').show();
					} else {
						$('.genQuickStartBtnHolder p').hide();
						if(currentDeviceType == 3 || currentDeviceType == 11) {
							$('#genQuickStopButton').show();
						} else {
							$('#genQuickStopButton').hide();
						}
					}
				}

				$('.genQuickStartBtnHolder').show();
			} else {
				$('.genQuickStartBtnHolder').hide();
			}

			if(!isSnaSeries() && !response.masterType) {
				$('#noPrimaryH4').fadeIn();
			} else {
				$('#noPrimaryH4').fadeOut();
			}

			if(response.masterType == 1) {						//Phase 1 System
				$('.phase1ParallelGridTextHolder').show();

				if(response._12KUsingGenerator) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase1ParallelGridTextHolder .phase1VacText').text(response.genVolt / 10);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase1ParallelGridTextHolder .phase1FacText').text(response.genFreq / 10);
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase1ParallelGridTextHolder .phase1VacText').text(response.vac / 10);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase1ParallelGridTextHolder .phase1FacText').text(response.fac );
				}

				if(isType6Series && response._12KUsingGenerator) {
					gridPower = response.genPower;
				} else {
					gridPower = response.gridPower;
				}
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase1ParallelGridTextHolder .phase1PacText').text(Math.abs(gridPower));

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPhase3TextHolder').hide();
				if(response.isOffGrid) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').hide();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.peps);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').show();
					if(response.peps > is12TripAndPowerGH50_positive) {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').show();
					} else {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();
					}

					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').hide();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').hide();
					if(currentDeviceType == 0 && currentPhase == 3) {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.peps);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').show();
					}
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').show();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();

					var consumptionPower = response.pLoad;
					consumptionPower = (consumptionPower < 0 ? 0 : consumptionPower);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerText').text(consumptionPower);
					if(consumptionPower > is12TripAndPowerGH50_positive) {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').show();
					} else {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').hide();
					}
				}

				if(response.haspEpsLNValue) {
					$('.epsLnTextHolder .epsL1nText').text(response.pEpsL1N);
					$('.epsLnTextHolder .epsL2nText').text(response.pEpsL2N);
					$('.epsLnTextHolder').show();
				} else {
					$('.epsLnTextHolder .epsL1nText').text('');
					$('.epsLnTextHolder .epsL2nText').text('');
					$('.epsLnTextHolder').hide();
				}
			} else if(response.masterType == 3 || response.masterType == 4) {				//Phase 3 System
				$('.phase3ParallelGridTextHolder').show();
				$('.consumptionPhase3TextHolder').show();
				$('.epsPhase3TextHolder').show();

				if(response.masterType == 4) {
					if(response.vact > response.vacs) {
						$('.phase3ParallelGridTextHolder .phase3VacsTextHolder').hide();
					} else {
						$('.phase3ParallelGridTextHolder .phase3VactTextHolder').hide();
					}
					$('.consumptionPowerrTextHolder').hide();
				} else {
					$('.phase3ParallelGridTextHolder .phase3VacsTextHolder').show();
					$('.phase3ParallelGridTextHolder .phase3VactTextHolder').show();
					$('.consumptionPowerrTextHolder').show();
				}

				if(response._12KUsingGenerator) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3VacrText').text(response.genVoltr );
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3VacsText').text(response.genVolts );
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3VactText').text(response.genVoltt );
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3FacrText').text(response.genFreqr / 100);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3FacsText').text(response.genFreqs / 100);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3FactText').text(response.genFreqt / 100);
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3VacrText').text(response.vacr );
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3VacsText').text(response.vacs );
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3VactText').text(response.vact );
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3FacrText').text(response.facr / 100);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3FacsText').text(response.facs / 100);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3FactText').text(response.fact / 100);
				}

				if(isType6Series && response._12KUsingGenerator) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3PacrText').text(Math.abs(response.genPowerr));
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3PacsText').text(Math.abs(response.genPowers));
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3PactText').text(Math.abs(response.genPowert));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacrDirText').text(getGridPowerText(response.genPowerr));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacsDirText').text(getGridPowerText(response.genPowers));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PactDirText').text(getGridPowerText(response.genPowert));
					gridPower = response.genPowerr + response.genPowers + response.genPowert;
					$('.phase3PacDataTotal').text(Math.abs(gridPower))
					if(gridPower != 0) {
						$('.phase3PacTotalDataHolder').text(getGridPowerText(gridPower).replace(/\(/,'').replace(/\)/,'')+": ")
					}
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3PacrText').text(Math.abs(response.gridPowerr));
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3PacsText').text(Math.abs(response.gridPowers));
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .phase3ParallelGridTextHolder .phase3PactText').text(Math.abs(response.gridPowert));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacrDirText').text(getGridPowerText(-response.gridPowerr));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacsDirText').text(getGridPowerText(-response.gridPowers));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PactDirText').text(getGridPowerText(-response.gridPowert));
					gridPower = response.gridPowerr + response.gridPowers + response.gridPowert;
					$('.phase3PacDataTotal').text(Math.abs(gridPower))
					if(gridPower != 0) {
						$('.phase3PacTotalDataHolder').text(getGridPowerText(-gridPower).replace(/\(/,'').replace(/\)/,'')+": ")
					}
				}

				if(response._us_type6_phase3) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .gridPowerText').text(Math.abs(gridPower));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacDataHolder').hide();
					$('.phase3ParallelGridTextHolder').is(':hidden') && $('.flowChartHolder .gridTextHolder').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .gridPowerText').text('');
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacDataHolder').show();
					$('.flowChartHolder .gridTextHolder').hide();
				}

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPhase3TextHolder').show();
				if(response.isOffGrid) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').hide();

					if(response._us_type6_phase3) {
						$('.consumptionPhase3TextHolder').hide();
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.pepsr + response.pepss + response.pepst);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPhase3TextHolder').hide();
					} else {
						$('.consumptionPhase3TextHolder').show();

						if(response.haspEpsLNValue) {
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.pepsr + ', ' + (response.masterType == 4 ? '' : (', ' + response.pepss)) + ', ' + response.pepst);
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPhase3TextHolder').hide();
						} else {
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerrText').text(response.pepsr);
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowersText').text(response.pepss);
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.pepst);
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPhase3TextHolder').show();
						}
					}

					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').show();

					if(response.pepsr > is12TripAndPowerGH50_positive || response.pepss > is12TripAndPowerGH50_positive || (response.masterType == 3 && response.pepst > is12TripAndPowerGH50_positive)) {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').show();
					} else {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();
					}

					if(response.masterType == 4 && !response.haspEpsLNValue && !(currentDeviceType == 0 && currentPhase == 3)) {
						$('.epsPowertLine').hide();
					} else {
						$('.epsPowertLine').show();
					}

					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerrText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowersText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').hide();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerrText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowersText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text('--');
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').hide();
					if(currentDeviceType == 0 && currentPhase == 3) {
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerrText').text(response.peps);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowersText').text(response.pepss);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.pepst);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').show();
					}
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').show();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();

					if(response._us_type6_phase3) {
						var consumptionPower = response.pLoadr + response.pLoads + response.pLoadt;
						consumptionPower = (consumptionPower < 0 ? 0 : consumptionPower);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerText').text(consumptionPower);

						if(consumptionPower > is12TripAndPowerGH50_positive) {
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').show();
						} else {
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').hide();
						}

						$('.consumptionPowerrTextHolder').show();
						$('.consumptionPhase3TextHolder').hide();
					} else {
						var consumptionPowerr = response.pLoadr;
						consumptionPowerr = (consumptionPowerr < 0 ? 0 : consumptionPowerr);
						var consumptionPowers = response.pLoads;
						consumptionPowers = (consumptionPowers < 0 ? 0 : consumptionPowers);
						var consumptionPowert = response.pLoadt;
						consumptionPowert = (consumptionPowert < 0 ? 0 : consumptionPowert);

						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerrText').text(consumptionPowerr);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowersText').text(consumptionPowers);
						$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerText').text(consumptionPowert);

						if((consumptionPowerr + consumptionPowers + consumptionPowert) > is12TripAndPowerGH50_positive) {
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').show();
						} else {
							$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').hide();
						}

						$('.consumptionPhase3TextHolder').show();
					}
				}

				if(response.haspEpsLNValue && !response._us_type6_phase3) {
					$('.epsLnTextHolder .epsL1nText').text(response.pEpsL1Nr + ', ' + response.pEpsL1Ns + ', ' + response.pEpsL1Nt);
					$('.epsLnTextHolder .epsL2nText').text(response.pEpsL2Nr + ', ' + response.pEpsL2Ns + ', ' + response.pEpsL2Nt);
					$('.epsLnTextHolder').show();
				} else {
					$('.epsLnTextHolder .epsL1nText').text('');
					$('.epsLnTextHolder .epsL2nText').text('');
					$('.epsLnTextHolder').hide();
				}
			}

			if(gridPower > is12TripAndPowerGH50_positive) {
				var gifFileName = (usingGenerator ? '_arrow_left.gif' : '_arrow_right.gif');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/' + gifFileName).show();
			} else if(gridPower < is12TripAndPowerGH50_negative) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_left.gif').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridArrayImg').hide();
			}

			if(response.directions.inverterArrowDir > 0) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.inverterArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_right.gif').show();
			} else if(response.directions.inverterArrowDir == 'toInverter') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.inverterArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_left.gif').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.inverterArrayImg').hide();
			}
			
			if(response.hasUnclosedQuickChargeTask) {
				$('#startQuickChargeButton').hide();
				if(response.lowVoltProtect) {
					$('#infoListLabel').show();
					$('#stopQuickChargeButton').hide();
				} else {
					$('#infoListLabel').hide();
					$('#stopQuickChargeButton').show();
				}
			} else {
				$('#stopQuickChargeButton').hide();
				$('#startQuickChargeButton').show();
			}
			$('.ctrlBtnHolder').fadeIn();
			
			if(response.hasUnclosedQuickDischargeTask) {
				$('#startQuickDischargeButton').hide();
				$('#stopQuickDischargeButton').show();
			} else {
				$('#stopQuickDischargeButton').hide();
				$('#startQuickDischargeButton').show();
			}
//			if(currentDeviceType == 0 && currentPhase != 3) {
//				$('.quickDisChgCtrlBtnHolder').fadeIn();
//			} else {
				$('.quickDisChgCtrlBtnHolder').fadeOut();
//			}
			
			if(currentDeviceType == 13) {
				$('.getaNotShow').hide()
			}
		}
	}, 'json');
}

function refreshInverterInformationSingle(snForRefreshInfo) {
	if(!snForRefreshInfo || snForRefreshInfo.length != 10) {
		clearInverterPower(snForRefreshInfo);
		return;
	}

	$.post(baseUrl + '/api/inverter/getInverterRuntime', { serialNum: snForRefreshInfo }, function (response) {
		if(showParallelData) {
			return;
		}
		$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .statusImg').attr('src', resourceBaseUrl + '/web/img/monitor/inverter/status/' + response.statusText + ".png");
		if(!response.success) {
			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .statusImg').attr('src', resourceBaseUrl + '/web/img/monitor/inverter/status/offline.png');
		}
		if(response.statusText == 'error' || response.statusText == 'warning') {
			$('.doubtIcon').show()
		} else {
			$('.doubtIcon').hide()
		}
		if(response.lost || (!response.hasRuntimeData)) {
			clearInverterPower(snForRefreshInfo);
		} else {
			showPowerDetail(response)
			$('#localTimeLabel').text(response.deviceTime);

			if(response.hasEpsOverloadRecoveryTime) {
				queryEpsOverloadRecoveryTime(snForRefreshInfo);
			}

			var isType6Series = checkType6Series();

			if(response.pCharge > is12TripAndPowerGH50_positive) {								//Battery power
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerLabel').text(chargePowerLabel);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerText').text(response.pCharge);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.batteryArrowImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_left.gif').show();
			} else if(response.pDisCharge > is12TripAndPowerGH50_positive) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerLabel').text(dischargePowerLabel);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerText').text(response.pDisCharge);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.batteryArrowImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_right.gif').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerLabel').text(batteryPowerLabel);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryPowerText').text('0');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.batteryArrowImg').hide();
			}

			if(isEG4Platform && currentBatteryType == 'LEAD_ACID') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .socHolder').hide().find('.monitorDataText').text('--');
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .socHolder').show().find('.monitorDataText').text(response.soc);
			}
			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vbatText').text(response.vBat );

			var hasCustomBatteryEnergyIcon = false;
			if(response.batteryType == 'LITHIUM') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxChgCurrText').text(response.maxChgCurrValue);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxDischgCurrText').text(response.maxDischgCurrValue);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').show().text(response.bmsCharge ? 'Allowed' : 'Forbidden');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').show().text(response.bmsDischarge ? 'Allowed' : 'Forbidden');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsForceChargeText').show().text(response.bmsForceCharge ? 'ON' : 'OFF');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryCapacityText').text('--');

				response.bmsCharge ? $('.allowedHideBmsChargeTitle').hide() : $('.allowedHideBmsChargeTitle').show();
				response.bmsDischarge ? $('.allowedHideBmsDischargeTitle').hide() : $('.allowedHideBmsDischargeTitle').show();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').addClass("pointer");
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').addClass("pointer");

				if(response.batParallelNum && response.batParallelNum != '0') {
					$('#monitorHolder .batParallelNumHolder').show().find('.monitorDataText').text(response.batParallelNum);
				} else {
					$('#monitorHolder .batParallelNumHolder').hide().find('.monitorDataText').text('--');
				}

				if(response.batCapacity && response.batCapacity != '0') {
					$('#monitorHolder .batCapacityHolder').show().find('.monitorDataText').text(response.batCapacity + ' Ah');
				} else {
					$('#monitorHolder .batCapacityHolder').hide().find('.monitorDataText').text('--');
				}

				$('#monitorHolder .batteryImg').data('batteryType', response.batteryType);

				if(isFortressPlatform) {
					if(response.maxChgCurrValue % 60 == 0) {
						hasCustomBatteryEnergyIcon = true;
						$('#customBatteryEnergyIcon').attr('src', resourceBaseUrl + '/web/platform/FORTRESS/img/monitor/plant/eflex_96.png');
					} else if(response.maxChgCurrValue % 250 == 0) {
						hasCustomBatteryEnergyIcon = true;
						$('#customBatteryEnergyIcon').attr('src', resourceBaseUrl + '/web/platform/FORTRESS/img/monitor/plant/evault_96.png');
					}
				}
			} else if(response.batteryType == 'LEAD_ACID' && response.batteryCapacity) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryCapacityText').text(response.batteryCapacity);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxChgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxDischgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsForceChargeText').hide().text('--');
				$('#monitorHolder .batteryImg').data('batteryType', response.batteryType);
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxChgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .maxDischgCurrText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsChargeText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsDischargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .bmsForceChargeText').hide().text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryCapacityText').hide().text('--');
				$('#monitorHolder .batteryImg').removeData('batteryType');
			}

			if(isFortressPlatform && !hasCustomBatteryEnergyIcon) {
				$('#customBatteryEnergyIcon').attr('src', resourceBaseUrl + '/web/platform/FORTRESS/img/monitor/plant/icon_battery_discharging.png');
			}

			if(firstTimeShowMaxCurrHolder) {
				firstTimeShowMaxCurrHolder = false;
//				$('#monitorHolder .batteryImg').click();
				checkBatteryFlowHolderShow();
			}

			if(platform == 'TECLOMAN') {
				if(response.soc >= 95) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_10.png');
				} else if(response.soc >= 85) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_9.png');
				} else if(response.soc >= 75) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_8.png');
				} else if(response.soc >= 65) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_7.png');
				} else if(response.soc >= 55) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_6.png');
				} else if(response.soc >= 45) {								//Battery SOC
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_5.png');
				} else if(response.soc >= 35) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_4.png');
				} else if(response.soc >= 25) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_3.png');
				} else if(response.soc >= 15) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_2.png');
				} else if(response.soc >= 5) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_1.png');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/TECLOMAN/img/monitor/plant/icon_battery_0.png');
				}
			} else if(hasCustomPlatformImg) {
				var customPlatromBattColor = response.batteryColor;
				if(isEG4Platform && currentBatteryType != 'LEAD_ACID') {
					if(response.soc <= 10) {
						customPlatromBattColor = 'red';
					}
				}

				if(response.soc >= 90) {								//Battery SOC
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_5_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 70) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_4_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 50) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_3_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 30) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_2_' + customPlatromBattColor + '.png');
				} else if(response.soc >= 10) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_1_' + customPlatromBattColor + '.png');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/platform/' + customPlatform + '/img/monitor/plant/icon_battery_0_' + customPlatromBattColor + '.png');
				}
			} else {
				if(response.soc >= 90) {								//Battery SOC
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_5_' + response.batteryColor + '.png');
				} else if(response.soc >= 70) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_4_' + response.batteryColor + '.png');
				} else if(response.soc >= 50) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_3_' + response.batteryColor + '.png');
				} else if(response.soc >= 30) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_2_' + response.batteryColor + '.png');
				} else if(response.soc >= 10) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_1_' + response.batteryColor + '.png');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .batteryImg').attr('src', resourceBaseUrl + '/web/img/monitor/plant/icon_battery_0_' + response.batteryColor + '.png');
				}
			}

			if(currentDeviceType == 2) {				//AC Charger
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.pvArrowImg').hide();

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvPowerText').text(response.ppv1 *1000);
				if(response.ppv1 < 30) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.acPvArrowImg').hide();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.acPvArrowImg').show();
				}
			} else {
				if((isType6Series || isSnaSeries()) && response._12KAcCoupleInverterFlow) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvArrowImg').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvArrowImg').hide();
				}

				//Clear Trip 12K AC Couple Data Panel...
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowerrText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowersText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowertText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvTextHolder').hide();

				//Clear 12K AC Couple Data Panel...
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvPowerText').text('');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvTextHolder').hide();

				if(currentDeviceType == 0 && currentPhase == 3 && response._12KAcCoupleInverterData) {				//Trip 12K
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvImg').show();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowerrText').text(response.acCouplePower);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowersText').text(response.acCouplePowers);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvPowertText').text(response.acCouplePowert);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .trip12kAcPvTextHolder').show();
					$('.pvTextHolder').css('left', '30px');
				} else if((isType6Series || isSnaSeries()) && response._12KAcCoupleInverterData) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvImg').show();
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvPowerText').text(response.acCouplePower);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] ._12kAcPvTextHolder').show();
					$('.pvTextHolder').css('left', '30px');
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .acPvImg').hide();
					$('.pvTextHolder').css('left', (screen.width < 800 ? (395 - 86) : 395) + 'px');
				}

				var ppv = response.ppv;
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .pvPowerText').text(ppv);
				if(ppv > is12TripAndPowerGH50_positive) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.pvArrowImg').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.pvArrowImg').hide();
				}
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .pv1PowerText').text((response.ppv1 *1000).toFixed(1));
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .pv2PowerText').text(response.ppv2 *1000);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .pv3PowerText').text(response.ppv3 *1000);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vpv1Text').text(response.vpv1  );
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vpv2Text').text(response.vpv2  );
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vpv3Text').text(response.vpv3  );
			}

			var usingGenerator = false;
			var gridPower = response.pToGrid - response.pToUser;
			var $gridImage = $('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridImg');
			var gridImageDirPath = $gridImage.attr('imgDirPath');

			if(isSnaSeries() && response._12KUsingGenerator) {
				$gridImage.attr('src', gridImageDirPath + 'generator.png');

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vacText').text(response.genVolt / 10);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .facText').text(response.genFreq / 100);
			} else if((currentDeviceType == 6 || currentDeviceType == 7 || currentDeviceType == 8 || currentDeviceType == 10) && response._12KUsingGenerator) {
				usingGenerator = true;

				$gridImage.attr('src', gridImageDirPath + 'generator.png');

				gridPower = response.genPower;

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vacText').text(response.genVolt / 10);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .facText').text(response.genFreq / 100);
			} else if(currentPhase == 3 && currentDeviceType == 0) {
				$('.phase3ParallelGridTextHolder').show();
				$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacDataHolder').show();
				$('.flowChartHolder .gridTextHolder').hide();
				$('.flowChartHolder .vacTextHolder').hide();
				$('.flowChartHolder .facTextHolder').hide();

				if(response._12KUsingGenerator) {
					usingGenerator = true;

					$gridImage.attr('src', gridImageDirPath + 'generator.png');

					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3VacrText').text(response.genVolt );
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3VacsText').text(response.genVolts / 10);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3VactText').text(response.genVoltt / 10);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3FacrText').text(response.genFreq / 100);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3FacsText').text(response.genFreq / 100);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3FactText').text(response.genFreq / 100);

					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacrText').text(response.genPower);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacsText').text(response.genPowers);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PactText').text(response.genPowert);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacrDirText').text(getGridPowerText(response.genPower));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacsDirText').text(getGridPowerText(response.genPowers));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PactDirText').text(getGridPowerText(response.genPowert));
					gridPower = response.genPower + response.genPowers + response.genPowert;
					$('.phase3PacDataTotal').text(Math.abs(gridPower))
					if(gridPower != 0) {
						$('.phase3PacTotalDataHolder').text(getGridPowerText(gridPower).replace(/\(/,'').replace(/\)/,'')+": ")
					}
				} else {
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3VacrText').text(response.vacr );
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3VacsText').text(response.vacs / 10);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3VactText').text(response.vact / 10);
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3FacrText').text(response.fac );
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3FacsText').text(response.fac );
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3FactText').text(response.fac );

					var gridPowerr = response.pToGrid - response.pToUser;
					var gridPowers = response.pToGrids - response.pToUsers;
					var gridPowert = response.pToGridt - response.pToUsert;

					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacrText').text(Math.abs(-gridPowerr));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacsText').text(Math.abs(-gridPowers));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PactText').text(Math.abs(-gridPowert));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacrDirText').text(getGridPowerText(-gridPowerr));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PacsDirText').text(getGridPowerText(-gridPowers));
					$('.flowChartHolder .phase3ParallelGridTextHolder .phase3PactDirText').text(getGridPowerText(-gridPowert));
					gridPower = gridPowerr + gridPowers + gridPowert;
					$('.phase3PacDataTotal').text(Math.abs(gridPower))
					if(gridPower != 0) {
						$('.phase3PacTotalDataHolder').text(getGridPowerText(-gridPower).replace(/\(/,'').replace(/\)/,'')+": ")
					}
				}
			} else {
				$gridImage.attr('src', gridImageDirPath + 'icon_grid.png');

				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .vacText').text(response.vacr );
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .facText').text(response.fac );
			}

			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .gridPowerText').text(Math.abs(gridPower));
			if(gridPower > is12TripAndPowerGH50_positive) {
//				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .importPowerLabel').hide();
//				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .exportPowerLabel').show();

				var gifFileName = (usingGenerator ? '_arrow_left.gif' : '_arrow_right.gif');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/' + gifFileName).show();
				if(japanCustomerStyle) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .gridTextHolder').show();
				}
			} else if(gridPower < is12TripAndPowerGH50_negative) {
//				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .exportPowerLabel').hide();
//				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .importPowerLabel').show();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_left.gif').show();
				if(japanCustomerStyle) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .gridTextHolder').show();
				}
			} else {
//				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .importPowerLabel').hide();
//				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .exportPowerLabel').hide();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.gridArrayImg').hide();
				if(japanCustomerStyle) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .gridTextHolder').hide();
				}
			}

			if(response.directions.inverterArrowDir > 0) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.inverterArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_right.gif').show();
			} else if(response.directions.inverterArrowDir == 'toInverter') {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.inverterArrayImg').attr('src', resourceBaseUrl + '/' + platformUrl + '/img/monitor/plant/arrow/_arrow_left.gif').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] img.inverterArrayImg').hide();
			}

			var showGenDryContact = false;
			var showGenQuickStartBtn = false;
			if(isType6Series || isSnaSeries()) {
				if(response.genDryContact) {
					showGenDryContact = true;
					$('.genDryContactText').text(response.genDryContact);
					$('.genDryContactTextHolder').show();

					if((currentDeviceType == 6 && (currentStandard == 'EAAB' || currentStandard == 'eAAB' || currentStandard == 'FAAB' || currentStandard == 'fAAB') && currentSlaveVersion >= 0x18 && currentFwVersion >= 0x18)
						|| (currentDeviceType == 0 && currentPhase == 3) || currentDeviceType == 3 && (currentStandard == 'cbaa' && currentSlaveVersion >= 0x24 || currentStandard == 'cBaa' && currentSlaveVersion >= 0x8D || currentStandard == 'cBAA' && currentSlaveVersion >= 0x8D || currentDtc == 1 && currentStandard == 'ccaa' && currentSlaveVersion >= 0x12) || currentDeviceType == 11 && (currentDtc == 1 && currentStandard == 'ceaa' && currentSlaveVersion >= 0x06 || currentStandard == 'cfaa' && currentSlaveVersion >= 0x06)) {
						showGenQuickStartBtn = true;
					}
				}
			}
			if(!showGenDryContact) {
				$('.genDryContactTextHolder').hide();
				$('.genDryContactText').text('--');
			}
			if(showGenQuickStartBtn) {
				if(response.genDryContact == 'OFF') {
					$('.genQuickStartBtnHolder p').hide();
					$('#genQuickStopButton').hide();
					$('#genQuickStartButton').show();
				} else {
					$('#genQuickStartButton').hide();

					if(response.remainTimeBeforeGenStop && response.remainTimeBeforeGenStop > 0) {
						currentRemainTimeBeforeGenStop = response.remainTimeBeforeGenStop;
						$('.genQuickStartBtnHolder p span').text(handleSecondText(currentRemainTimeBeforeGenStop));
						clearInterval(genStopIntervalBox);
						genStopIntervalBox = setTimeout(countDownRemainTimeBeforeGenStopEverySecond, 1000);

						$('.genQuickStartBtnHolder p').show();
						$('#genQuickStopButton').show();
					} else {
						$('.genQuickStartBtnHolder p').hide();
						if(currentDeviceType == 3 || currentDeviceType == 11) {
							$('#genQuickStopButton').show();
						} else {
							$('#genQuickStopButton').hide();
						}
					}
				}

				$('.genQuickStartBtnHolder').show();
			} else {
				$('.genQuickStartBtnHolder').hide();
			}
			if(currentPhase == 3 && currentDeviceType == 0) {
				$('.consumptionPhase3SingleTextHolder').show()
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerRText').text((response.consumptionPowerr || response.consumptionPowerr == '0')? response.consumptionPowerr:'--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerSText').text((response.consumptionPowers || response.consumptionPowers == '0')? response.consumptionPowers:'--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerTText').text((response.consumptionPowert || response.consumptionPowert == '0')? response.consumptionPowert:'--');
			} else {
				$('.consumptionPhase3SingleTextHolder').hide()
			}
			var consumptionPower = response.consumptionPower;
			$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .consumptionPowerText').show().text(consumptionPower);
			if(consumptionPower > is12TripAndPowerGH50_positive) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').show();
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .loadArrowImg').hide();
			}

			if(response.haspEpsLNValue) {
				$('.epsLnTextHolder .epsL1nText').text(response.pEpsL1N);
				$('.epsLnTextHolder .epsL2nText').text(response.pEpsL2N);
				$('.epsLnTextHolder').show();
			} else {
				$('.epsLnTextHolder .epsL1nText').text('');
				$('.epsLnTextHolder .epsL2nText').text('');
				$('.epsLnTextHolder').hide();
			}

			if(currentPhase == 3 && currentDeviceType == 0) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').hide();
				if(response.haspEpsLNValue) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.peps + ', ' + response.pepss + ', ' + response.pepst);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPhase3TextHolder').hide();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerrText').text(response.peps);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowersText').text(response.pepss);
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.pepst);
					$('.epsPhase3TextHolder').show();
				}
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').show();

				if(response.peps > is12TripAndPowerGH50_positive || response.pepss > is12TripAndPowerGH50_positive || response.pepst > is12TripAndPowerGH50_positive) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();
				}
			} else if(response.status >= 0x40) {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').hide();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text(response.peps);
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').show();

				if(response.peps > is12TripAndPowerGH50_positive) {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').show();
				} else {
					$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();
				}
			} else {
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerText').text('--');
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsPowerLine').hide();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .standByLine').show();
				$('.flowChartHolder[chartTarget=' + snForRefreshInfo + '] .epsArrowImg').hide();
			}

			if(response.hasUnclosedQuickChargeTask) {
				$('#startQuickChargeButton').hide();
				if(response.lowVoltProtect) {
					$('#infoListLabel').show();
					$('#stopQuickChargeButton').hide();
				} else {
					$('#infoListLabel').hide();
					$('#stopQuickChargeButton').show();
				}
			} else {
				$('#stopQuickChargeButton').hide();
				$('#startQuickChargeButton').show();
			}
			$('.ctrlBtnHolder').fadeIn();
			
			if(response.hasUnclosedQuickDischargeTask) {
				$('#startQuickDischargeButton').hide();
				$('#stopQuickDischargeButton').show();
			} else {
				$('#stopQuickDischargeButton').hide();
				$('#startQuickDischargeButton').show();
			}
			if(currentDeviceType == 0 && currentPhase != 3) {
				$('.quickDisChgCtrlBtnHolder').fadeIn();
			} else {
				$('.quickDisChgCtrlBtnHolder').fadeOut();
			}

//			if((currentClusterId == 4 || isSecondCluster) && currentDeviceType == 6) {
//				if(response.batteryBackupMode) {
//					$('#startBatteryBackupButton').hide();
//					$('#stopBatteryBackupButton').show();
//				} else {
//					$('#stopBatteryBackupButton').hide();
//					$('#startBatteryBackupButton').show();
//				}
//				$('.batteryBackupModeBtnHolder').fadeIn();
//			} else {
//				$('.batteryBackupModeBtnHolder').fadeOut();
//			}

			if(currentDeviceType == 13) {
				$('.getaNotShow').hide()
			}
		}
	}, 'json');
}

function getGridPowerText(gridPower) {
	if(gridPower > 0) {
		return ' (Import)';
	} else if(gridPower < 0) {
		return ' (Export)';
	}
	return '';
}

$('.phase3ParallelGridTextHolder').click(function() {
	if($('.phase3PacDataDetail').is(':visible')) {
		$('.phase3PacDataDetail').hide()
	} else {
		$('.phase3PacDataDetail').show()
	}
})
/*	Remove map...
var map = false;
var latitude = false, longitude = false;

function loadPlantInfo() {
	$.post(baseUrl + '/api/plant/getPlantInfo', { plantId: selectPlantId }, function(response) {
		$('#stationSolarPvPowerText').text(response.nominalPowerText);
		$('#plantCreateDateText').text(response.createDate);
		$('.currencyUnitText').text(response.currencyUnitSymbol);

		latitude = response.latitude
		longitude = response.longitude

		if(map) {
			if(latitude && longitude) {
				var center = new Microsoft.Maps.Location(latitude, longitude)
				map.setView({
					center: center
				})
				map.entities.clear()
				map.entities.push(new Microsoft.Maps.Pushpin(center));
			} else {
				map.entities.clear()
			}
		}
	}, 'json');
}

function GetMap() {
	var mapConfig = {
	        credentials: 'Ag8y6RlDnTaW2GfIzGRT3vj6QsnO5XCZRA1zTR4_cqJFIbOSUwCCqLWoXGkCU3dA',
	        showDashboard:false,    //Control panel
	        showMapTypeSelector:false,
	        animate: true,
	        useInertia: false,
	        enableSearchLogo: false,
	        enableClickableLogo: false,
	        showCopyright: false,
	        zoom: 10
	    };

	if(latitude && longitude) {
		mapConfig.center = new Microsoft.Maps.Location(latitude, longitude)
	}

	map = new Microsoft.Maps.Map('#mapContainer', mapConfig);

	if(mapConfig.center) {
		map.entities.push(new Microsoft.Maps.Pushpin(mapConfig.center));
	}
}	*/

//Input&Output power line chart
function initPowerLintChart() {
	$('#dayLineChartDate').datepicker({
		autoclose: true,
//		endDate: new Date(),
		format: 'yyyy-mm-dd',
		language: language4Datetimepicker,
		todayHighlight: true,
		todayBtn: true
	});
	$('#dayLineChartDate').datepicker('update', moment().format('YYYY-MM'));

	initPowerChart();
}

changeLineChartDate = function(diff) {
	$('#dayLineChartDate').val(moment($('#dayLineChartDate').val()).add('days', diff).format('YYYY-MM-DD')).change();
};

//javascript for tab chart
var tabPlantChart = new Object();

tabPlantChart.changeMonthColumnChartDate = function(diff) {
	$('#plantMonthColumnChartDate').val(moment($('#plantMonthColumnChartDate').val()).add('months', diff).format('YYYY-MM')).change();
};

tabPlantChart.changeYearColumnChartDate = function(diff) {
	$('#plantYearColumnChartDate').val(moment($('#plantYearColumnChartDate').val()).add('years', diff).format('YYYY')).change();
};

tabPlantChart.initialize = function() {
	$('#plantMonthColumnChartDate').datepicker({
		autoclose: true,
//		endDate: new Date(),
		format: 'yyyy-mm',
		language: language4Datetimepicker,
		todayHighlight: true,
		todayBtn: true
	});
	$('#plantMonthColumnChartDate').datepicker('update', moment().format('YYYY-MM'));

	$('#plantYearColumnChartDate').datepicker({
		autoclose: true,
//		endDate: new Date(),
		format: 'yyyy',
		language: language4Datetimepicker,
		todayHighlight: true,
		todayBtn: true
	});
	$('#plantYearColumnChartDate').datepicker('update', moment().format('YYYY'));

	$('#plantChartRadioHolder .btn').click(function() {
		$('#chartContainer .chartHolder').hide();
		if($('#' + $(this).attr('chartHolder')).is('[notshow]')) {
			eval($('#' + $(this).attr('chartHolder')).show().removeAttr('notshow').attr('script'));
		} else {
			$('#' + $(this).attr('chartHolder')).fadeIn();
		}

		$('#chartContainer .menuContent').hide();
		$('#' + $(this).attr('menuContentId')).fadeIn();

		$('#exportEnergyDataButton').attr('timeRangeType', $(this).attr('timeRangeType'));
	});

	$('#chartContainer .dateInput').change(function() {
		$(this).blur();
	});
};

function exportEnergyData() {
	var timeRangeType = $('#exportEnergyDataButton').attr('timeRangeType');

	var timeSuffix = '';
	if(timeRangeType == 'month') {
		var monthDate = moment($('#plantMonthColumnChartDate').val(), 'YYYY-MM');
		timeSuffix = '&year=' + monthDate.year() + '&month=' + (monthDate.month() + 1)
	} else if(timeRangeType == 'year') {
		var yearDate = moment($('#plantYearColumnChartDate').val(), 'YYYY');
		timeSuffix = '&year=' + yearDate.year()
	}

	window.open(baseUrl + '/web/analyze/energy/exportData?serialNum=' + $('#inverterSearchInput').combogrid('getValue') + '&timeRangeType=' + timeRangeType + timeSuffix);
};

let allHeight = 0;
(function ($) {
	$.fn.autoScrollContainer = function (titel1, title2) {
		let container = $('#autoScrollContainer')
		return this.each(function () {
			if (titel1){
				let scroll = $('<p class="warning_color" style="margin-bottom: 0; line-height: 20px;">' + titel1 +' <span>'+ title2 +'</span></p>').appendTo(container)
			}
			$('#autoScrollContainer p').each(function (index, item) {
				allHeight += $(item).height() * -1;
			})
		})
	}
})(jQuery);


$('#enlargeChart').click(function () {
	$('#lineChartContent').css('width', '100%')
	$('#lineChartContent').css('height', '600px')
	$('#powerLineHolder').css('height', '560px')
	var width = document.getElementById('lineChartContent').offsetWidth
	powerChart.setSize(width-36, null)
	$('#rightContent').hide()
	$('#enlargeChart').hide()
	$('#narrowChart').show()
})
$('#narrowChart').click(function () {
	$('#lineChartContent').css('width', '100%')
	$('#lineChartContent').css('height', '400px')
	$('#powerLineHolder').css('height', '360px')
	var width = document.getElementById('lineChartContent').offsetWidth
	powerChart.setSize(width-306, null)
	$('#enlargeChart').show()
	$('#narrowChart').hide()
	$('#rightContent').show()
})
function getPanixInfo(serialNum) {
	$.post(baseUrl + '/api/phnix/getData', { serialNum }, function(response) {
		response && (response = JSON.parse(response))
		if (response.success) {
			let form = (response.data && response.data.length)? response.data[0] : null
			if(form) {
				$('#isOffline').text(form.deviceStatus)
				$('#currentModeSpan').text(form.modeText)
				$('#hotWaterTemperature').text(form.RO1)
				$('#heatingTargetTemperature').text(form.RO2)
				$('#coolingTargetTemperature').text(form.RO3)
				$('#inletWaterTemperature').text(form.TO1)
				$('#outletTemperature').text(form.T02)
				$('#waterTankTemperature').text(form.TO8)
				$('#ambientTemperature').text(form.TO4)
				let statusText = form.Output1 == '1'? 'Normal' : 'Standby'
				$('#waterCirculationVolume').text(statusText)
				if(form.isFault) {
					$('#currentStatus').attr('src', resourceBaseUrl + '/web/img/monitor/phnix/redLight.png')
				} else {
					$('#currentStatus').attr('src', resourceBaseUrl + '/web/img/monitor/phnix/greenLight.png')
				}
			} else {
				clearPhnixInfo()
			}
		} else {
			clearPhnixInfo()
		}
	})
}
var chargePointSn = ''
function getCloudFastChargingInfo(serialNum) {
	$.post(baseUrl + '/api/chargePoint/realTime', { inverterSn: serialNum }, function(response) {
		response = JSON.parse(response)
		if (response.success) {
			let form = response
			if(form) {
				$('#evChargerSerialNumber').text(form.chargePointSn)
				$('.chargingBox').show()
				// $('#pileNumber').text(form.chargerNum)
				$('#gunNumber').text(form.connectNum)
				const deviceStatusList = {
					0: offline,
					1: fault,
					2: free,
					3: charge
				}
				$('#status').text(deviceStatusList[form.deviceStatus])
				$('#gunInPlace').text(form.connectHoming == 1? yes : no)
				$('#gunInserted').text(form.isConnect == 1? yes : no)
				$('#outputVoltage').text(form.voltage / 10.0)
				$('#outputCurrent').text(form.current)
				$('#gunLineTemperature').text(form.wireTemp / 10.0)
				$('#gunLineCode').text(form.phases)
				$('#soc').text(form.soc)
				$('#maximumTemperatureOfBatteryPack').text(form.packMaxTemp)
				$('#accumulatedChargingTime').text(form.totalTime)
				$('#remainingTime').text(form.remainder)
				$('#chargingDegree').text(form.chargingDegree)
				$('#calculatedChargingDegree').text(form.lossChargingDegree)
				$('#hardwareMalfunction').text(form.hardwareFailure)
				if(form.deviceStatus == '2') {
					$('#charge').show()
					$('#stopCharge').hide()
				} else if(form.deviceStatus == '3') {
					$('#charge').hide()
					$('#stopCharge').show()
				} else {
					$('#charge').hide()
					$('#stopCharge').hide()
					// $('#chargeBtnBox').hide()
				}
				chargePointSn = form.chargePointSn
			} else {
				clearCloudFastChargingInfo()
			}
		} else {
			clearCloudFastChargingInfo()
			$('.chargingBox').hide()
			$('#evChargerSerialNumber').text(response.chargePointSn)
			// $('#pileNumber').text(response.chargePointSn)
			chargePointSn = response.chargePointSn
			if(response.msg == 'noUnclosedTransaction') {
				$('#charge').show()
				$('#stopCharge').hide()
			}
		}
	})
}

function toCharge(type) {
	if(type == 'stop') {
		stopCharge(null)
	} else {
		goCharge(null)
	}
}

function clearPhnixInfo() {
	$('.currentModeValue').text('--')
	$('#hotWaterTemperature').text('--')
	$('#heatingTargetTemperature').text('--')
	$('#coolingTargetTemperature').text('--')
	$('#inletWaterTemperature').text('--')
	$('#outletTemperature').text('--')
	$('#waterTankTemperature').text('--')
	$('#ambientTemperature').text('--')
	$('#waterCirculationVolume').text('--')
}

function clearCloudFastChargingInfo() {
	$('#evChargerSerialNumber').text('--')
	$('#pileNumber').text('--')
	$('#gunNumber').text('--')
	$('#status').text('--')
	$('#gunInPlace').text('--')
	$('#gunInserted').text('--')
	$('#outputVoltage').text('--')
	$('#outputCurrent').text('--')
	$('#gunLineTemperature').text('--')
	$('#gunLineCode').text('--')
	$('#soc').text('--')
	$('#maximumTemperatureOfBatteryPack').text('--')
	$('#accumulatedChargingTime').text('--')
	$('#remainingTime').text('--')
	$('#chargingDegree').text('--')
	$('#calculatedChargingDegree').text('--')
	$('#hardwareMalfunction').text('--')
}
//Use
//$(document).ready(function() {
//	$('#autoScrollContainer').autoScrollContainer('New content:','test');
//});
/*	$('#autoScrollContainer').autoScrollContainer();

let autoScrollSetInterval;
clearInterval(autoScrollSetInterval)
autoScrollSetInterval = setInterval(handleSetInterval, 2000)

let currentTop = 0
let firstItemElement = $('#autoScrollContainer p:first').css('margin-top', 0 + 'px')
function handleSetInterval(){
	//Clear timmer
	let container = $('#autoScrollContainer')
	if (container === null){
		clearInterval(autoScrollSetInterval)
	}

	if (currentTop > allHeight + 20) {
		currentTop += -20;
		firstItemElement.animate({'margin-top' : currentTop + 'px'});
		// firstItemElement.css('margin-top', currentTop + 'px')
	}else {
		currentTop = 0
		// firstItemElement.css('margin-top', 0 + 'px')
		firstItemElement.animate({'margin-top' : 0 + 'px'});
	}
}	*/

function showPowerDetail(res) {
	$('#powerDetail').hide()
	$('#powerDetailBox .powerDetailItem').remove()
	if(currentDeviceType == 6 && (currentStandard == 'FAAB' || currentStandard == 'fAAB') && currentSlaveVersion > 0x1F && currentFwVersion > 0x1F) {
		let content = ''
		res.smartLoadPower && (content += '<div class="powerDetailItem">smartLoadPower: ' + res.smartLoadPower + 'W</div>')
		res.epsLoadPower && (content += '<div class="powerDetailItem">epsLoadPower: ' + res.epsLoadPower + 'W</div>')
		res.gridLoadPower && (content += '<div class="powerDetailItem">gridLoadPower: ' + res.gridLoadPower + 'W</div>')
		$('#powerDetailBox').append(content)
		if(res.smartLoadPower || res.epsLoadPower || res.gridLoadPower) {
			$('#powerDetail').show()
		}
	} else if(currentDeviceType == 3 && (currentStandard == 'cbaa' && currentSlaveVersion >= 0x24 || currentStandard == 'cBaa' && currentSlaveVersion >= 0x8D || currentStandard == 'cBAA' && currentSlaveVersion >= 0x8D || currentDtc == 1 && currentStandard == 'ccaa' && currentSlaveVersion >= 0x12) || currentDeviceType == 11 && (currentDtc == 1 && currentStandard == 'ceaa' && currentSlaveVersion >= 0x06 || currentStandard == 'cfaa' && currentSlaveVersion >= 0x06)) {
		let content = ''
		content += '<div class="powerDetailItem">smartLoadPower: ' + res.smartLoadPower + 'W</div>'
		content += '<div class="powerDetailItem">epsLoadPower: ' + res.epsLoadPower + 'W</div>'
		content += '<div class="powerDetailItem">gridLoadPower: ' + res.gridLoadPower + 'W</div>'
		$('#powerDetailBox').append(content)
		if(res.smartLoadInverterEnable) {
			$('#powerDetail').show()
		}
	} else if(isTrip12K()) {
		let content = ''
		content += '<div class="powerDetailItem">smartLoadPower: ' + (res.smartLoadInverterEnable? res.smartLoadPower : '--') + 'W</div>'
		$('#powerDetailBox').append(content)
		if(res.smartLoadInverterEnable) {
			$('#powerDetail').show()
		}
	}
}

$('#powerDetail').click(function() {
	$('#powerDetailBox').toggle()
})

function showBmsInfo() {
	$('#bmsDialog').modal().on('shown.bs.modal', function () {
		$('#bmsInfoTable').datagrid({
			url: baseUrl + '/api/inverter/getInverterBatteryInfoParallel',
			onBeforeLoad: function (param) {
				param.serialNum = currentSerialNum
			},
			loadFilter: function(data) {
				if (data && data.deviceCount !== undefined && data.deviceArray !== undefined) {
					return {
						total: data.deviceCount,
						rows: data.deviceArray
					};
				} else {
					return { total: 0, rows: [] };
				}
			},
			columns: [[
				{ field:'serialNum', title:'serialNum', width: '10%' },
				{ field:'batParallelNum', title:'Batt Parallel Num', width: '10%' },
				{ field:'batCapacityValue', title:'Batt Capacity(Ah)', width: '10%' },
				{ field:'maxChgCurrValue', title:'BMS Limit Charge(A)', width: '10%' },
				{field:'maxDischgCurrValue',title:'BMS Limit Discharge(A)', width: '10%'},
				{field:'bmsCharge',title:'BMS Charge', width: '15%', formatter: function(value, row, index ){
						if((value === '' || value == undefined)) return ''
						let content = '<p  style="font-size: 13px;">' + (value ? 'Allowed' : 'Forbidden')
						// if(isAdmin && value) {
							content += '<a  class="bmsStatusText allowedHideBmsDischargeTitle" href="javascript:showBmsChargeStatus(\'DONT_CHARGE\', \'' + row.serialNum + '\');" title=""> (?)</a>'
						// }
						content += '</p>'
						return content
				}},
				{field:'bmsDischarge',title:'BMS Discharge', width: '15%', formatter: function(value, row, index ){
					if((value === '' || value == undefined)) return ''
					let content = '<p  style="font-size: 13px;">' + (value ? 'Allowed' : 'Forbidden')
						// if(isAdmin && value) {
							content += '<a  class="bmsStatusText allowedHideBmsDischargeTitle" href="javascript:showBmsChargeStatus(\'DONT_DISCHARGE\', \'' + row.serialNum + '\');" title=""> (?)</a>'
						// }
						content += '</p>'
						return content
				}},
				{field:'bmsForceCharge',title:'BMS Force Charge', width: '20%', formatter: function(value, row, index ){
						if((value === '' || value == undefined)) return ''
						let content = '<p  style="font-size: 13px;">' + (value ? 'ON' : 'OFF') + '</p>'
						return content
				}}
			]],
			pagination: false,
			fitColumns: true,
			singleSelect: true
		});
	});
}

setupRefresh()
function getTimeToMidnight() {
	const now = new Date();
	const midnight = new Date();
	midnight.setHours(24, 0, 0, 0);
	return midnight - now;
}

function setupRefresh() {
	const timeToMidnight = getTimeToMidnight();
	setTimeout(() => {
		window.location.reload();
	}, timeToMidnight)
}

function getNextDelay() {
	const now = new Date();
	const currentHour = now.getHours();
	const target = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		currentHour,
		5,
		0
	);
	if (now > target) {
		target.setHours(target.getHours() + 1);
	}
	return target - now;
}

setTimeout(function() {
	reloadAllCharts()
	setInterval(reloadAllCharts, 3600000);
}, getNextDelay());
