; window.whaleRadial = (function (win, doc) {
  function getColor(idx) {
    var palette = [
      '#D24545', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
      '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    return palette[idx % palette.length];
  }
  // 构造函数
  function WhaleRadial(options) {
    var self = this;
    self.box = options.element;
    WhaleRadial.boxes.push(self.box);
    var width = options.width, height = options.height;
    // 创建一个分组用来组合要画的图表元素
    var main = d3.select(options.selector).append('svg').append('g')
      // .classed('main', true)
      .attr('transform', "translate(" + width / 2 + ',' + height / 2 + ')');
    var data = options.data;
    // 设定一些方便计算的常量
    var radius = options.radius,
      // 指标的个数，即fieldNames的长度
      total = data.fieldNames.length,
      // 需要将网轴分成几级，即网轴上从小到大有多少个正多边形
      level = 4,
      // 网轴的范围，类似坐标轴
      rangeMin = options.min || 0,
      rangeMax = options.max || d3.max(data.values[0]),
      arc = 2 * Math.PI;
    // 每项指标所在的角度
    var onePiece = arc / total;
    // 计算网轴的正多边形的坐标
    var polygons = {
      webs: [],
      webPoints: []
    };
    for (var k = level; k > 0; k--) {
      var webs = '',
        webPoints = [];
      var r = radius / level * k;
      for (var i = 0; i < total; i++) {
        var x = r * Math.sin(i * onePiece + onePiece / 2),
          y = r * Math.cos(i * onePiece + onePiece / 2);
        webs += x + ',' + y + ' ';
        webPoints.push({
          x: x,
          y: y
        });
      }
      polygons.webs.push(webs);
      polygons.webPoints.push(webPoints);
    }
    var webs = main.append('g')
      .classed('webs', true);
    webs.selectAll('polygon')
      .data(polygons.webs)
      .enter()
      .append('polygon')
      .attr('points', function (d) {
        return d;
      });
    // 添加纵轴
    var lines = main.append('g')
      .classed('lines', true);
    lines.selectAll('line')
      .data(polygons.webPoints[0])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function (d) {
        return d.x;
      })
      .attr('y2', function (d) {
        return d.y;
      });
    // 计算雷达图表的坐标
    var areasData = [];
    var values = data.values;
    for (var i = 0; i < values.length; i++) {
      var value = values[i],
        area = '',
        points = [];
      for (var k = 0; k < total; k++) {
        var r = radius * (value[k] - rangeMin) / (rangeMax - rangeMin);
        var x = r * Math.sin(k * onePiece + onePiece / 2),
          y = r * Math.cos(k * onePiece + onePiece / 2);
        area += x + ',' + y + ' ';
        points.push({
          x: x,
          y: y
        })
      }
      areasData.push({
        polygon: area,
        points: points
      });
    }
    // 添加g分组包含所有雷达图区域
    var areas = main.append('g')
      .classed('areas', true);
    // 添加g分组用来包含一个雷达图区域下的多边形以及圆点
    areas.selectAll('g')
      .data(areasData)
      .enter()
      .append('g')
      .attr('class', function (d, i) {
        return 'area' + (i + 1);
      });
    for (var i = 0; i < areasData.length; i++) {
      // 依次循环每个雷达图区域
      var area = areas.select('.area' + (i + 1)),
        areaData = areasData[i];
      // 绘制雷达图区域下的多边形
      area.append('polygon')
        .attr('points', areaData.polygon)
        .attr('stroke', function (d, index) {
          return getColor(i);
        })
        .attr('fill', function (d, index) {
          return getColor(i);
        });
      // 绘制雷达图区域下的点
      var circles = area.append('g')
        .classed('circles', true);
      circles.selectAll('circle')
        .data(areaData.points)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        })
        .attr('r', 3)
        .attr('stroke', function (d, index) {
          return getColor(i);
        });
    }
    // 计算文字标签坐标
    var textPoints = [];
    var textRadius = radius + 20;
    for (var i = 0; i < total; i++) {
      var x = textRadius * Math.sin(i * onePiece + onePiece / 2),
        y = textRadius * Math.cos(i * onePiece + onePiece / 2);
      textPoints.push({
        x: x,
        y: y
      });
    }
    // 绘制文字标签
    var texts = main.append('g')
      .classed('texts', true);
    texts.selectAll('text')
      .data(textPoints)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      })
      .attr('font-size', "10px")
      .text(function (d, i) {
        return data.fieldNames[i];
      });
  }

  //实例
  WhaleRadial.boxes = []; //实例元素数组
  // 静态方法们
  WhaleRadial._set = function (element) {
    if (WhaleRadial.boxes.indexOf(element) == -1) {
      return true;
    }
  }

  WhaleRadial._otherPrivateMethod = function () {
  };

  // 原型方法
  WhaleRadial.prototype = {
    constructor: WhaleRadial, // 反向引用构造器

    exampleMethod1: function () {
    },

    exampleMethod2: function () {
    }
  };

  return function (options) { // factory
    options = options || {};
    var selector = options.selector,
      elements = doc.querySelectorAll(selector),
      instance = [];
    for (var index = 0, len = elements.length; index < len; index++) {
      options.element = elements[index];
      if (!!WhaleRadial._set(options.element)) {   // 保证实例是唯一的
        instance.push(new WhaleRadial(options));
      }
    }
    return instance;
  };
})(window, document);
