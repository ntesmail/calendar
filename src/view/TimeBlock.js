(function() {

    fc.TimeBlock = TimeBlock;


    /**
     * 某一个的块
     * @param {object} date 数据
     * @param {View} view 视图
     */
    function TimeBlock(data, view) {
        var container,
            width,
            height,
            posTop,
            posLeft,
            leftBlock,
            currentDate;

        // 容器的样式
        container = $('<div class="can can-block"></div>');
        width = data.width;
        height = data.height;
        posTop = data.posTop;
        posLeft = data.posLeft;
        leftBlock = data.leftBlock;
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
        that.getWidth = getWidth;
        that.getHeight = getHeight;
        that.getLeftBlock = getLeftBlock;
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
         * 获取左侧时间
         * @return {Dom} 左侧节点
         */
        function getLeftBlock() {
            return leftBlock;
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
         * @return {string} viewname
         */
        function getViewName () {
            return view.getViewName();
        }

        /**
         * 获取宽度
         * @return {string} width
         */
        function getWidth() {
            return width;
        }

        /**
         * 获取高度
         * @return {string} height
         */
        function getHeight () {
            return height;
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
            if(fc.util.isSameDay(currentDate, fc.util.getNow())) {
                container.addClass('can-crt');
            }
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