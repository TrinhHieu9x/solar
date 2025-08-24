var siteRequest = {
    loadAjaxUrl: function (url, id, contentid, mess, callback) {
        var target = document.querySelector(id);
        var blockUI = new KTBlockUI(target, {
            message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Loading...</div>',
            overlayColor: '#000000',
            //state: 'success',
            // message: mess
        });
        blockUI.block();
        $.post(encodeURI(url), function (data) {
            blockUI.release();
            blockUI.destroy();
            $(contentid).html(data);
            if (callback != "")
                setTimeout(callback, 1);
        });

    },
    submit: function (formId, fieldValid, message, url, wait, callBack) {
        FormValidation.formValidation(document.getElementById(formId), {
            fields: fieldValid,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5(),
                //message: new FormValidation.plugins.Message(),
                submitButton: new FormValidation.plugins.SubmitButton(),
               /* icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),*/
            },
        }).on('core.form.valid', function () {
            var target = document.querySelector('#' + formId);
            var blockUI = new KTBlockUI(target, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Loading...</div>',
                overlayColor: '#000000',
                //state: 'success',
                // message: mess
            });
            blockUI.block();
            var formData = new FormData(document.getElementById(formId));
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    blockUI.release();
                    blockUI.destroy();
                    siteRequest.showMessage(data.Title, data.Message, data.Type);
                    if (callBack != "")
                        window.setTimeout(callBack, 1);
                    if (data.CallBack != "")
                        window.setTimeout(data.CallBack, 1);
                    if (data.Type === "SUCCESS") {
                        $('.modal').modal('hide');
                        $('.modal').remove();
                    }
                },
                error: function (xhr, status, error) {
                    alert('Đã xảy ra lỗi. Vui lòng thử lại.\n' + error);
                    blockUI.release();
                    blockUI.destroy();
                }
            });
        });

    },
    confirm: function (title, url, callback, mess) {
        var id = Math.floor((Math.random() * 100) + 1);
        var dialog = '	<div class="modal fade" tabindex="-1" id="kt_modal_' + id + '">	'
            + '	    <div class="modal-dialog modal-sm">	'
            + '	        <div class="modal-content">	'
            + '	            <div class="modal-header">	'
            + '	                <h5 class="modal-title">' + title + '</h5>	'
            + '	                <!--begin::Close-->	'
            + '	                <div class="btn btn-icon btn-sm btn-active-dark-primary ms-2" data-bs-dismiss="modal" aria-label="Close">	'
            + '	                    <span class="svg-icon svg-icon-2x"></span>	'
            + '	                </div>	'
            + '	                <!--end::Close-->	'
            + '	            </div>	'
            + '	            <div class="modal-body">	'
            + '	                <h6 class="">' + mess + '</h6>	'
            + '	                <button type="button" class="btn btn-primary" id="btnConfirm" data-bs-dismiss="modal">Có</button>	'
            + '	                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Không</button>	'
            + '	            </div>	'
            + '	            <div class="modal-footer">	'
          

            + '	            </div>	'
            + '	        </div>	'
            + '	    </div>	'
            + '	</div>	';
        $("body").append(dialog);
        var myModal = new bootstrap.Modal($('#kt_modal_' + id))
        myModal.show();
        $('#btnConfirm').click(function () {
            var target = document.querySelector('#kt_modal_' + id + ' .modal-body');
            var blockUI = new KTBlockUI(target, {
                message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Loading...</div>',
                overlayColor: '#000000',
                //state: 'success',
                // message: mess
            });
            $.post(url,
                function (data) {
                    blockUI.release();
                    blockUI.destroy();
                    siteRequest.showMessage(data.Title, data.Message, data.Type);
                    $('#kt_modal_' + id).modal('hide');
                    $('#kt_modal_' + id).remove();
                    setTimeout(callback, 1);
                    if (data.CallBack != "")
                        window.setTimeout(data.CallBack, 1);
                   
                });
        });
        //for remove modal if close button pressed
        var myModalEl = document.getElementById('kt_modal_' + id);
        myModalEl.addEventListener('hidden.bs.modal', function (event) {
            $('.modal').modal('hide');
            $('.modal').remove();
            //myModal.dispose();
            //myModalEl.remove();
            if (callback != "")
                setTimeout(callback, 1);
        });  
    },
    showModal: function (title, size, url, callback, mess) {
        //size: xl, lg, sm,
        //var id = Math.floor((Math.random() * 100) + 1);
        var id = 0;
        var dialog = '	<div class="modal fade" tabindex="-1" id="kt_modal_' + id + '">	'
            + '	    <div class="modal-dialog modal-' + size + '">	'
            + '	        <div class="modal-content">	'
            + '	            <div class="modal-header pb-0 border-0">	'
            + '                 <div class="flex-grow-1 flex-shrink-0">'
            + '                     <h1 class="modal-title">' + title + '</h1> '
            + '                 </div>'
            + '                 <div class="position-relative justify-content-end">'
            + '                     <!--begin:: Close--> '
            + '                     <div class="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal"> '
            + '                         <!--begin::Svg Icon | path: icons/duotune/arrows/arr061.svg--> '
            + '                         <span class="svg-icon svg-icon-1"> '
            + '                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> '
            + '                                 <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" '
            + '                                     fill="black" /> '
            + '                                 <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="black" /> '
            + '                             </svg> '
            + '                         </span> '
            + '                         <!--end::Svg Icon--> '
            + '                     </div> '
            + '                     <!--end:: Close--> '
            + '                 </div>'
            + '	            </div>	'
            + '	            <div class="modal-body" id="modalBody">	'
            + '	            </div>	'        
            + '	        </div>	'
            + '	    </div>	'
            + '	</div>	';
        $("body").append(dialog);
        var myModal = new bootstrap.Modal($('#kt_modal_' + id))       

        myModal.show();
        var target = document.querySelector('#kt_modal_' + id + ' .modal-body');
        var blockUI = new KTBlockUI(target, {
            message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Loading...</div>',
            overlayColor: '#000000',
            //state: 'success',
            // message: mess
        });
        blockUI.block();
        $.post(encodeURI(url), function (data) {
            $('#kt_modal_' + id + ' .modal-body').html(data);           
        });
        //for remove modal if close button pressed
        var myModalEl = document.getElementById('kt_modal_' + id);
        myModalEl.addEventListener('hidden.bs.modal', function (event) {
            $('.modal').modal('hide');
            $('.modal').remove();
            //myModal.dispose();
            //myModalEl.remove();
            if (callback != "")
                setTimeout(callback, 1);
        });
    },


    showMessage: function (title, mes, ty) {       
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toastr-top-right",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

       
        title = '<span style="color:#ccf90a">' + title + '</span>';
        if (ty == 'ERROR')
            toastr.error(mes, title);
        if (ty == 'SUCCESS')
            toastr.success(mes, title);
        if (ty == 'INFO')
            toastr.info(mes, title);
        if (ty == 'WARNING')
            toastr.warning(mes, title);
    },
    
    formatDate: function (id, st) {
        var arrows;
        if (KTUtil.isRTL()) {
            arrows = {
                leftArrow: '<i class="la la-angle-right"></i>',
                rightArrow: '<i class="la la-angle-left"></i>'
            }
        } else {
            arrows = {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        }

        if (st == 'D') {
            $(id).datepicker({
                rtl: KTUtil.isRTL(),
                todayHighlight: true,
                orientation: "bottom left",
                templates: arrows,
                format: 'dd/mm/yyyy'
            });
        }

        if (st == 'DT') {
            $(id).datetimepicker({
                todayHighlight: true,
                autoclose: true,
                format: 'dd/mm/yyyy hh:ii'
            });

        }

    }, formatTime: function (id, ty) {

        $(id).timepicker({
            defaultTime: $(id).val(),
            minuteStep: 1,
            showSeconds: ty,
            showMeridian: false
        });


    },
    inputAutoComplete: function (id, urlJson, mess, disValue, disPlay) {

        var bestPictures = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(disValue),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: { url: urlJson, cache: false }

        });
        bestPictures.initialize();
        var autoCPL = $(id).typeahead(null, {
            name: 'best-pictures',
            display: disValue,
            source: bestPictures,
            templates: {
                empty: [
                    '<div class="empty-message" style="padding: 10px 15px; text-align: center;">',
                    mess,
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(disPlay)
            }
        });
        bestPictures.clear();
        return autoCPL;
    },
    inputAutoCompleteDO: function (id, urlJson, mess, disValue, disPlay, idrcustomerow) {

        var bestPictures = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(disValue),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: { url: urlJson, cache: false }

        });
        bestPictures.initialize();
        var autoCPL = $(id).typeahead(null, {
            name: 'best-pictures',
            display: disValue,
            highlight: true,
            source: bestPictures,
            templates: {
                empty: function (context) {
                    $("#shipperID" + idrcustomerow).val(0);
                    $("#phone" + idrcustomerow).val("");
                    $("#address" + idrcustomerow).val("");
                    return [
                        '<div class="empty-message" style="padding: 10px 15px; text-align: center;">',
                        mess,
                        '</div>'
                    ].join('\n');
                },
                suggestion: Handlebars.compile(disPlay)
            }
        });
        bestPictures.clear();
        return autoCPL;
    },
    inputAutoCompleteFlight: function (id, urlJson, mess, disValue, disPlay, action) {

        var bestPictures = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(disValue),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: { url: urlJson, cache: false }

        });
        bestPictures.initialize();
        var autoCPL = $(id).typeahead(null, {
            name: 'best-pictures',
            display: disValue,
            source: bestPictures,
            templates: {
                empty: [
                    '<div id="autoshow" class="empty-message" style="padding: 10px 15px; text-align: center;">',
                    mess,
                    '<button type="button" onclick="' + action + '" class="gwt-Button">Add new</button>',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(disPlay)
            }
        });
        bestPictures.clear();
        return autoCPL;
    }
}