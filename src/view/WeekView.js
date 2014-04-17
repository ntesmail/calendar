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
            blockWidth = Math.floor(containerWidth / 7);
            blockHeight = Math.floor(containerHeight / verticalCount);

            // 重新计算高宽，处理掉小数的影响
            containerWidth = blockWidth * 7;
            containerHeight = blockHeight * verticalCount;

            container.css({
                width : containerWidth + leftHeaderWidth,
                height : containerHeight + headerHeight
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