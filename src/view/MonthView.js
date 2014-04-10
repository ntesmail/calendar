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
            container,
            dayList = [],
            calendar = calendar;

        container = new shark.Container('<div></div>');

        var that = this;
        that.getContainer = getContainer;
        that.render = render;
        that.hide = hide;
        that.show = show;

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
         * 渲染视图
         * @param  {Date} date 某天
         * @return {void}
         */
        function render(date) {

            // 获取时间的range
            var range = fc.util.getMonthRange(date);

            // 处理方格的前面和后面
            start = fc.util.getWeekRange(range.start).start;
            end = fc.util.getWeekRange(range.end).end;
            // 当前月
            currentMonth = date.getMonth();

            // 周数
            var endDate = fc.util.clearTime(end);
            var weekCount = (endDate - start) / (7 * 24 * 60 * 60 * 1000);
            var blockWidth = Math.floor(data.width / 7);
            var blockHeight = Math.floor(data.height / weekCount);

            // header
            var headerHeight = 20;
            // 周日到周六
            var headerText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            for (var i = 0; i < 7; i++) {

                var head = new shark.Container('<div>' + headerText[i] + '</div>');
                head.getEle().css({
                    position : 'absolute',
                    top : 0,
                    left : blockWidth * i
                });
                container.addChild(head);
            }

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
                    dayBlock.render();

                    // 设置一下颜色等以作区别
                    if (dayDate.getMonth() !== currentMonth) {
                        // TODO
                    }
                    // 加到页面中
                    container.addChild(dayBlock.getContainer());

                    dayList.push(dayBlock);
                }
            }

            // 统一添加日历事件
            // 获取的
            var defer = $.Deferred();
            defer.done(function(events) {
                for (var i = 0; i < dayList.length; i++) {
                    // 相关的事件
                    var dayBlock = dayList[i];
                    var dayDate = dayBlock.getDate();

                    var dayKey = fc.util.getDayNumber(dayDate);

                    dayList[i].renderEvents(events[dayKey]);
                };
            })
            calendar.getEventManager().fetch(start, end, defer);
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
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                // 日历事件
                container.getEle().append('<div>' + event.getTitle() + '</div>');
            };

            checkOverflow();
        }
    }

})();