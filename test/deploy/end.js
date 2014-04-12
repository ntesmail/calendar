    if(typeof shark === 'undefined') {
        window.FullCalendar = fc.Calendar;
    } else {
        shark.FullCalendar = fc.Calendar;
    }
})();