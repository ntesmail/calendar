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
            blockWidth,
            headerHeight,
            leftHeaderWidth,
            calendar = calendar;

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
         * @param  {Number} _height 高度
         * @param  {Number} _top    上
         * @param  {Number} _left   左定位
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