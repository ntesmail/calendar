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
            currentView,
            // event管理
            eventManager,
            // 视图缓存
            views = {};
        // 月视图的配置
        var monthOpt = {
            minHeight: 100,
            minWidth: 200
        };
        // 周视图的配置
        var weekOpt = {
            minHeight: 100,
            minWidth: 200,
            // 开始时间
            startTime: '00:00:00',
            // 结束时间
            endTime: '24:00:00',
            // 间隔时间
            splitTime: '6:00:00'
        };
        // 日视图的配置
        var dayOpt = {
            minHeight: 100,
            minWidth: 200,
            // 开始时间
            startTime: '00:00:00',
            // 结束时间
            endTime: '24:00:00',
            // 间隔时间
            splitTime: '24:00:00'
        };

        var that = this;
        // public
        that.render = render;
        that.getContainer = getContainer;
        that.getEventManager = getEventManager;

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

        function renderView(viewName, day) {
            if (currentView !== viewName) {
                var view = views[viewName];
                if (typeof view === 'undefined') {
                    switch (viewName) {
                        case 'month':
                            view = new fc.MonthView(data, settings, monthOpt, that);
                            break;
                        case 'week':
                            view = new fc.WeekView(data, settings, weekOpt, that);
                            break;
                        case 'day':
                            view = new fc.DayView(data, settings, dayOpt, that);
                            break;
                    }
                    views[viewName] = view;
                }
                if (currentView) {
                    views[currentView].hide();
                }
                // 直接切换过去
                // 切换当前的
                currentView = viewName;
                // render
                if (!day) {
                    // 当天时间
                    day = new Date();
                }

                view.render(day);
                // 添加进去
                container.addChild(view.getContainer());
                // 显示
                view.show();
            }
        }
    }

})();