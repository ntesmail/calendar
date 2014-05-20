(function () {
    fc.util = {};
    fc.util.getMonthRange = getMonthRange;
    fc.util.getWeekRange = getWeekRange;
    fc.util.getDayRange = getDayRange;
    fc.util.clearTime = clearTime;
    fc.util.getDayNumber = getDayNumber;
    fc.util.isSameDay = isSameDay;
    fc.util.filterEvents = filterEvents;
    fc.util.hide = hide;
    fc.util.show = show;
    fc.util.setTimeOffset = setTimeOffset;
    fc.util.getNow = getNow;
    var offset = 0;
    /**
     * 判断某个年份是否为闰年
     * @param {Number} year
     * @returns {Boolean}
     */
    function isLeapYear (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    /**
     * 设置客户端时间偏移
     * @param {long} off 偏移量
     */
    function setTimeOffset(off) {
        offset = off;
    }

    /**
     * 获取当前时间
     * @return {Date} 时间
     */
    function getNow() {
        return new Date(new Date().getTime() + offset);
    }

    /**
     * 获取某个月份的天数
     * @param {Number} month (0-11)
     * @param {Number} year (0-11)
     * @returns {Number}
     */
    function daysOfMonth (month, year) {
        var bigMonth = {
            0: true,
            2: true,
            4: true,
            6: true,
            7: true,
            9: true,
            11: true
        };
        if (month === 1) {
            if (year !== undefined && isLeapYear(year)) {
                return 29;
            } else {
                return 28;
            }
        }
        if (bigMonth[month]) {
            return 31;
        } else {
            return 30;
        }
    }

    /**
     * 获取某一时刻所在月份起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getMonthRange(d) {
        var year = d.getFullYear(),
            month = d.getMonth();

        var start = new Date(year, month, 1);
        var end = new Date(year, month, daysOfMonth(month, year));

        setEndTime(end);

        return {start : start, end: end};
    }


    /**
     * 获取某一时刻所在周的起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getWeekRange(d){
        // 星期天开始 0 -- 6
        var day = d.getDay();

        var start = new Date(d);
        clearTime(start);

        start.setDate(d.getDate() - day);

        var end = new Date(d);
        clearTime(end);

        end.setDate(d.getDate() + (6 - day));
        setEndTime(end);

        return {start : start, end: end};
    }

    /**
     * 获取某一时刻所在日起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getDayRange(d) {
        var start = new Date(d);
        clearTime(start);

        var end = new Date(d);
        setEndTime(end);

        return {start : start, end: end};
    }

    /**
     * 设置一天的开始时间
     * @param {Date} d 日期
     */
    function clearTime(d) {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }

    /**
     * 设置一天的结束时间
     * @param {Date} d 日期
     */
    function setEndTime(d) {
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        d.setMilliseconds(999);
        return d;
    }

    /**
     * 获取某个时间对应的天的相对天数
     * @param  {Date} d 某天
     * @return {Number}  相对天数
     */
    function getDayNumber(d) {
        var day = new Date(d);
        clearTime(day);
        // 取得天数
        return Math.floor(day.getTime() / (24 * 60 * 60 * 1000));
    }

    /**
     * 是否同一天
     * @param  {Date}  d1 时间1
     * @param  {Date}  d2 时间2
     * @return {Boolean}    是否同一天
     */
    function isSameDay(d1,d2) {
        return d1.getFullYear() === d2.getFullYear() 
            && d1.getMonth() === d2.getMonth() 
            && d1.getDate() === d2.getDate();
    }

    /**
     * 过滤events
     * @param  {Array} events  事件 Event array
     * @param  {Array} filters 过滤方法 Function array
     * @return {Array}       过滤后的events
     */
    function filterEvents(events, filters){
        // 检查是否有返回false的
        if(typeof events !== 'undefined' && events.length > 0 
            && typeof filters !== 'undefined') {
            var list = [];
            for (var i = 0; i < events.length; i++) {
                var valid = true;
                for (var key in filters) {
                    if(valid) {
                        if(!filters[key](events[i])) {
                            valid = false;
                        }
                    }
                };
                if(valid) {
                    list.push(events[i]);
                }
            };
            return list;
        } else {
            return events;
        }
    }

    /**
     * 隐藏container
     * @param  {Dom} container container
     * @return {void}
     */
    function hide(container) {
        container.addClass('f-hide');
    }

    /**
     * 显示container
     * @param  {Dom} container container
     * @return {void}
     */
    function show(container) {
        container.removeClass('f-hide');
    }
})();