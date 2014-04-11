(function() {

    fc.Calendar = Calendar;

    /**
     * 日历
     * @param {[type]} data     数据
     *                          {function} events 数据
     *                                  function(start, end, timezone, defer)
     *                                      defer.resolve([event list])
     *                          {Number} width
     *                          {Number} height
     *                          {String} defaultView
     *
     *
     * @param {[type]} settings 设置
     *                          {function} windowResize 窗口resize的时候
     *
     */
    function Calendar(data, settings) {
        var events,
            // 容器，shark.Container
            container = new shark.Container('<div></div>'),
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
            // event缓存管理
            eventManager;
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
        // render
        that.renderEvents = renderEvents;
        /**
         * 生成ui
         * @return {[type]} [description]
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
        function renderEvents(timeBlock, events) {
            // 当前的filters
            if (typeof currentFilters !== 'undefined') {
                var filterList = [];
                for (var key in currentFilters) {
                    filterList.push(currentFilters[key]);
                }
                var showEvents = fc.util.filterEvents(events, filterList);

                onRenderEvents(timeBlock, showEvents);
            } else {
                onRenderEvents(timeBlock, events);
            }
        }

        /**
         * 生成各个视图
         * @param  {String} viewName [description]
         * @param  {Date} day      日期，optional，默认今天
         * @return {void}
         */
        function renderView(viewName, day) {
            // render
            if (!day) {
                // 当天时间
                day = new Date();
            }

            if (currentView) {
                currentView.hide();
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
            container.addChild(currentView.getContainer());
            // 显示
            currentView.show();
        }
    }

})();