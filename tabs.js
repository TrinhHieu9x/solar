const TabContents = {
    view: `
    <main class="max-w-7xl mx-auto px-2 sm:px-4 py-2 space-y-2">
        <div class="bg-white rounded-lg px-2.5 py-1 shadow-xs border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
            <div class="flex items-center gap-1.5">
                <span class="font-medium text-slate-500">Trạm chọn:</span>
                <select id="station-select" class="border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 font-semibold text-slate-700 outline-none text-[11px]">
                    <option id="stationOptionName" value="station-1">Đang tải...</option>
                </select>
                <span id="system-serial-badge" class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold border border-slate-200 text-[10px]">---</span>
            </div>
            <div id="connection-status-indicator" class="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <span id="connection-dot" class="w-2 h-2 rounded-full bg-slate-300"></span> <span id="connection-text">Đang chờ API...</span>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-1 sm:gap-1.5">
            <!-- KPI 1: Solar Yield -->
            <div id="kpi-pv-card" class="bg-white rounded-lg shadow-2xs border border-slate-200 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-amber-300 transition-colors" onclick="togglePVCardMode()" title="Nhấp chuyển đổi hiển thị công suất cực đại trong ngày">
                <div id="kpi-pv-header" class="bg-amber-500 text-white px-1.5 py-0.5 font-semibold text-[10px] sm:text-xs flex justify-between items-center transition-colors">
                    <span id="kpi-pv-title" class="truncate">Năng suất MT</span>
                    <i class="fa-solid fa-solar-panel shrink-0 text-[10px]"></i>
                </div>
                <div class="p-1 sm:p-1.5 flex items-center justify-between gap-1">
                    <div id="kpi-pv-icon" class="text-amber-500 text-base sm:text-xl shrink-0 transition-colors">
                        <i class="fa-solid fa-sun"></i>
                    </div>
                    <div class="text-right w-full min-w-0">
                        <div class="text-xs sm:text-base font-bold font-mono text-slate-800 leading-none"><span id="kpi-pv-today">--</span> <span id="kpi-pv-unit" class="text-[8px] sm:text-[9px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400" id="kpi-pv-label1">Hôm nay</div>
                        <div class="text-[10px] sm:text-xs font-semibold font-mono text-slate-700 mt-0.5 leading-none"><span id="kpi-pv-total">--</span> <span class="text-[8px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400" id="kpi-pv-label2">Tổng cộng</div>
                    </div>
                </div>
            </div>
            
            <!-- KPI 2: Battery -->
            <div id="kpi-bat-card" class="bg-white rounded-lg shadow-2xs border border-slate-200 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-slate-300 transition-colors" onclick="toggleBatteryMode()">
                <div id="kpi-bat-header" class="bg-emerald-600 text-white px-1.5 py-0.5 font-semibold text-[10px] sm:text-xs flex justify-between items-center transition-colors">
                    <span id="kpi-bat-title" class="truncate">Xả pin</span>
                    <i id="kpi-bat-header-icon" class="fa-solid fa-battery-half shrink-0 text-[10px]"></i>
                </div>
                <div class="p-1 sm:p-1.5 flex items-center justify-between gap-1">
                    <div id="kpi-bat-icon" class="text-emerald-500 text-base sm:text-xl shrink-0 transition-colors">
                        <i class="fa-solid fa-car-battery"></i>
                    </div>
                    <div class="text-right w-full min-w-0">
                        <div class="text-xs sm:text-base font-bold font-mono text-slate-800 leading-none"><span id="kpi-bat-val1">--</span> <span class="text-[8px] sm:text-[9px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400" id="kpi-bat-label1">Xả hôm nay</div>
                        <div class="text-[10px] sm:text-xs font-semibold font-mono text-slate-700 mt-0.5 leading-none"><span id="kpi-bat-val2">--</span> <span class="text-[8px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400" id="kpi-bat-label2">Tổng xả</div>
                    </div>
                </div>
            </div>

            <!-- KPI 3: Grid -->
            <div id="kpi-grid-card" class="bg-white rounded-lg shadow-2xs border border-slate-200 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-sky-300 transition-colors" onclick="cycleGridMode()" title="Nhấp chuyển đổi xem Lấy/Đẩy lưới">
                <div id="kpi-grid-header" class="bg-sky-600 text-white px-1.5 py-0.5 font-semibold text-[10px] sm:text-xs flex justify-between items-center transition-colors">
                    <span id="kpi-grid-title" class="truncate">Import</span>
                    <i class="fa-solid fa-tower-cell shrink-0 text-[10px]"></i>
                </div>
                <div class="p-1 sm:p-1.5 flex items-center justify-between gap-1">
                    <div id="kpi-grid-icon" class="text-sky-500 text-base sm:text-xl shrink-0 transition-colors">
                        <i class="fa-solid fa-plug-circle-bolt"></i>
                    </div>
                    <div class="text-right w-full min-w-0">
                        <div class="text-xs sm:text-base font-bold font-mono text-slate-800 leading-none"><span id="kpi-grid-val1">--</span> <span class="text-[8px] sm:text-[9px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400" id="kpi-grid-label1">Lấy hôm nay</div>
                        <div class="text-[10px] sm:text-xs font-semibold font-mono text-slate-700 mt-0.5 leading-none"><span id="kpi-grid-val2">--</span> <span class="text-[8px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400" id="kpi-grid-label2">Tổng lấy</div>
                    </div>
                </div>
            </div>

            <!-- KPI 4: Consumption -->
            <div class="bg-white rounded-lg shadow-2xs border border-slate-200 overflow-hidden flex flex-col justify-between">
                <div class="bg-blue-600 text-white px-1.5 py-0.5 font-semibold text-[10px] sm:text-xs flex justify-between items-center">
                    <span class="truncate">Sự tiêu thụ</span>
                    <i class="fa-solid fa-house-chimney shrink-0 text-[10px]"></i>
                </div>
                <div class="p-1 sm:p-1.5 flex items-center justify-between gap-1">
                    <div class="text-blue-500 text-base sm:text-xl shrink-0">
                        <i class="fa-solid fa-house-laptop"></i>
                    </div>
                    <div class="text-right w-full min-w-0">
                        <div class="text-xs sm:text-base font-bold font-mono text-slate-800 leading-none"><span id="kpi-load-today">--</span> <span class="text-[8px] sm:text-[9px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400">Dùng hôm nay</div>
                        <div class="text-[10px] sm:text-xs font-semibold font-mono text-slate-700 mt-0.5 leading-none"><span id="kpi-load-total">--</span> <span class="text-[8px] font-normal text-slate-500">kWh</span></div>
                        <div class="text-[8px] text-slate-400">Tổng dùng</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-amber-50/90 rounded-lg px-2.5 py-1 border border-amber-200/80 shadow-2xs flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-amber-900">
            <div class="flex items-center gap-1.5 overflow-hidden">
                <i class="fa-solid fa-bullhorn text-amber-500 text-xs shrink-0"></i>
                <span class="font-medium truncate">Thông báo: Đang kết nối trực tiếp đến dữ liệu API thời gian thực của biến tần.</span>
            </div>
            <span id="notice-date" class="text-[9px] sm:text-[10px] font-mono text-amber-600 shrink-0 font-semibold">--</span>
        </div>

        <!-- TOPOLOGY POWER FLOW MAP -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-2xs p-2.5 sm:p-3 relative overflow-hidden">
            <div class="flex items-center justify-between mb-2 border-b border-slate-100 pb-1.5">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-800 text-xs sm:text-sm font-mono">Thông tin hệ thống</span>
                    <span id="system-status-badge" class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] bg-emerald-50 text-emerald-600 font-semibold flex items-center gap-1 border border-emerald-200">
                        <span id="status-dot" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <span id="system-status-text">Normal</span>
                    </span>
                </div>
                <button onclick="triggerFastCharge()" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-medium transition shadow-2xs cursor-pointer flex items-center gap-1">
                    <i class="fa-solid fa-bolt"></i> Bắt đầu sạc nhanh
                </button>
            </div>

            <div class="relative w-full max-w-[850px] mx-auto h-[270px] sm:h-[310px] flex items-center justify-center">
                <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 850 260">
                    <defs>
                        <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"/></marker>
                        <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
                        <marker id="arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#0d9488"/></marker>
                        <marker id="arrow-sky" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7"/></marker>
                        <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7"/></marker>
                        <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"/></marker>
                    </defs>

                    <path d="M 140 25 L 328 25 Q 340 25, 340 57 L 340 105 Q 340 107, 352 107 L 375 107" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3" fill="none"/>
                    <path d="M 710 25 L 522 25 Q 510 25, 510 57 L 510 105 Q 510 107, 498 107 L 475 107" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3" fill="none"/>
                    <path d="M 140 210 L 328 210 Q 340 210, 340 198 L 340 165 Q 340 143, 352 143 L 375 143" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3" fill="none"/>
                    <path d="M 475 143 L 498 143 Q 510 143, 510 165 L 510 198 Q 510 210, 522 210 L 710 210" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3" fill="none"/>
                    <path d="M 425 150 L 425 220" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3" fill="none"/>

                    <g id="stream-pv"></g>
                    <g id="stream-bat"></g>
                    <g id="stream-grid"></g>
                    <g id="stream-load"></g>
                </svg>

                <!-- NODE 1: PV -->
                <div class="absolute top-2 left-[4%] sm:left-[6%] flex items-center gap-2 z-10">
                    <div class="flex flex-col items-center text-center">
                        <div id="card-pv" title="Nhấp bật/tắt PV" class="cursor-pointer node-card bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center hover:shadow-md hover:border-amber-400">
                            <i id="topo-pv-icon" class="fa-solid fa-solar-panel text-2xl sm:text-3xl text-slate-400 transition-transform"></i>
                            <span class="text-[10px] sm:text-xs font-semibold text-slate-600 mt-1 truncate">Pin mặt trời</span>
                        </div>
                        <div class="mt-1 font-mono text-center">
                            <div id="topo-pv-total-watts" class="font-bold text-slate-400 text-xs sm:text-sm leading-tight">-- W</div>
                            <div class="text-[8px] sm:text-[9px] text-slate-400 leading-tight mt-0.5">Công suất phát</div>
                        </div>
                    </div>
                    <div id="pv-info-box" class="font-mono text-left bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg border border-slate-200/85 shadow-2xs self-start mt-1">
                        <div class="text-[8px] sm:text-[9px] text-slate-500 leading-tight space-y-0.5">
                            <div>PV1: <span id="topo-pv1-watts" class="font-semibold text-slate-700">--W</span> (<span id="topo-pv1-volts">--V</span>)</div>
                            <div>PV2: <span id="topo-pv2-watts" class="font-semibold text-slate-600">--W</span> (<span id="topo-pv2-volts">--V</span>)</div>
                        </div>
                    </div>
                </div>

                <!-- NODE 2: Grid -->
                <div class="absolute top-2 right-[4%] sm:right-[6%] flex items-center flex-row-reverse gap-2 z-10">
                    <div class="flex flex-col items-center text-center">
                        <div id="card-grid" title="Nhấp đổi chế độ Lưới" class="cursor-pointer node-card bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center hover:shadow-md hover:border-sky-400">
                            <i id="topo-grid-icon" class="fa-solid fa-tower-cell text-2xl sm:text-3xl text-slate-400 transition-transform"></i>
                            <span class="text-[10px] sm:text-xs font-semibold text-slate-600 mt-1 truncate">Hòa lưới</span>
                        </div>
                        <div class="mt-1 font-mono text-center">
                            <div id="topo-grid-watts" class="font-bold text-slate-400 text-xs sm:text-sm leading-tight">-- W</div>
                            <div class="text-[8px] sm:text-[9px] text-slate-400 leading-tight mt-0.5"><span id="topo-grid-volts">-- V</span> | <span id="topo-grid-freq">-- Hz</span></div>
                        </div>
                    </div>
                </div>

                <!-- NODE 3: Inverter -->
                <div class="absolute top-[48%] -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center z-25">
                    <svg class="w-20 h-22 sm:w-24 sm:h-26 md:w-28 md:h-30 drop-shadow-md transition-transform duration-300" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="15" y="6" width="70" height="86" rx="10" fill="#E2EEF9" stroke="#1E293B" stroke-width="3.5"/>
                        <line x1="15" y1="62" x2="85" y2="62" stroke="#1E293B" stroke-width="3"/>
                        <rect x="34" y="16" width="32" height="24" rx="4" fill="#0284C7" stroke="#1E293B" stroke-width="3"/>
                        <rect x="39" y="21" width="22" height="14" rx="2" fill="#38BDF8" class="animate-pulse"/>
                        <text x="50" y="78" text-anchor="middle" fill="#64748B" font-size="11" font-family="monospace" font-weight="bold" letter-spacing="2">ECO</text>
                    </svg>
                </div>

                <!-- NODE 4: Battery -->
                <div class="absolute bottom-2 left-[4%] sm:left-[6%] flex items-center gap-2 z-10">
                    <div class="flex flex-col items-center text-center">
                        <div id="card-bat" title="Nhấp chuyển Sạc/Xả pin" class="cursor-pointer node-card bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center relative hover:shadow-md hover:border-emerald-400">
                            <i id="topo-bat-icon" class="fa-solid fa-battery-half text-3xl sm:text-4xl text-slate-400 transition-transform"></i>
                            <span class="text-[10px] sm:text-xs font-semibold text-slate-600 mt-1 truncate">Pin lưu trữ</span>
                        </div>
                        <div class="mt-1 font-mono text-center">
                            <div id="topo-bat-watts" class="font-bold text-slate-400 text-xs sm:text-sm leading-tight">-- W</div>
                            <div class="text-[8px] sm:text-[9px] text-slate-400 leading-tight mt-0.5">SOC: <span id="topo-bat-soc" class="font-semibold text-slate-500">--%</span> | <span id="topo-bat-volts">-- Vdc</span></div>
                        </div>
                    </div>
                </div>

                <!-- NODE 5: EPS -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div id="topo-eps-box" class="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm transition-all">
                        <i id="topo-eps-icon" class="fa-solid fa-plug-circle-bolt text-slate-400 text-xl transition-all"></i>
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">Tải dự phòng (EPS)</span>
                    <span id="topo-eps-watts" class="font-bold text-slate-400 text-xs font-mono">0 W</span>
                </div>

                <!-- NODE 6: Load -->
                <div class="absolute bottom-2 right-[4%] sm:right-[6%] flex items-center flex-row-reverse gap-2 z-10">
                    <div class="flex flex-col items-center text-center">
                        <div id="card-load" class="cursor-pointer node-card bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-400">
                            <i id="topo-load-icon" class="fa-solid fa-house-chimney text-2xl sm:text-3xl text-slate-400 transition-transform"></i>
                            <span class="text-[10px] sm:text-xs font-semibold text-slate-600 mt-1 truncate">Tải</span>
                        </div>
                        <div class="mt-1 font-mono text-center">
                            <div id="topo-load-watts" class="font-bold text-slate-400 text-xs sm:text-sm leading-tight">-- W</div>
                            <div class="text-[8px] sm:text-[9px] text-slate-400 leading-tight mt-0.5">Công suất tiêu thụ</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span class="flex items-center gap-1"><i class="fa-regular fa-clock text-slate-400"></i> Cập nhật lần cuối: <strong id="last-updated-time" class="text-slate-400">--</strong></span>
                <span id="connection-status-footer" class="text-slate-400 font-semibold text-[9px]">Status: Disconnected</span>
            </div>
        </div>

<div class="grid grid-cols-2 gap-2 sm:gap-2.5">
    <!-- Card 1: Chế độ đang chạy (Working Mode) -->
    <div class="bg-white rounded-xl p-2.5 sm:p-3 shadow-2xs border border-slate-200 flex flex-col justify-between">
        <div class="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-sliders text-xs"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-xs sm:text-sm truncate">Chế độ đang chạy</h4>
            </div>
            <!-- Thêm active:scale-95 để tạo hiệu ứng nảy nhẹ khi bấm và nhả ra mất luôn -->
            <button onclick="openSettingsModal()" class="w-8 h-8 -mr-1.5 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-transform cursor-pointer">
                <i class="fa-solid fa-sliders text-xs"></i>
            </button>
        </div>
        <div class="space-y-0.5 py-0.5">
            <div class="text-emerald-600 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span id="mode-primary-title">Hòa lưới</span>
            </div>
            <div id="mode-secondary-desc" class="text-[11px] text-slate-500 font-medium truncate">
                Chế độ tự tiêu thụ (Self-consumption mode)
            </div>
        </div>
        <div class="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono">
            <span id="mode-priority-text" class="truncate">Ưu tiên: Tải > Pin > Lưới</span>
            <span id="mode-badge-text" class="text-emerald-600 font-semibold shrink-0">Tối ưu</span>
        </div>
    </div>

    <!-- Card 2: Nhật ký / Cảnh báo (System Logs & Alarms) -->
    <div id="alarm-card" class="bg-white rounded-xl p-2.5 sm:p-3 shadow-2xs border border-slate-200 flex flex-col justify-between transition-colors">
        <div class="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <div class="flex items-center gap-1.5">
                <div id="alarm-icon-bg" class="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-clipboard-list text-xs"></i>
                </div>
                <div class="flex items-center gap-1">
                    <h4 class="font-bold text-slate-800 text-xs sm:text-sm">Nhật ký</h4>
                    <span onclick="alert('Nhật ký ghi nhận các cảnh báo và sự kiện vận hành hệ thống')" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-transform cursor-pointer">
                        <i class="fa-regular fa-circle-question text-xs"></i>
                    </span>
                </div>
            </div>
            <button onclick="openErrorModal()" class="w-8 h-8 -mr-1.5 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-transform cursor-pointer">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>

        </div>
        
        <!-- Khu vực hiển thị tên lỗi -->
        <div id="log-status-container" class="py-1 flex items-center gap-1.5 text-xs text-slate-600">
            <i id="alarm-status-icon" class="fa-solid fa-circle-check text-emerald-500 text-sm shrink-0"></i>
            <span id="alarm-text" class="font-medium text-slate-700 text-[11px] sm:text-xs truncate">Hiện tại không có cảnh báo</span>
        </div>

        <!-- Khu vực hiển thị giá trị thô và trạng thái -->
        <div class="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono">
            <span>Mã lỗi (Dec): <strong id="alarm-code" class="text-slate-600">0</strong></span>
            <span id="alarm-badge" class="text-emerald-600 font-semibold">Bình thường</span>
        </div>
    </div>
</div>

        <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div class="flex flex-wrap items-center justify-between mb-3 gap-2">
                <h2 class="text-base font-bold text-gray-800">Input & Output Power (Biểu đồ công suất ngày)</h2>
                <div class="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm">
                    <button onclick="changeDay(-1)" class="text-gray-500 hover:text-gray-800"><i class="fa-solid fa-chevron-left"></i></button>
                    <span id="current-day-label" onclick="openQuickSelectModal('day')" class="font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition" title="Bấm để chọn nhanh ngày">Ngày 13 thg 9, 2026</span>
                    <button onclick="changeDay(1)" class="text-gray-500 hover:text-gray-800"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
            <div class="relative w-full h-64">
                <canvas id="dailyPowerChart"></canvas>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div class="flex flex-wrap items-center justify-between mb-3 gap-2">
                <h2 class="text-base font-bold text-gray-800" id="energy-chart-title">Energy Overview (Năng lượng tháng)</h2>
                <div class="flex items-center space-x-3">
                    <div class="inline-flex rounded-lg bg-gray-100 p-0.5 text-xs font-medium">
                        <button id="btn-tab-month" onclick="switchEnergyMode('month')" class="px-3 py-1.5 rounded-md bg-white text-blue-600 shadow-sm transition">Tháng</button>
                        <button id="btn-tab-year" onclick="switchEnergyMode('year')" class="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 transition">Năm</button>
                    </div>
                    <div class="flex items-center space-x-1 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                        <button onclick="changeEnergyPeriod(-1)" class="text-gray-500 hover:text-gray-800 p-1"><i class="fa-solid fa-chevron-left"></i></button>
                        <span id="energy-period-label" onclick="openQuickSelectModal()" class="font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition" title="Bấm để chọn nhanh thời gian">2026-09</span>
                        <button onclick="changeEnergyPeriod(1)" class="text-gray-500 hover:text-gray-800 p-1"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
            <div class="relative w-full h-64">
                <canvas id="energyOverviewChart"></canvas>
            </div>
        </div>
    </main>
    <div id="notification-modal" class="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center hidden">
        <div class="bg-white rounded-xl p-4 max-w-sm w-full mx-4 shadow-xl border border-slate-200 text-center space-y-3">
            <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto text-lg">
                <i class="fa-solid fa-circle-info"></i>
            </div>
            <h4 class="font-bold text-slate-800 text-sm">Thông báo hệ thống</h4>
            <p id="modal-message-text" class="text-xs text-slate-600"></p>
            <button onclick="closeNotification()" class="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer">
                Đóng
            </button>
        </div>
    </div>
<!-- Modal Lịch sử cảnh báo (Giao diện Dark Mode & Căn giữa màn hình) -->
<div id="errorModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-800 w-full sm:max-w-lg rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header Modal -->
        <div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-800/50">
                    <i class="fa-solid fa-clipboard-list text-xs"></i>
                </div>
                <div>
                    <h3 class="font-bold text-slate-100 text-sm">Lịch sử cảnh báo hệ thống</h3>
                    <p class="text-[11px] text-slate-400" id="total-error-sub">Tổng số: đang tải...</p>
                </div>
            </div>
            <button onclick="closeErrorModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </div>

        <!-- Body Danh sách lỗi -->
        <div class="p-4 overflow-y-auto space-y-2.5 flex-1 bg-slate-950/50" id="error-list-container">
            <!-- Dữ liệu từ API sẽ được đổ vào đây bằng Javascript -->
            <div class="text-center py-8 text-slate-500 text-xs">Đang tải dữ liệu lịch sử...</div>
        </div>

        <!-- Footer Modal -->
        <div class="p-3 border-t border-slate-800 bg-slate-900 flex justify-end">
            <button onclick="closeErrorModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
                Đóng
            </button>
        </div>
    </div>
</div>

<!-- Modal Container -->
<div id="settingsModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-800 w-full sm:max-w-lg rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header Modal -->
        <div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 shrink-0">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
                    <i class="fa-solid fa-sliders text-xs"></i>
                </div>
                <div>
                    <h3 class="font-bold text-slate-100 text-sm">Cài đặt hệ thống</h3>
                    <p class="text-[11px] text-slate-400">Cấu hình thông số và chế độ vận hành Inverter</p>
                </div>
            </div>
            <button onclick="closeSettingsModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </div>

        <!-- Body Danh sách cấu hình -->
        <div class="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-950/50 text-xs text-slate-300">
            
            <!-- Nhóm: Cài đặt hệ thống -->
            <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">Cài đặt hệ thống</div>
            
            <!-- 1. Chế độ hoạt động (Thanh ghi 2100) -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden transition-all">
                <div onclick="toggleAccordionMenu('workModeSection')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-colors">
                    <div>
                        <div class="font-bold text-slate-200 text-xs">Chế độ hoạt động</div>
                        <div class="text-[11px] text-slate-400 mt-0.5">Chọn logic hoạt động cho Inverter</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span id="text_reg_2100" class="text-emerald-400 font-medium text-[11px]">Đang tải...</span>
                        <i id="icon_workModeSection" class="fa-solid fa-chevron-right text-[10px] text-slate-500 transition-transform duration-200"></i>
                    </div>
                </div>
            
                <div id="workModeSection" class="hidden p-3 bg-slate-950/60 border-t border-slate-800/60 space-y-1.5">
                    <label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer">
                        <span class="text-slate-200">Chế độ tự tiêu thụ</span>
                        <input type="radio" name="reg_2100" value="0" class="accent-emerald-500" onchange="writeRegister('2100', this.value)">
                    </label>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer">
                        <span class="text-slate-200">Chế độ ưu tiên phát lưới điện</span>
                        <input type="radio" name="reg_2100" value="1" class="accent-emerald-500" onchange="writeRegister('2100', this.value)">
                    </label>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer">
                        <span class="text-slate-200">Chế độ dự phòng</span>
                        <input type="radio" name="reg_2100" value="2" class="accent-emerald-500" onchange="writeRegister('2100', this.value)">
                    </label>
                </div>
            </div>

            <!-- Nhóm: Điều khiển theo thời gian -->
            <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1 pt-1">Điều khiển theo thời gian</div>

            <!-- 2. Kiểm soát theo thời gian (Thanh ghi 2101) -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold text-slate-200 text-xs">Kiểm soát theo thời gian</div>
                        <div class="text-[11px] text-slate-400 mt-0.5">Lịch trình sạc/xả pin lưu trữ</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="reg_2101" class="sr-only peer" onchange="writeRegister('2101', this.checked ? 1 : 0)">
                        <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>
            </div>

<!-- Nhóm: Cấu hình tính năng -->
            <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1 pt-1">Cấu hình tính năng</div>

            <!-- 3. GEN / Máy phát điện (Thanh ghi 2102) -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden transition-all">
                <div onclick="toggleAccordionMenu('genModeSection')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-colors">
                    <div>
                        <div class="font-bold text-slate-200 text-xs">GEN (Máy phát điện)</div>
                        <div class="text-[11px] text-slate-400 mt-0.5">Cài đặt chức năng cổng GEN</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span id="text_reg_2102" class="text-slate-400 font-medium text-[11px]">Đang tải...</span>
                        <i id="icon_genModeSection" class="fa-solid fa-chevron-right text-[10px] text-slate-500 transition-transform duration-200"></i>
                    </div>
                </div>

                <div id="genModeSection" class="hidden p-3 bg-slate-950/60 border-t border-slate-800/60 space-y-1.5">
                    <label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer">
                        <span class="text-slate-200">Không bật</span>
                        <input type="radio" name="reg_2102" value="0" class="accent-emerald-500" onchange="writeRegister('2102', this.value)">
                    </label>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer">
                        <span class="text-slate-200">Máy phát điện</span>
                        <input type="radio" name="reg_2102" value="1" class="accent-emerald-500" onchange="writeRegister('2102', this.value)">
                    </label>
                    <label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 cursor-pointer">
                        <span class="text-slate-200">Tải thông minh</span>
                        <input type="radio" name="reg_2102" value="2" class="accent-emerald-500" onchange="writeRegister('2102', this.value)">
                    </label>
                </div>
            </div>

            <!-- 4. Song song -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                <div>
                    <div class="font-bold text-slate-200 text-xs">Chế độ song song</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">Cài đặt hoạt động song song các inverter</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="reg_2103" class="sr-only peer" onchange="writeRegister('reg_2013', this.checked ? 1 : 0)">
                    <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <!-- 5. Giảm tải đỉnh / Cắt đỉnh -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold text-slate-200 text-xs">Cắt đỉnh (Giảm tải đỉnh)</div>
                        <div class="text-[11px] text-slate-400 mt-0.5">Quản lý giới hạn lưới điện</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="reg_2014" class="sr-only peer" onchange="writeRegister('reg_2014', this.checked ? 1 : 0)">
                        <div class="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>
                
                <div class="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <div>
                        <div class="text-slate-300 text-xs">Công suất đầu vào tối đa từ lưới điện</div>
                        <div class="text-[10px] text-slate-500">Giới hạn công suất lấy từ lưới AC</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <input type="number" id="reg_max_grid_power" class="val-edit bg-slate-800 text-emerald-400 px-2 py-1 rounded text-right w-20 text-xs border border-slate-700" onchange="writeRegister('reg_max_grid_power', this.value)">
                        <span class="text-[11px] text-slate-400">W</span>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <div class="text-slate-300 text-xs">Thời gian trễ (s)</div>
                    <div class="flex items-center gap-1.5">
                        <input type="number" id="reg_peak_delay" class="val-edit bg-slate-800 text-emerald-400 px-2 py-1 rounded text-right w-20 text-xs border border-slate-700" onchange="writeRegister('reg_peak_delay', this.value)">
                        <span class="text-[11px] text-slate-400">s</span>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <div>
                        <div class="text-slate-300 text-xs">Thời gian xả Pin lưu trữ (s)</div>
                        <div class="text-[10px] text-slate-500">Thời gian sạc để cắt đỉnh tiêu thụ</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <input type="number" id="reg_peak_discharge_time" class="val-edit bg-slate-800 text-emerald-400 px-2 py-1 rounded text-right w-20 text-xs border border-slate-700" onchange="writeRegister('reg_peak_discharge_time', this.value)">
                        <span class="text-[11px] text-slate-400">s</span>
                    </div>
                </div>
            </div>

            <!-- 6. Khác -->
            <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-3">
                <div class="font-bold text-slate-200 text-xs">Cài đặt khác</div>
                
                <div class="space-y-2 pt-1 border-t border-slate-800/60">
                    <div class="flex items-center justify-between py-1">
                        <span class="text-slate-300">Force Start-Up with PV Only</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="reg_force_pv" class="sr-only peer" onchange="writeRegister('reg_force_pv', this.checked ? 1 : 0)">
                            <div class="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div class="flex items-center justify-between py-1 border-t border-slate-800/40">
                        <span class="text-slate-300">Chuông cảnh báo</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="reg_buzzer" class="sr-only peer" onchange="writeRegister('reg_buzzer', this.checked ? 1 : 0)">
                            <div class="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div class="flex items-center justify-between py-1 border-t border-slate-800/40">
                        <span class="text-slate-300">DRM</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="reg_drm" class="sr-only peer" onchange="writeRegister('reg_drm', this.checked ? 1 : 0)">
                            <div class="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div class="flex items-center justify-between py-1 border-t border-slate-800/40">
                        <span class="text-slate-300">Chức năng ghép nối AC</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="reg_ac_couple" class="sr-only peer" onchange="writeRegister('reg_ac_couple', this.checked ? 1 : 0)">
                            <div class="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </div>

        </div>

        <!-- Footer Modal -->
        <div class="p-3 border-t border-slate-800 bg-slate-900 flex justify-end shrink-0">
            <button onclick="closeSettingsModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
                Đóng
            </button>
        </div>
    </div>
</div>


    `,
    setting: `

<!-- Container Accordion đồng bộ -->
<div class="accordion-container">

    <!-- 1. Cài đặt pin -->
    <div class="accordion-item active">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>🔋 CÀI ĐẶT PIN</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content" style="display: none;">
            <div class="accordion-inner">
                <div class="info-row">
                    <span>Thương hiệu</span>
                    <select class="val-edit" id="reg_2110" onchange="TypeBatteryMode()">
                        <option value="0"> No Battery </option>
                        <option value="1"> Lead-Acid Battery</option>
                        <option value="2"> PYLON </option>
                        <option value="3"> Dyness </option>
                        <option value="4"> UZ </option>
                        <option value="5"> Lithium Battery (Without COMM) </option>
                        <option value="6"> PrimeVOLT_LV </option>
                        <option value="7"> Lithium-LV </option>
                    </select>
                </div>
                <div class="info-row">
                    <span>Quản lý dung lượng</span>
                    <select class="val-edit" id="reg_2124" onchange="toggleCapacityMode()">
                        <option value="0">SOC (%)</option>
                        <option value="1">Voltage (V)</option>
                    </select>
                </div>
                <div class="info-row">
                    <span>Dung lượng <span class="unit">(Ah)</span></span>
                    <input type="number" id="reg_2112" class="val-edit" value="---">
                </div>
                <div class="group-soc-settings">
                    <div class="info-row">
                        <span>Điểm dừng xả (SOC) <span class="unit">(%)</span></span>
                        <input type="number" id="reg_211B" class="val-edit" value="---" oninput="syncVoltageDisplay()">
                    </div>
                    <div class="info-row">
                        <span>Điểm dừng sạc (SOC) <span class="unit">(%)</span></span>
                        <input type="number" id="reg_2119" class="val-edit" value="---" oninput="syncVoltageDisplay()">
                    </div>
                    <div class="info-row">
                        <span>Điểm kết nối lại pin khi mất lưới (SOC) <span class="unit">(%)</span></span>
                        <input type="number" id="reg_2186" class="val-edit" value="---" oninput="syncVoltageDisplay()">
                    </div>
                    <div class="info-row">
                        <span>Xả/Sạc <span class="unit">(%)</span></span>
                        <div style="display:flex; align-items:center;">
                            <input type="number" id="display_soc_low" class="val-edit" style="width:45px" value="---" readonly>
                            <span style="margin:0 5px">-</span>
                            <input type="number" id="display_soc_high" class="val-edit" style="width:45px" value="---" readonly>
                        </div>
                    </div>
                </div>
                <div class="group-volt-settings" style="display:none;">
                    <div id="lead_acid_params" style="display:none;">
                        <div class="info-row">
                            <span>Điện áp sạc duy trì <span class="unit">(V)</span></span>
                            <input type="number" id="reg_2180" step="0.1" class="val-edit" value="---">
                        </div>
                        <div class="info-row">
                            <span>Điện áp sạc hấp thụ <span class="unit">(V)</span></span>
                            <input type="number" id="reg_2181" step="0.1" class="val-edit" value="---">
                        </div>
                        <div class="info-row">
                            <span>Điện trở trong <span class="unit">(mΩ)</span></span>
                            <input type="number" id="reg_214F" class="val-edit" value="---">
                        </div>
                        <div class="info-row">
                            <span>Thời gian hấp thụ <span class="unit">(m)</span></span>
                            <input type="number" id="reg_2605" class="val-edit" value="---">
                        </div>
                    </div>
                    <div id="pylon_params" style="display:none;">
                        <div class="info-row">
                            <span>Điện áp ngắt xả <span class="unit">(V)</span></span>
                            <input type="number" id="reg_2113" step="0.1" class="val-edit" value="---" oninput="syncVoltageDisplay()">
                        </div>
                        <div class="info-row">
                            <span>Điện áp ngắt sạc <span class="unit">(V)</span></span>
                            <input type="number" id="reg_2114" step="0.1" class="val-edit" value="---" oninput="syncVoltageDisplay()">
                        </div>
                        <div class="info-row">
                            <span>Điện áp kết nối lại pin khi mất lưới <span class="unit">(V)</span></span>
                            <input type="number" id="reg_212F" step="0.1" class="val-edit" value="---" oninput="syncVoltageDisplay()">
                        </div>
                    </div>
                    <div class="info-row">
                        <span>Xả/Sạc <span class="unit">(V)</span></span>
                        <div style="display:flex; align-items:center;">
                            <input type="number" id="display_2113" class="val-edit" style="width:45px" value="---" readonly>
                            <span style="margin:0 5px">-</span>
                            <input type="number" id="display_2114" class="val-edit" style="width:45px" value="---" readonly>
                        </div>
                    </div>
                </div>
                <div class="info-row">
                    <span>CS Sạc tối đa <span class="unit">(W)</span></span>
                    <input type="number" id="reg_2118" class="val-edit" value="---">
                </div>
                <div class="info-row">
                    <span>CS Xả tối đa <span class="unit">(W)</span></span>
                    <input type="number" id="reg_211A" class="val-edit" value="---">
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Cân bằng pin (EQ) -->
    <div class="accordion-item" id="group_eq_settings" style="display:none;">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>⚖️ CÂN BẰNG PIN (EQ)</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content">
            <div class="accordion-inner">
                <div class="info-row">
                    <span>Áp cân bằng EQ <span class="unit">(V)</span></span>
                    <input type="number" step="0.1" class="val-edit" value="---">
                </div>
                <div class="info-row">
                    <span>Thời gian EQ <span class="unit">(min)</span></span>
                    <input type="number" class="val-edit" value="---">
                </div>
                <div class="info-row">
                    <span>Thời gian tối đa được phép thử cân bằng EQ <span class="unit">(min)</span></span>
                    <input type="number" class="val-edit" value="---">
                </div>
                <div class="info-row">
                    <span>Số ngày giữa các lần sạc EQ tự động <span class="unit">(Day)</span></span>
                    <input type="number" class="val-edit" value="---">
                </div>
                <div class="info-row">
                    <span>Cưỡng chế EQ ngay</span>
                    <div class="switch" onclick="toggleSwitch(this)"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Sạc từ lưới điện -->
    <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>🔌 SẠC TỪ LƯỚI ĐIỆN</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content">
            <div class="accordion-inner">
                <div class="info-row">
                    <span>Cho phép sạc lưới</span>
                    <div class="switch" id="reg_2115" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>CS sạc lưới tối đa <span class="unit">(W)</span></span>
                    <input type="number" id="reg_2116" class="val-edit" value="---">
                </div>
                <div class="group-soc-charge">
                    <div class="info-row">
                        <span>SOC dừng sạc lưới <span class="unit">(%)</span></span>
                        <input type="number" id="reg_2117" class="val-edit" value="---">
                    </div>
                </div>
                <div class="group-volt-charge" style="display:none;">
                    <div class="info-row">
                        <span>Áp pin dừng sạc lưới <span class="unit">(V)</span></span>
                        <input type="number" id="reg_2148" step="0.1" class="val-edit" value="---">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 4. Cài đặt xả pin -->
    <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>⚡ CÀI ĐẶT XẢ PIN</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content">
            <div class="accordion-inner">
                <div class="group-soc-discharge">
                    <div class="info-row">
                        <span>SOC ngắt xả ( Có lưới ) <span class="unit">(%)</span></span>
                        <input type="number" id="reg_214A" class="val-edit" value="---">
                    </div>
                </div>
                <div class="group-volt-discharge" style="display:none;">
                    <div class="info-row">
                        <span>Áp pin ngắt xả ( Có lưới ) <span class="unit">(V)</span></span>
                        <input type="number" id="reg_214B" step="0.1" class="val-edit" value="---">
                    </div>
                </div>
                <div class="info-row">
                    <span>Xả pin đến tải</span>
                    <div class="switch" id="reg_2141" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>Xả pin lên lưới</span>
                    <div class="switch" id="reg_2149" onclick="toggleSwitch(this)"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 5. Tải dự phòng -->
    <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>💡 TẢI DỰ PHÒNG</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content">
            <div class="accordion-inner">
                <div class="info-row">
                    <span>Đầu ra dự phòng</span>
                    <div class="switch" id="reg_211C" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>Điện áp đầu ra định mức <span class="unit">(V)</span></span>
                    <input type="number" id="reg_211D" class="val-edit" value="---" step="0.1">
                </div>
                <div class="info-row">
                    <span>Tối đa điện áp đầu ra dự phòng <span class="unit">(V)</span></span>
                    <input type="number" id="reg_2133" class="val-edit" value="---" step="0.1">
                </div>
                <div class="info-row">
                    <span>Tối thiểu điện áp đầu ra dự phòng <span class="unit">(V)</span></span>
                    <input type="number" id="reg_2132" class="val-edit" value="---" step="0.1">
                </div>
                <div class="info-row">
                    <span>Tần số đầu ra định mức <span class="unit">(HZ)</span></span>
                    <select class="val-edit" id="reg_211E">
                        <option value="5000">50</option>
                        <option value="6000">60</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- 6. Điều khiển công suất -->
    <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>🎛️ ĐIỀU KHIỂN CÔNG SUẤT</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content">
            <div class="accordion-inner">
                <div class="info-row">
                    <span>Điều khiển công suất</span>
                    <select class="val-edit" id="reg_30B3">
                        <option value="0"> Tắt </option>
                        <option value="2"> Cảm biến CT</option>
                        <option value="3"> Công tơ điện kỹ thuật số</option>
                    </select>
                </div>
                <div class="info-row">
                    <span>Vị trí công tơ</span>
                    <select class="val-edit" id="reg_30B5">
                        <option value="0"> Phía lưới điện</option>
                        <option value="1"> Phía tải</option>
                    </select>
                </div>
                <div class="info-row">
                    <span>Hướng dòng năng lượng</span>
                    <select class="val-edit" id="reg_30B2">
                        <option value="0"> Từ lưới đến biến tần</option>
                        <option value="1"> Từ biến tần đến tải</option>
                    </select>
                </div>
                <div class="info-row">
                    <span>Phương pháp giới hạn CS</span>
                    <select class="val-edit" id="reg_3089">
                        <option value="0"> CS một pha nhỏ nhất </option>
                        <option value="1"> Tổng công suất </option>
                    </select>
                </div>
                <div class="info-row">
                    <span>CS Tối đa phát lưới <span class="unit">(W)</span></span>
                    <input type="number" id="reg_30BA" class="val-edit" value="---">
                </div>
                <div class="info-row">
                    <span>CS Tối đa nhập lưới <span class="unit">(W)</span></span>
                    <input type="number" id="reg_308E" class="val-edit" value="---">
                </div>
            </div>
        </div>
    </div>

    <!-- 7. Bảo vệ -->
    <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>🛡️ BẢO VỆ</span>
            <span class="arrow">▼</span>
        </div>
        <div class="accordion-content">
            <div class="accordion-inner">
                <div class="info-row">
                    <span>Duy trì vận hành ở điện áp thấp</span>
                    <div class="switch" id="reg_510E" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>Ngưỡng kích hoạt LVRT <span class="unit">(V)</span></span>
                    <input type="number" id="reg_5063" class="val-edit" value="---" step="0.1">
                </div>
                <div class="info-row">
                    <span>Ngưỡng kích hoạt HVRT <span class="unit">(V)</span></span>
                    <input type="number" id="reg_5064" class="val-edit" value="---" step="0.1">
                </div>
                <div class="info-row">
                    <span>Phát hiện đảo lưới điện</span>
                    <div class="switch" id="reg_5112" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>Phát hiện cách ly</span>
                    <div class="switch" id="reg_5117" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>Phát hiện dòng rò (GFCI)</span>
                    <div class="switch" id="reg_5118" onclick="toggleSwitch(this)"></div>
                </div>
                <div class="info-row">
                    <span>Điện trở cách điện PV <span class="unit">(kΩ)</span></span>
                    <input type="number" id="reg_501B" class="val-edit" value="---" step="1">
                </div>
                <div class="info-row">
                    <span>Dòng rò PV <span class="unit">(mA)</span></span>
                    <input type="number" id="reg_5110" class="val-edit" value="---" step="1">
                </div>
                <div class="info-row">
                    <span>Giảm công suất khi đạt <span class="unit">(%)</span></span>
                    <input type="number" id="reg_5104" class="val-edit" value="---" step="1">
                </div>
            </div>
        </div>
    </div>

</div>

    `,
    overview: `

    <!-- Device Subheader -->
    <div class="device-info-card">
        <div class="device-header">
            <span>🔌 SN: <span id="info-sn">--</span></span>
            <span id="info-wifi" style="font-size: 15px; color: #2563eb;">📶 --</span>
        </div>
        <div class="device-sub" id="update-time-wrap">Cập nhật lần cuối: <span id="update-time">--</span></div>
    </div>

    <!-- Accordion List -->
    <div class="accordion-container">

        <!-- 1. Các Inverter -->
        <div class="accordion-item active">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>📥 Các Inverter</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content" style="max-height: 1200px;">
                <div class="accordion-inner">
                    <div class="info-row"><span>SN</span> <b id="inv-sn">--</b></div>
                    <div class="info-row"><span>Tên Inverter</span> <b id="inv-name">--</b></div>
                    <div class="info-row"><span>Tự tiêu thụ</span> <b id="inv-self-use">--</b></div>
                    <div class="info-row"><span>Tự cung tự cấp</span> <b id="inv-self-suff">--</b></div>
                    <div class="info-row"><span>Chế độ đang chạy</span> <b id="inv-mode">--</b></div>
                    <div class="info-row"><span>Nhiệt độ Inverter</span> <b id="inv-temp">--</b></div>
                    <div class="info-row"><span>Chế độ hoạt động</span> <b>Chế độ tự tiêu thụ</b></div>
                    <div class="info-row"><span>Phiên bản phần mềm DSP</span> <b id="cnt-version">--</b></div>
                    <div class="info-row"><span>Phiên bản Slave DSP</span> <b id="csb-version">--</b></div>
                    <div class="info-row"><span>Phiên bản mạch điều khiển</span> <b id="cnt-version-2">--</b></div>
                    <div class="info-row"><span>Phiên bản module Wifi</span> <b id="wifi-version">--</b></div>
                </div>
            </div>
        </div>

        <!-- 2. Điện mặt trời (Quang điện) -->
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>⚡ Điện mặt trời (Quang điện)</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-inner">
                    <div class="info-row"><span>Tổng công suất DC</span> <b id="pv-total-dc">--</b></div>
                    <div id="pv-dynamic-strings"></div>
                    <div class="info-row" style="margin-top: 8px;"><span>Sản lượng trong ngày</span> <b id="pv-et-day">--</b></div>
                    <div class="info-row" style="margin-top: 8px;"><span>Công suất đỉnh trong ngày</span> <b id="pv-Peackpower">--</b></div>
                    <div class="info-row"><span>Tổng sản lượng</span> <b id="pv-et-total">--</b></div>
                </div>
            </div>
        </div>

        <!-- 3. Pin lưu trữ -->
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>🔋 Pin lưu trữ</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-inner" id="battery-dynamic-packs"></div>
            </div>
        </div>

        <!-- 4. BMS -->
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>🎛️ BMS</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-inner">
                    <div class="info-row"><span>Trạng thái BMS (BMS_Status)</span> <b id="bms-status">--</b></div>
                    <div class="info-row"><span>Phiên bản BMS</span> <b id="bms-ver">--</b></div>
                    <div class="info-row"><span>Giới hạn điện áp sạc</span> <b id="bms-vol-chg">--</b></div>
                    <div class="info-row"><span>Giới hạn điện áp xả</span> <b id="bms-vol-dis">--</b></div>
                    <div class="info-row"><span>Giới hạn dòng sạc</span> <b id="bms-cur-chg">--</b></div>
                    <div class="info-row"><span>Giới hạn dòng xả</span> <b id="bms-cur-dis">--</b></div>
                </div>
            </div>
        </div>

        <!-- 5. Lưới điện -->
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>🌐 Lưới điện</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-inner" id="grid-dynamic-container"></div>
            </div>
        </div>

        <!-- 6. Tải trên lưới (với CT) -->
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>🏠 Tải trên lưới (với CT)</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-inner" id="load-dynamic-container"></div>
            </div>
        </div>

        <!-- 7. Tải dự phòng (EPS) -->
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>💡 Tải dự phòng (EPS)</span>
                <span class="arrow">▶</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-inner" id="eps-dynamic-container"></div>
            </div>
        </div>

    </div>
    `
};
