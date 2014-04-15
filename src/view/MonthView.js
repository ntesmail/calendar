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

            // 周数
            var endDate = fc.util.clearTime(end);
            weekCount = (endDate - start) / (7 * 24 * 60 * 60 * 1000);
            // block的高宽
            blockWidth = Math.floor(containerWidth / 7);
            blockHeight = Math.floor(containerHeight / weekCount);

            // 头部
            renderHeader(start);

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
                    var dayBlock = new MonthDayBlock(dayData, that);

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


    /**
     * 某一天的块
     * @param {[type]} date [description]
     */
    function MonthDayBlock(data, view) {
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
         * @return {stirng} viewname
         */
        function getViewName () {
            return viewName;
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