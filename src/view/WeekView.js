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
            blockWidth,
            blockHeight,
            headerHeight,
            leftHeaderWidth,
            calendar = calendar;

        // 高度
        headerHeight = weekOpt.headerHeight;
        // 左侧宽度
        leftHeaderWidth = weekOpt.leftHeaderWidth;

        container = new shark.Container('<div></div>');

        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.hide = hide;
        that.show = show;
        that.getCurrent = getCurrent;
        that.getNext = getNext;
        that.getPrev = getPrev;
        /**
         * 容器对象
         * @return {shark.Container} 容器对象
         */
        function getContainer() {
            return container;
        }

        function hide() {
            container.hide();
        }

        function show() {
            container.show();
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
            for (var i = 0; i < 7; i++) {

                var head = new shark.Container('<div>' + headerText[i] + '</div>');
                head.getEle().css({
                    width : blockWidth,
                    height : headerHeight,
                    position : 'absolute',
                    top : 0,
                    border : 'solid 1px green',
                    left : leftHeaderWidth + blockWidth * i
                });
                container.addChild(head);
            }
        }

        function renderVerticalHeader() {
            // header
            // 周日到周六
            var headerText = ['凌晨', '上午', '下午', '晚上'];
            for (var i = 0; i < 4; i++) {

                var head = new shark.Container('<div>' + headerText[i] + '</div>');
                head.getEle().css({
                    width : leftHeaderWidth,
                    height : blockHeight,
                    position : 'absolute',
                    top : headerHeight + blockHeight * i,
                    border : 'solid 1px green',
                    left : 0
                });
                container.addChild(head);
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
            var verticalCount = 4;
            // block的高宽
            blockWidth = Math.floor(data.width / 7);
            blockHeight = Math.floor(data.height / verticalCount);

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
                    dayBlock.render();

                    // 设置一下颜色等以作区别
                    if (dayDate.getMonth() !== currentMonth) {
                        // TODO
                    }
                    // 加到页面中
                    container.addChild(dayBlock.getContainer());

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
                    if(dayEvents.length > 0) {
                        var startTime = block.getDate();
                        var endTime = new Date(startTime);
                        // 6个小时
                        endTime.setHours(endTime.getHours() + 6);
                        for (var j = 0; j < dayEvents.length; j++) {
                            var dayEvent = dayEvents[j];

                            if(dayEvent.getStart() < endTime && dayEvent.getStart() >= startTime) {
                                sortedEvents.push(dayEvent);
                            }
                        };
                    }

                    // 过滤一下events
                    block.renderEvents(sortedEvents);
                };
            })
            calendar.getEventManager().fetch(start, end, defer);
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
        container = new shark.Container('<div style="overflow:hidden;border:1px solid black;"></div>');
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
        that.renderEvents = renderEvents;
        that.resize = resize;

        /**
         * 获取容器
         * @return {shark.Container} 容器对象
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
            container.addChild(new shark.Text({
                text: currentDate.getDate()
            }));
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
            container.getEle().css({
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

        /**
         * 生成日历事件
         * @param  {Array} events Event Array
         * @return {void}
         */
        function renderEvents(events) {
            // 先按时间进行排序处理
            events.sort(function(x, y){
                return x.getStart() - y.getStart();
            });
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                // 日历事件
                container.getEle().append('<div>' + event.getStart() + '</div>');
            };

            checkOverflow();
        }
    }

})();