(function () {
    fc.util = {};
    fc.util.getMonthRange = getMonthRange;
    fc.util.getWeekRange = getWeekRange;
    fc.util.getDayRange = getDayRange;
    fc.util.clearTime = clearTime;
    fc.util.getDayNumber = getDayNumber;
    /**
     * 获取某一时刻所在月份起始到结束
     * @param  {Date} d 某一时刻
     * @return {Object}  包括了起始和结束时间
     */
    function getMonthRange(d) {
        var year = d.getFullYear(),
            month = d.getMonth();

        var start = new Date(year, month, 1);

        var date;
        if(month === 1) {
            date = year % 4 === 0 ? 29 : 28;
        } else if(month < 6) {
            date = month % 2 === 1 ? 30 : 31;
        } else {
            date = month % 2 === 0 ? 30 : 31;
        }
        var end = new Date(year, month, date);
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
        return d;
    }

    function getDayNumber(d) {
        // 取得天数
        return Math.floor(d.getTime() / (24 * 60 * 60 * 1000));
    }
})();