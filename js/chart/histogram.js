/**
 * usage:
 * $('#histogram').histogram({
      data: chartData,
      xRange: xRange,
      yRange: [yMin, yMax],
      width: 688,
      height: 323,
      key: 'x',
      label: ''
    })
 */

;(function ($, d3) {
  var _default = {
    width: 600,
    height: 500,
    margin: { top: 20, right: 20, bottom: 20, left: 50 },
    key: 'x',
    label: '',
    onClick: function () {}
  }

  function Histogram (ele, options) {
    this.options = options
    d3.select(ele).selectAll('svg').remove()
    this.svg = d3.select(ele)
      .append('svg')
      .attr('width', options.width)
      .attr('height', options.height)
      .classed('histogram', true)

    var margin = this.options.margin
    this.width = +this.svg.attr("width") - margin.left - margin.right
    this.height = +this.svg.attr("height") - margin.top - margin.bottom
    this.xScale = d3.scaleTime()
      .domain(this.options.xRange)
      .range([0, this.width])
    this.yScale = d3.scaleLinear()
      .domain(this.options.yRange)
      .range([this.height, 0])
  }

  Histogram.prototype.render = function render () {
    var _this = this
    var dataset = this.options.data
    var margin = this.options.margin
    var g = this.svg.append("g")
        .classed('axis', true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var formatNumber = d3.format(".1f")

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(d3.timeDay) // 以天为tick
      .tickFormat(function (d) {
        var date = d.getDate()
        date = date > 9 ? date : '0' + date
        return d.getMonth() + 1 + '-' + date
      })

    var yHistoAxis = d3.axisRight(this.yScale)
      .tickSize(this.width)
      .tickFormat(function (d) {
        var s = formatNumber(d);
        return this.parentNode.nextSibling
          ? "\xa0" + s
          : s + " 万元";
      })

    // 横坐标
    g.append("g")
      .classed('x-axis', true)
      .attr("transform", "translate(0," + this.height + ")")
      .call(customXAxis);

    // 纵坐标
    g.append("g")
      .classed('y-axis', true)
      .call(customYAxis)

    function customXAxis (g) {
      g.call(_this.xAxis);
    }

    function customYAxis (g) {
      g.call(yHistoAxis);
      g.selectAll(".tick line")
        .attr("stroke", "#E3E3E3")
      g.selectAll(".tick text")
        .attr("x", -40);
    }

    this.addLabel()
    // 柱状图
    this.drawHistogram()

    return this
  }

  Histogram.prototype.drawHistogram = function drawHistogram () {
    var rectPadding = 4;
    var margin = this.options.margin
    var data = this.options.data
    var _this = this
    var tickDis = this.xScale(new Date(data[1].time).getTime()) - this.xScale(new Date(data[0].time).getTime())

    var rects = this.svg.append('g')
      .classed('histogram-group', true)
      .selectAll(".bar")
      .data(this.options.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("x", function (d) {
        return _this.getCurX(d) - tickDis / 2 - 5
      })
      .attr("y", function (d) {
        return _this.yScale(d[_this.options.key]);
      })
      .attr("width", 36)
      .attr("height", function (d) {
        return _this.height - _this.yScale(d[_this.options.key])
      })
  }

  Histogram.prototype.addLabel = function addLabel () {
    this.svg.append("text")
      .attr("y", 15)
      .attr("x", 20)
      .classed('y-label', true)
      .text(this.options.label)
  }

  Histogram.prototype.getCurX = function getCurX (d) {
    return this.xScale(new Date(d.time).getTime())// + this.options.margin.left
  }

  Histogram.prototype.bind = function bind () {
    var _this = this
    d3.selectAll('.bar').on('click', function (d) {
      _this.options.onClick(d)
    })
  }

  $.fn.histogram = function (options) {
    options = $.extend({}, _default, options)
    if (this[0]) {
      var histogram = new Histogram(this[0], options)
      histogram.render()
        .bind()
    }
  }
})(jQuery, d3);
