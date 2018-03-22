; (function ($) {
  var radiusX = 90;
  var radiusY = 135;
  var radiusZ = 90;
  var d = 200;
  var dtr = Math.PI / 180;
  var mcList = [];
  var lasta = 1;
  var lastb = 1;
  var distr = true;
  var tspeed = 11;
  var size = 200;
  var mouseX = 0;
  var mouseY = 10;
  var howElliptical = 1;
  var aA = null;
  var oDiv = null;
  var sa, ca, sb, cb, sc, cc;

  function update() {
    var a, b, c = 0;
    a = (Math.min(Math.max(-mouseY, -size), size) / radiusX) * tspeed;
    b = (-Math.min(Math.max(-mouseX, -size), size) / radiusX) * tspeed;
    lasta = a;
    lastb = b;
    if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
      return;
    }
    sineCosine(a, b, c);
    for (var i = 0; i < mcList.length; i++) {
      if (mcList[i].on) {
        continue;
      }
      var rx1 = mcList[i].cx;
      var ry1 = mcList[i].cy * ca + mcList[i].cz * (-sa);
      var rz1 = mcList[i].cy * sa + mcList[i].cz * ca;

      var rx2 = rx1 * cb + rz1 * sb;
      var ry2 = ry1;
      var rz2 = rx1 * (-sb) + rz1 * cb;

      var rx3 = rx2 * cc + ry2 * (-sc);
      var ry3 = rx2 * sc + ry2 * cc;
      var rz3 = rz2;

      mcList[i].cx = rx3;
      mcList[i].cy = ry3;
      mcList[i].cz = rz3;

      var per = d / (d + rz3);

      mcList[i].x = (howElliptical * rx3 * per) - (howElliptical * 2);
      mcList[i].y = ry3 * per;
      mcList[i].scale = per;
      var alpha = per;
      alpha = (alpha - 0.6) * (10 / 6);
      mcList[i].alpha = alpha * alpha * alpha - 0.2;
      mcList[i].zIndex = Math.ceil(100 - Math.floor(mcList[i].cz));
    }
    doPosition();
  }
  function positionAll() {
    var phi = 0;
    var theta = 0;
    var max = mcList.length;
    for (var i = 0; i < max; i++) {
      if (distr) {
        phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
        theta = Math.sqrt(max * Math.PI) * phi;
      } else {
        phi = Math.random() * (Math.PI);
        theta = Math.random() * (2 * Math.PI);
      }
      //坐标变换
      mcList[i].cx = radiusY * Math.cos(theta) * Math.sin(phi);
      mcList[i].cy = radiusX * Math.sin(theta) * Math.sin(phi);
      mcList[i].cz = radiusZ * Math.cos(phi);

      aA[i].style.left = mcList[i].cx + oDiv.offsetWidth / 2 - mcList[i].offsetWidth / 2 + 'px';
      aA[i].style.top = mcList[i].cy + oDiv.offsetHeight / 2 - mcList[i].offsetHeight / 2 + 'px';
    }
  }
  function doPosition() {
    var l = oDiv.offsetWidth / 2;
    var t = oDiv.offsetHeight / 2;
    for (var i = 0; i < mcList.length; i++) {
      if (mcList[i].on) {
        continue;
      }
      var aAs = aA[i].style;
      if (mcList[i].alpha > 0.1) {
        if (aAs.display != '')
          aAs.display = '';
      } else {
        if (aAs.display != 'none')
          aAs.display = 'none';
        continue;
      }
      aAs.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
      aAs.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';
      //aAs.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';
      //aAs.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+100*mcList[i].alpha+")";
      aAs.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
      aAs.zIndex = mcList[i].zIndex;
      aAs.opacity = mcList[i].alpha;
    }
  }
  function sineCosine(a, b, c) {
    sa = Math.sin(a * dtr);
    ca = Math.cos(a * dtr);
    sb = Math.sin(b * dtr);
    cb = Math.cos(b * dtr);
    sc = Math.sin(c * dtr);
    cc = Math.cos(c * dtr);
  }
  var DEFAULT = {
    width: 800,
    height: 260,
    tspeed: 11,
    tags: [], // [{value: xxx, href: xxx}, {value: xxx, href: xxx}]
    radiusX: 90, // 竖轴半径
    radiusY: 135, // 横轴半径
    radiusZ: 90, // z轴半径
  }
  var WhaleTagsCloud = function (element, options) {
    this.options = $.extend({}, DEFAULT, options)
    this.$element = $(element)
  }

  // var tmpl = '<a href="http://sc.chinaz.com/" class="tagc1">js特效代码</a>';

  WhaleTagsCloud.prototype.init = function () {
    this.$element.addClass("tagscloud");
    this.$element.css({ width: this.options.width + "px", height: this.options.height + "px" });
    radiusX = this.options.radiusX || radiusX;
    radiusY = this.options.radiusY || radiusY;
    radiusZ = this.options.radiusZ || radiusZ;
    tspeed = this.options.tspeed || tspeed;
    var innerHtml = "";
    for (var j = 0; j < this.options.tags.length; j++) {
      innerHtml += '<a href="' + this.options.tags[j].href + '" class="tagc">' + this.options.tags[j].value + '</a>'
    }
    this.$element.html(innerHtml);

    var i = 0;
    var oTag = null;
    oDiv = this.$element[0];
    aA = oDiv.getElementsByTagName('a');
    for (i = 0; i < aA.length; i++) {
      oTag = {};
      aA[i].onmouseover = (function (obj) {
        return function () {
          obj.on = true;
          this.style.zIndex = 9999;
          // this.style.color = '#fff';
          // this.style.padding = '5px 5px';
          this.style.filter = "alpha(opacity=100)";
          this.style.opacity = 1;
        }
      })(oTag)
      aA[i].onmouseout = (function (obj) {
        return function () {
          obj.on = false;
          this.style.zIndex = obj.zIndex;
          // this.style.color = '#fff';
          // this.style.padding = '5px';
          this.style.filter = "alpha(opacity=" + 100 * obj.alpha + ")";
          this.style.opacity = obj.alpha;
          this.style.zIndex = obj.zIndex;
        }
      })(oTag)
      oTag.offsetWidth = aA[i].offsetWidth;
      oTag.offsetHeight = aA[i].offsetHeight;
      mcList.push(oTag);
    }
    sineCosine(0, 0, 0);
    positionAll();
    (function () {
      update();
      setTimeout(arguments.callee, 40);
    })();
  }
  $.fn.whaleTagsCloud = function (options) {
    return this.each(function () {
      var whaleDropdownSelect = new WhaleTagsCloud(this, options)
      whaleDropdownSelect.init()
    });
  };
}(jQuery));
