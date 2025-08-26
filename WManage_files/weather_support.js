		// $('.btn-clean-city').click(function() {
        //     $('#midboxContainer').is(':visible')? $('#midboxContainer #citySearchTextInput').val('') : $('#citySearchTextInput').val('')
        //     getWeatherForecast(selectPlantId)
        // })
        const colorMenu = {
            'RED': 'red' ,
            'ORANGE': 'orange' ,
            'YELLOW': '#f2d232' ,
            'GREEN': 'green' ,
            'OFFICIAL': '#f2d232' ,
            'UNKNOWN': 'green' };
        var alertList = [];
        function handleEnter(event) {
            if (event.key === "Enter") {
                searchCity()
            }}
        var tempCityDetail = {}
        function searchCity() {
            $('.loadingWeather').show()
            // $('.deleteIcon').hide()
            const citySearch = $('#midboxContainer').is(':visible')? $('#midboxContainer #citySearchTextInput').val() : $('#citySearchTextInput').val()
            const countrySearch = $('#midboxContainer').is(':visible')? $('#midboxContainer #countrySearchTextInput').val() : $('#countrySearchTextInput').val()


            $.post(baseUrl + '/api/weather/plant/forecast/manual', { inputLocation: citySearch, country:countrySearch }, function(response) {
                response = JSON.parse(response)
                operateCityDetail(response, true)
            })
        }
        function saveArea() {
            const form = {
                plantId: selectPlantId,
                latitude: tempCityDetail.latitude,
                longitude: tempCityDetail.longitude,
                resolvedAddress: tempCityDetail.resolvedAddress,
                tzoffset: tempCityDetail.tzoffset,
            }
            $.post(baseUrl + '/api/weather/plant/saveLocation', form, function(response) {
                response = JSON.parse(response)
                if(response.success) {
                    // alert('Operation successful')
                    // $('.deleteIcon').show()
                    $('.addLocationData').hide()
                    getWeatherForecast($('#inverterSearchInput').combogrid('getValue') )
                    $('.warningTip').html('')
                }
            })
        }
        $('.deleteIcon').click(function() {
            $('#midboxContainer').is(':visible') && $('#midboxContainer .removeCityModal').modal()
            $('#inverterFlowContainer').is(':visible') && $('#inverterFlowContainer .removeCityModal').modal()
            onDel()
        })
        function removeCity() {
            if(!tempCityDetail.success) return
            $.post(baseUrl + '/api/weather/plant/clearLocation', {plantId: selectPlantId}, function(response) {
                response = JSON.parse(response)
                if(response.success) {
                    $('.noCityData').show()
                    $('.hasCityData').hide()
                    $('#midboxContainer').is(':visible') && $('#midboxContainer .removeCityModal').modal('hide')
                    $('#inverterFlowContainer').is(':visible') && $('#inverterFlowContainer .removeCityModal').modal('hide')
                    tempCityDetail.success = false
                    $('.warningTip').html('')
                }
            })
        }
        function getWeatherForecast(serialNum) {
            $('.loadingWeather').show()
            $.post(baseUrl + '/api/weather/forecast', { serialNum: serialNum }, function(response) {
                operateCityDetail(response, false)
            }, 'json');
        }
        function operateCityDetail(res, isSearch) {
            $('.loadingWeather').hide()
            if(res.success) {
                tempCityDetail = res
                $('.noCityData').hide()
                $('.hasCityData').show()
                const addressDetail = isSearch? res.resolvedAddress : res.plantCity
                $('.resolvedAddress').text(addressDetail)

                $('.timezone').text(res.timezone)
                if(res.days && res.days.length) {
                    $('.datetime').text(res.days[0].datetime)
                    $('.temp').text(res.days[0].tempmin + ' ~ ' + res.days[0].tempmax)
                    $('.solarradiation').text(res.days[0].solarradiation)
                    $('.weatherIcon').attr('src', resourceBaseUrl + '/web/img/format/weatherIcon/' + res.days[0].icon + '.png').show();
                    $('.weatherText').text(res.days[0].conditions)
                }
                if(res.alerts && res.alerts.length) {
                    alertList = res.alerts;
                    let content = ''
                    res.alerts.forEach((item,index) => {
                        let color = colorMenu[item.level]
                        if(index == 0) {
                            content += '<div class="warningTipBox slideWeather" style="background:' + color + ';">'
                                + '<div class="iconfont icon-lingdang" style="margin-right: 5px"></div>' + '<div>' + item.event + '</div>' +
                              	'<div class=" iconfont icon-gengduo more" onclick="onAlert(' + index + ')"></div></div>'
                        } else {
                            content += '<div class="warningTipBox slideWeather" style="background:' + color + ';transform: translateY(100%);">'
                                + '<div class="iconfont icon-lingdang" style="margin-right: 5px"></div>' + '<div>' + item.event + '</div>' +
                                '<div class="iconfont icon-gengduo more" onclick="onAlert(' + index + ')"></div></div>'
                        }
                    })
                    $('.warningTip').append(content)
                    clearInterval(slideInterval);
                    initSlideWeather()
                } else {
                    $('.warningTip').html('')
                }
				
                if(res.ePvPredict) {
                	$('.todayDatetime').text(res.localDate);
                	$('.predictSolarToday').text(res.ePvPredict.todayPvEnergy >= 0 ? (res.ePvPredict.todayPvEnergy / 10) : '-');
                	$('.predictSolarTomorrow').text(res.ePvPredict.tomorrowPvEnergy >= 0 ? (res.ePvPredict.tomorrowPvEnergy / 10) : '-');
                	$('.yeildBox').show();
                } else {
                	$('.todayDatetime').text('');
                	$('.predictSolarToday').text('');
                	$('.predictSolarTomorrow').text('');
                	$('.yeildBox').hide();
                }
                
                if(isSearch) {
                    saveArea()
                }
            } else {
                $('.hasCityData').hide()
                if(isSearch) {
                    $('.noDataTip').fadeIn()
                    setTimeout(() => {
                        $('.noDataTip').fadeOut(500)
                    }, 1000)
                } else {
                    $('.noCityData').fadeIn()
                }
                // $('.hasCityData').hide()
                // removeCity()
                tempCityDetail = res
            }
        }
        function addLocation() {
            $('.addLocationData').fadeIn()
            // $('.noCityData').hide()
        };
        function onAlert(index) {
            $('.des').html('')
            clearInterval(slideInterval);
            const alertObj = alertList[index]
            let safeDescription = alertObj.description.replace(/"/g, '&quot;');
            let start = 'Start Time '+ alertObj.onset
            let end = 'End Time '+ alertObj.ends
            $('.des').append('<div style="position: relative;word-break: break-word;">'+start+ '\n' + end + '\n' + safeDescription
                +'<div class="iconfont icon-shanchu del" onclick="onDel()"></div></div>')

            $('.des').show()
        };
        function onDel() {
            clearInterval(slideInterval);
            $('.des').hide();
            slideInterval = setInterval(nextSlide, 3000);
        };
		$(document).ready(function() {
			$('.settingIcon').click(function() {
                $('.addLocationData').show()
                onDel()
			});
            $('.cancelSearch').click(function (){
                $('.addLocationData').hide()
            });
		});
        let slideInterval
        let $slides = []
        let currentSlide = 0
        function initSlideWeather() {
            let $warningTip = []
            $('#midboxContainer').is(':visible') && ($warningTip = $('#midboxContainer .warningTip'))
            $('#inverterFlowContainer').is(':visible') && ($warningTip = $('#inverterFlowContainer .warningTip'))
            $slides = $warningTip.find('.slideWeather');
            currentSlide = 0;
            slideInterval = setInterval(nextSlide, 3000); // 每3秒滚动到下一张图片
            // $warningTip.hover(function() {
            //     clearInterval(slideInterval);
            // });
        }
        function nextSlide() {
            let nextSlide = (currentSlide + 1) % $slides.length;
            $slides.eq(currentSlide).css('transform', 'translateY(100%)');
            $slides.eq(nextSlide).css('transform', 'translateY(0)');
            currentSlide = nextSlide;
        }