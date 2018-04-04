// 实现部分
;(function ($) {
  // 先序
  var eachBefore = function (callback) {
    var node = this, nodes = [node], children, i;
    while (node = nodes.pop()) {
      callback(node), children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i]);
      }
    }
    return this;
  }
  // 后序
  var eachAfter = function (callback) {
    var node = this, nodes = [node], next = [], children, i, n;
    while (node = nodes.pop()) {
      next.push(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        nodes.push(children[i]);
      }
    }
    while (node = next.pop()) {
      callback(node);
    }
    return this;
  }
  // 找当前节点
  var findNodeById = function (id) {
    var node = this, nodes = [node], children, i;
    while (node = nodes.pop()) {
      if (id === node.id) {
        return node
      }
      children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i]);
      }
    }
    return null;
  }
  // 找祖先节点
  var findAncestorsidsByNode = function (node) {
    var arr = []
    if (node) {
      while (node = node.parent) {
        if (node.id != -1)
          arr.push(node.id)
      }
    }
    return arr
  }
  // 找子孙节点
  var findChildrenidsByNode = function (nodes) {
    var arr = [], caches = [], cache,
      children, x = 0;
    if (nodes) {
      caches.push(nodes)
      while (cache = caches.pop()) {
        var children = cache.children
        if (children) for (i = children.length - 1; i >= 0; --i) {
          arr.push(children[i].id)
          caches.push(children[i]);
        }
      }
    }
    return arr
  }
  function Node(data) {
    this.data = data;
    this.id = data.id;
    this.depth = 0;
    this.open = true;
    this.height = 0;
    this.parent = null;
  }
  Node.prototype = {
    eachBefore: eachBefore,  // 先序遍历
    eachAfter: eachAfter, // 后序遍历
    findNodeById: findNodeById,
    findAncestorsidsByNode: findAncestorsidsByNode,
    findChildrenidsByNode: findChildrenidsByNode
  }
  var _options = {
    data: {},
    setting: {
      check: {
        enable: false
      },
      open: {
        enable: false
      },
      callback: {
        onclick: function ($this, id, node) {
          console.log(id, node)
        },
        selectNode: function ($this, id, node, checked) {
          console.log(id, node, checked)
        }
      }
    }
  },
    html = '', indent = 18,
    caches = {},
    //  通用工具以及缓存创建的tree，防止创建一个页面多个tree
    tool = {
      deepCopy: function (obj) {
        if (obj === null) return null;
        var o = Object.prototype.toString.apply(obj) === "[object Array]" ? [] : {};
        for (var i in obj) {
          o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? tool.deepCopy(obj[i]) : obj[i]);
        }
        return o;
      },
      getCache: function (treeId) {
        return caches[treeId];
      },
      setCache: function (treeId, cache) {
        if (caches[treeId]) {
          return;
        }
        caches[treeId] = cache;
      }
    },
    event = {
      close: function ($this, $ele, sons, root) {
        $this.removeClass('open')
        for (let i of sons) {
          $($ele.find("[data-id= " + i + "]")).addClass('hide')
        }
      },
      expand: function ($this, $ele, sons, root) {
        var recordOpen = []
        $this.addClass('open')
        for (var i of sons) {
          var son = root.findNodeById(i);
          if (son.children && !$($ele.find("[data-id= " + i + "]")).hasClass('open')) {
            recordOpen = recordOpen.concat(root.findChildrenidsByNode(son))
          }
          if (recordOpen.indexOf(i) < 0) {
            $($ele.find("[data-id= " + i + "]")).removeClass('hide')
          }
        }
      },
      highLight: function ($this, $ele, sons, ancestors) {
        if ($this.hasClass('active')) {
          $this.removeClass('active')
          for (let i of sons) {
            $($ele.find("[data-id= " + i + "]")).removeClass('active')
          }
        } else {
          $this.addClass('active')
          for (let i of ancestors) {
            $($ele.find("[data-id= " + i + "]")).addClass('active')
          }
          for (let i of sons) {
            $($ele.find("[data-id= " + i + "]")).addClass('active')
          }
        }
      }
    }
  function appendHtml(node, settings) {
    if (node.id == -1) return
    var isCheck = settings.setting.check.enable;
    var childrenLogo = settings.setting.expand;
    var hasClass = settings.setting.class;
    html += `<div class="item ${node.data.class ? node.data.class : ""} ${node.children ? "parent" : ""} ${node.children && node.open ? 'open' : ''}" data-id="${node.id}"
       ${hasClass ? "" : "style=padding-left:" + (node.depth - 1) * indent + "px"}>
          ${node.children && !node.data.class ? "<span class='expand'></span>" : ""}
          ${!node.children && childrenLogo && childrenLogo.children ? "<span class='" + childrenLogo.children + "'></span>" : ""}
          <span>${node.data.name}</span>
          ${isCheck ? node.children ? "<span class='check-all'>全选</span>" : "<span class='check-box'></span>" : ""}
      </div>`
  }
  function defaultChildren(d) {
    return d.children;
  }
  function WhaleTree($ele, options) {
    if (!$ele.hasClass('whale-tree')) {
      $ele.addClass('whale-tree')
    }
    var treeId = $ele.attr('id');
    var _optionDefault = tool.deepCopy(_options);
    html = '', indent = 18;
    var settings = {
      setting: $.extend(true, {}, _optionDefault.setting, options.setting),
      data: options.data
    }
    var hasClass = settings.setting.class;
    if (hasClass) {
      $ele.addClass(hasClass)
    }
    var dataBox = {
      id: -1,
      name: 'all'
    }
    dataBox.children = settings.data;
    var root = new Node(dataBox)
    var node,
      nodes = [root],
      child,
      childs,
      i,
      children = null,
      n;
    if (children == null) children = defaultChildren;
    while (node = nodes.pop()) {
      if ((childs = children(node.data)) && (n = childs.length)) {
        node.children = new Array(n);
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = node.children[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }
    tool.setCache(treeId, root)
    root.eachBefore(function (node) {
      appendHtml(node, settings)
    })  // 先序遍历生成html字符串
    $ele.html(html);
    // 点击事件
    $ele.on('click', '.item', function (e) {
      e.stopPropagation()
      var $this = $(this)
      var id = $this.data('id')
      var node = root.findNodeById(id)
      var ancestors = root.findAncestorsidsByNode(node)
      var sons = root.findChildrenidsByNode(node)
      if (settings.setting.check && settings.setting.check.enable) {
        // 展开和收起，收起：就是儿子全hide；展开：儿子看是否已经展开
        if ($this.hasClass('open')) {
          event.close($this, $ele, sons, root)
        } else {
          event.expand($this, $ele, sons, root)
        }
      } else if (settings.setting.expand && settings.setting.expand.enable) {
        // 展开和收起，收起：就是儿子全hide；展开：儿子看是否已经展开
        if ($this.hasClass('open')) {
          event.close($this, $ele, sons, root)
        } else {
          event.expand($this, $ele, sons, root)
        }
      }
      else {
        // 高亮祖先节点 和 当前节点
        event.highLight($this, $ele, sons, ancestors);
      }
      settings.setting.callback.onclick ? settings.setting.callback.onclick($this, id, node.data) : _optionDefault.setting.callback.onclick($this, id, node.data)
    });
    // 选中操作
    $ele.find('.item').on('click', '.check-box, .check-all', function (e) {
      e.stopPropagation();
      var $parent = $(e.target).parent('.item')
      var $this = $(this);
      var id = $parent.data('id')
      var node = root.findNodeById(id)
      var ancestors = root.findAncestorsidsByNode(node)
      var sons = root.findChildrenidsByNode(node)
      var checked = true;
      node = [node.data]
      if ($this.hasClass('check-all')) {
        event.expand($parent, $ele, sons, root)
        if ($this.hasClass('checked')) {
          $this.removeClass('checked')
          $this.text('全选')
          checked = false
          for (let i of sons) {
            node.push(root.findNodeById(i).data)
            $($ele.find("[data-id= " + i + "] .check-box")).removeClass('checked')
          }
        } else {
          $this.addClass('checked')
          $this.text('取消全选')
          for (let i of sons) {
            var hasChecked = $($ele.find("[data-id= " + i + "] .check-box")).hasClass('checked')
            if (!hasChecked) {
              var sonNode = root.findNodeById(i).data
              node.push(sonNode)
              $($ele.find("[data-id= " + i + "] .check-box")).addClass('checked')
            }
          }
        }
      } else {
        if ($this.hasClass('checked')) {
          checked = false
          $this.removeClass('checked')
        } else {
          $this.addClass('checked')
        }
      }
      settings.setting.callback.selectNode ? settings.setting.callback.selectNode($this, id, node, checked) : _optionDefault.setting.callback.selectNode($this, id, node, checked)
    })
  }
  function unSelectTree($ele, options) {
    $dom = $($ele.find("[data-id= " + options + "] .check-box"))
    if ($dom.hasClass('checked')) {
      $dom.removeClass('checked')
    } else {
      $dom.addClass('checked')
    }
  }
  $.fn.whaleTree = function (type, options) {
    if (type == 'init') {
      return this.each(function () {
        new WhaleTree($(this), options)
      })
    } else if (type == 'unSelect') {
      return new unSelectTree($(this), options)
    }

  }
})(jQuery);
