(function () {
    // body...
    fc.EventManager = EventManager;
    function EventManager(data) {
        // 获取event的方式
        var fetchEvents = data.fetchEvents;

        var events = [];

        // public
        this.fetch = fetch;

        function fetch(start, end, defer) {
            // 是否都有了在events中
            var checkStart = fc.util.getDayNumber(start);
            var checkEnd = fc.util.getDayNumber(end);
            var needFetch = false;
            for (var i = checkStart; i <= checkEnd; i++) {
                var evts = events[i];
                if(typeof evts === 'undefined') {
                    // no cache
                    needFetch = true;
                    var defer2 = $.Deferred();
                    defer2.done(function(start, end, evts){
                        // 更新到cache
                        updateEventsCache(checkStart, checkEnd, evts);
                        // 返回event的copy
                        defer.resolve(getSubArray(checkStart, checkEnd, events));
                    });
                    defer2.fail(function(){
                        // 一样
                        defer.resolve(getSubArray(checkStart, checkEnd, events));
                    });
                    // 通过外部接口获取
                    fetchEvents(start, end, defer2);
                    return;
                }
            }

            // 都在缓存里面
            defer.resolve(getSubArray(checkStart, checkEnd, events));
        }

        function getSubArray(start, end, array) {
            var copy = [];
            for (var i = start; i <= end; i++) {
                copy[i] = array[i];
            };
            return copy;
        }

        function updateEventsCache(checkStart, checkEnd, evts) {

            for (var i = checkStart; i <= checkEnd; i++) {
                // 时间范围内的全部重置
                events[i] = [];
            }
            var days = [];
            for (var i = 0; i < evts.length; i++) {
                var eventDay = fc.util.getDayNumber(evts[i].start);
                // 放进去event
                if(typeof events[eventDay] !== 'undefined') {
                    events[eventDay].push(new fc.Event(evts[i]));
                }
            };
            for (var i = checkStart; i <= checkEnd; i++) {
                // 时间范围内的全部排序
                if(events[i].length > 0) {
                    events[i].sort(function(x, y) {
                        return x.getStart() - y.getStart();
                    });
                }
            }
        }   
    }
})();
