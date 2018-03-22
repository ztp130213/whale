;(function ($, d3) {
  var _default = {
    width: 850,
    height: 570,
    onChangePath: function () {},
    onClickLeaf: function () {},
    sumByType: 'size'
  }

  /** constructor */
  function Treemap (ele, options) {
    var data = options.data

    this.options = options
    d3.select(ele).selectAll('.d3-treemap').remove()
    this.container = d3.select(ele)
      .append('div')
      .classed('d3-treemap', true)
    this.breadcrumbUl = this.container.append('ul')
      .classed('breadcrumb-list', true)
    this.svg = this.container.append('svg')
      .style('width', options.width)
      .style('height', options.height)
    this.data = JSON.parse(JSON.stringify(data))
    this.breadcrumb = [data.name]

    var fader = function (color) {
      return d3.interpolateRgb(color, "#fff")(0.2);
    }
    this.color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    this.format = d3.format(",d");
    this.treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([options.width, options.height])
      .round(true)
      .paddingInner(8);
    this.root = this.genHierarchyData(data)
    this.selectedId = this.root.children && this.root.children[0].data.id
  }

  /** methods */
  Treemap.prototype.init = function init () {
    this.render(this.root)
      .bind()
  }

  Treemap.prototype.genHierarchyData = function genHierarchyData (data) {
    var _this = this
    return d3.hierarchy(data)
      .eachBefore(function (d) {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + (d.data.id || d.data.name);
      })
      .sum(function (d) {
        return d[_this.options.sumByType]
      })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      })
  }

  Treemap.prototype.render = function render (data) {
    if (!data) return

    var _this = this
    this.treemap(data);

    // 画图
    var cell = this.svg.selectAll("g")
      .data(data.children)
      .enter().append("g")
      .classed('rect-container', true)
      .classed('can-drill-down', function (d) {
        return !!d.data.children
      })
      .classed('selected', function (d) {
        return _this.selectedId === d.data.id
      })
      .attr("transform", function (d) {
        return "translate(" + d.x0 + "," + d.y0 + ")";
      });

    cell.append("rect")
      .attr('class', 'rect')
      .attr("id", function (d) { return d.data.id; })
      .attr("width", function (d) { return d.x1 - d.x0; })
      .attr("height", function (d) { return d.y1 - d.y0; })
      .attr("fill", function (d) {
        return _this.color(d.data.id);
      })

    cell.append("clipPath")
      .attr("id", function (d) { return "clip-" + d.data.id; })
      .append("use")
      .attr("xlink:href", function (d) { return "#" + d.data.id; });

    var textEnter = cell.append("text")
      .attr('class', 'rect-text')
      .attr("clip-path", function (d) { return "url(#clip-" + d.data.id + ")"; })
      .selectAll("tspan")
      .data(function (d) {
        d.totalCount = d.leaves()
          .map(function (l) {
            return l.data.count || 0
          })
          .reduce(function (acc, cur) {
            return acc + cur
          })
        var data = d.data.name.split(/(?=[A-Z][^A-Z])/g)
        if (!d.data.show_key) {
          data = data.concat(['金额: ' + _this.format(d.value) + '元', '笔数: ' + _this.format(d.totalCount)])
        } else {
          d.data.show_key.forEach(function (k) {
            data.push(d.data.key_map[k] + ': ' + d.data[k])
          })
        }

        return data
      })
      .enter().append("tspan")
      .attr("x", 10)
      .attr("y", function (d, i) { return 20 + i * 15; })
      .text(function (d) { return d; })

    cell.append("title")
      .text(function (d, i, g) {
        var begin = textEnter._groups.slice(0, i).reduce(function (acc, cur) {
          return acc + cur.length
        }, 0)
        var end = begin + textEnter._groups[i].length
        var data = textEnter.data().slice(begin, end)
        return data.join('\n')
      });

    // 画面包屑
    var breadcrumb = this.container.select('.breadcrumb-list')
      .selectAll('li')
      .data(this.breadcrumb)
    breadcrumb.enter()
      .append('li')
      .classed('breadcrumb-item', true)
      .merge(breadcrumb)
      .text(function(d) { return d })
    breadcrumb.exit().remove()

    return this
  };

  Treemap.prototype.findChildrenByName = function findChildrenByName (name) {
    var _this = this
    var data = JSON.parse(JSON.stringify(this.data))
    var children = data.children
    var id = data.id
    for (var i = 1; i < this.breadcrumb.length; i++) {
      if (!children) return null

      children = children.find(function (c) {
        id = c.id
        return c.name === _this.breadcrumb[i]
      }).children
    }

    if (!children || !children.length) return null

    var newData = {
      id: id,
      name: name,
      children: children
    }

    return newData
  }

  Treemap.prototype.reRender = function reRender (newData) {
    this.svg.selectAll('*').remove()
    newData = this.genHierarchyData(newData)
    this.selectedId = newData.children[0].data.id
    this.render(newData)
      .bind()

    this.options.onChangePath(this.breadcrumb)
  }

  Treemap.prototype.bind = function bind () {
    var _this = this

    // 下钻事件
    d3.selectAll('.d3-treemap .rect-container').on('click', function (d, i, nodes) {
      var name = d.data.name
      _this.breadcrumb.push(name)
      var newData = _this.findChildrenByName(name)
      if (!newData) {
        _this.options.onClickLeaf(_this.breadcrumb)
        _this.breadcrumb.pop()
        d3.select(this.parentNode).selectAll('.rect-container').classed('selected', false)
        d3.select(this).classed('selected', true)
        return
      }

      _this.reRender(newData)
    })

    // 点击面包屑, 上钻
    _this.container.selectAll('.d3-treemap .breadcrumb-item').on('click', function (d, i, nodes) {
      if (i === _this.breadcrumb.length -1) return

      _this.breadcrumb = _this.breadcrumb.slice(0, i + 1)
      var newData = _this.findChildrenByName(d)
      _this.reRender(newData)
    })

    return this
  }

  /** api */
  $.fn.treemap = function (options) {
    options = $.extend({}, _default, options)

    if (options && options.data) {
      var treemap = new Treemap(this[0], options)
      treemap.init()
    }
  }

})(jQuery, d3);
