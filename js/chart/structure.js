;(function ($) {
  var _default = {
    data: {},
    isToggle: false,
  };
  /*
   * 定义常量
   */
  // 矩形的高
  var H = 66
  var rootH = 30
  // 矩形的宽
  var W = 72
  var rootW = 100
  var borderColor = "#e3e3e3";
  // 每层高度
  var levelHeight = 100;
  /*
   @desc 计算字符串实际显示长度和高度
   @param {String} text 计算字符串
   @param {Number} fontSize 计算字符串
   @return {Object} {height: <>, width: <>}
  */
  function measureText(text, fontSize) {
    if (!text || text.length === 0) return { height: 0, width: 0 };
    var container = d3.select('body').append('svg').attr('class', 'dummy');
    container.append('text')
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('font-size', fontSize)
      .text(text);
    var bbox = container.node().getBBox();
    container.remove();
    return { height: bbox.height, width: bbox.width };
  }

  function formatExtraText(text) {
    text.each((d, idx, g) => {
      let thisText = d3.select(g[idx])
      if (d.parent) {
        const len = 5
        let textStack = []
        let name = d.data.value || ''
        let y = -15
        let lineHeight = 15
        let i = 0
        textStack.push({
          name: name,
          dx: - 100 / 2,
          dy: lineHeight + y
        })
        textStack.forEach((v) => {
          thisText.append('tspan').text(v.name).attr('y', v.dy)
            .attr('x', v.dx)
            .attr('fill', '#666')
            .attr('class', 'extra-text')
          // .attr('textLength', width)
          // .attr('lengthAdjust', 'spacing')
          // .attr('font-size', '14px')
        })
      }
    })
  }
  function formatNodeName(text, width, h) {
    text.each((d, idx, g) => {
      let thisText = d3.select(g[idx])
      if (d.parent) {
        const len = 5
        let textStack = []
        let name = d.data.name || ''
        let y = -15
        let lineHeight = 15
        let i = 0
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: - width / 2,
            dy: ((i++ * lineHeight) + y)
          })
          name = name.slice(len)
        }
        textStack.push({
          name: name.slice(0),
          dx: - width / 2,
          dy: ((i * lineHeight) + y)
        })
        textStack.forEach((v) => {
          thisText.append('tspan').text(v.name).attr('y', v.dy)
            .attr('x', v.dx)
            .attr('fill', '#666')
          // .attr('textLength', width)
          // .attr('lengthAdjust', 'spacing')
          // .attr('font-size', '14px')
        })
      } else {
        thisText.append('tspan')
          .text(d.data.name || '')
          .attr('fill', '#333')
          .attr('font-weight', 'bold')
          .attr('x', function (d) {
            return - (d.box.width) / 2
          })
          .attr('dx', 0)
          .attr('y', h / 2 - 10)
          .attr('dy', 0)
      }

    })
  }
  var StructureGraph = function(ele, options) {
    this.options = options;
    this.svg0 = d3.select(ele);
    this.width = +this.svg0.attr("width");
    this.height = +this.svg0.attr("height");
    this.svg = this.svg0.append('g')
      .attr('class', 'whale-structure');
  }
  StructureGraph.prototype.processData = function () {
    this.root = d3.hierarchy(this.options.data);
    this.treeHeight = levelHeight * this.root.height;
    function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    }
    var tree = d3.tree().separation(separation).size([this.width, this.treeHeight]);
    tree(this.root);
    // 交换x,y的坐标
    this.root.eachBefore(function (node) {
      var tmp = node.x
      node.x = node.y
      node.y = tmp
      // 计算文字长度
      node.box = measureText(node.data.name, "12px")
    })
    console.log(this.root);
  }
  StructureGraph.prototype.render = function () {
    // console.log(this.treeHeight);
    this.processData();
    this.g = this.svg
      .append("g")
      .attr("transform", "translate(0, " + (this.treeHeight / 2) + ")");
    this.renderArrow();
    this.renderLinks();
    this.renderNodes();
    this.bindZoom();
    if (this.options.isToggle) {
      this.bindToggle();
    }
  }
  // 生成一个箭头
  StructureGraph.prototype.renderArrow = function () {
    var defs = this.svg.append("defs");
    //添加marker标签及其属性
    var arrowMarker = defs.append("marker")
      .attr("id", "arrow")  // 重点是这个引用，使用的时候引用这个id就行
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("viewBox", "0 0 12 12")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("orient", "auto")
    var arrow_path = "M6,2 L6,10 L2,6 L6,2";
    arrowMarker.append("path")
      .attr("d", arrow_path)
      .attr("fill", "#e3e3e3")
  }
  // 生成边
  StructureGraph.prototype.renderLinks = function () {
    var link = this.g.selectAll(".link")
      .data(this.root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", function (d) {
        return "M" + d.parent.y  + "," + (d.parent.x + H / 2 + 6)
          + " L" + d.parent.y + "," + (d.parent.x + levelHeight / 2)
          + " L" + d.y + "," + (d.x - levelHeight / 2)
          + " L" + d.y + "," + (d.x - H / 2);
      })
      .attr("marker-start", "url(#arrow)");
      // .attr("marker-end", "url(#arrow)");
  }
  // 生成节点
  StructureGraph.prototype.renderNodes = function () {
    var node = this.g.selectAll(".node")
      .data(this.root.descendants())
      .enter().append("g")
      .attr("class", function (d) { return "node"; })
      .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
    // 矩形
    var rectGroup = node.append('g')
    rectGroup.append("rect")
      .attr("width", function (d) {
        if (d.parent) {
          return W
        } else {
          return d.box.width + 6
        }
      })
      .attr("height", function (d) {
        if (d.parent) {
          return H
        } else {
          return rootH
        }
      })
      .attr("fill", "#fff")
      .attr("stroke", "#E3E3E3")
      .attr("x", d => d.parent ? - W / 2 : - (d.box.width + 6) / 2)
      .attr("y", d => d.parent ? -H / 2 : - rootH / 2 + (H - rootH) / 2)
    rectGroup.append("text")
      .attr("class", "node-toggle-text whale-structure-toggle-text")
    rectGroup.append("text")
      .attr("class", "node-extra-text whale-structure-extra-text")
    // 添加额外显示的文字
    // var textArea = rectGroup.append('text')
    //   .attr('x', 0)
    //   .attr('y', 1)
    //   .attr('width', 100)
    //   .attr('height', 20)
    //   .fill('fill', '#000')
    //   .text('50%');
    // 增加toggle按钮
    if (this.options.isToggle) {
      var toggleIcon = rectGroup.append('g').attr('class', 'whale-structure-toggle-icon')

      toggleIcon.append('rect')
        .attr('width', d => d.parent && d.children ? '12px' : 0)
        .attr('height', d => d.parent && d.children ? '12px' : 0)
        .attr('rx', '4px')
        .attr('ry', '4px')
        .attr('fill', '#D24545')
        .attr('x', - 6)
        .attr('y', H / 2 - 6);

      toggleIcon.append('text')
        .attr('x', -4)
        .attr('y', H / 2 + 3)
        .attr('fill', '#fff')
        .text(d => d.parent && d.children ? '+' : '');
    }

    node.selectAll('.node-toggle-text').call(formatNodeName, 60, H);
    // node.selectAll('.node-extra-text').call(formatExtraText);
    var extraText = rectGroup.append('g').attr('class', 'whale-structure-extra-text')

    extraText.append('rect')
      .attr('width', d => d.data && d.data.value ? '36px' : 0)
      .attr('height', d => d.data && d.data.value ? '14px' : 0)
      .attr('fill', '#FFF')
      .attr('x', -18)
      .attr('y', - H / 2 - 15);

    extraText.append('text')
      .attr('x', -18)
      .attr('y', - H / 2 - 3)
      .attr('fill', '#999')
      .attr('font-size', 11)
      .text(d => d.data && d.data.value ? d.data.value : '');
  }
  // 绑定缩放事件
  StructureGraph.prototype.bindZoom = function () {
    function zoom() {
      d3.select('g.whale-structure').attr('transform', d3.event.transform)
    }
    var zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom)
    this.svg0.call(zoomListener);
  }
  // 绑定收缩事件
  StructureGraph.prototype.bindToggle = function () {
    this.svg.selectAll('.whale-structure-toggle-icon').on('click', toggle)
    function toggle(d) {
      console.log(d)
    }
  }
  // 隐藏节点和边
  StructureGraph.prototype.hide = function () {

  }
  // 显示节点和边
  StructureGraph.prototype.show = function () {

  }
  /*
   * @param {object} options
   *   data: 组织结构树的数据
   *   isToggle: 是否需要展开收缩, 默认false
   */
  $.fn.structure = function (options) {
    options = $.extend({}, _default, options);
    if (this[0]) {
      var ins = new StructureGraph(this[0], options);
      ins.render();
    }
  }
})(jQuery);
