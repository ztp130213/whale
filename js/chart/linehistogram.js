/**
 * usage:
 * $('#lineHistogram').lineHistogram({
      data: chartData,
      xRange: xRange,
      yLineRange: [yRightMin, yRightMax],
      yHistoRange: [yLeftMin, yLeftMax],
      width: 688,
      height: 323,
      lineKey: 'x',
      histoKey: 'y',
      lineLabel: '',
      histoLabel: '',
      lineLegend: '',
      histoLegend: ''
    })
 */

;(function ($, d3) {
  var _default = {
    width: 600,
    height: 500,
    margin: { top: 20, right: 20, bottom: 20, left: 50 },
    lineKey: 'x',
    histoKey: 'y',
    lineLabel: '',
    histoLabel: '',
    lineLegend: '',
    histoLabel: ''
  }

  function LineHistogram (ele, options) {
    this.options = options
    d3.select(ele).selectAll('svg').remove()
    this.svg = d3.select(ele)
      .append('svg')
      .attr('width', options.width)
      .attr('height', options.height)
      .classed('line-histogram', true)

    var margin = this.options.margin
    this.width = +this.svg.attr("width") - margin.left - margin.right
    this.height = +this.svg.attr("height") - margin.top - margin.bottom
    this.xScale = d3.scaleTime()
      .domain(this.options.xRange)
      .range([0, this.width])
    this.yScaleHisto = d3.scaleLinear()
      .domain(this.options.yHistoRange)
      .range([this.height, 0])
    this.yScaleLine = d3.scaleLinear()
      .domain(this.options.yLineRange)
      .range([this.height, 0])
  }

  LineHistogram.prototype.render = function render () {
    var _this = this
    var dataset = this.options.data
    var margin = this.options.margin
    var g = this.svg.append("g")
        .classed('axis', true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var formatNumber = d3.format(".1f")

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(d3.timeYear) // 以年为tick, 还需支持季度、月、星期、天

    var yHistoAxis = d3.axisRight(this.yScaleHisto)
      .tickSize(this.width)
      .tickFormat(function (d) {
        var s = formatNumber(d);
        return this.parentNode.nextSibling
          ? "\xa0" + s
          : s + " 元";
      });
    var yLineAxis = d3.axisLeft(this.yScaleLine)
      .tickSize(5);

    // 横坐标
    g.append("g")
      .classed('x-axis', true)
      .attr("transform", "translate(0," + this.height + ")")
      .call(customXAxis);

    // 纵坐标
    g.append("g")
      .classed('y-axis', true)
      .call(customYAxis)

    // 右方纵坐标
    g.append("g")
      .classed('y-line-axis', true)
      .attr("transform", "translate(" + (this.width - 1) + ",0)")
      .call(yLineAxis);

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
    // 折线图
    this.drawLine()
    this.addLegend()

    return this
  }

  LineHistogram.prototype.drawLine = function drawLine () {
    var _this = this

    var line = d3.line()
      .x(this.getCurX.bind(this))
      .y(function (d) { return _this.yScaleLine(d[_this.options.lineKey]) })
      .curve(d3.curveNatural)
    this.svg.append('g')
      .classed('line-group', true)
      .append("path")
      .datum(this.options.data)
      .classed('line', true)
      .attr("d", line)
    this.svg.select('.line-group')
      .selectAll('.dot')
      .data(this.options.data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', this.getCurX.bind(this))
      .attr('cy', function (d, i) {
        return _this.yScaleLine(d[_this.options.lineKey])
      })
      .attr('r', 2.5)
  }

  LineHistogram.prototype.drawHistogram = function drawHistogram () {
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
        return _this.getCurX(d) - tickDis / 2 - 16
      })
      .attr("y", function (d) {
        return _this.yScaleHisto(d[_this.options.histoKey]);
      })
      .attr("width", 36)
      .attr("height", function (d) {
        return _this.height - _this.yScaleHisto(d[_this.options.histoKey])
      })
  }

  LineHistogram.prototype.addLabel = function addLabel () {
    this.svg.append("text")
      .attr("y", 15)
      .attr("x", 20)
      .classed('y-label', true)
      .text(this.options.histoLabel)

    this.svg.append('text')
      .attr('y', 15)
      .attr('x', this.width + 40)
      .classed('y-label', true)
      .text(this.options.lineLabel)
  }

  LineHistogram.prototype.addLegend = function addLegend () {
    var legend = this.svg.append('g')
      .attr('class', 'legend-group')
      .attr('transform', 'translate(' + (this.width - 50) + ',' + 15 + ')')
    addLegendItem(this.options.histoLegend, 'histogram-group')
    addLegendItem(this.options.lineLegend, 'line-group')

    function addLegendItem (text, linkName) {
      var g = legend.append('g')
        .attr('link', linkName)

      g.append('circle')
        .attr('r', 6)
        .attr('class', 'outer')
      g.append('circle')
        .attr('r', 4)
        .attr('class', 'inner')
      g.append('text')
        .text(text)
    }
  }

  LineHistogram.prototype.getCurX = function getCurX (d) {
    return this.xScale(new Date(d.time).getTime()) + this.options.margin.left
  }

  LineHistogram.prototype.bind = function bind () {
    var isHide = {}

    this.svg.selectAll('.legend-group > g').on('click', function (d, i, node) {
      var linkName = d3.select(this).attr('link')
      isHide[linkName] = !isHide[linkName]
      d3.select('[link=' + linkName + '] .inner').classed('hide', isHide[linkName])
      d3.selectAll('.' + linkName)
        .style('opacity', isHide[linkName] ? 0 : 1)
    })

    return this
  }

  $.fn.lineHistogram = function (options) {
    options = $.extend({}, _default, options)
    if (this[0]) {
      var lineHistogram = new LineHistogram(this[0], options)
      lineHistogram.render()
        .bind()
    }
  }
})(jQuery, d3);
