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
                        }
                    };
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
                }
                // resize
                resize(containerWidth, containerHeight);
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