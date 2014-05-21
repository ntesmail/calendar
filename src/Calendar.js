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
     *                          {long} offset 客户端时间偏移 now = new Date(offset + new Date().getTime())
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
            onPreRenderEventsBlock = settings.onPreRenderEventsBlock,
            // renderEvents
            onRenderEvents = settings.onRenderEvents,
            // renderEventsCompleted
            onRenderEventsCompleted = settings.onRenderEventsCompleted,
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

        if(typeof data.offset === 'number') {
            fc.util.setTimeOffset(data.offset);
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
        that.preRenderEventsBlock = preRenderEventsBlock;
        // renderEvents
        that.renderEvents = renderEvents;
        // renderEventsCompleted
        that.renderEventsCompleted = renderEventsCompleted;
        // render header
        that.renderHeader = renderHeader;
        // render vertical header
        that.renderVerticalHeader = renderVerticalHeader;
        // 销毁
        that.onDestroy = onDestroy;
        that.getWidth  = getWidth;
        that.getHeight = getHeight;
        that.getViewName = getViewName;

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
         * 获取当前的viewName
         * @return {String} viewName
         */
        function getViewName() {
            return currentViewName;
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
         * @param  {string} viewName 视图名称，默认使用当前视图
         * @param  {Date} day 跳到某天
         * @return {void}
         */
        function goDate(viewName, day) {
             renderView(viewName || currentViewName, day);
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
         * @return {void}
         */
        function preRenderEventsBlock(timeBlock) {
            onPreRenderEventsBlock(timeBlock);
        }
        /**
         * render
         * @param  {Block} timeBlock block
         * @param  {Array} events    events array
         * @return {void}
         */
        function renderEvents(timeBlock, events) {
            onRenderEvents(timeBlock, events);
        }
        /**
         * render
         * @param  {string} viewName
         * @return {void}
         */
        function renderEventsCompleted(viewName) {
            onRenderEventsCompleted(viewName);
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
                day = currentDate || fc.util.getNow();
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