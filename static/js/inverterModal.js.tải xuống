$('#inputOutputPowerModal').on('shown.bs.modal', function (e) {
    $('#inputOutputPowerTable').datagrid({
        onBeforeLoad: function(param) {
            param.serialNum = getChartTargetSerialNum()
            param.dateText = $('#dayLineChartDate').val()
            param.timeText = moment(timeText).utcOffset(0).format('HH:mm')
        },
        loadFilter: function(data){
            if (data.success) {
                return {
                    rows: data.data
                };
            } else {
                return {
                    rows: []
                };
            }
        },
        onLoadSuccess: function(data){
            mergeCells()
            if(checkShowPv3ViewByDevice()) {
				$('#inputOutputPowerTable').datagrid('showColumn','ppv3');
            } else {
                $('#inputOutputPowerTable').datagrid('hideColumn','ppv3');
			}
            if(currentDeviceType == '2') {
                $('#inputOutputPowerTable').datagrid('hideColumn','ppv2');
            } else {
				$('#inputOutputPowerTable').datagrid('showColumn','ppv2');
			}
        }
    });
    firstTimeOpenModal = false;
    $('#inputOutputPowerTableContainer').fadeIn(function() {
        $('#inputOutputPowerTable').datagrid('fitColumns');
    });
});

function mergeCells(){
    var mergeIndex = 0
    var mergeCount = 1
    var rows = $('#inputOutputPowerTable').datagrid('getRows')
    for(var i = 1; i < rows.length; i++) {
        if(rows[i].serialNum == rows[i - 1].serialNum) {
            mergeCount++
        } else {
            $('#inputOutputPowerTable').datagrid('mergeCells', {
                index: mergeIndex,
                field: 'serialNum',
                rowspan: mergeCount,
                colspan: 1
            });
            mergeIndex = i
            mergeCount = 1
        }
    }
    $('#inputOutputPowerTable').datagrid('mergeCells',{
        index: mergeIndex,
        field: 'serialNum',
        rowspan: mergeCount,
        colspan: 1
    })
}

var id = ''
$('#inputOutputPowerModal').on('hidden.bs.modal', function (e) {
    id = ''
});

var timeText = ''
function clickPoint(x,y) {
    timeText = x
    $('#inputOutputPowerModal').modal();
}