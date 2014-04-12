/*! calendar - v0.0.1 - 2014-04-12
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
    fc.util.filterEvents = filterEvents;
    fc.util.hide = hide;
    fc.util.show = show;

    /**
     * 获取某一时刻所在月份起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getMonthRange(d) {
        var year = d.getFullYear(),
            month = d.getMonth();

        var start = new Date(year, month, 1);

        var date;
        if(month === 1) {
            date = year % 4 === 0 ? 29 : 28;
        } else if(month < 6) {
            date = month % 2 === 1 ? 30 : 31;
        } else {
            date = month % 2 === 0 ? 30 : 31;
        }
        var end = new Date(year, month, date);
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
        var title, start, type, end, repeate;

        title = data.title;
        start = data.start;

        var that = this;
        that.getTitle = getTitle;
        that.getStart = getStart;
        that.getEnd = getEnd;
        that.getType = getType;
        that.getColor = getColor;

        function getTitle() {
            return title;
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

    fc.MonthView = MonthView;


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

        container = $('<div></div>');

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

        function renderHeader() {
            // header
            // 周日到周六
            var headerText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            header = $('<div></div>');
            for (var i = 0; i < 7; i++) {
                var head = $('<div>' + headerText[i] + '</div>');
                head.css({
                    width: blockWidth,
                    height: headerHeight,
                    position: 'absolute',
                    top: 0,
                    border: 'solid 1px green',
                    left: blockWidth * i
                });
                header.append(head);
            }
            container.append(header);
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

            // 周数
            var endDate = fc.util.clearTime(end);
            weekCount = (endDate - start) / (7 * 24 * 60 * 60 * 1000);
            // block的高宽
            blockWidth = Math.floor(containerWidth / 7);
            blockHeight = Math.floor(containerHeight / weekCount);

            // 头部
            renderHeader();

            for (var i = 0; i < weekCount; i++) {
                // 周几
                for (var j = 0; j < 7; j++) {
                    var dayDate = new Date(start);
                    dayDate.setDate(dayDate.getDate() + i * 7 + j);
                    var dayData = {
                        width: blockWidth,
                        height: blockHeight,
                        posTop: headerHeight + blockHeight * i,
                        posLeft: blockWidth * j,
                        date: dayDate
                    };
                    var dayBlock = new MonthDayBlock(dayData);

                    // 设置一下颜色等以作区别
                    if (dayDate.getMonth() !== currentMonth) {
                        // TODO
                    }
                    // 加到页面中
                    container.append(dayBlock.getContainer());

                    blockList.push(dayBlock);
                }
            }

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
            blockWidth = Math.floor(containerWidth / 7);
            blockHeight = Math.floor(containerHeight / weekCount);

            // 头部重新定位
            var heads = header.children();
            for (var i = 0; i < heads.length; i++) {
                $(heads[i]).css({
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


    /**
     * 某一天的块
     * @param {[type]} date [description]
     */
    function MonthDayBlock(data, settings, monthOpt) {
        var container,
            width,
            height,
            posTop,
            posLeft,
            currentDate;

        // 容器的样式
        container = $('<div style="overflow:hidden;border:1px solid black;"></div>');
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
        that.resize = resize;
        that.destroy = destroy;

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
         * 生成ui
         * @return {void}
         */
        function render() {
            resize(data.width, data.height, data.posTop, data.posLeft);
            container.append(currentDate.getDate());
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
                position: 'absolute',
                width: width,
                height: height,
                top: posTop,
                left: posLeft
            });
        }
    }

})();
(function() {

    fc.WeekView = WeekView;


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

        container = $('<div></div>');

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

        function renderHeader() {
            // header
            // 周日到周六
            var headerText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            header = $('<div></div>');
            for (var i = 0; i < 7; i++) {

                var head = $('<div>' + headerText[i] + '</div>');
                head.css({
                    width: blockWidth,
                    height: headerHeight,
                    position: 'absolute',
                    top: 0,
                    border: 'solid 1px green',
                    left: leftHeaderWidth + blockWidth * i
                });
                header.append(head);
            }
            container.append(header);
        }

        function renderVerticalHeader() {
            // header
            // 周日到周六
            var headerText = ['凌晨', '上午', '下午', '晚上'];
            verticalHeader = $('<div></div>');
            for (var i = 0; i < 4; i++) {

                var head = $('<div>' + headerText[i] + '</div>');
                head.css({
                    width: leftHeaderWidth,
                    height: blockHeight,
                    position: 'absolute',
                    top: headerHeight + blockHeight * i,
                    border: 'solid 1px green',
                    left: 0
                });
                verticalHeader.append(head);
            }
            container.append(verticalHeader);
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
            blockWidth = Math.floor(containerWidth / 7);
            blockHeight = Math.floor(containerHeight/ verticalCount);

            // 头部
            renderHeader();
            // 左侧
            renderVerticalHeader()

            for (var i = 0; i < verticalCount; i++) {
                // 周几
                for (var j = 0; j < 7; j++) {
                    var dayDate = new Date(start);
                    dayDate.setDate(dayDate.getDate() + j);
                    dayDate.setHours(i * (24 / verticalCount));
                    var dayData = {
                        width: blockWidth,
                        height: blockHeight,
                        posTop: headerHeight + blockHeight * i,
                        posLeft: leftHeaderWidth + blockWidth * j,
                        date: dayDate
                    };
                    var dayBlock = new WeekTimeBlock(dayData);

                    // 设置一下颜色等以作区别
                    if (dayDate.getMonth() !== currentMonth) {
                        // TODO
                    }
                    // 加到页面中
                    container.append(dayBlock.getContainer());

                    blockList.push(dayBlock);
                }
            }

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
            blockWidth = Math.floor(containerWidth / 7);
            blockHeight = Math.floor(containerHeight / verticalCount);

            // 头部重新定位
            var heads = header.children();
            for (var i = 0; i < heads.length; i++) {
                $(heads[i]).css({
                    left : leftHeaderWidth + blockWidth * i,
                    width : blockWidth
                });
            };

            // 左侧重新定位
            var heads = verticalHeader.children();
            for (var i = 0; i < heads.length; i++) {
                $(heads[i]).css({
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


    /**
     * 某一天的块
     * @param {[type]} date [description]
     */
    function WeekTimeBlock(data, settings, weekOpt) {
        var container,
            width,
            height,
            posTop,
            posLeft,
            currentDate;

        // 容器的样式
        container = $('<div style="overflow:hidden;border:1px solid black;"></div>');
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
        that.resize = resize;
        that.destroy = destroy;

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
         * 生成ui
         * @return {void}
         */
        function render() {
            resize(data.width, data.height, data.posTop, data.posLeft);
            container.append(currentDate.getDate());
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
                position: 'absolute',
                width: width,
                height: height,
                top: posTop,
                left: posLeft
            });
            // 检查一下
            checkOverflow();
        }

        /**
         * 检查是不是超出了
         * @return {void}
         */
        function checkOverflow() {
            // TODO
        }

    }

})();
(function() {

    fc.DayView = DayView;


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

        container = new $('<div></div>');

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
            blockWidth = data.width;

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
                                width: blockWidth,
                                date: showEvents[0].getStart()
                            };
                            // 这个block是否显示跟里面的events数量相关
                            var block = new DayTimeBlock(dayData);
                            blockList.push(block);
                            // 事件，不需要filter
                            calendar.renderEvents(block, showEvents, false);
                            // 加到页面中
                            container.append(block.getContainer());
                        }
                    };
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

             
            for (var i = 0; i < blockList.length; i++) {
                // 周几
                blockList[i].resize(
                    containerWidth
                );
            }
        }
    }


    /**
     * 某一天的块
     * @param {[type]} date [description]
     */
    function DayTimeBlock(data, settings, dayOpt) {
        var container,
            width,
            height,
            posTop,
            posLeft,
            currentDate;

        // 容器的样式
        container = new $('<div style="overflow:hidden;border:1px solid black;"></div>');
        width = data.width;
        // 当前时间
        currentDate = data.date;

        // public
        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.getDate = getDate;
        that.resize = resize;
        that.destroy = destroy;

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
         * 生成ui
         * @return {void}
         */
        function render() {
            resize(data.width);
            container.append(currentDate.getHours() + ':' + currentDate.getMinutes());
        }

        /**
         * 销毁
         * @return {void}
         */
        function destroy() {
            container.remove();
            container = null;
        }
        /**
         * resize
         * @param  {Number} _width  宽度
         * @return {void}
         */
        function resize(_width) {
            width = _width;

            // 重新renderUI
            container.css({
                width: width
            });
        }
    }

})();
(function() {

    fc.Calendar = Calendar;
    var calendarContainerTmpl = '<div></div>';
    /**
     * 日历
     * @param {[type]} data     数据
     *                          {function} events 数据
     *                                  function(start, end, timezone, defer)
     *                                      defer.resolve([event list])
     *                          {Number} width
     *                          {Number} height
     *                          {String} defaultView
     *                          {String} clsName
     *
     * @param {[type]} settings 设置
     *                          {function} windowResize 窗口resize的时候
     *
     */
    function Calendar(data, settings) {
        var events,
            // 容器，shark.Container
            container = $(calendarContainerTmpl),
            // 名称 month,week,day
            defaultView = data.defaultView || 'month',
            // 当前视图
            currentViewName,
            // 当前视图对象
            currentView,
            // 当前filters
            currentFilters = data.filters,
            // renderEvents
            onRenderEvents = settings.onRenderEvents,
            // ondestroy
            onDestroy = settings.onDestroy,
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
            leftHeaderWidth: 40
        };
        // 日视图的配置
        var dayOpt = {
            headerHeight: 20,
            // 左侧宽度
            leftHeaderWidth: 40
        };

        // 加上clsName
        if(typeof data.clsName === 'string') {
            container.addClass(data.clsName)
        }

        var that = this;
        // public
        that.render = render;
        that.getContainer = getContainer;
        that.getEventManager = getEventManager;
        that.prev = prev;
        that.next = next;
        that.changeView = changeView;
        that.changeFilters = changeFilters;
        that.getFilters = getFilters;
        that.resize = resize;
        // render
        that.renderEvents = renderEvents;
        // 销毁
        that.onDestroy = onDestroy;

        // render
        that.render();
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
            renderView(defaultView);
        }

        function getEventManager() {
            return eventManager;
        }

        function getContainer() {
            return container;
        }

        /**
         * 下一个
         * @return {void}
         */
        function next() {
            var day = currentView.getNext();
            // 新视图
            renderView(currentViewName, day);
        }

        /**
         * 前一个
         * @return {void}
         */
        function prev() {
            var day = currentView.getPrev();
            // 新视图
            renderView(currentViewName, day);
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
            renderView(currentViewName);
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
                day = new Date();
            }

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
                    console.log('resize');
                    currentView.resize(width, height);
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