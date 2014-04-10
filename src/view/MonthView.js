fc.MonthView = MonthView;


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
        date;

    container = new shark.Container('<div style="overflow:hidden;border:1px solid black;"></div>');
    width = data.width;
    height = data.height;
    posTop = data.posTop;
    posLeft = data.posLeft;
    // 当前时间
    date = data.date;

    // public
    var that = this;
    that.getContainer = getContainer;
    that.render = render;
    that.getDate = getDate;
    that.renderEvents = renderEvents;
    that.resize = resize;

    function getContainer() {
        return container;
    }

    function getDate() {
        return date;
    }

    function render() {
        container.getEle().css({
            position : 'absolute',
            width : width,
            height : height,
            top : posTop,
            left : posLeft
        });
        container.addChild(new shark.Text({text : date.getDate()}));
    }

    function resize(_width, _height, _top, _left) {
        width = _width;
        height = _height;
        posTop = _top;
        posLeft = _left;
        // 重新renderUI
        renderUI();
    }

    function renderEvents(events) {
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            // 日历事件
            container.addChild(new shark.Text({text : event.getTitle(), clsName : 'f-txt-warn'}));
        };
    }
}

function MonthView (data, settings, monthOpt, calendar) {
    // 获取开始到结束时间
    var start,
        end,
        container,
        dayList = [],
        calendar = calendar;

    container = new shark.Container('<div></div>');

    var that = this;
    that.getContainer = getContainer;
    that.render = render;
    that.hide = hide;
    that.show = show;

    // 生成表格
    function getContainer() {
        return container;
    }
    function hide() {
        container.hide();
    }

    function show() {
        container.show();
    }
    function render(date) {
        // 获取时间的range
        var range = fc.util.getMonthRange(date);

        // 处理方格的前面和后面
        start = fc.util.getWeekRange(range.start).start;
        end = fc.util.getWeekRange(range.end).end;

        // 周数
        var endDate = fc.util.clearTime(end);
        var weekCount =  (endDate - start) / (7 * 24 * 60 * 60 * 1000);
        var blockWidth = Math.floor(data.width / 7);
        var blockHeight = Math.floor(data.height / weekCount);

        for (var i = 0; i < weekCount; i++) {
            // 周几
            for (var j = 0; j < 7; j++) {
                var dayDate = new Date(start);
                dayDate.setDate(dayDate.getDate() + i * 7 + j);
                var dayData = {
                    width : blockWidth, 
                    height : blockHeight, 
                    posTop : blockHeight * i,
                    posLeft : blockWidth * j,
                    date : dayDate
                };
                var dayBlock = new MonthDayBlock(dayData);
                dayBlock.render();

                // 加到页面中
                container.addChild(dayBlock.getContainer());

                dayList.push(dayBlock);
            }
        }

        // 统一添加日历事件
        // 获取的
        var defer = $.Deferred();
        defer.done(function(events){
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