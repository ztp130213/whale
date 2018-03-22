;(function ($) {
  var _default = {
    width: 718,
    height: 600,
    r: 20
  }

  var Force = function (ele, options) {
    this.options = options
    this.ele = ele

    d3.select(ele).selectAll('svg').remove()
    this.svg = d3.select(ele)
      .append('svg')
      .attr('width', options.width)
      .attr('height', options.height)
      .classed('force', true)
    this.vertexes = options.data.vertexes
    this.edges = options.data.edges
    this.edgeTypes = ['invest', 'officer']
  }

  Force.prototype.preprocessData = function () {
    this.edges.forEach(function (e) {
      e.source = e._from
      e.target = e._to
      e._type = e._type || (e._id.includes('/') && e._id.split('/')[0].toLowerCase())
    })
    this.vertexes.forEach(function (v) {
      v._type = v._type || (v._id.includes('/') && v._id.split('/')[0].toLowerCase())
    })

    this.setIndex()

    return this
  }

  Force.prototype.initChartLayers = function () {
    this.svg.append('g')
    this.svg.append('g')
      .attr('class', 'chart-layer')
      .append('g')
      .attr('class', 'links')
    this.svg.select('.chart-layer')
      .append('g')
      .attr('class', 'nodes')

    return this
  }

  Force.prototype.render = function () {
    /**
     * 定义箭头
     * @param {Object} svg 要添加进的 svg
     * @param {String} id 箭头 id
     * @param {Number} refX refX 位置
     * @param {String} pathDescr path d 元素
     * @param {String} className 箭头 class
     */
    function defineArrow (svg, id, refX, pathDescr, className = '') {
      svg.append('defs')
        .append('marker')
        .attr('id', id)
        .attr('class', 'arrow-marker ' + className)
        .attr('refX', refX)
        .attr('refY', 5)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', pathDescr)
    }

    /** 动态调整位置 */
    function tickActions () {
      // 移动 vertex 位置
      _this.svg.selectAll('g.node')
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })

      // 调整label和边的距离
      _this.svg.selectAll('g .link-name').each(function (d, i, g) {
        var r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2))
        if (Math.abs(d.source.y - d.target.y) < r / 2) {
          d3.select(g[i]).attr('transform', 'translate(0, -5)')
        } else if ((d.source.x > d.target.x && d.source.y > d.target.y) ||
          (d.source.x < d.target.x && d.source.y < d.target.y)) {
          d3.select(g[i]).attr('transform', 'translate(5, 0)')
        } else if ((d.source.x > d.target.x && d.source.y < d.target.y) ||
          (d.source.x < d.target.x && d.source.y > d.target.y)) {
          d3.select(g[i]).attr('transform', 'translate(-5, 0)')
        }
      })

      _this.svg.selectAll('g .link-name textPath').each(function (d, i, g) {
        // 通过旋转 label, 使文字始终处于 edge 上方
        if (d.source.x > d.target.x) {
          d3.select(g[i]).attr('xlink:href', (d) => '#' + d._id.replace('/', '_') + _this.ele.id + '_reverse')
        } else {
          d3.select(g[i]).attr('xlink:href', (d) => '#' + d._id + _this.ele.id)
        }
      })

      // IE bug, marker-end 不能动态更新, 所以每次更新位置时都去除 path 再增加上 (note: 会有性能问题)
      if (window.ActiveXObject || /Trident\/7\./.test(navigator.userAgent)) {
        linkEnter.selectAll('path').remove()
        edge = linkEnter.append('path')
          .attr('class', 'link')
          .attr('linkIndex', (d) => d.linkIndex)
          .attr('linkMap', (d) => d.linkNum)
          .attr('marker-end', (d) => getArrow(d._type))
      }

      // 计算 edge 的 path, 多条路径时计算弧度
      _this.svg.selectAll('.edge-path').each(function (d, i, g) {
        var dx = d.target.x - d.source.x
        var dy = d.target.y - d.source.y
        var dr = d.linkNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0
        var middleIdx = (d.linkNum + 1) / 2

        if (d.linkNum > 1) {
          dr = d.linkIndex === middleIdx ? 0
            : dr / (Math.log((Math.abs(d.linkIndex - middleIdx) * 0.6) + 1) +
              (1 / (10 * Math.pow(d.linkNum, 2))))  // 秘制调参
        }
        var sweepFlag = d.linkIndex > middleIdx ? 1 : 0
        if (d.labelDirection) sweepFlag = 1 - sweepFlag
        var path = 'M' + d.source.x + ',' + d.source.y +
          'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y

        // 自己指向自己
        if (d._from === d._to) {
          path = `M${d.source.x} ${d.source.y} C ${d.source.x} ${d.source.y - 150},
            ${d.source.x + 150} ${d.source.y}, ${d.source.x} ${d.source.y}`
        }

        d3.select(g[i])
          .attr('d', path)
          .attr('id', d._id + _this.ele.id)
        // 增加一条反向的路径, 用于旋转 label
        d3.select('#' + d._id.replace('/', '_') + _this.ele.id + '_reverse')
          .attr('d', 'M' + d.target.x + ',' + d.target.y +
          'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y)
      })
    }

    /**
    * 对节点名称进行格式化
    * @param {Object} text text selection object
    */
    function textWrap (text) {
      text.each(function (d, idx, g) {
        var thisText = d3.select(g[idx])
        const len = 16
        var textStack = []
        var name = d.name || d.case_id || ''
        if (d._type === 'Family_id') {
          name = '互为亲属'
        }
        var y = parseFloat(thisText.attr('y'))
        var lineHeight = 20
        var i = 0
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: 0,
            dy: (i++ * lineHeight) + y
          })
          name = name.slice(len)
        }
        textStack.push({
          name: name.slice(0),
          dx: 0,
          dy: (i++ * lineHeight) + y
        })
        textStack.forEach((v) => {
          thisText.append('tspan').text(v.name).attr('y', v.dy)
            .attr('x', v.dx)
            .attr('class', v.risk ? 'risk-status' : '')
        })
      })
    }

    /**
     * 设置节点 icon
     * @param {Object} d vertex
     * @return {Object} svg image file
     */
    function setNodeIcon(d) {
      var type = d._type || d.entity_type || (d._id.includes('/') && d._id.split('/')[0]) || 'Company'

      return '/assets/img/examples/' + type + '.svg'
    }

    var _this = this
    // define arrow
    this.edgeTypes.forEach(function (e) {
      defineArrow(_this.svg, 'arrow_' + e, _this.options.r + 9, 'M0,0 L10,5 L0,10 L2,5 z', e)
    })
    defineArrow(this.svg, 'arrow', this.options.r + 9, 'M0,0 L10,5 L0,10 L2,5 z')

    // setup
    var linkForce = d3.forceLink(this.edges)
      .distance(200)
      .id((d) => d._id)
    this.simulation = d3.forceSimulation()
      .alphaDecay(0.07)
      .nodes(this.vertexes)
      .force('links', linkForce)
      .force('charge_force', d3.forceManyBody().strength(-2500))
      .force('center_force', d3.forceCenter(this.options.width / 2, this.options.height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force('collision', d3.forceCollide(1.5 * this.options.r))
      .on('tick', tickActions)

    // add vertexes
    var nodeEnter = this.svg.select('.nodes').selectAll('g')
      .data(this.vertexes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('node-type', (d) => d._type)

    nodeEnter.append('circle')
      .attr('r', this.options.r)
      .attr('class', 'circle')

    nodeEnter.append('text')
      .attr('class', 'node-name')
      .attr('y', '35')
      .style('text-anchor', 'middle')

    nodeEnter.selectAll('.node-name')
      .call(textWrap)

    nodeEnter.append('image')
      .attr('xlink:href', (d) => setNodeIcon(d))
      .attr('width', this.options.r * 2)
      .attr('height', this.options.r * 2)
      .attr('contextMenuTarget', true)
      .attr('id', (d) => d._id)
      .attr('name', (d) => d.name)
      .attr('x', -this.options.r)
      .attr('y', -this.options.r)

    // add edges
    var linkEnter = this.svg.select('.links').selectAll('g')
      .data(this.edges)
      .enter()
      .append('g')
      .attr('class', (d) => d._type)

    var edge = linkEnter.append('path')
      .attr('class', (d) => `link ${d._type}`)
      .classed('edge-path', true)
      .attr('linkIndex', (d) => d.linkIndex)
      .attr('linkMap', (d) => d.linkNum)
      .attr('marker-end', (d) => this.edgeTypes.includes(d._type) ? `url(#arrow_${d._type})` : 'url(#arrow)')

    // 增加反向路径, 用于旋转 label
    this.svg.select('defs').selectAll('.reverse-path')
      .data(this.edges)
      .enter()
      .append('path')
      .attr('id', (d) => d._id.replace('/', '_') + _this.ele.id + '_reverse')

    // add edge text
    linkEnter.append('text')
      .attr('class', (d) => `link-name ${d._id.split('/') && d._id.split('/')[0].toLowerCase()}`)
      .append('textPath')
      .attr('xlink:href', (d) => '#' + d._id + _this.ele.id)
      .attr('startOffset', '50%')
      .text((d) => d.label)

    return this
  }

  /**
   * 计算起点和终点相同边的条数，并加到link属性里
   * 计算每个点的度，并加到 vertex 的 degree 属性中
   * @return {Object} this this
   */
  Force.prototype.setIndex = function () {
    var linkNumMap = {}
    var nodeNumMap = {}
    var linkDirection = {}
    this.edges.forEach(function (edge) {
      if (linkNumMap[edge._from + edge._to] === undefined) {
        linkNumMap[edge._from + edge._to] = linkNumMap[edge._to + edge._from] = 1
        linkDirection[edge._from + edge._to] = linkDirection[edge._to + edge._from] = edge._from
      } else {
        linkNumMap[edge._from + edge._to]++
        linkNumMap[edge._to + edge._from]++
      }

      nodeNumMap[edge._from] = nodeNumMap[edge._from] ? nodeNumMap[edge._from] + 1 : 1
      nodeNumMap[edge._to] = nodeNumMap[edge._to] ? nodeNumMap[edge._to] + 1 : 1
      edge.linkIndex = linkNumMap[edge._from + edge._to]
    })
    this.edges.forEach(function (edge) {
      edge.linkNum = linkNumMap[edge._from + edge._to]
      edge.labelDirection = linkDirection[edge._from + edge._to] === edge._from ? 1 : 0
    })
    this.vertexes.forEach((vertex) => {
      vertex.degree = nodeNumMap[vertex._id]
    })

    return this
  }

  Force.prototype.bind = function () {
    /**
     * dragStart 开始拖拽
     * @param  {Object} d vertex
     */
    function dragStart (d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    /**
     * 拖动
     * @param {Object} d vertex
     */
    function drag (d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    /**
     * 结束拖动
     * @param {Object} d vertex
     */
    function dragEnd (d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    /** 缩放 */
    function zoom () {
      _this.svg.select('g.chart-layer').attr('transform', d3.event.transform)
    }

    var _this = this

    // 注册缩放事件
    this.zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom)
    // 缩放配置
    this.svg.call(this.zoomListener)
    // 清空缩放事件
    var t = d3.zoomIdentity.translate(0, 0).scale(1)
    this.svg.call(this.zoomListener.transform, t)

    // 拖拽配置
    var dragHandler = d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd)

    dragHandler(this.svg.selectAll('.node'))

    return this
  }

  Force.prototype.init = function () {
    this.preprocessData()
      .initChartLayers()
      .render()
      .bind()
  }

  $.fn.force = function (method, options) {
    options = $.extend({}, _default, options)
    var force = new Force(this[0], options)
    force[method] && force[method]()
  }
})(jQuery);
