(function() {

    fc.Event = Event;

    /**
     * 日历事件对象
     * @param {[type]} data     [description]
     * @param {[type]} settings [description]
     */
    function Event(data, settings) {
        var title, start, type, end, repeate;

        title = data.title;
        start = data.start;

        var that = this;
        that.getTitle = getTitle;
        that.getStart = getStart;
        that.getEnd = getEnd;
        that.getType = getType;
        that.getColor = getColor;

        function getTitle() {
            return title;
        }

        function getStart() {
            return start;
        }

        function getEnd() {
            return end;
        }

        function getType() {
            return type;
        }

        function getColor() {
            return color;
        }
    }

})();