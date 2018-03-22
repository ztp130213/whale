(function ($) {
  var _options = {
    date: new Date(), // 要渲染的日期
    schedule: {}      // 日程信息
  }
  var year, month
  var colorMap = ['green', 'blue', 'yellow']
  var tmpl = `
    <div class="header-bar">
      <span class="today">今天</span>
      <div class="day-week-year">
        <span>日</span>
        <span>周</span>
        <span class="active">月</span>
      </div>
      <div class="switch-month">
        <i class="iconfont icon-left1"></i>
        <span class="current"></span>
        <i class="iconfont icon-right1"></i>
      </div>
      <div class="toggle-btn">
        <i class="iconfont icon-form active"></i>
        <i class="iconfont icon-tabulation"></i>
      </div>
    </div>
    <div class="pane">
      <header class="week-bar">
          <span class="week">星期日</span>
          <span class="week">星期一</span>
          <span class="week">星期二</span>
          <span class="week">星期三</span>
          <span class="week">星期四</span>
          <span class="week">星期五</span>
          <span class="week">星期六</span>
      </header>
      <div class="calendar-wrapper clearfix" id="bigCalendarView"></div>
    </div>
  `

  function genDatesArray(year, month) {
    //当前月的第一天的日期
    var firstDay = new Date(year, month, 1);
    //第一天是星期几
    var weekday = firstDay.getDay();

    //求当前月一共有多少天
    //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
    //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
    var days = new Date(year, month + 1, 0).getDate();

    // 上月
    // 上个月多少天
    prevMonthDays = new Date(year, month, 0).getDate();
    var lastMonth = month > 0 ? month - 1 : 11;
    var lastMonthYear = lastMonth == 11 ? year - 1 : year;
    // 下月
    // 下一个月需要加多少天进来
    nextMonthRetainDays = 7 - ((days + weekday) % 7);
    var nextMonth = month === 11 ? 0 : month + 1;
    var nextMonthYear = nextMonth === 0 ? year + 1 : year;
    // 生成当前视图的所有日期
    var daysArray = []
    for (var i = 0; i < weekday; i++) {
      daysArray.unshift({
        date: prevMonthDays - i,
        month: lastMonth,
        year: lastMonthYear,
      });
    }
    for (i = 0; i < days; i++) {
      daysArray.push({
        date: i + 1,
        month: month,
        year: year,
      });
    }
    for (i = 0; i < nextMonthRetainDays; i++) {
      daysArray.push({
        date: i + 1,
        month: nextMonth,
        year: nextMonthYear,
      });
    }

    return daysArray
  }

  function insertSchedule(daysArray, schedule) {
    var personNames = []
    daysArray.forEach(function (day, idx) {
      var data = schedule[new Date(day.year, day.month, day.date)] || { schedule: [] }
      data.schedule.forEach(function (d) {
        if (d.person) {
          var personIdx = personNames.indexOf(d.person)
          if (personIdx > -1) {
            d.color = colorMap[personIdx]
          } else {
            personNames.push(d.person)
            d.color = colorMap[personNames.length] || 'yellow'
          }
        }
      })
      day.data = data
    })
  }

  function renderBigCalendar($ele, options) {
    // 大日历插件
    var date = options.date
    //当前是哪一年
    year = date.getFullYear()
    //当前是哪个月，注意这里的月是从0开始计数的
    month = date.getMonth()  // 0~11
    var today = date.getDate()
    var daysArray = genDatesArray(year, month)
    insertSchedule(daysArray, options.schedule)
    var tpl = `
      {{each data as item i}}
        <div class="day-item{{if (i + 1) % 7 === 0}} row-last-item{{/if}}">
          <p class="day{{if item.month !== month}} not-month-day{{/if}}">
            <span class="{{if item.date === date && item.month === month}}today{{/if}}">{{item.date}}</span>
          </p>
          <div class="schedule-container">
            {{ each item.data.schedule as schedule scheduleIdx }}
              <p class="schedule-title {{ schedule.color }}">{{ schedule.title }}</p>
              <div class="detail hide">
                <p>{{ schedule.detail.time }}</p>
                <p class="content">{{ schedule.detail.content }}</p>
                <p>{{ schedule.detail.company }}</p>
                <p class="location">
                  <i class="iconfont icon-local"></i>
                  {{ schedule.detail.location }}
                </p>
              </div>
            {{ /each }}
          </div>
        </div>
      {{/each}}
    `
    var render = template.compile(tpl);
    var html = render({ date: today, month: month, data: daysArray });
    var $calendar = $(tmpl)
    $calendar.find('#bigCalendarView').html(html)
    $ele.html($calendar)

    $ele.find('.switch-month .current').html(year + '年' + (month + 1) + '月')
  }

  function BigCalendar($ele, options) {
    var settings = $.extend({}, _options, options)
    renderBigCalendar($ele, settings)
  }

  $.fn.bigCalendar = function (options) {
    if (!$.isPlainObject(options)) {
      options = {}
    }

    return this.each(function () {
      new BigCalendar($(this), options);
    })
  }
})(jQuery);
