/*! calendar - v0.0.1 - 2014-05-05
* https://github.com/ntesmail/calendar
* Copyright (c) 2014 ; Licensed  */
(function () {
var fc = {};

(function () {
    fc.util = {};
    fc.util.getMonthRange = getMonthRange;
    fc.util.getWeekRange = getWeekRange;
    fc.util.getDayRange = getDayRange;
    fc.util.clearTime = clearTime;
    fc.util.getDayNumber = getDayNumber;
    fc.util.isSameDay = isSameDay;
    fc.util.filterEvents = filterEvents;
    fc.util.hide = hide;
    fc.util.show = show;

    /**
     * 判断某个年份是否为闰年
     * @param {Number} year
     * @returns {Boolean}
     */
    function isLeapYear (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    /**
     * 获取某个月份的天数
     * @param {Number} month (0-11)
     * @param {Number} year (0-11)
     * @returns {Number}
     */
    function daysOfMonth (month, year) {
        var bigMonth = {
            0: true,
            2: true,
            4: true,
            6: true,
            7: true,
            9: true,
            11: true
        };
        if (month === 1) {
            if (year !== undefined && isLeapYear(year)) {
                return 29;
            } else {
                return 28;
            }
        }
        if (bigMonth[month]) {
            return 31;
        } else {
            return 30;
        }
    }

    /**
     * 获取某一时刻所在月份起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getMonthRange(d) {
        var year = d.getFullYear(),
            month = d.getMonth();

        var start = new Date(year, month, 1);
        var end = new Date(year, month, daysOfMonth(month, year));

        setEndTime(end);

        return {start : start, end: end};
    }


    /**
     * 获取某一时刻所在周的起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getWeekRange(d){
        // 星期天开始 0 -- 6
        var day = d.getDay();

        var start = new Date(d);
        clearTime(start);

        start.setDate(d.getDate() - day);

        var end = new Date(d);
        clearTime(end);

        end.setDate(d.getDate() + (6 - day));
        setEndTime(end);

        return {start : start, end: end};
    }

    /**
     * 获取某一时刻所在日起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getDayRange(d) {
        var start = new Date(d);
        clearTime(start);

        var end = new Date(d);
        setEndTime(end);

        return {start : start, end: end};
    }

    /**
     * 设置一天的开始时间
     * @param {Date} d 日期
     */
    function clearTime(d) {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }

    /**
     * 设置一天的结束时间
     * @param {Date} d 日期
     */
    function setEndTime(d) {
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        d.setMilliseconds(999);
        return d;
    }

    /**
     * 获取某个时间对应的天的相对天数
     * @param  {Date} d 某天
     * @return {Number}  相对天数
     */
    function getDayNumber(d) {
        var day = new Date(d);
        clearTime(day);
        // 取得天数
        return Math.floor(day.getTime() / (24 * 60 * 60 * 1000));
    }

    /**
     * 是否同一天
     * @param  {Date}  d1 时间1
     * @param  {Date}  d2 时间2
     * @return {Boolean}    是否同一天
     */
    function isSameDay(d1,d2) {
        return d1.getFullYear() === d2.getFullYear() 
            && d1.getMonth() === d2.getMonth() 
            && d1.getDate() === d2.getDate();
    }

    /**
     * 过滤events
     * @param  {Array} events  事件 Event array
     * @param  {Array} filters 过滤方法 Function array
     * @return {Array}       过滤后的events
     */
    function filterEvents(events, filters){
        // 检查是否有返回false的
        if(typeof events !== 'undefined' && events.length > 0 
            && typeof filters !== 'undefined') {
            var list = [];
            for (var i = 0; i < events.length; i++) {
                var valid = true;
                for (var key in filters) {
                    if(valid) {
                        if(!filters[key](events[i])) {
                            valid = false;
                        }
                    }
                };
                if(valid) {
                    list.push(events[i]);
                }
            };
            return list;
        } else {
            return events;
        }
    }

    /**
     * 隐藏container
     * @param  {Dom} container container
     * @return {void}
     */
    function hide(container) {
        container.addClass('f-hide');
    }

    /**
     * 显示container
     * @param  {Dom} container container
     * @return {void}
     */
    function show(container) {
        container.removeClass('f-hide');
    }
})();
(function() {

    fc.Event = Event;

    /**
     * 日历事件对象
     * @param {[type]} data     [description]
     * @param {[type]} settings [description]
     */
    function Event(data, settings) {
        var id, title, start, color, type, end, repeate;
        id = data.id;
        title = data.title;
        start = data.start;
        type = data.type;
        end = data.end;
        repeate = data.repeate;
        color = data.color;

        var that = this;
        that.getId = getId;
        that.getTitle = getTitle;
        that.getStart = getStart;
        that.getEnd = getEnd;
        that.getType = getType;
        that.getColor = getColor;
        that.getRepeate = getRepeate;

        function getId() {
            return id;
        }
        function getTitle() {
            return title;
        }

        function getRepeate() {
            return repeate;
        }

        function getStart() {
            return start;
        }

        function getEnd() {
            return end;
        }

        function getType() {
            return type;
        }

        function getColor() {
            return color;
        }
    }

})();
(function () {
    // body...
    fc.EventManager = EventManager;
    function EventManager(data) {
        // 获取event的方式
        var fetchEvents = data.fetchEvents;

        var events = [];

        // public
        this.fetch = fetch;

        function fetch(start, end, defer) {
            // 是否都有了在events中
            var checkStart = fc.util.getDayNumber(start);
            var checkEnd = fc.util.getDayNumber(end);
            var needFetch = false;
            for (var i = checkStart; i <= checkEnd; i++) {
                var evts = events[i];
                if(typeof evts === 'undefined') {
                    // no cache
                    needFetch = true;
                    var defer2 = $.Deferred();
                    defer2.done(function(start, end, evts){
                        // 更新到cache
                        updateEventsCache(checkStart, checkEnd, evts);
                        // 返回event的copy
                        defer.resolve(getSubArray(checkStart, checkEnd, events));
                    });
                    defer2.fail(function(){
                        // 一样
                        defer.resolve(getSubArray(checkStart, checkEnd, events));
                    });
                    // 通过外部接口获取
                    fetchEvents(start, end, defer2);
                    return;
                }
            }

            // 都在缓存里面
            defer.resolve(getSubArray(checkStart, checkEnd, events));
        }

        function getSubArray(start, end, array) {
            var copy = [];
            for (var i = start; i <= end; i++) {
                copy[i] = array[i];
            };
            return copy;
        }

        function updateEventsCache(checkStart, checkEnd, evts) {

            for (var i = checkStart; i <= checkEnd; i++) {
                // 时间范围内的全部重置
                events[i] = [];
            }
            for (var i = 0; i < evts.length; i++) {
                var eventDay = fc.util.getDayNumber(evts[i].start);
                // 放进去event
                if(typeof events[eventDay] !== 'undefined') {
                    events[eventDay].push(new fc.Event(evts[i]));
                } else {
                    events[eventDay] = [];
                }
            };
        }   
    }
})();

(function() {

    fc.TimeBlock = TimeBlock;


    /**
     * 某一个的块
     * @param {object} date 数据
     * @param {View} view 视图
     */
    function TimeBlock(data, view) {
        var container,
            width,
            height,
            posTop,
            posLeft,
            currentDate;

        // 容器的样式
        container = $('<div class="can can-block"></div>');
        width = data.width;
        height = data.height;
        posTop = data.posTop;
        posLeft = data.posLeft;
        // 当前时间
        currentDate = data.date;

        // public
        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.getDate = getDate;
        that.isCurrentMonth = isCurrentMonth;
        that.resize = resize;
        that.destroy = destroy;
        that.getViewName = getViewName;
        that.getWidth = getWidth;
        that.getHeight = getHeight;
        // render
        that.render();
        /**
         * 获取容器
         * @return {Dom} 容器对象
         */
        function getContainer() {
            return container;
        }

        /**
         * 获取容器
         * @return {Date} 当前日期对象
         */
        function getDate() {
            return currentDate;
        }

        /**
         * 获取view name
         * @return {string} viewname
         */
        function getViewName () {
            return view.getViewName();
        }

        /**
         * 获取宽度
         * @return {string} width
         */
        function getWidth() {
            return width;
        }

        /**
         * 获取高度
         * @return {string} height
         */
        function getHeight () {
            return height;
        }
        /**
         * 是否当月
         * @return {Boolean} 是否当月
         */
        function isCurrentMonth () {
            return view.getCurrentMonth() === currentDate.getMonth();
        }

        /**
         * 生成ui
         * @return {void}
         */
        function render() {
            resize(data.width, data.height, data.posTop, data.posLeft);
            if(fc.util.isSameDay(currentDate, new Date())) {
                container.addClass('can-crt');
            }
        }

        /**
         * 销毁
         * @return {void}
         */
        function destroy() {
            container = null;
        }
        /**
         * resize
         * @param  {Number} _width  宽度
         * @param  {Number} _height 高度
         * @param  {Number} _top    上
         * @param  {Number} _left   左定位
         * @return {void}
         */
        function resize(_width, _height, _top, _left) {
            width = _width;
            height = _height;
            posTop = _top;
            posLeft = _left;
            // 重新renderUI
            container.css({
                width: width,
                height: height,
                top: posTop,
                left: posLeft
            });
        }
    }

})();
(function() {

    fc.MonthView = MonthView;

    var viewName = 'month';

    /**
     * 月视图
     * @param {Object} data     数据相关的配置
     * @param {Object} settings 事件相关的
     * @param {Object} monthOpt 月视图配置项
     * @param {Calendar} calendar 日历对象
     */
    function MonthView(data, settings, monthOpt, calendar) {
        // 获取开始到结束时间
        var start,
            end,
            // 当前所在month
            currentMonth,
            // 当前时间
            currentDate,
            container,
            // 头部
            header,
            blockList = [],
            weekCount,
            containerWidth,
            containerHeight,
            blockWidth,
            blockHeight,
            headerHeight,
            calendar = calendar;

        // 高度宽度
        containerWidth = data.width;
        containerHeight = data.height;
        // 高度
        headerHeight = monthOpt.headerHeight;

        container = $('<div class="m-calendar m-calendar-' + viewName + '"></div>');
        // clsName
        if(typeof monthOpt.clsName === 'string') {
            container.addClass(monthOpt.clsName);
        }
        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.hide = hide;
        that.show = show;
        that.destroy = destroy;
        that.getCurrent = getCurrent;
        that.getCurrentMonth = getCurrentMonth;
        that.getNext = getNext;
        that.getPrev = getPrev;
        that.resize = resize;
        that.getViewName = getViewName;
        that.getWidth  = getWidth;
        that.getHeight = getHeight;

        /**
         * 获取宽度
         * @return {Number} 宽度
         */
        function getWidth() {
            return containerWidth;
        }

        /**
         * 获取高度
         * @return {Number} 高度
         */
        function getHeight() {
            return containerHeight;
        }

        /**
         * 获取view name
         * @return {string} viewname
         */
        function getViewName () {
            return viewName;
        }

        /**
         * 容器对象
         * @return {Dom} 容器对象
         */
        function getContainer() {
            return container;
        }

        function hide() {
            fc.util.hide(container);
        }

        function show() {
            fc.util.show(container);
        }

        function destroy() {
            // 销毁
            if(calendar.onDestroy) {
                calendar.onDestroy(that);
            }
            for (var i = 0; i < blockList.length; i++) {
                blockList[i].destroy();
            };
            blockList.length = 0;
            container.remove();
            container = null;
        }
        /**
         * 当前时间
         * @return {Date} 下个月
         */
        function getCurrent() {
            return currentDate;
        }

        /**
         * 当前月份
         * @return {Number}
         */
        function getCurrentMonth() {
            return currentMonth;
        }

        /**
         * 下个月
         * @return {Date} 下个月
         */
        function getNext() {
            var next = fc.util.getMonthRange(currentDate).start;
            next.setMonth(next.getMonth() + 1);
            return next;
        }

        /**
         * 上个月
         * @return {Date} 上个月
         */
        function getPrev() {
            var next = fc.util.getMonthRange(currentDate).start;
            next.setMonth(next.getMonth() - 1);
            return next;
        }

        function renderHeader(start) {
            // header
            // 周日到周六
            header = [];
            for (var i = 0; i < 7; i++) {
                var head = $('<div class="can can-week"></div>');
                head.css({
                    width: blockWidth,
                    height: headerHeight,
                    top: 0,
                    left: blockWidth * i
                });
                header.push(head);

                var date = new Date(start);
                date.setDate(date.getDate() + i);
                calendar.renderHeader(viewName, head, date);

                container.append(head);
            }
        }

        /**
         * 渲染视图
         * @param  {Date} date 某天
         * @return {void}
         */
        function render(date) {
            currentDate = date;
            // 获取时间的range
            var range = fc.util.getMonthRange(date);

            // 处理方格的前面和后面
            start = fc.util.getWeekRange(range.start).start;
            end = fc.util.getWeekRange(range.end).end;
            // 当前月
            currentMonth = date.getMonth();

            var endDate = fc.util.clearTime(end);
            // 周数
            weekCount = Math.ceil((endDate - start) / (7 * 24 * 60 * 60 * 1000));
            // block的高宽
            // blockWidth = Math.floor(containerWidth / 7);
            // blockHeight = Math.floor(containerHeight / weekCount);

            // 头部
            renderHeader(start);

            for (var i = 0; i < weekCount; i++) {
                // 周几
                for (var j = 0; j < 7; j++) {
                    var dayDate = new Date(start);
                    dayDate.setDate(dayDate.getDate() + i * 7 + j);
                    var dayData = {
                        // width: blockWidth,
                        // height: blockHeight,
                        // posTop: headerHeight + blockHeight * i,
                        // posLeft: blockWidth * j,
                        date: dayDate
                    };
                    var dayBlock = new fc.TimeBlock(dayData, that);

                    // 设置一下颜色等以作区别
                    if (dayDate.getMonth() !== currentMonth) {
                        // TODO
                    }
                    // 加到页面中
                    container.append(dayBlock.getContainer());

                    blockList.push(dayBlock);
                }
            }

            resize(containerWidth, containerHeight)

            // 统一添加日历事件
            // 获取的
            var defer = $.Deferred();
            defer.done(function(events) {
                for (var i = 0; i < blockList.length; i++) {
                    // 相关的事件
                    var dayBlock = blockList[i];
                    var dayDate = dayBlock.getDate();

                    var dayKey = fc.util.getDayNumber(dayDate);
                    calendar.renderEvents(dayBlock, events[dayKey], true);
                };
            })
            calendar.getEventManager().fetch(start, end, defer);
        }

        /**
         * resize month view.
         * @param  {Number} width  宽度
         * @param  {Number} height 高度
         * @return {void}
         */
        function resize(width, height) {
            containerWidth = width;
            containerHeight = height;
            // block的高宽
            blockWidth = containerWidth / 7;
            blockHeight = (containerHeight - headerHeight) / weekCount;

            container.css({
                width : containerWidth,
                height : containerHeight
            });

            // 头部重新定位
            for (var i = 0; i < header.length; i++) {
                header[i].css({
                    left : blockWidth * i,
                    width : blockWidth
                });
            };
             
            for (var i = 0; i < weekCount; i++) {
                // 周几
                for (var j = 0; j < 7; j++) {
                    var index = i * 7 + j;
                    blockList[index].resize(
                        blockWidth, 
                        blockHeight, 
                        headerHeight + blockHeight * i,
                        blockWidth * j
                    );
                }
            }
        }
    }


})();
(function() {

    fc.WeekView = WeekView;

    var viewName = 'week';

    /**
     * 周视图
     * @param {Object} data     数据相关的配置
     * @param {Object} settings 事件相关的
     * @param {Object} weekOpt 周视图配置项
     * @param {Calendar} calendar 日历对象
     */
    function WeekView(data, settings, weekOpt, calendar) {
        // 获取开始到结束时间
        var start,
            end,
            // 当前所在month
            currentMonth,
            currentDate,
            container,
            blockList = [],
            containerWidth,
            containerHeight,
            blockWidth,
            blockHeight,
            headerHeight,
            leftHeaderWidth,
            verticalCount,
            header,
            verticalHeader,
            calendar = calendar;

        // 高度宽度
        containerWidth = data.width;
        containerHeight = data.height;
        // 高度
        headerHeight = weekOpt.headerHeight;
        // 左侧宽度
        leftHeaderWidth = weekOpt.leftHeaderWidth;

        container = $('<div class="m-calendar m-calendar-' + viewName + '"></div>');
        // clsName
        if(typeof weekOpt.clsName === 'string') {
            container.addClass(weekOpt.clsName);
        }
        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.hide = hide;
        that.show = show;
        that.destroy = destroy;
        that.getCurrent = getCurrent;
        that.getCurrentMonth = getCurrentMonth;
        that.getNext = getNext;
        that.getPrev = getPrev;
        that.resize = resize;
        that.getViewName = getViewName;
        that.getWidth  = getWidth;
        that.getHeight = getHeight;

        /**
         * 获取宽度
         * @return {Number} 宽度
         */
        function getWidth() {
            return containerWidth;
        }

        /**
         * 获取高度
         * @return {Number} 高度
         */
        function getHeight() {
            return containerHeight;
        }

        /**
         * 获取view name
         * @return {string} viewname
         */
        function getViewName () {
            return viewName;
        }
        /**
         * 容器对象
         * @return {Dom} 容器对象
         */
        function getContainer() {
            return container;
        }

        function hide() {
            fc.util.hide(container);
        }

        function destroy() {
            // 销毁
            if(calendar.onDestroy) {
                calendar.onDestroy(that);
            }
            for (var i = 0; i < blockList.length; i++) {
                blockList[i].destroy();
            };
            blockList.length = 0;
            container.remove();
            container = null;
        }

        function show() {
            fc.util.show(container);
        }

        /**
         * 当前时间
         * @return {Date} 当前时间
         */
        function getCurrent() {
            return currentDate;
        }

        /**
         * 获取当前月份
         * @return {Number} 当前月份
         */
        function getCurrentMonth() {
            return currentMonth;
        }

        /**
         * 下个星期
         * @return {Date} 下个星期
         */
        function getNext() {
            var next = fc.util.getWeekRange(currentDate).start;
            next.setDate(next.getDate() + 7);
            return next;
        }

        /**
         * 上个星期
         * @return {Date} 上个星期
         */
        function getPrev() {
            var next = fc.util.getWeekRange(currentDate).start;
            next.setDate(next.getDate() - 7);
            return next;
        }

        function renderHeader(start, end) {
            // header
            // 周日到周六
            header = [];
            for (var i = 0; i < 7; i++) {
                var head = $('<div class="can can-week"></div>');
                head.css({
                    width: blockWidth,
                    height: headerHeight,
                    top: 0,
                    left: leftHeaderWidth + blockWidth * i
                });
                header.push(head);

                var date = new Date(start);
                date.setDate(date.getDate() + i);
                calendar.renderHeader(viewName, head, date);

                container.append(header);
            }
        }

        function renderVerticalHeader() {
            // header
            verticalHeader = [];
            var blank = $('<div class="can can-blank"></div>');
            blank.css({
                top : 0,
                left : 0,
                width : leftHeaderWidth,
                height : headerHeight
            });
            container.append(blank);

            for (var i = 0; i < 4; i++) {
                var head = $('<div class="can can-time"></div>');
                head.css({
                    width: leftHeaderWidth,
                    height: blockHeight,
                    top: headerHeight + blockHeight * i,
                    left: 0
                });
                verticalHeader.push(head);

                calendar.renderVerticalHeader(viewName, head, i);
                container.append(head);
            }
        }
        /**
         * 渲染视图
         * @param  {Date} date 某天
         * @return {void}
         */
        function render(date) {
            currentDate = date;
            // 获取时间的range
            var range = fc.util.getWeekRange(date);

            // 处理方格的前面和后面
            start = range.start;
            end = range.end;
            // 当前月
            currentMonth = date.getMonth();

            // 纵向的数量,分成四块
            verticalCount = 4;
            // block的高宽
            // blockWidth = Math.floor(containerWidth / 7);
            // blockHeight = Math.floor(containerHeight/ verticalCount);

            // 头部
            renderHeader(start, end);
            // 左侧
            renderVerticalHeader()

            for (var i = 0; i < verticalCount; i++) {
                // 周几
                for (var j = 0; j < 7; j++) {
                    var dayDate = new Date(start);
                    dayDate.setDate(dayDate.getDate() + j);
                    dayDate.setHours(i * (24 / verticalCount));
                    var dayData = {
                        // width: blockWidth,
                        // height: blockHeight,
                        // posTop: headerHeight + blockHeight * i,
                        // posLeft: leftHeaderWidth + blockWidth * j,
                        date: dayDate
                    };
                    var dayBlock = new fc.TimeBlock(dayData, that);

                    // 设置一下颜色等以作区别
                    if (dayDate.getMonth() !== currentMonth) {
                        // TODO
                    }
                    // 加到页面中
                    container.append(dayBlock.getContainer());

                    blockList.push(dayBlock);
                }
            }

            resize(containerWidth, containerHeight);

            // 统一添加日历事件
            // 获取的
            var defer = $.Deferred();
            defer.done(function(events) {

                for (var i = 0; i < blockList.length; i++) {
                    // 相关的事件
                    var block = blockList[i];
                    var dayDate = block.getDate();

                    var dayKey = fc.util.getDayNumber(dayDate);
                    // 当天的事件
                    var dayEvents = events[dayKey];

                    var sortedEvents = [];
                    if (dayEvents.length > 0) {
                        var startTime = block.getDate();
                        var endTime = new Date(startTime);
                        // 6个小时
                        endTime.setHours(endTime.getHours() + 6);
                        for (var j = 0; j < dayEvents.length; j++) {
                            var dayEvent = dayEvents[j];

                            if (dayEvent.getStart() < endTime && dayEvent.getStart() >= startTime) {
                                sortedEvents.push(dayEvent);
                            }
                        };
                    }

                    // 过滤一下events
                    calendar.renderEvents(block, sortedEvents, true);
                };
            })
            calendar.getEventManager().fetch(start, end, defer);
        }


        /**
         * resize week view.
         * @param  {Number} width  宽度
         * @param  {Number} height 高度
         * @return {void}
         */
        function resize(width, height) {
            containerWidth = width;
            containerHeight = height;

            // block的高宽
            blockWidth = (containerWidth - weekOpt.leftHeaderWidth) / 7;
            blockHeight = (containerHeight - headerHeight) / verticalCount;

            container.css({
                width : containerWidth,
                height : containerHeight
            });
            // 头部重新定位
            for (var i = 0; i < header.length; i++) {
                header[i].css({
                    left : leftHeaderWidth + blockWidth * i,
                    width : blockWidth
                });
            };

            // 左侧重新定位
            for (var i = 0; i < verticalHeader.length; i++) {
                verticalHeader[i].css({
                    top : headerHeight + blockHeight * i,
                    height : blockHeight
                });
            };
             
            for (var i = 0; i < verticalCount; i++) {
                // 周几
                for (var j = 0; j < 7; j++) {
                    var index = i * 7 + j;
                    blockList[index].resize(
                        blockWidth, 
                        blockHeight, 
                        headerHeight + blockHeight * i,
                        leftHeaderWidth + blockWidth * j
                    );
                }
            }
        }

    }



})();
(function() {

    fc.DayView = DayView;

    var viewName = 'day';
    /**
     * 日视图
     * @param {Object} data     数据相关的配置
     * @param {Object} settings 事件相关的
     * @param {Object} dayOpt 日视图配置项
     * @param {Calendar} calendar 日历对象
     */
    function DayView(data, settings, dayOpt, calendar) {
        // 获取开始到结束时间
        var start,
            end,
            currentDate,
            container,
            blockList = [],
            containerWidth,
            containerHeight,
            blockWidth,
            headerHeight,
            leftHeaderWidth,
            calendar = calendar;

        // 高度宽度
        containerWidth = data.width;
        containerHeight = data.height;
        // 高度
        headerHeight = dayOpt.headerHeight;
        // 左侧宽度
        leftHeaderWidth = dayOpt.leftHeaderWidth;

        container = $('<div class="m-calendar m-calendar-' + viewName + '"></div>');

        // clsName
        if(typeof dayOpt.clsName === 'string') {
            container.addClass(dayOpt.clsName);
        }
        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.hide = hide;
        that.show = show;
        that.destroy = destroy;
        that.getCurrent = getCurrent;
        that.getNext = getNext;
        that.getPrev = getPrev;
        that.resize = resize;
        that.getViewName = getViewName;
        that.getWidth  = getWidth;
        that.getHeight = getHeight;

        /**
         * 获取宽度
         * @return {Number} 宽度
         */
        function getWidth() {
            return containerWidth;
        }

        /**
         * 获取高度
         * @return {Number} 高度
         */
        function getHeight() {
            return container.height();
        }

        /**
         * 获取view name
         * @return {string} viewname
         */
        function getViewName () {
            return viewName;
        }
        /**
         * 容器对象
         * @return {Dom} 容器对象
         */
        function getContainer() {
            return container;
        }

        function hide() {
            fc.util.hide(container);
        }

        function show() {
            fc.util.show(container);
        }

        function destroy() {
            // 销毁
            if(calendar.onDestroy) {
                calendar.onDestroy(that);
            }
            for (var i = 0; i < blockList.length; i++) {
                blockList[i].destroy();
            };
            blockList.length = 0;
            container.remove();
            container = null;
        }
        /**
         * 当前时间
         * @return {Date} 当前时间
         */
        function getCurrent() {
            return currentDate;
        }

        /**
         * 下一天
         * @return {Date} 下一天
         */
        function getNext() {
            var next = new Date(currentDate);
            next.setDate(next.getDate() + 1);
            return next;
        }

        /**
         * 上一天
         * @return {Date} 上一天
         */
        function getPrev() {
            var next = new Date(currentDate);
            next.setDate(next.getDate() - 1);
            return next;
        }


        /**
         * 渲染视图
         * @param  {Date} date 某天
         * @return {void}
         */
        function render(date) {
            currentDate = date;
            // 获取时间的range
            var range = fc.util.getDayRange(date);

            // 处理方格的前面和后面
            start = range.start;
            end = range.end;

            // 纵向的数量,分成四块
            var verticalCount = 4;
            // block的高宽
            // blockWidth = data.width;

            var defer = $.Deferred();
            defer.done(function(events) {
                // 当前天
                var dayKey = fc.util.getDayNumber(currentDate);
                var dayEvents = events[dayKey];
                if (typeof dayEvents !== 'undefined' && dayEvents.length > 0) {
                    // 先按时间进行排序处理
                    dayEvents.sort(function(x, y) {
                        return x.getStart() - y.getStart();
                    });
                    // 合并时间相同的项
                    var sortedEvents = {};
                    for (var i = 0; i < dayEvents.length; i++) {
                        var dayEvent = dayEvents[i];
                        if (sortedEvents[dayEvent.getStart()]) {
                            sortedEvents[dayEvent.getStart()].push(dayEvent);
                        } else {
                            sortedEvents[dayEvent.getStart()] = [dayEvent];
                        }
                    }

                    // 显示所有事件
                    for (var eventKey in sortedEvents) {
                        var showEvents = fc.util.filterEvents(sortedEvents[eventKey], calendar.getFilters());

                        if(showEvents.length > 0) {
                            // 事件时间
                            var dayData = {
                                // width: blockWidth,
                                date: showEvents[0].getStart()
                            };
                            // 这个block是否显示跟里面的events数量相关
                            var block = new fc.TimeBlock(dayData, that);
                            blockList.push(block);
                            // 事件，不需要filter
                            calendar.renderEvents(block, showEvents, false);
                            var min = dayData.date.getMinutes();
                            var showTime = dayData.date.getHours() + ':' + (min >= 10 ? min : '0' + min);
                            // 加到页面中
                            var time = 
                                $('<div class="can can-time">' +
                                    '<span class="w-time">' + showTime + '</span>' +
                                '</div>');
                            container.append(time);
                            container.append(block.getContainer());
                        }
                    };

                    resize(containerWidth, containerHeight);
                } else {
                    // 没有数据的时候
                    // 这个block是否显示跟里面的events数量相关
                    var block = new fc.TimeBlock({date : currentDate}, that);
                    blockList.push(block);
                    // 加到页面中
                    var time = $('<div class="can can-time"></div>');
                    container.append(time);
                    container.append(block.getContainer());
                    // 事件，不需要filter
                    calendar.renderEvents(block, [], false);
                    resize(containerWidth, containerHeight);
                }
            });
            calendar.getEventManager().fetch(start, end, defer);
        }

        /**
         * resize week view.
         * @param  {Number} width  宽度
         * @param  {Number} height 高度
         * @return {void}
         */
        function resize(width, height) {
            containerWidth = width;
            containerHeight = height;
            // block的高宽
            container.css({
                width : containerWidth
            });
            for (var i = 0; i < blockList.length; i++) {
                // 周几
                blockList[i].resize(
                    containerWidth - leftHeaderWidth - 1
                );
            }
        }
    }


})();
(function() {

    fc.Calendar = Calendar;

    /**
     * 日历
     * @param {[type]} data     数据
     *                          {Number} width
     *                          {Number} height
     *                          {String} defaultView
     *                          {String} clsName
     *                          {long, Date} date 默认时间
     *                          {object} monthOpt
     *                              {Number} monthOpt.headerHeight header高度
     *                              {String} monthOpt.clsName class扩展名称
     *                          {object} weekOpt
     *                              {Number} weekOpt.headerHeight header高度
     *                              {Number} weekOpt.leftHeaderWidth 左侧导航宽度
     *                              {String} weekOpt.clsName class扩展名称
     *                          {object} dayOpt
     *                              {Number} dayOpt.headerHeight header高度
     *                              {Number} dayOpt.leftHeaderWidth 左侧导航宽度
     *                              {String} dayOpt.clsName class扩展名称
     *
     * @param {[type]} settings 设置
     *                          {function} windowResize 窗口resize的时候
     *                          {function} fetchEvents
     *                              function (start, end, defer)  开始时间，结束时间，defer返回
     *                          {function} onRenderHeader
     *                              function(viewName, headBlock, date) view名称，block，时间
     *                          {function} onRenderVerticalHeader
     *                              function(viewName, headBlock, index) view名称，block，位置
     *                          {function} onRenderEvents
     *                              function(timeBlock, showEvents) block 事件
     *                          {function} onViewChanged
     *                              function(view) 视图切换了
     *                          {function} onSizeChanged
     *                              function(width,height) 视图大小切换了
     */
    function Calendar(data, settings) {
        var events,
            // 容器，shark.Container
            container = $('<div class="js-calendar-container"></div>'),
            // 名称 month,week,day
            defaultView = data.defaultView || 'month',
            // 当前视图
            currentViewName,
            // 当前时间
            currentDate,
            // 当前视图对象
            currentView,
            // 当前filters
            currentFilters = data.filters,
            // renderEvents
            onRenderEvents = settings.onRenderEvents,
            // render header
            onRenderHeader = settings.onRenderHeader,
            // change view
            onViewChanged = settings.onViewChanged,
            // render vertical header
            onRenderVerticalHeader = settings.onRenderVerticalHeader,
            // ondestroy
            onDestroy = settings.onDestroy,
            // on size changed
            onSizeChanged = settings.onSizeChanged,
            // event缓存管理
            eventManager,
            resizeTimeout;
        // 月视图的配置
        var monthOpt = {
            headerHeight: 20
        };
        // 周视图的配置
        var weekOpt = {
            headerHeight: 20,
            // 左侧宽度
            leftHeaderWidth: 100
        };
        // 日视图的配置
        var dayOpt = {
            headerHeight: 20,
            // 左侧宽度
            leftHeaderWidth: 100
        };

        // 月视图配置
        if(typeof data.monthOpt === 'object') {
            monthOpt = $.extend(monthOpt, data.monthOpt);
        }
        // 周视图配置
        if(typeof data.weekOpt === 'object') {
            weekOpt = $.extend(weekOpt, data.weekOpt);
        }
        // 日视图配置
        if(typeof data.dayOpt === 'object') {
            dayOpt = $.extend(dayOpt, data.dayOpt);
        }

        // 加上clsName
        if(typeof data.clsName === 'string') {
            container.addClass(data.clsName)
        }

        if(typeof data.date !== 'undefined') {
            currentDate = new Date(data.date);
        }

        var that = this;
        // public
        that.render = render;
        that.getContainer = getContainer;
        that.getEventManager = getEventManager;
        that.refresh = refresh;
        that.prev = prev;
        that.next = next;
        that.goDate = goDate;
        that.changeView = changeView;
        that.changeFilters = changeFilters;
        that.getFilters = getFilters;
        that.resize = resize;
        // render
        that.renderEvents = renderEvents;
        // render header
        that.renderHeader = renderHeader;
        // render vertical header
        that.renderVerticalHeader = renderVerticalHeader;
        // 销毁
        that.onDestroy = onDestroy;
        that.getWidth  = getWidth;
        that.getHeight = getHeight;

        // render
        that.render();
        /**
         * 获取宽度
         * @return {Number} 宽度
         */
        function getWidth() {
            return currentView.getWidth();
        }

        /**
         * 获取高度
         * @return {Number} 高度
         */
        function getHeight() {
            return currentView.getHeight();
        }

        /**
         * 生成ui
         * @return {void}
         */
        function render() {
            eventManager = new fc.EventManager({
                fetchEvents: settings.fetchEvents
            });
            // 初始化
            // 默认view
            renderView(defaultView, currentDate);
        }

        /**
         * 获取这个eventManger
         * @return {EventManager} eventManager
         */
        function getEventManager() {
            return eventManager;
        }

        function getContainer() {
            return container;
        }

        /**
         * 使用当前时间，当前视图，只刷新数据
         * @return {void}
         */
        function refresh() {
            eventManager = new fc.EventManager({
                fetchEvents: settings.fetchEvents
            });
            renderView(currentViewName, currentDate);
        }

        /**
         * 下一个
         * @return {Date} 下一个
         */
        function next() {
            var day = currentView.getNext();
            // 新视图
            renderView(currentViewName, day);
            return day;
        }

        /**
         * 前一个
         * @return {Date} 前一个
         */
        function prev() {
            var day = currentView.getPrev();
            // 新视图
            renderView(currentViewName, day);
            return day;
        }

        /**
         * 跳到某一天
         * @param  {string} viewName 视图名称
         * @param  {Date} day 跳到某天
         * @return {void}
         */
        function goDate(viewName, day) {
             renderView(viewName, day);
        }

        /**
         * 切换视图
         * @param  {string} viewName 视图名称
         * @return {void}
         */
        function changeView(viewName) {
            if (currentViewName !== viewName) {
                // 切换视图
                renderView(viewName);
            }
        }

        /**
         * 改变过滤条件
         * @param  {object} filters 过滤条件
         * @return {void}
         */
        function changeFilters(filters) {
            // 更换了filter
            currentFilters = filters;
            // 切换视图
            renderView(currentViewName, currentDate);
        }

        /**
         * 获取filters
         * @return {object} filters
         */
        function getFilters() {
            return currentFilters;
        }

        /**
         * render
         * @param  {Block} timeBlock block
         * @param  {Array} events    events array
         * @return {void}
         */
        function renderEvents(timeBlock, events, filter) {
            if(filter) {
                // 当前的filters
                var showEvents = fc.util.filterEvents(events, currentFilters);

                onRenderEvents(timeBlock, showEvents);
            } else {
                onRenderEvents(timeBlock, events);
            }
        }

        function renderHeader(viewName, headBlock, date) {
            onRenderHeader(viewName, headBlock, date);
        }

        function renderVerticalHeader(viewName, headBlock, date) {
            onRenderVerticalHeader(viewName, headBlock, date);
        }
        /**
         * 生成各个视图
         * @param  {String} viewName [description]
         * @param  {Date} day      日期，optional，默认今天
         * @private
         * @return {void}
         */
        function renderView(viewName, day) {
            // render
            if (!day) {
                // 当天时间
                day = currentDate || new Date();
            }
            currentDate = day;
            var viewChanged = typeof currentView !== 'undefined';
            if (currentView) {
                currentView.destroy();
                currentView = null;
            }
            switch (viewName) {
                case 'month':
                    currentView = new fc.MonthView(data, settings, monthOpt, that);
                    break;
                case 'week':
                    currentView = new fc.WeekView(data, settings, weekOpt, that);
                    break;
                case 'day':
                    currentView = new fc.DayView(data, settings, dayOpt, that);
                    break;
            }

            // 当前视图名称
            currentViewName = viewName;

            currentView.render(day);
            // 添加进去
            container.append(currentView.getContainer());
            // 显示
            currentView.show();

            // 切换了
            if(viewChanged && typeof onViewChanged === 'function') {
                onViewChanged(currentView);
            }
        }

        /**
         * resize
         * @param  {Number} width  宽度
         * @param  {Number} height 高度
         * @return {void}
         */
        function resize (width, height) {
            // 重新设置宽高
            data.width = width;
            data.height = height;
            if(currentView) {
                if(resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }
                resizeTimeout = setTimeout(function() {
                    currentView.resize(width, height);
                    if(typeof onSizeChanged === 'function') {
                        onSizeChanged();
                    }
                }, 200);
            }
        }
    }

})();
    if(typeof shark === 'undefined') {
        window.FullCalendar = fc.Calendar;
    } else {
        shark.FullCalendar = fc.Calendar;
    }
})();