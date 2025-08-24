var queryQuickChargeStatusLoopTime = 0;

/**
 * Include quick charge and quick discharge status...
 */
function queryQuickChargeStatusInLoop() {
	if(queryQuickChargeStatusLoopTime > 0) {
		queryQuickChargeStatusLoopTime--;
		refreshQuickChargeStatus();
	}
	
	setTimeout(queryQuickChargeStatusInLoop, 5000);
}

function refreshQuickChargeStatus() {
	if(currentSerialNum) {
		$.post(baseUrl + '/web/config/quickCharge/getStatusInfo', { inverterSn: currentSerialNum }, function(response) {
			if(response.success) {
				if(response.hasUnclosedQuickChargeTask) {
					$('#startQuickChargeButton').hide();
					$('#midboxContainer #startQuickChargeButton').hide();
					if(response.lowVoltProtect) {
						$('#infoListLabel').show();
						$('#stopQuickChargeButton').hide();
						$('#midboxContainer #stopQuickChargeButton').hide();
					} else {
						$('#infoListLabel').hide();
						$('#stopQuickChargeButton').show();
						$('#midboxContainer #stopQuickChargeButton').show();
					}
				} else {
					$('#stopQuickChargeButton').hide();
					$('#midboxContainer #stopQuickChargeButton').hide();
					$('#startQuickChargeButton').show();
					$('#midboxContainer #startQuickChargeButton').show();
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
			}
		}, 'json');
	}
}

function refreshRuntimeDataAfterCtrl() {
	$('#refreshSingleButton').click();
}

$(document).ready(function() {
	//Start quick charge
	$('#startQuickChargeButton, #midboxContainer #startQuickChargeButton').click(function() {
		if(currentSerialNum) {
			$('#startQuickChargeButton, #midboxContainer #startQuickChargeButton').button('loading');
			$.post(baseUrl + '/web/config/quickCharge/start', { inverterSn: currentSerialNum, clientType: 'WEB' }, function(response) {
				$('#startQuickChargeButton, #midboxContainer #startQuickChargeButton').button('reset');
				if(response.success) {
					queryQuickChargeStatusLoopTime = 3;
					refreshQuickChargeStatus();
					setTimeout(refreshRuntimeDataAfterCtrl, 10000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//Stop quick charge
	$('#stopQuickChargeButton, #midboxContainer #stopQuickChargeButton').click(function() {
		if(currentSerialNum) {
			$('#stopQuickChargeButton, #midboxContainer #stopQuickChargeButton').button('loading');
			$.post(baseUrl + '/web/config/quickCharge/stop', { inverterSn: currentSerialNum, clientType: 'WEB' }, function(response) {
				$('#stopQuickChargeButton, #midboxContainer #stopQuickChargeButton').button('reset');
				if(response.success) {
					queryQuickChargeStatusLoopTime = 3;
					refreshQuickChargeStatus();
					setTimeout(refreshRuntimeDataAfterCtrl, 10000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//Start quick discharge
	$('#startQuickDischargeButton').click(function() {
		if(currentSerialNum) {
			$('#startQuickDischargeButton').button('loading');
			$.post(baseUrl + '/web/config/quickDischarge/start', { inverterSn: currentSerialNum, clientType: 'WEB' }, function(response) {
				$('#startQuickDischargeButton').button('reset');
				if(response.success) {
					queryQuickChargeStatusLoopTime = 3;
					refreshQuickChargeStatus();
					setTimeout(refreshRuntimeDataAfterCtrl, 10000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//Stop quick discharge
	$('#stopQuickDischargeButton').click(function() {
		if(currentSerialNum) {
			$('#stopQuickDischargeButton').button('loading');
			$.post(baseUrl + '/web/config/quickDischarge/stop', { inverterSn: currentSerialNum, clientType: 'WEB' }, function(response) {
				$('#stopQuickDischargeButton').button('reset');
				if(response.success) {
					queryQuickChargeStatusLoopTime = 3;
					refreshQuickChargeStatus();
					setTimeout(refreshRuntimeDataAfterCtrl, 10000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	queryQuickChargeStatusInLoop();
	
	//GEN Quick Start
	$('#genQuickStartButton, #midboxContainer #genQuickStartButton').click(function() {
		if(currentSerialNum) {
			$('#genQuickStartButton, #midboxContainer #genQuickStartButton').button('loading');
			$.post(baseUrl + '/api/inverter/ctrlGenExercise', { inverterSn: currentSerialNum, enable: true, clientType: 'WEB' }, function(response) {
				$('#genQuickStartButton, #midboxContainer #genQuickStartButton').button('reset');
				if(response.success) {
					$('.genQuickStartBtnHolder button').hide();
					setTimeout(refreshRuntimeDataAfterCtrl, 3000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//GEN Quick Start
	$('#genQuickStopButton, #midboxContainer #genQuickStopButton').click(function() {
		if(currentSerialNum) {
			$('#genQuickStopButton, #midboxContainer #genQuickStopButton').button('loading');
			$.post(baseUrl + '/api/inverter/ctrlGenExercise', { inverterSn: currentSerialNum, enable: false, clientType: 'WEB' }, function(response) {
				$('#genQuickStopButton, #midboxContainer #genQuickStopButton').button('reset');
				if(response.success) {
					$('.genQuickStartBtnHolder p').hide();
					$('.genQuickStartBtnHolder button').hide();
					setTimeout(refreshRuntimeDataAfterCtrl, 3000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//Start Battery Backup
	$('#startBatteryBackupButton').click(function() {
		if(currentSerialNum) {
			$('#startBatteryBackupButton').button('loading');
			$.post(baseUrl + '/api/inverter/ctrlBatteryBackup', { inverterSn: currentSerialNum, enable: true, clientType: 'WEB' }, function(response) {
				$('#startBatteryBackupButton').button('reset');
				if(response.success) {
					setTimeout(refreshRuntimeDataAfterCtrl, 1000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//Stop Battery Backup
	$('#stopBatteryBackupButton').click(function() {
		if(currentSerialNum) {
			$('#stopBatteryBackupButton').button('loading');
			$.post(baseUrl + '/api/inverter/ctrlBatteryBackup', { inverterSn: currentSerialNum, enable: false, clientType: 'WEB' }, function(response) {
				$('#stopBatteryBackupButton').button('reset');
				if(response.success) {
					setTimeout(refreshRuntimeDataAfterCtrl, 1000);
					alert('Success');
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});
	
	//Auto parallel
	$('#autoParallelButton').click(function() {
		if(currentSerialNum) {
			$('#autoParallelButton').button('loading');
			$.post(baseUrl + '/api/inverter/autoParallel', { plantId: selectPlantId }, function(response) {
				$('#autoParallelButton').button('reset');
				if(response.success) {
					window.location.reload();
				} else {
					alert('Failure: ' + response.msg);
				}
			}, 'json');
		}
	});

	$('#startGenBtn').click(function() {
		$('#startGenBtn').button('loading');
		$.post(baseUrl + '/web/maintain/remoteSet/write', {
			inverterSn: currentSerialNum,
			holdParam: 'MIDBOX_HOLD_START_GENERATOR',
			valueText: 1,
			clientType: 'WEB',
			remoteSetType: 'NORMAL' }, function(response) {
			$('#startGenBtn').button('reset');
			showPostWriteResult(response)
		}, 'json');
	})
});

function showPostWriteResult(response) {
	if(response.success) {
		alert(setResultSuccessText);
	} else {
		showPostWriteFailReason(response);
	}
}

function showPostWriteFailReason(response, timeoutTip) {
	switch(response.msg) {
		case 'noPermission':
		case 'NO_PERMISSION':
			alert(noPermissionText);
			break;
		case 'PARAM_ERROR':
			alert(resultParamErrorText);
			break;
		case 'ACTION_ERROR_UNDONE':
			alert(resultUndoText);
			break;
		case 'DEVICE_OFFLINE':
			alert(resultDeviceOfflineText);
			break;
		case 'DATAFRAME_UNSEND':
			alert(resultCommandNotSendText);
			break;
		case 'DATAFRAME_TIMEOUT':
			alert(resultTimeoutText + (timeoutTip ? ', dongle will offline and try to reconnect server soon, please try again after that.' : ''));
			break;
		case 'SERVER_HTTP_EXCEPTION':
			alert(resultServerExceptionText);
			break;
		case 'REMOTE_SET_ERROR':
		case 'REMOTE_READ_ERROR':
			alert(resultFailedText + ' ' + response.errorCode);
			break;
		case 'notAllowRemoteTechSupport':
			alert(response.msg);
			break;
		case 'apiBlocked':
			alert('API blocked in 24 hours');
			break;
		default:
			alert(resultUnknownErrorText);
			break;
	}
}