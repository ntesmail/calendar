(function() {

    fc.Event = Event;

    /**
     * 日历事件对象
     * @param {[type]} data     [description]
     * @param {[type]} settings [description]
     */
    function Event(data, settings) {
        var id, title, start, type, end, repeate;
        id = data.id;
        title = data.title;
        start = data.start;
        type = data.type;
        end = data.end;
        repeate = data.repeate;
        color = data.color;

        var that = this;
        that.getId = getId;
        that.getTitle = getTitle;
        that.getStart = getStart;
        that.getEnd = getEnd;
        that.getType = getType;
        that.getColor = getColor;
        that.getRepeate = getRepeate;

        function getId() {
            return id;
        }
        function getTitle() {
            return title;
        }

        function getRepeate() {
            return repeate;
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