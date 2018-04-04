var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2018 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.3.7';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.3.7';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d).prop(d, true);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d).prop(d, false);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target).closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
      // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
      e.preventDefault();
      // The target component still receive the focus
      if ($btn.is('input,button')) $btn.trigger('focus');else $btn.find('input:visible,button:visible').first().trigger('focus');
    }
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.3.7';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      $next[0].offsetWidth; // force reflow
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var href;
    var $this = $(this);
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    if (!$target.hasClass('carousel')) return;
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/*!
 * Mricode Pagination Plugin
 * Github: https://github.com/momopig/Mricode.Pagination
 * Version: 1.4.4
 * 
 * Required jQuery
 * 
 * Copyright 2016 Mricle
 * Released under the MIT license
 * Modified By momopig
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Globals
    factory(jQuery);
  }
})(function ($) {
  "use strict";

  var Page = function Page(element, options) {
    var defaultOption = {
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      pageBtnCount: 11,
      showFirstLastBtn: true,
      firstBtnText: null,
      lastBtnText: null,
      prevBtnText: "&laquo;",
      nextBtnText: "&raquo;",
      loadFirstPage: true,
      initSuccess: function initSuccess() {
        if (this.debug && console) {
          console.info('init success! just run once!');
        }
      },
      remote: {
        url: null,
        params: null,
        pageParams: null,
        success: null,
        beforeSend: null,
        complete: null,
        pageIndexName: 'pageIndex',
        pageSizeName: 'pageSize',
        totalName: 'total',
        traditional: false
      },
      pageElementSort: ['$page', '$size', '$jump', '$info'],
      showInfo: false,
      infoFormat: '{start} ~ {end} of {total} entires',
      noInfoText: '0 entires',
      showJump: false,
      jumpBtnText: 'Go',
      showPageSizes: false,
      pageSizeItems: [5, 10, 15, 20],
      debug: false
    };
    this.$element = $(element);
    this.$page = $('<ul class="m-pagination-page"></ul>').hide();
    this.$size = $('<div class="m-pagination-size"></div>').hide();
    this.$jump = $('<div class="m-pagination-jump"></div>').hide();
    this.$info = $('<div class="m-pagination-info"></div>').hide();
    this.options = $.extend(true, {}, defaultOption, $.fn.pagination.defaults, options);

    if (options.pageElementSort) {
      this.options.pageElementSort = options.pageElementSort;
    } else {
      if ($.fn.pagination.defaults && $.fn.pagination.defaults.pageElementSort) {
        this.options.pageElementSort = $.fn.pagination.defaults.pageElementSort;
      } else {
        this.options.pageElementSort = defaultOption.pageElementSort;
      }
    }
    this.options.pageSizeItems = options.pageSizeItems || ($.fn.pagination.defaults && $.fn.pagination.defaults.pageSizeItems ? $.fn.pagination.defaults.pageSizeItems : defaultOption.pageSizeItems);
    this.total = this.options.total;
    this.currentUrl = this.options.remote.url;
    this.currentPageIndex = utility.convertInt(this.options.pageIndex);
    this.currentPageSize = utility.convertInt(this.options.pageSize);
    this.currentParams = utility.deserializeParams(this.options.remote.params) || {};
    this.getLastPageNum = function () {
      return pagination.core.calLastPageNum(this.total, this.currentPageSize);
    };
    if (this.options.remote.success === null) {
      this.options.remote.success = this.options.remote.callback;
    }
    this.init();
  };

  Page.prototype = {
    getPageIndex: function getPageIndex() {
      return this.currentPageIndex;
    },
    getPageSize: function getPageSize() {
      return this.currentPageSize;
    },
    getParams: function getParams() {
      return this.currentParams;
    },
    setPageIndex: function setPageIndex(pageIndex) {
      if (pageIndex !== undefined && pageIndex !== null) {
        this.currentPageIndex = utility.convertInt(pageIndex);
      }
    },
    setPageSize: function setPageSize(pageSize) {
      if (pageSize !== undefined && pageSize !== null) {
        this.currentPageSize = utility.convertInt(pageSize);
      }
    },
    setRemoteUrl: function setRemoteUrl(url) {
      if (url) {
        this.currentUrl = url;
      }
    },
    setParams: function setParams(params) {
      if (params) {
        this.currentParams = utility.deserializeParams(params);
      }
    },
    render: function render(total) {
      if (total !== undefined && total !== null) {
        this.total = utility.convertInt(total);
      }
      this.renderPagination();
      this.debug('pagination rendered');
    },
    init: function init() {
      this.initHtml();
      this.initEvent();
      if (this.currentUrl && this.options.loadFirstPage) {
        this.remote();
      } else {
        this.renderPagination();
      }
      this.debug('pagination inited');
      this.options.initSuccess();
    },
    initHtml: function initHtml() {
      //init size module
      var sizeHtml = $('<select data-page-btn="size"></select>');
      var list = '';
      for (var i = 0; i < this.options.pageSizeItems.length; i++) {
        sizeHtml.append('<option value="' + this.options.pageSizeItems[i] + '" ' + (this.currentPageSize == this.options.pageSizeItems[i] ? "selected" : "") + ' >' + this.options.pageSizeItems[i] + '</option>');
        //自定义样式切换pagesize下拉列表
        list += '<li><a href="javascript:;" key=' + this.options.pageSizeItems[i] + '>' + this.options.pageSizeItems[i] + '条/页' + '</a></li>';
      }
      sizeHtml.val(this.currentPageSize);
      this.$size.append(sizeHtml);

      this.$size.append('<div class="list-container"><ul>' + list + '</ul></div>');
      //自定义样式的pagesize框
      this.$size.append('<div class="size-container"><span class="label">' + this.currentPageSize + '条/页' + '</span><span class="iconfont icon-dropdown-copy"></span><span class="iconfont icon-pickup2"></span></div>');

      //init jump module
      //添加自定义样式label字段
      var prefix = '跳转 ';
      var endfix = ' 页';
      var jumpHtml = '<span class="jump-prefix">' + prefix + '</span><div class="m-pagination-group"><input data-page-btn="jump" type="text"><button data-page-btn="jump" type="button">' + this.options.jumpBtnText + '</button></div><span class="jump-endfix">' + endfix + '</span>';
      this.$jump.append(jumpHtml);
      this.$jump.find('input').val(1);
      for (var i = 0; i < this.options.pageElementSort.length; i++) {
        this.$element.append(this[this.options.pageElementSort[i]]);
      }
    },
    initEvent: function initEvent() {
      this.$element.on('click', {
        page: this
      }, function (event) {
        event.stopPropagation();
        if ($(event.target).is('button')) {
          if ($(event.target).data('pageBtn') == 'jump') {
            var $input = event.data.page.$element.find('input[data-page-btn=jump]');
            event.data.page.jumpEventHandler($input.val(), event);
          }
        } else {
          if ($(event.target).data('pageIndex') !== undefined) eventHandler.call(event.data.page, event);

          //自定义样式pagesize下拉选择事件绑定
          if ($(event.target).parent().attr('class') == 'size-container') {
            var sizeContainer = $(event.target).parent();
            var paginationSize = sizeContainer.parent();
            var ul = paginationSize.find('ul');
            if (!ul.is(':visible')) {
              ul.slideDown("fast");
              sizeContainer.find('.icon-dropdown-copy').hide();
              sizeContainer.find('.icon-pickup2').css('display', 'inline-block');
            } else {
              ul.slideUp("fast");
              sizeContainer.find('.icon-pickup2').hide();
              sizeContainer.find('.icon-dropdown-copy').css('display', 'inline-block');
            }
          }
          if ($(event.target).closest('div').attr('class') == 'list-container') {
            var $this = $(event.target);
            var $paginationSize = $this.closest('.m-pagination-size');
            var txt = $this.text();
            var key = $this.attr("key");
            $paginationSize.find('.size-container .label').html(txt).attr('key', key);
            $this.closest('ul').hide();
            $paginationSize.find('.icon-pickup2').hide();
            $paginationSize.find('.icon-dropdown-copy').css('display', 'inline-block');
            var originSelect = $paginationSize.find('[data-page-btn="size"]');
            originSelect.val(key);
            originSelect.trigger('change');
          }
        }
      }).on('change', {
        page: this
      }, function (event) {
        var $this = $(event.target);
        if ($this.data('pageBtn') == 'jump') {
          event.data.page.jumpEventHandler($this.val(), event);
        }
        if ($this.data('pageBtn') == 'size') {
          eventHandler.call(event.data.page, event);
        }
      }).on('keypress', {
        page: this
      }, function (event) {
        if (event.keyCode == "13") {
          var $input = event.data.page.$element.find('input[data-page-btn=jump]');
          var pageIndex = $input.val();
          event.data.page.jumpEventHandler($input.val(), event);
          $input.val(pageIndex);
        }
      });
      //点击空白处 隐藏pagesize下拉列表
      $(document).on('click', function (e) {
        if ($('.m-pagination .list-container ul').is(':visible')) {
          var ul = $('.m-pagination .list-container ul');
          var paginationSize = ul.closest('.m-pagination-size');
          ul.hide();
          paginationSize.find('.size-container .icon-pickup2').hide();
          paginationSize.find('.size-container .icon-dropdown-copy').css('display', 'inline-block');
        }
      });
    },
    jumpEventHandler: function jumpEventHandler(inputValue, event) {
      if (!inputValue) {
        this.$jump.removeClass('error');
      } else if (!pagination.check.checkJumpPage(inputValue)) {
        this.$jump.addClass('error');
      } else if (utility.convertInt(inputValue) > this.getLastPageNum()) {
        this.$jump.addClass('error');
      } else {
        this.$jump.removeClass('error');
        eventHandler.call(this, event);
      }
    },

    doPagination: function doPagination() {
      if (this.currentUrl) {
        this.remote();
      } else {
        this.renderPagination();
      }
    },
    remote: function remote() {
      if (typeof this.options.remote.pageParams === 'function') {
        var pageParams = this.options.remote.pageParams.call(this, {
          pageIndex: this.currentPageIndex,
          pageSize: this.currentPageSize
        });
        this.currentParams = $.extend({}, this.currentParams, pageParams);
      } else {
        this.currentParams[this.options.remote.pageIndexName] = this.currentPageIndex;
        this.currentParams[this.options.remote.pageSizeName] = this.currentPageSize;
      }
      pagination.remote.getAjax(this, this.currentUrl, this.currentParams, this.ajaxCallBack, this.options.remote.beforeSend, this.options.remote.complete, this.options.remote.traditional);
    },

    ajaxCallBack: function ajaxCallBack(result) {
      var total = utility.mapObjectNameRecursion(result, this.options.remote.totalName);
      if (total == null || total == undefined) throw new Error("the response of totalName :  '" + this.options.remote.totalName + "'  not found.");
      total = utility.convertInt(total);
      this.total = total;
      var lastPageNum = this.getLastPageNum();
      if (this.currentPageIndex > 0 && lastPageNum - 1 < this.currentPageIndex) {
        this.setPageIndex(lastPageNum - 1);
        this.remote();
      } else {
        if (typeof this.options.remote.success === 'function') this.options.remote.success(result);
        this.renderPagination();
      }
    },

    onEvent: function onEvent(eventName, pageIndex, pageSize) {
      if (pageIndex != null) this.currentPageIndex = utility.convertInt(pageIndex);
      if (pageSize != null) this.currentPageSize = utility.convertInt(pageSize);
      this.doPagination();
      this.$element.trigger(eventName, {
        pageIndex: this.currentPageIndex,
        pageSize: this.currentPageSize
      });
      this.debug('pagination ' + eventName);
    },
    //生成分页
    renderPagination: function renderPagination() {
      var option = {
        showFirstLastBtn: this.options.showFirstLastBtn,
        firstBtnText: this.options.firstBtnText,
        prevBtnText: this.options.prevBtnText,
        nextBtnText: this.options.nextBtnText,
        lastBtnText: this.options.lastBtnText
      };
      var lastPageNum = this.getLastPageNum();
      this.currentPageIndex = lastPageNum > 0 && this.currentPageIndex > lastPageNum - 1 ? lastPageNum - 1 : this.currentPageIndex;
      this.$page.empty().append(pagination.core.renderPages(this.currentPageIndex, this.currentPageSize, this.total, this.options.pageBtnCount, option)).show();
      if (this.options.showPageSizes && lastPageNum !== 0) this.$size.show();else this.$size.hide();
      if (this.options.showJump && lastPageNum !== 0) this.$jump.show();else this.$jump.hide();
      this.$info.text(pagination.core.renderInfo(this.currentPageIndex, this.currentPageSize, this.total, this.options.infoFormat, this.options.noInfoText));
      if (this.options.showInfo) this.$info.show();else this.$info.hide();
    },
    //销毁分页
    destroy: function destroy() {
      this.$element.unbind().data("pagination", null).empty();
      this.debug('pagination destroyed');
    },
    debug: function debug(message, data) {
      if (this.options.debug && console) {
        message && console.info(message + ' : pageIndex = ' + this.currentPageIndex + ' , pageSize = ' + this.currentPageSize + ' , total = ' + this.total);
        data && console.info(data);
      }
    }
  };

  var eventHandler = function eventHandler(event) {
    var that = event.data.page;
    var $target = $(event.target);

    if (event.type === 'click' && $target.data('pageIndex') !== undefined && !$target.parent().hasClass('active')) {
      that.onEvent(pagination.event.pageClicked, $target.data("pageIndex"), null);
    } else if ((event.type === 'click' || event.type === 'keypress') && $target.data('pageBtn') === 'jump') {
      var pageIndexStr = that.$jump.find('input').val();
      if (utility.convertInt(pageIndexStr) <= that.getLastPageNum()) {
        that.onEvent(pagination.event.jumpClicked, pageIndexStr - 1, null);
        that.$jump.find('input').val(null);
      }
    } else if (event.type === 'change' && $target.data('pageBtn') === 'size') {
      var newPageSize = that.$size.find('select').val();
      var lastPageNum = pagination.core.calLastPageNum(that.total, newPageSize);
      if (lastPageNum > 0 && that.currentPageIndex > lastPageNum - 1) {
        that.currentPageIndex = lastPageNum - 1;
      }
      that.onEvent(pagination.event.pageSizeChanged, that.currentPageIndex, newPageSize);
    }
  };

  var pagination = {};
  pagination.event = {
    pageClicked: 'pageClicked',
    jumpClicked: 'jumpClicked',
    pageSizeChanged: 'pageSizeChanged'
  };
  pagination.remote = {
    getAjax: function getAjax(pagination, url, data, _success, _beforeSend, complate, traditional) {
      $.ajax({
        url: url,
        dataType: 'json',
        data: data,
        cache: false,
        traditional: traditional,
        contentType: 'application/Json',
        beforeSend: function beforeSend(XMLHttpRequest) {
          if (typeof _beforeSend === 'function') _beforeSend.call(this, XMLHttpRequest);
        },
        complete: function complete(XMLHttpRequest, textStatue) {
          if (typeof complate === 'function') complate.call(this, XMLHttpRequest, textStatue);
        },
        success: function success(result) {
          _success.call(pagination, result);
        }
      });
    }
  };
  pagination.core = {
    /*
    options : {
        showFirstLastBtn
        firstBtnText:
    }
    */
    renderPages: function renderPages(pageIndex, pageSize, total, pageBtnCount, options) {
      options = options || {};
      var pageNumber = pageIndex + 1;
      var lastPageNumber = this.calLastPageNum(total, pageSize);
      var html = [];

      if (lastPageNumber <= pageBtnCount) {
        html = this.renderGroupPages(1, lastPageNumber, pageNumber);
      } else {
        var firstPage = this.renderPerPage(options.firstBtnText || 1, 0);
        var lastPage = this.renderPerPage(options.lastBtnText || lastPageNumber, lastPageNumber - 1);

        //button count of  both sides
        var symmetryBtnCount = (pageBtnCount - 1 - 4) / 2;
        if (!options.showFirstLastBtn) symmetryBtnCount = symmetryBtnCount + 1;
        var frontBtnNum = (pageBtnCount + 1) / 2;
        var behindBtnNum = lastPageNumber - (pageBtnCount + 1) / 2;

        var prevPage = this.renderPerPage(options.prevBtnText, pageIndex - 1);
        var nextPage = this.renderPerPage(options.nextBtnText, pageIndex + 1);

        symmetryBtnCount = symmetryBtnCount.toString().indexOf('.') == -1 ? symmetryBtnCount : symmetryBtnCount + 0.5;
        frontBtnNum = frontBtnNum.toString().indexOf('.') == -1 ? frontBtnNum : frontBtnNum + 0.5;
        behindBtnNum = behindBtnNum.toString().indexOf('.') == -1 ? behindBtnNum : behindBtnNum + 0.5;
        if (pageNumber < frontBtnNum) {
          if (options.showFirstLastBtn) {
            html = this.renderGroupPages(1, pageBtnCount - 2, pageNumber);
            html.push(nextPage);
            html.push(lastPage);
          } else {
            html = this.renderGroupPages(1, pageBtnCount - 1, pageNumber);
            html.push(nextPage);
          }
        } else if (pageNumber > behindBtnNum) {
          if (options.showFirstLastBtn) {
            html = this.renderGroupPages(lastPageNumber - pageBtnCount + 3, pageBtnCount - 2, pageNumber);
            html.unshift(prevPage);
            html.unshift(firstPage);
          } else {
            html = this.renderGroupPages(lastPageNumber - pageBtnCount + 2, pageBtnCount - 1, pageNumber);
            html.unshift(prevPage);
          }
        } else {
          if (options.showFirstLastBtn) {
            html = this.renderGroupPages(pageNumber - symmetryBtnCount, pageBtnCount - 4, pageNumber);
            html.unshift(prevPage);
            html.push(nextPage);
            html.unshift(firstPage);
            html.push(lastPage);
          } else {
            html = this.renderGroupPages(pageNumber - symmetryBtnCount, pageBtnCount - 2, pageNumber);
            html.unshift(prevPage);
            html.push(nextPage);
          }
        }
      }
      return html;
    },
    renderGroupPages: function renderGroupPages(beginPageNum, count, currentPage) {
      var html = [];
      for (var i = 0; i < count; i++) {
        var page = this.renderPerPage(beginPageNum, beginPageNum - 1);
        if (beginPageNum === currentPage) page.addClass("active");
        html.push(page);
        beginPageNum++;
      }
      return html;
    },
    renderPerPage: function renderPerPage(text, value) {
      return $("<li><a data-page-index='" + value + "'>" + text + "</a></li>");
    },
    renderInfo: function renderInfo(currentPageIndex, currentPageSize, total, infoFormat, noInfoText) {
      if (total <= 0) {
        return noInfoText;
      } else {
        var startNum = currentPageIndex * currentPageSize + 1;
        var endNum = (currentPageIndex + 1) * currentPageSize;
        endNum = endNum >= total ? total : endNum;
        return infoFormat.replace('{start}', startNum).replace('{end}', endNum).replace('{total}', total);
      }
    },
    //计算最大分页数
    calLastPageNum: function calLastPageNum(total, pageSize) {
      total = utility.convertInt(total);
      pageSize = utility.convertInt(pageSize);
      var i = total / pageSize;
      return utility.isDecimal(i) ? parseInt(i) + 1 : i;
    }
  };
  pagination.check = {
    //校验跳转页数有效性
    checkJumpPage: function checkJumpPage(pageIndex) {
      var reg = /^\+?[1-9][0-9]*$/;
      return reg.test(pageIndex);
    }
  };

  var utility = {
    //转换为int
    convertInt: function convertInt(i) {
      if (typeof i === 'number') {
        return i;
      } else {
        var j = parseInt(i);
        if (!isNaN(j)) {
          return j;
        } else {
          throw new Error("convertInt Type Error.  Type is " + (typeof i === 'undefined' ? 'undefined' : _typeof(i)) + ', value = ' + i);
        }
      }
    },
    //返回是否小数
    isDecimal: function isDecimal(i) {
      return parseInt(i) !== i;
    },
    //匹配对象名称（递归）
    mapObjectNameRecursion: function mapObjectNameRecursion(object, name) {
      var obj = object;
      var arr = name.split('.');
      for (var i = 0; i < arr.length; i++) {
        obj = utility.mapObjectName(obj, arr[i]);
      }
      return obj;
    },
    //匹配对象名称
    mapObjectName: function mapObjectName(object, name) {
      var value = null;
      for (var i in object) {
        //过滤原型属性
        if (object.hasOwnProperty(i)) {
          if (i == name) {
            value = object[i];
            break;
          }
        }
      }
      return value;
    },
    deserializeParams: function deserializeParams(params) {
      var newParams = {};
      if (typeof params === 'string') {
        var arr = params.split('&');
        for (var i = 0; i < arr.length; i++) {
          var a = arr[i].split('=');
          newParams[a[0]] = decodeURIComponent(a[1]);
        }
      } else if (params instanceof Array) {
        for (var i = 0; i < params.length; i++) {
          newParams[params[i].name] = decodeURIComponent(params[i].value);
        }
      } else if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
        newParams = params;
      }
      return newParams;
    }
  };

  $.fn.pagination = function (option) {
    if (typeof option === 'undefined') {
      return $(this).data('pagination') || false;
    } else {
      var result;
      var args = arguments;
      this.each(function () {
        var $this = $(this);
        var data = $this.data('pagination');
        if (!data && typeof option === 'string') {
          throw new Error('MricodePagination is uninitialized.');
        } else if (data && (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
          throw new Error('MricodePagination is initialized.');
        }
        //初始化
        else if (!data && (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
            var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
            var data_api_options = $this.data();
            options = $.extend(options, data_api_options);
            $this.data('pagination', data = new Page(this, options));
          } else if (data && typeof option === 'string') {
            result = data[option].apply(data, Array.prototype.slice.call(args, 1));
          }
      });
      return typeof result === 'undefined' ? this : result;
    }
  };
});
/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.3.7';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.3.7';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.3.7';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.3.7';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) {
        // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      }
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null;
    });
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.3.7';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.popover-content').children().detach().end()[// we use append for html objects to maintain js events
    this.options.html ? typeof content == 'string' ? 'html' : 'append' : 'text'](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.3.7';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.3.7';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.3.7';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);

;(function ($) {
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
    var a,
        b,
        c = 0;
    a = Math.min(Math.max(-mouseY, -size), size) / radiusX * tspeed;
    b = -Math.min(Math.max(-mouseX, -size), size) / radiusX * tspeed;
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
      var ry1 = mcList[i].cy * ca + mcList[i].cz * -sa;
      var rz1 = mcList[i].cy * sa + mcList[i].cz * ca;

      var rx2 = rx1 * cb + rz1 * sb;
      var ry2 = ry1;
      var rz2 = rx1 * -sb + rz1 * cb;

      var rx3 = rx2 * cc + ry2 * -sc;
      var ry3 = rx2 * sc + ry2 * cc;
      var rz3 = rz2;

      mcList[i].cx = rx3;
      mcList[i].cy = ry3;
      mcList[i].cz = rz3;

      var per = d / (d + rz3);

      mcList[i].x = howElliptical * rx3 * per - howElliptical * 2;
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
        phi = Math.random() * Math.PI;
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
        if (aAs.display != '') aAs.display = '';
      } else {
        if (aAs.display != 'none') aAs.display = 'none';
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
    radiusZ: 90 // z轴半径
  };
  var WhaleTagsCloud = function WhaleTagsCloud(element, options) {
    this.options = $.extend({}, DEFAULT, options);
    this.$element = $(element);
  };

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
      innerHtml += '<a href="' + this.options.tags[j].href + '" class="tagc">' + this.options.tags[j].value + '</a>';
    }
    this.$element.html(innerHtml);

    var i = 0;
    var oTag = null;
    oDiv = this.$element[0];
    aA = oDiv.getElementsByTagName('a');
    for (i = 0; i < aA.length; i++) {
      oTag = {};
      aA[i].onmouseover = function (obj) {
        return function () {
          obj.on = true;
          this.style.zIndex = 9999;
          // this.style.color = '#fff';
          // this.style.padding = '5px 5px';
          this.style.filter = "alpha(opacity=100)";
          this.style.opacity = 1;
        };
      }(oTag);
      aA[i].onmouseout = function (obj) {
        return function () {
          obj.on = false;
          this.style.zIndex = obj.zIndex;
          // this.style.color = '#fff';
          // this.style.padding = '5px';
          this.style.filter = "alpha(opacity=" + 100 * obj.alpha + ")";
          this.style.opacity = obj.alpha;
          this.style.zIndex = obj.zIndex;
        };
      }(oTag);
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
  };
  $.fn.whaleTagsCloud = function (options) {
    return this.each(function () {
      var whaleDropdownSelect = new WhaleTagsCloud(this, options);
      whaleDropdownSelect.init();
    });
  };
})(jQuery);

;(function ($) {
  var _default = {
    data: {},
    isToggle: false
  };
  /*
   * 定义常量
   */
  // 矩形的高
  var H = 66;
  var rootH = 30;
  // 矩形的宽
  var W = 72;
  var rootW = 100;
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
    container.append('text').attr('x', -1000).attr('y', -1000).attr('font-size', fontSize).text(text);
    var bbox = container.node().getBBox();
    container.remove();
    return { height: bbox.height, width: bbox.width };
  }

  function formatExtraText(text) {
    text.each(function (d, idx, g) {
      var thisText = d3.select(g[idx]);
      if (d.parent) {
        var len = 5;
        var textStack = [];
        var name = d.data.value || '';
        var y = -15;
        var lineHeight = 15;
        var _i = 0;
        textStack.push({
          name: name,
          dx: -100 / 2,
          dy: lineHeight + y
        });
        textStack.forEach(function (v) {
          thisText.append('tspan').text(v.name).attr('y', v.dy).attr('x', v.dx).attr('fill', '#666').attr('class', 'extra-text');
          // .attr('textLength', width)
          // .attr('lengthAdjust', 'spacing')
          // .attr('font-size', '14px')
        });
      }
    });
  }
  function formatNodeName(text, width, h) {
    text.each(function (d, idx, g) {
      var thisText = d3.select(g[idx]);
      if (d.parent) {
        var len = 5;
        var textStack = [];
        var name = d.data.name || '';
        var y = -15;
        var lineHeight = 15;
        var _i2 = 0;
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: -width / 2,
            dy: _i2++ * lineHeight + y
          });
          name = name.slice(len);
        }
        textStack.push({
          name: name.slice(0),
          dx: -width / 2,
          dy: _i2 * lineHeight + y
        });
        textStack.forEach(function (v) {
          thisText.append('tspan').text(v.name).attr('y', v.dy).attr('x', v.dx).attr('fill', '#666');
          // .attr('textLength', width)
          // .attr('lengthAdjust', 'spacing')
          // .attr('font-size', '14px')
        });
      } else {
        thisText.append('tspan').text(d.data.name || '').attr('fill', '#333').attr('font-weight', 'bold').attr('x', function (d) {
          return -d.box.width / 2;
        }).attr('dx', 0).attr('y', h / 2 - 10).attr('dy', 0);
      }
    });
  }
  var StructureGraph = function StructureGraph(ele, options) {
    this.options = options;
    this.svg0 = d3.select(ele);
    this.width = +this.svg0.attr("width");
    this.height = +this.svg0.attr("height");
    this.svg = this.svg0.append('g').attr('class', 'whale-structure');
  };
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
      var tmp = node.x;
      node.x = node.y;
      node.y = tmp;
      // 计算文字长度
      node.box = measureText(node.data.name, "12px");
    });
    console.log(this.root);
  };
  StructureGraph.prototype.render = function () {
    // console.log(this.treeHeight);
    this.processData();
    this.g = this.svg.append("g").attr("transform", "translate(0, " + this.treeHeight / 2 + ")");
    this.renderArrow();
    this.renderLinks();
    this.renderNodes();
    this.bindZoom();
    if (this.options.isToggle) {
      this.bindToggle();
    }
  };
  // 生成一个箭头
  StructureGraph.prototype.renderArrow = function () {
    var defs = this.svg.append("defs");
    //添加marker标签及其属性
    var arrowMarker = defs.append("marker").attr("id", "arrow") // 重点是这个引用，使用的时候引用这个id就行
    .attr("markerUnits", "strokeWidth").attr("markerWidth", 12).attr("markerHeight", 12).attr("viewBox", "0 0 12 12").attr("refX", 6).attr("refY", 6).attr("orient", "auto");
    var arrow_path = "M6,2 L6,10 L2,6 L6,2";
    arrowMarker.append("path").attr("d", arrow_path).attr("fill", "#e3e3e3");
  };
  // 生成边
  StructureGraph.prototype.renderLinks = function () {
    var link = this.g.selectAll(".link").data(this.root.descendants().slice(1)).enter().append("path").attr("class", "link").attr("d", function (d) {
      return "M" + d.parent.y + "," + (d.parent.x + H / 2 + 6) + " L" + d.parent.y + "," + (d.parent.x + levelHeight / 2) + " L" + d.y + "," + (d.x - levelHeight / 2) + " L" + d.y + "," + (d.x - H / 2);
    }).attr("marker-start", "url(#arrow)");
    // .attr("marker-end", "url(#arrow)");
  };
  // 生成节点
  StructureGraph.prototype.renderNodes = function () {
    var node = this.g.selectAll(".node").data(this.root.descendants()).enter().append("g").attr("class", function (d) {
      return "node";
    }).attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });
    // 矩形
    var rectGroup = node.append('g');
    rectGroup.append("rect").attr("width", function (d) {
      if (d.parent) {
        return W;
      } else {
        return d.box.width + 6;
      }
    }).attr("height", function (d) {
      if (d.parent) {
        return H;
      } else {
        return rootH;
      }
    }).attr("fill", "#fff").attr("stroke", "#E3E3E3").attr("x", function (d) {
      return d.parent ? -W / 2 : -(d.box.width + 6) / 2;
    }).attr("y", function (d) {
      return d.parent ? -H / 2 : -rootH / 2 + (H - rootH) / 2;
    });
    rectGroup.append("text").attr("class", "node-toggle-text whale-structure-toggle-text");
    rectGroup.append("text").attr("class", "node-extra-text whale-structure-extra-text");
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
      var toggleIcon = rectGroup.append('g').attr('class', 'whale-structure-toggle-icon');

      toggleIcon.append('rect').attr('width', function (d) {
        return d.parent && d.children ? '12px' : 0;
      }).attr('height', function (d) {
        return d.parent && d.children ? '12px' : 0;
      }).attr('rx', '4px').attr('ry', '4px').attr('fill', '#D24545').attr('x', -6).attr('y', H / 2 - 6);

      toggleIcon.append('text').attr('x', -4).attr('y', H / 2 + 3).attr('fill', '#fff').text(function (d) {
        return d.parent && d.children ? '+' : '';
      });
    }

    node.selectAll('.node-toggle-text').call(formatNodeName, 60, H);
    // node.selectAll('.node-extra-text').call(formatExtraText);
    var extraText = rectGroup.append('g').attr('class', 'whale-structure-extra-text');

    extraText.append('rect').attr('width', function (d) {
      return d.data && d.data.value ? '36px' : 0;
    }).attr('height', function (d) {
      return d.data && d.data.value ? '14px' : 0;
    }).attr('fill', '#FFF').attr('x', -18).attr('y', -H / 2 - 15);

    extraText.append('text').attr('x', -18).attr('y', -H / 2 - 3).attr('fill', '#999').attr('font-size', 11).text(function (d) {
      return d.data && d.data.value ? d.data.value : '';
    });
  };
  // 绑定缩放事件
  StructureGraph.prototype.bindZoom = function () {
    function zoom() {
      d3.select('g.whale-structure').attr('transform', d3.event.transform);
    }
    var zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom);
    this.svg0.call(zoomListener);
  };
  // 绑定收缩事件
  StructureGraph.prototype.bindToggle = function () {
    this.svg.selectAll('.whale-structure-toggle-icon').on('click', toggle);
    function toggle(d) {
      console.log(d);
    }
  };
  // 隐藏节点和边
  StructureGraph.prototype.hide = function () {};
  // 显示节点和边
  StructureGraph.prototype.show = function () {};
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
  };
})(jQuery);

;(function ($) {
  var _default = {
    width: 718,
    height: 600,
    r: 20
  };

  var Force = function Force(ele, options) {
    this.options = options;
    this.ele = ele;

    d3.select(ele).selectAll('svg').remove();
    this.svg = d3.select(ele).append('svg').attr('width', options.width).attr('height', options.height).classed('force', true);
    this.vertexes = options.data.vertexes;
    this.edges = options.data.edges;
    this.edgeTypes = ['invest', 'officer'];
  };

  Force.prototype.preprocessData = function () {
    this.edges.forEach(function (e) {
      e.source = e._from;
      e.target = e._to;
      e._type = e._type || e._id.includes('/') && e._id.split('/')[0].toLowerCase();
    });
    this.vertexes.forEach(function (v) {
      v._type = v._type || v._id.includes('/') && v._id.split('/')[0].toLowerCase();
    });

    this.setIndex();

    return this;
  };

  Force.prototype.initChartLayers = function () {
    this.svg.append('g');
    this.svg.append('g').attr('class', 'chart-layer').append('g').attr('class', 'links');
    this.svg.select('.chart-layer').append('g').attr('class', 'nodes');

    return this;
  };

  Force.prototype.render = function () {
    var _this2 = this;

    /**
     * 定义箭头
     * @param {Object} svg 要添加进的 svg
     * @param {String} id 箭头 id
     * @param {Number} refX refX 位置
     * @param {String} pathDescr path d 元素
     * @param {String} className 箭头 class
     */
    function defineArrow(svg, id, refX, pathDescr) {
      var className = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

      svg.append('defs').append('marker').attr('id', id).attr('class', 'arrow-marker ' + className).attr('refX', refX).attr('refY', 5).attr('markerUnits', 'userSpaceOnUse').attr('markerWidth', 20).attr('markerHeight', 20).attr('orient', 'auto').append('path').attr('d', pathDescr);
    }

    /** 动态调整位置 */
    function tickActions() {
      // 移动 vertex 位置
      _this.svg.selectAll('g.node').attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

      // 调整label和边的距离
      _this.svg.selectAll('g .link-name').each(function (d, i, g) {
        var r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2));
        if (Math.abs(d.source.y - d.target.y) < r / 2) {
          d3.select(g[i]).attr('transform', 'translate(0, -5)');
        } else if (d.source.x > d.target.x && d.source.y > d.target.y || d.source.x < d.target.x && d.source.y < d.target.y) {
          d3.select(g[i]).attr('transform', 'translate(5, 0)');
        } else if (d.source.x > d.target.x && d.source.y < d.target.y || d.source.x < d.target.x && d.source.y > d.target.y) {
          d3.select(g[i]).attr('transform', 'translate(-5, 0)');
        }
      });

      _this.svg.selectAll('g .link-name textPath').each(function (d, i, g) {
        // 通过旋转 label, 使文字始终处于 edge 上方
        if (d.source.x > d.target.x) {
          d3.select(g[i]).attr('xlink:href', function (d) {
            return '#' + d._id.replace('/', '_') + _this.ele.id + '_reverse';
          });
        } else {
          d3.select(g[i]).attr('xlink:href', function (d) {
            return '#' + d._id + _this.ele.id;
          });
        }
      });

      // IE bug, marker-end 不能动态更新, 所以每次更新位置时都去除 path 再增加上 (note: 会有性能问题)
      if (window.ActiveXObject || /Trident\/7\./.test(navigator.userAgent)) {
        linkEnter.selectAll('path').remove();
        edge = linkEnter.append('path').attr('class', 'link').attr('linkIndex', function (d) {
          return d.linkIndex;
        }).attr('linkMap', function (d) {
          return d.linkNum;
        }).attr('marker-end', function (d) {
          return getArrow(d._type);
        });
      }

      // 计算 edge 的 path, 多条路径时计算弧度
      _this.svg.selectAll('.edge-path').each(function (d, i, g) {
        var dx = d.target.x - d.source.x;
        var dy = d.target.y - d.source.y;
        var dr = d.linkNum > 1 ? Math.sqrt(dx * dx + dy * dy) : 0;
        var middleIdx = (d.linkNum + 1) / 2;

        if (d.linkNum > 1) {
          dr = d.linkIndex === middleIdx ? 0 : dr / (Math.log(Math.abs(d.linkIndex - middleIdx) * 0.6 + 1) + 1 / (10 * Math.pow(d.linkNum, 2))); // 秘制调参
        }
        var sweepFlag = d.linkIndex > middleIdx ? 1 : 0;
        if (d.labelDirection) sweepFlag = 1 - sweepFlag;
        var path = 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y;

        // 自己指向自己
        if (d._from === d._to) {
          path = 'M' + d.source.x + ' ' + d.source.y + ' C ' + d.source.x + ' ' + (d.source.y - 150) + ',\n            ' + (d.source.x + 150) + ' ' + d.source.y + ', ' + d.source.x + ' ' + d.source.y;
        }

        d3.select(g[i]).attr('d', path).attr('id', d._id + _this.ele.id);
        // 增加一条反向的路径, 用于旋转 label
        d3.select('#' + d._id.replace('/', '_') + _this.ele.id + '_reverse').attr('d', 'M' + d.target.x + ',' + d.target.y + 'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y);
      });
    }

    /**
    * 对节点名称进行格式化
    * @param {Object} text text selection object
    */
    function textWrap(text) {
      text.each(function (d, idx, g) {
        var thisText = d3.select(g[idx]);
        var len = 16;
        var textStack = [];
        var name = d.name || d.case_id || '';
        if (d._type === 'Family_id') {
          name = '互为亲属';
        }
        var y = parseFloat(thisText.attr('y'));
        var lineHeight = 20;
        var i = 0;
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: 0,
            dy: i++ * lineHeight + y
          });
          name = name.slice(len);
        }
        textStack.push({
          name: name.slice(0),
          dx: 0,
          dy: i++ * lineHeight + y
        });
        textStack.forEach(function (v) {
          thisText.append('tspan').text(v.name).attr('y', v.dy).attr('x', v.dx).attr('class', v.risk ? 'risk-status' : '');
        });
      });
    }

    /**
     * 设置节点 icon
     * @param {Object} d vertex
     * @return {Object} svg image file
     */
    function setNodeIcon(d) {
      var type = d._type || d.entity_type || d._id.includes('/') && d._id.split('/')[0] || 'Company';

      return '/assets/img/examples/' + type + '.svg';
    }

    var _this = this;
    // define arrow
    this.edgeTypes.forEach(function (e) {
      defineArrow(_this.svg, 'arrow_' + e, _this.options.r + 9, 'M0,0 L10,5 L0,10 L2,5 z', e);
    });
    defineArrow(this.svg, 'arrow', this.options.r + 9, 'M0,0 L10,5 L0,10 L2,5 z');

    // setup
    var linkForce = d3.forceLink(this.edges).distance(200).id(function (d) {
      return d._id;
    });
    this.simulation = d3.forceSimulation().alphaDecay(0.07).nodes(this.vertexes).force('links', linkForce).force('charge_force', d3.forceManyBody().strength(-2500)).force('center_force', d3.forceCenter(this.options.width / 2, this.options.height / 2)).force('x', d3.forceX()).force('y', d3.forceY()).force('collision', d3.forceCollide(1.5 * this.options.r)).on('tick', tickActions);

    // add vertexes
    var nodeEnter = this.svg.select('.nodes').selectAll('g').data(this.vertexes).enter().append('g').attr('class', 'node').attr('node-type', function (d) {
      return d._type;
    });

    nodeEnter.append('circle').attr('r', this.options.r).attr('class', 'circle');

    nodeEnter.append('text').attr('class', 'node-name').attr('y', '35').style('text-anchor', 'middle');

    nodeEnter.selectAll('.node-name').call(textWrap);

    nodeEnter.append('image').attr('xlink:href', function (d) {
      return setNodeIcon(d);
    }).attr('width', this.options.r * 2).attr('height', this.options.r * 2).attr('contextMenuTarget', true).attr('id', function (d) {
      return d._id;
    }).attr('name', function (d) {
      return d.name;
    }).attr('x', -this.options.r).attr('y', -this.options.r);

    // add edges
    var linkEnter = this.svg.select('.links').selectAll('g').data(this.edges).enter().append('g').attr('class', function (d) {
      return d._type;
    });

    var edge = linkEnter.append('path').attr('class', function (d) {
      return 'link ' + d._type;
    }).classed('edge-path', true).attr('linkIndex', function (d) {
      return d.linkIndex;
    }).attr('linkMap', function (d) {
      return d.linkNum;
    }).attr('marker-end', function (d) {
      return _this2.edgeTypes.includes(d._type) ? 'url(#arrow_' + d._type + ')' : 'url(#arrow)';
    });

    // 增加反向路径, 用于旋转 label
    this.svg.select('defs').selectAll('.reverse-path').data(this.edges).enter().append('path').attr('id', function (d) {
      return d._id.replace('/', '_') + _this.ele.id + '_reverse';
    });

    // add edge text
    linkEnter.append('text').attr('class', function (d) {
      return 'link-name ' + (d._id.split('/') && d._id.split('/')[0].toLowerCase());
    }).append('textPath').attr('xlink:href', function (d) {
      return '#' + d._id + _this.ele.id;
    }).attr('startOffset', '50%').text(function (d) {
      return d.label;
    });

    return this;
  };

  /**
   * 计算起点和终点相同边的条数，并加到link属性里
   * 计算每个点的度，并加到 vertex 的 degree 属性中
   * @return {Object} this this
   */
  Force.prototype.setIndex = function () {
    var linkNumMap = {};
    var nodeNumMap = {};
    var linkDirection = {};
    this.edges.forEach(function (edge) {
      if (linkNumMap[edge._from + edge._to] === undefined) {
        linkNumMap[edge._from + edge._to] = linkNumMap[edge._to + edge._from] = 1;
        linkDirection[edge._from + edge._to] = linkDirection[edge._to + edge._from] = edge._from;
      } else {
        linkNumMap[edge._from + edge._to]++;
        linkNumMap[edge._to + edge._from]++;
      }

      nodeNumMap[edge._from] = nodeNumMap[edge._from] ? nodeNumMap[edge._from] + 1 : 1;
      nodeNumMap[edge._to] = nodeNumMap[edge._to] ? nodeNumMap[edge._to] + 1 : 1;
      edge.linkIndex = linkNumMap[edge._from + edge._to];
    });
    this.edges.forEach(function (edge) {
      edge.linkNum = linkNumMap[edge._from + edge._to];
      edge.labelDirection = linkDirection[edge._from + edge._to] === edge._from ? 1 : 0;
    });
    this.vertexes.forEach(function (vertex) {
      vertex.degree = nodeNumMap[vertex._id];
    });

    return this;
  };

  Force.prototype.bind = function () {
    /**
     * dragStart 开始拖拽
     * @param  {Object} d vertex
     */
    function dragStart(d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    /**
     * 拖动
     * @param {Object} d vertex
     */
    function drag(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    /**
     * 结束拖动
     * @param {Object} d vertex
     */
    function dragEnd(d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    /** 缩放 */
    function zoom() {
      _this.svg.select('g.chart-layer').attr('transform', d3.event.transform);
    }

    var _this = this;

    // 注册缩放事件
    this.zoomListener = d3.zoom().scaleExtent([0.1, 5]).on('zoom', zoom);
    // 缩放配置
    this.svg.call(this.zoomListener);
    // 清空缩放事件
    var t = d3.zoomIdentity.translate(0, 0).scale(1);
    this.svg.call(this.zoomListener.transform, t);

    // 拖拽配置
    var dragHandler = d3.drag().on('start', dragStart).on('drag', drag).on('end', dragEnd);

    dragHandler(this.svg.selectAll('.node'));

    return this;
  };

  Force.prototype.init = function () {
    this.preprocessData().initChartLayers().render().bind();
  };

  $.fn.force = function (method, options) {
    options = $.extend({}, _default, options);
    var force = new Force(this[0], options);
    force[method] && force[method]();
  };
})(jQuery);

;(function ($) {
  var DEFAULT = {
    duration: 750,
    i: 0
  };

  function TreeGraph(config) {
    this.ele = config.ele;
    this.config = config;
  }

  TreeGraph.prototype.render = function (data) {
    // Set the dimensions and margins of the diagram
    var margin = { top: 20, right: 90, bottom: 30, left: 90 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.svg = d3.select(this.ele).append("svg").attr('class', 'whale-tree').attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // declares a tree layout and assigns the size
    this.treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(data, function (d) {
      return d.children;
    });
    this.root.x0 = height / 2;
    this.root.y0 = 0;

    // Collapse after the second level
    this.root.children.forEach(collapse);

    this.update(this.root);
  };

  // Collapse the node and all it's children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  TreeGraph.prototype.update = function (source) {
    var _this = this;
    // Assigns the x and y position for the nodes
    var treeData = this.treemap(this.root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = this.svg.selectAll('g.node').data(nodes, function (d) {
      return d.id || (d.id = ++_this.config.i);
    });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g').attr('class', 'node').attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    }).on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle').attr('class', 'node').attr('r', 1e-6).style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

    // Add labels for the nodes
    nodeEnter.append('text').attr("dy", ".35em").attr("x", function (d) {
      return d.children || d._children ? -13 : 13;
    }).attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    }).text(function (d) {
      return d.data.name;
    });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition().duration(this.config.duration).attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

    // Update the node attributes and style
    nodeUpdate.select('circle.node').attr('r', 10).style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    }).attr('cursor', 'pointer');

    // Remove any exiting nodes
    var nodeExit = node.exit().transition().duration(this.config.duration).attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    }).remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = this.svg.selectAll('path.link').data(links, function (d) {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g").attr("class", "link").attr('d', function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition().duration(this.config.duration).attr('d', function (d) {
      return diagonal(d, d.parent);
    });

    // Remove any exiting links
    var linkExit = link.exit().transition().duration(this.config.duration).attr('d', function (d) {
      var o = { x: source.x, y: source.y };
      return diagonal(o, o);
    }).remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

      path = 'M ' + s.y + ' ' + s.x + '\n              C ' + (s.y + d.y) / 2 + ' ' + s.x + ',\n                ' + (s.y + d.y) / 2 + ' ' + d.x + ',\n                ' + d.y + ' ' + d.x;

      return path;
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      _this.update(d);
    }
  };

  $.fn.treeGraph = function (data, config) {
    var config = $.extend(true, {}, DEFAULT, config);
    config.ele = this[0];
    var graph = new TreeGraph(config);
    try {
      graph.render(data);
    } catch (e) {
      console.error(e);
    }
  };
})(jQuery);

;(function ($, d3) {
  var _default = {
    width: 850,
    height: 570,
    onChangePath: function onChangePath() {},
    onClickLeaf: function onClickLeaf() {},
    sumByType: 'size'

    /** constructor */
  };function Treemap(ele, options) {
    var data = options.data;

    this.options = options;
    d3.select(ele).selectAll('.d3-treemap').remove();
    this.container = d3.select(ele).append('div').classed('d3-treemap', true);
    this.breadcrumbUl = this.container.append('ul').classed('breadcrumb-list', true);
    this.svg = this.container.append('svg').style('width', options.width).style('height', options.height);
    this.data = JSON.parse(JSON.stringify(data));
    this.breadcrumb = [data.name];

    var fader = function fader(color) {
      return d3.interpolateRgb(color, "#fff")(0.2);
    };
    this.color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)), this.format = d3.format(",d");
    this.treemap = d3.treemap().tile(d3.treemapResquarify).size([options.width, options.height]).round(true).paddingInner(8);
    this.root = this.genHierarchyData(data);
    this.selectedId = this.root.children && this.root.children[0].data.id;
  }

  /** methods */
  Treemap.prototype.init = function init() {
    this.render(this.root).bind();
  };

  Treemap.prototype.genHierarchyData = function genHierarchyData(data) {
    var _this = this;
    return d3.hierarchy(data).eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + (d.data.id || d.data.name);
    }).sum(function (d) {
      return d[_this.options.sumByType];
    }).sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });
  };

  Treemap.prototype.render = function render(data) {
    if (!data) return;

    var _this = this;
    this.treemap(data);

    // 画图
    var cell = this.svg.selectAll("g").data(data.children).enter().append("g").classed('rect-container', true).classed('can-drill-down', function (d) {
      return !!d.data.children;
    }).classed('selected', function (d) {
      return _this.selectedId === d.data.id;
    }).attr("transform", function (d) {
      return "translate(" + d.x0 + "," + d.y0 + ")";
    });

    cell.append("rect").attr('class', 'rect').attr("id", function (d) {
      return d.data.id;
    }).attr("width", function (d) {
      return d.x1 - d.x0;
    }).attr("height", function (d) {
      return d.y1 - d.y0;
    }).attr("fill", function (d) {
      return _this.color(d.data.id);
    });

    cell.append("clipPath").attr("id", function (d) {
      return "clip-" + d.data.id;
    }).append("use").attr("xlink:href", function (d) {
      return "#" + d.data.id;
    });

    var textEnter = cell.append("text").attr('class', 'rect-text').attr("clip-path", function (d) {
      return "url(#clip-" + d.data.id + ")";
    }).selectAll("tspan").data(function (d) {
      d.totalCount = d.leaves().map(function (l) {
        return l.data.count || 0;
      }).reduce(function (acc, cur) {
        return acc + cur;
      });
      var data = d.data.name.split(/(?=[A-Z][^A-Z])/g);
      if (!d.data.show_key) {
        data = data.concat(['金额: ' + _this.format(d.value) + '元', '笔数: ' + _this.format(d.totalCount)]);
      } else {
        d.data.show_key.forEach(function (k) {
          data.push(d.data.key_map[k] + ': ' + d.data[k]);
        });
      }

      return data;
    }).enter().append("tspan").attr("x", 10).attr("y", function (d, i) {
      return 20 + i * 15;
    }).text(function (d) {
      return d;
    });

    cell.append("title").text(function (d, i, g) {
      var begin = textEnter._groups.slice(0, i).reduce(function (acc, cur) {
        return acc + cur.length;
      }, 0);
      var end = begin + textEnter._groups[i].length;
      var data = textEnter.data().slice(begin, end);
      return data.join('\n');
    });

    // 画面包屑
    var breadcrumb = this.container.select('.breadcrumb-list').selectAll('li').data(this.breadcrumb);
    breadcrumb.enter().append('li').classed('breadcrumb-item', true).merge(breadcrumb).text(function (d) {
      return d;
    });
    breadcrumb.exit().remove();

    return this;
  };

  Treemap.prototype.findChildrenByName = function findChildrenByName(name) {
    var _this = this;
    var data = JSON.parse(JSON.stringify(this.data));
    var children = data.children;
    var id = data.id;
    for (var i = 1; i < this.breadcrumb.length; i++) {
      if (!children) return null;

      children = children.find(function (c) {
        id = c.id;
        return c.name === _this.breadcrumb[i];
      }).children;
    }

    if (!children || !children.length) return null;

    var newData = {
      id: id,
      name: name,
      children: children
    };

    return newData;
  };

  Treemap.prototype.reRender = function reRender(newData) {
    this.svg.selectAll('*').remove();
    newData = this.genHierarchyData(newData);
    this.selectedId = newData.children[0].data.id;
    this.render(newData).bind();

    this.options.onChangePath(this.breadcrumb);
  };

  Treemap.prototype.bind = function bind() {
    var _this = this;

    // 下钻事件
    d3.selectAll('.d3-treemap .rect-container').on('click', function (d, i, nodes) {
      var name = d.data.name;
      _this.breadcrumb.push(name);
      var newData = _this.findChildrenByName(name);
      if (!newData) {
        _this.options.onClickLeaf(_this.breadcrumb);
        _this.breadcrumb.pop();
        d3.select(this.parentNode).selectAll('.rect-container').classed('selected', false);
        d3.select(this).classed('selected', true);
        return;
      }

      _this.reRender(newData);
    });

    // 点击面包屑, 上钻
    _this.container.selectAll('.d3-treemap .breadcrumb-item').on('click', function (d, i, nodes) {
      if (i === _this.breadcrumb.length - 1) return;

      _this.breadcrumb = _this.breadcrumb.slice(0, i + 1);
      var newData = _this.findChildrenByName(d);
      _this.reRender(newData);
    });

    return this;
  };

  /** api */
  $.fn.treemap = function (options) {
    options = $.extend({}, _default, options);

    if (options && options.data) {
      var treemap = new Treemap(this[0], options);
      treemap.init();
    }
  };
})(jQuery, d3);

;window.whaleRadial = function (win, doc) {
  function getColor(idx) {
    var palette = ['#D24545', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050', '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'];
    return palette[idx % palette.length];
  }
  // 构造函数
  function WhaleRadial(options) {
    var self = this;
    self.box = options.element;
    WhaleRadial.boxes.push(self.box);
    var width = options.width,
        height = options.height;
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
    var webs = main.append('g').classed('webs', true);
    webs.selectAll('polygon').data(polygons.webs).enter().append('polygon').attr('points', function (d) {
      return d;
    });
    // 添加纵轴
    var lines = main.append('g').classed('lines', true);
    lines.selectAll('line').data(polygons.webPoints[0]).enter().append('line').attr('x1', 0).attr('y1', 0).attr('x2', function (d) {
      return d.x;
    }).attr('y2', function (d) {
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
        });
      }
      areasData.push({
        polygon: area,
        points: points
      });
    }
    // 添加g分组包含所有雷达图区域
    var areas = main.append('g').classed('areas', true);
    // 添加g分组用来包含一个雷达图区域下的多边形以及圆点
    areas.selectAll('g').data(areasData).enter().append('g').attr('class', function (d, i) {
      return 'area' + (i + 1);
    });
    for (var i = 0; i < areasData.length; i++) {
      // 依次循环每个雷达图区域
      var area = areas.select('.area' + (i + 1)),
          areaData = areasData[i];
      // 绘制雷达图区域下的多边形
      area.append('polygon').attr('points', areaData.polygon).attr('stroke', function (d, index) {
        return getColor(i);
      }).attr('fill', function (d, index) {
        return getColor(i);
      });
      // 绘制雷达图区域下的点
      var circles = area.append('g').classed('circles', true);
      circles.selectAll('circle').data(areaData.points).enter().append('circle').attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).attr('r', 3).attr('stroke', function (d, index) {
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
    var texts = main.append('g').classed('texts', true);
    texts.selectAll('text').data(textPoints).enter().append('text').attr('x', function (d) {
      return d.x;
    }).attr('y', function (d) {
      return d.y;
    }).attr('font-size', "10px").text(function (d, i) {
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
  };

  WhaleRadial._otherPrivateMethod = function () {};

  // 原型方法
  WhaleRadial.prototype = {
    constructor: WhaleRadial, // 反向引用构造器

    exampleMethod1: function exampleMethod1() {},

    exampleMethod2: function exampleMethod2() {}
  };

  return function (options) {
    // factory
    options = options || {};
    var selector = options.selector,
        elements = doc.querySelectorAll(selector),
        instance = [];
    for (var index = 0, len = elements.length; index < len; index++) {
      options.element = elements[index];
      if (!!WhaleRadial._set(options.element)) {
        // 保证实例是唯一的
        instance.push(new WhaleRadial(options));
      }
    }
    return instance;
  };
}(window, document);

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
    onClick: function onClick() {}
  };

  function Histogram(ele, options) {
    this.options = options;
    d3.select(ele).selectAll('svg').remove();
    this.svg = d3.select(ele).append('svg').attr('width', options.width).attr('height', options.height).classed('histogram', true);

    var margin = this.options.margin;
    this.width = +this.svg.attr("width") - margin.left - margin.right;
    this.height = +this.svg.attr("height") - margin.top - margin.bottom;
    this.xScale = d3.scaleTime().domain(this.options.xRange).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain(this.options.yRange).range([this.height, 0]);
  }

  Histogram.prototype.render = function render() {
    var _this = this;
    var dataset = this.options.data;
    var margin = this.options.margin;
    var g = this.svg.append("g").classed('axis', true).attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var formatNumber = d3.format(".1f");

    this.xAxis = d3.axisBottom(this.xScale).ticks(d3.timeDay) // 以天为tick
    .tickFormat(function (d) {
      var date = d.getDate();
      date = date > 9 ? date : '0' + date;
      return d.getMonth() + 1 + '-' + date;
    });

    var yHistoAxis = d3.axisRight(this.yScale).tickSize(this.width).tickFormat(function (d) {
      var s = formatNumber(d);
      return this.parentNode.nextSibling ? "\xa0" + s : s + " 万元";
    });

    // 横坐标
    g.append("g").classed('x-axis', true).attr("transform", "translate(0," + this.height + ")").call(customXAxis);

    // 纵坐标
    g.append("g").classed('y-axis', true).call(customYAxis);

    function customXAxis(g) {
      g.call(_this.xAxis);
    }

    function customYAxis(g) {
      g.call(yHistoAxis);
      g.selectAll(".tick line").attr("stroke", "#E3E3E3");
      g.selectAll(".tick text").attr("x", -40);
    }

    this.addLabel();
    // 柱状图
    this.drawHistogram();

    return this;
  };

  Histogram.prototype.drawHistogram = function drawHistogram() {
    var rectPadding = 4;
    var margin = this.options.margin;
    var data = this.options.data;
    var _this = this;
    var tickDis = this.xScale(new Date(data[1].time).getTime()) - this.xScale(new Date(data[0].time).getTime());

    var rects = this.svg.append('g').classed('histogram-group', true).selectAll(".bar").data(this.options.data).enter().append("rect").attr("class", "bar").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("x", function (d) {
      return _this.getCurX(d) - tickDis / 2 - 5;
    }).attr("y", function (d) {
      return _this.yScale(d[_this.options.key]);
    }).attr("width", 36).attr("height", function (d) {
      return _this.height - _this.yScale(d[_this.options.key]);
    });
  };

  Histogram.prototype.addLabel = function addLabel() {
    this.svg.append("text").attr("y", 15).attr("x", 20).classed('y-label', true).text(this.options.label);
  };

  Histogram.prototype.getCurX = function getCurX(d) {
    return this.xScale(new Date(d.time).getTime()); // + this.options.margin.left
  };

  Histogram.prototype.bind = function bind() {
    var _this = this;
    d3.selectAll('.bar').on('click', function (d) {
      _this.options.onClick(d);
    });
  };

  $.fn.histogram = function (options) {
    options = $.extend({}, _default, options);
    if (this[0]) {
      var histogram = new Histogram(this[0], options);
      histogram.render().bind();
    }
  };
})(jQuery, d3);

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
  var _default = _defineProperty({
    width: 600,
    height: 500,
    margin: { top: 20, right: 20, bottom: 20, left: 50 },
    lineKey: 'x',
    histoKey: 'y',
    lineLabel: '',
    histoLabel: '',
    lineLegend: ''
  }, 'histoLabel', '');

  function LineHistogram(ele, options) {
    this.options = options;
    d3.select(ele).selectAll('svg').remove();
    this.svg = d3.select(ele).append('svg').attr('width', options.width).attr('height', options.height).classed('line-histogram', true);

    var margin = this.options.margin;
    this.width = +this.svg.attr("width") - margin.left - margin.right;
    this.height = +this.svg.attr("height") - margin.top - margin.bottom;
    this.xScale = d3.scaleTime().domain(this.options.xRange).range([0, this.width]);
    this.yScaleHisto = d3.scaleLinear().domain(this.options.yHistoRange).range([this.height, 0]);
    this.yScaleLine = d3.scaleLinear().domain(this.options.yLineRange).range([this.height, 0]);
  }

  LineHistogram.prototype.render = function render() {
    var _this = this;
    var dataset = this.options.data;
    var margin = this.options.margin;
    var g = this.svg.append("g").classed('axis', true).attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var formatNumber = d3.format(".1f");

    this.xAxis = d3.axisBottom(this.xScale).ticks(d3.timeYear); // 以年为tick, 还需支持季度、月、星期、天

    var yHistoAxis = d3.axisRight(this.yScaleHisto).tickSize(this.width).tickFormat(function (d) {
      var s = formatNumber(d);
      return this.parentNode.nextSibling ? "\xa0" + s : s + " 元";
    });
    var yLineAxis = d3.axisLeft(this.yScaleLine).tickSize(5);

    // 横坐标
    g.append("g").classed('x-axis', true).attr("transform", "translate(0," + this.height + ")").call(customXAxis);

    // 纵坐标
    g.append("g").classed('y-axis', true).call(customYAxis);

    // 右方纵坐标
    g.append("g").classed('y-line-axis', true).attr("transform", "translate(" + (this.width - 1) + ",0)").call(yLineAxis);

    function customXAxis(g) {
      g.call(_this.xAxis);
    }

    function customYAxis(g) {
      g.call(yHistoAxis);
      g.selectAll(".tick line").attr("stroke", "#E3E3E3");
      g.selectAll(".tick text").attr("x", -40);
    }

    this.addLabel();
    // 柱状图
    this.drawHistogram();
    // 折线图
    this.drawLine();
    this.addLegend();

    return this;
  };

  LineHistogram.prototype.drawLine = function drawLine() {
    var _this = this;

    var line = d3.line().x(this.getCurX.bind(this)).y(function (d) {
      return _this.yScaleLine(d[_this.options.lineKey]);
    }).curve(d3.curveNatural);
    this.svg.append('g').classed('line-group', true).append("path").datum(this.options.data).classed('line', true).attr("d", line);
    this.svg.select('.line-group').selectAll('.dot').data(this.options.data).enter().append('circle').attr('class', 'dot').attr('cx', this.getCurX.bind(this)).attr('cy', function (d, i) {
      return _this.yScaleLine(d[_this.options.lineKey]);
    }).attr('r', 2.5);
  };

  LineHistogram.prototype.drawHistogram = function drawHistogram() {
    var rectPadding = 4;
    var margin = this.options.margin;
    var data = this.options.data;
    var _this = this;
    var tickDis = this.xScale(new Date(data[1].time).getTime()) - this.xScale(new Date(data[0].time).getTime());

    var rects = this.svg.append('g').classed('histogram-group', true).selectAll(".bar").data(this.options.data).enter().append("rect").attr("class", "bar").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("x", function (d) {
      return _this.getCurX(d) - tickDis / 2 - 16;
    }).attr("y", function (d) {
      return _this.yScaleHisto(d[_this.options.histoKey]);
    }).attr("width", 36).attr("height", function (d) {
      return _this.height - _this.yScaleHisto(d[_this.options.histoKey]);
    });
  };

  LineHistogram.prototype.addLabel = function addLabel() {
    this.svg.append("text").attr("y", 15).attr("x", 20).classed('y-label', true).text(this.options.histoLabel);

    this.svg.append('text').attr('y', 15).attr('x', this.width + 40).classed('y-label', true).text(this.options.lineLabel);
  };

  LineHistogram.prototype.addLegend = function addLegend() {
    var legend = this.svg.append('g').attr('class', 'legend-group').attr('transform', 'translate(' + (this.width - 50) + ',' + 15 + ')');
    addLegendItem(this.options.histoLegend, 'histogram-group');
    addLegendItem(this.options.lineLegend, 'line-group');

    function addLegendItem(text, linkName) {
      var g = legend.append('g').attr('link', linkName);

      g.append('circle').attr('r', 6).attr('class', 'outer');
      g.append('circle').attr('r', 4).attr('class', 'inner');
      g.append('text').text(text);
    }
  };

  LineHistogram.prototype.getCurX = function getCurX(d) {
    return this.xScale(new Date(d.time).getTime()) + this.options.margin.left;
  };

  LineHistogram.prototype.bind = function bind() {
    var isHide = {};

    this.svg.selectAll('.legend-group > g').on('click', function (d, i, node) {
      var linkName = d3.select(this).attr('link');
      isHide[linkName] = !isHide[linkName];
      d3.select('[link=' + linkName + '] .inner').classed('hide', isHide[linkName]);
      d3.selectAll('.' + linkName).style('opacity', isHide[linkName] ? 0 : 1);
    });

    return this;
  };

  $.fn.lineHistogram = function (options) {
    options = $.extend({}, _default, options);
    if (this[0]) {
      var lineHistogram = new LineHistogram(this[0], options);
      lineHistogram.render().bind();
    }
  };
})(jQuery, d3);

/*
 * Jquery Message插件
 * 使用例子 :
 * 1. $.alert("提示内容",{
 *      title : "标题",
 *      position : ['left', [-0.1,0]]
 * })
 * 2. $.alert("提示内容","标题");
 * 位置请使用
 * top-left,top-right,bottom-left,bottom-right,center 大小写都可以哦
 */

(function ($) {
  $.alertExt = {
    // state 到 css图标名映射
    state2Css: {
      "info": "message",
      "warning": "warning",
      "success": "right",
      "danger": "wrong"
    },
    // 默认配置
    defaults: {
      id: '',
      autoClose: true, // 自动关闭
      closeTime: 3000, // 自动关闭时间，不少于1000
      withTime: false, // 添加计时  会在文字后面添加  ...10
      type: 'success', // 提示类型, ['success', 'danger', 'warning', 'info']
      isDetail: true, // 是否为详细类型弹窗
      position: ['center', [-0.42, 0]], // 位置,第一个写位置; 后面是相对于window的偏移，如果是1跟-1之间为百分比, [top, right]
      title: '', // 标题
      close: '', // 需绑定关闭事件的按钮
      speed: 'normal', // fadeIn / fadeOut 速度
      isOnly: true, // 是否只出现一个
      minTop: 10, //最小Top
      onShow: function onShow() {}, // 打开后回调
      onClose: function onClose() {}, // 关闭后回调
      onNoMoreAlert: function onNoMoreAlert() {} // 点击不再显示后回调
    },

    // 提示框模版
    detailTmpl: '<div class="whale-alert alert-dismissable clearfix alert-detail ${Type}">' + '<i class="type-icon iconfont icon-toast-${State}"></i>' + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' + '<i class="close-white-icon iconfont icon-close"></i>' + '</button>' + '<h4 style="white-space: nowrap;">' + '${Title}' + '</h4>' + '<p>' + '<span class="msg">${Content}</span>' + '<span class="no-more-alert"><i class="checkbox iconfont icon-non-check"></i>不再提示</span>' + '</p>' + '</div>',
    basicTmpl: '<div class="whale-alert alert-dismissable clearfix alert-basic ${Type}">' + '<p class="msg">' + '${Content}' + '</p>' + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' + '<i class="close-white-icon iconfont icon-close"></i>' + '</button>' + '</div>',

    noMoreAlertList: [],

    // 初始化函数
    init: function init(msg, options) {
      if (this.noMoreAlertList.indexOf(options.id) > -1) return false;

      this.options = $.extend({}, this.defaults, options);

      this.create(msg);
      this.setCss();

      this.bindEvent();

      return this.alertDiv;
    },

    template: function template(tmpl, data) {
      $.each(data, function (k, v) {
        tmpl = tmpl.replace('${' + k + '}', v);
      });
      return $(tmpl);
    },

    // 创建提示框
    create: function create(msg) {
      var tmpl = this.options.isDetail ? this.detailTmpl : this.basicTmpl;
      this.alertDiv = this.template(tmpl, {
        State: this.state2Css[this.options.type],
        Type: 'alert-' + this.options.type,
        Title: this.options.title,
        Content: msg
      }).hide();
      if (this.options.isOnly) {
        $('body > .whale-alert').remove();
      }
      this.alertDiv.appendTo($('body'));
    },

    // 设置样式
    setCss: function setCss() {
      var alertDiv = this.alertDiv;

      // 初始化样式
      alertDiv.css({
        'position': 'fixed',
        'z-index': 10001 + $(".whale-alert").length
      });

      // IE6兼容
      var ie6 = 0;
      if ($.browser && $.browser.msie && $.browser.version == '6.0') {
        alertDiv.css('position', 'absolute');
        ie6 = $(window).scrollTop();
      }

      // 位置设置提取
      var position = this.options.position,
          posStr = position[0].split('-'),
          pos = [0, 0];
      if (position.length > 1) {
        pos = position[1];
      }

      // 偏移百分比检测
      if (pos[0] > -1 && pos[0] < 1) {
        pos[0] = pos[0] * $(window).height();
      }
      if (pos[1] > -1 && pos[1] < 1) {
        pos[1] = pos[1] * $(window).width();
      }

      // 位置设置
      for (var i in posStr) {
        if ($.type(posStr[i]) !== 'string') {
          continue;
        }
        var str = posStr[i].toLowerCase();

        if ($.inArray(str, ['left', 'right']) > -1) {
          alertDiv.css(str, pos[1]);
        } else if ($.inArray(str, ['top', 'bottom']) > -1) {
          alertDiv.css(str, pos[0] + ie6);
        } else {
          alertDiv.css({
            'top': ($(window).height() - alertDiv.outerHeight()) / 2 + pos[0] + ie6,
            'left': ($(window).width() - alertDiv.outerWidth()) / 2 + pos[1]
          });
        }
      }

      if (parseInt(alertDiv.css('top')) < this.options.minTop) {
        alertDiv.css('top', this.options.minTop);
      }
    },

    // 绑定事件
    bindEvent: function bindEvent() {
      this.bindShow();
      this.bindClose();
      this.bindNoMoreAlert();

      if ($.browser && $.browser.msie && $.browser.version == '6.0') {
        this.bindScroll();
      }
    },

    // 显示事件
    bindShow: function bindShow() {
      var ops = this.options;
      this.alertDiv.fadeIn(ops.speed, function () {
        ops.onShow($(this));
      });
    },

    // 关闭事件
    bindClose: function bindClose() {
      var alertDiv = this.alertDiv,
          ops = this.options,
          closeBtn = $('.close', alertDiv).add($(this.options.close, alertDiv));

      closeBtn.bind('click', function (e) {
        alertDiv.fadeOut(ops.speed, function () {
          $(this).remove();
          ops.onClose($(this));
        });
        e.stopPropagation();
      });

      // 自动关闭绑定
      if (ops.autoClose) {
        var time = parseInt(ops.closeTime / 1000);
        if (ops.withTime) {
          $('p', alertDiv).append('<span>...<em class="close-time-count">' + time + '</em></span>');
        }
        var timer = setInterval(function () {
          $('.close-time-count', alertDiv).text(--time);
          if (!time) {
            clearInterval(timer);
            closeBtn.trigger('click');
          }
        }, 1000);
      }
    },

    // 不再提示事件
    bindNoMoreAlert: function bindNoMoreAlert() {
      var ops = this.options;
      var _this = this;
      $('.no-more-alert', this.alertDiv).on('click', function (e) {
        var $checkbox = $(this).find('.checkbox');
        var idx = _this.noMoreAlertList.indexOf(ops.id);
        if ($checkbox.hasClass('icon-check_focus')) {
          $checkbox.removeClass('icon-check_focus').addClass('icon-non-check');
          if (idx > -1) {
            _this.noMoreAlertList.splice(idx, 1);
          }
        } else {
          $checkbox.addClass('icon-check_focus').removeClass('icon-non-check');
          if (idx === -1) {
            _this.noMoreAlertList.push(ops.id);
          }
        }
        ops.onNoMoreAlert($(this));
      });
    },

    // IE6滚动跟踪
    bindScroll: function bindScroll() {
      var alertDiv = this.alertDiv,
          top = alertDiv.offset().top - $(window).scrollTop();
      $(window).scroll(function () {
        alertDiv.css("top", top + $(window).scrollTop());
      });
    },

    // 检测是否为手机浏览器
    checkMobile: function checkMobile() {
      var userAgent = navigator.userAgent;
      var keywords = ['Android', 'iPhone', 'iPod', 'iPad', 'Windows Phone', 'MQQBrowser'];
      for (var i in keywords) {
        if (userAgent.indexOf(keywords[i]) > -1) {
          return keywords[i];
        }
      }
      return false;
    }
  };

  $.whaleAlert = function (msg, arg) {
    arg = arg || {};
    if ($.alertExt.checkMobile()) {
      alert(msg);
      return;
    }
    if (!$.trim(msg).length) {
      return false;
    }
    if ($.type(arg) === "string") {
      arg = {
        title: arg
      };
    }
    // 对于详细消息提示，如果没有title，将msg作为title
    if (arg.isDetail !== false && !arg.title) {
      arg.title = msg;
      msg = '';
    }
    // 统一消息类型
    if (arg) {
      switch (arg.type) {
        case 'error':
          arg.type = 'danger';
          break;
        case 'positive':
          arg.type = 'info';
          break;
        default:
          break;
      }
    }
    if (arg.id === undefined) {
      arg.id = arg.title + '-' + msg;
    }

    return $.alertExt.init(msg, arg);
  };
})(jQuery);

// 实现部分
;(function ($) {
  // 先序
  var eachBefore = function eachBefore(callback) {
    var node = this,
        nodes = [node],
        children,
        i;
    while (node = nodes.pop()) {
      callback(node), children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i]);
      }
    }
    return this;
  };
  // 后序
  var eachAfter = function eachAfter(callback) {
    var node = this,
        nodes = [node],
        next = [],
        children,
        i,
        n;
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
  };
  // 找当前节点
  var findNodeById = function findNodeById(id) {
    var node = this,
        nodes = [node],
        children,
        i;
    while (node = nodes.pop()) {
      if (id === node.id) {
        return node;
      }
      children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i]);
      }
    }
    return null;
  };
  // 找祖先节点
  var findAncestorsidsByNode = function findAncestorsidsByNode(node) {
    var arr = [];
    if (node) {
      while (node = node.parent) {
        if (node.id != -1) arr.push(node.id);
      }
    }
    return arr;
  };
  // 找子孙节点
  var findChildrenidsByNode = function findChildrenidsByNode(nodes) {
    var arr = [],
        caches = [],
        cache,
        children,
        x = 0;
    if (nodes) {
      caches.push(nodes);
      while (cache = caches.pop()) {
        var children = cache.children;
        if (children) for (i = children.length - 1; i >= 0; --i) {
          arr.push(children[i].id);
          caches.push(children[i]);
        }
      }
    }
    return arr;
  };
  function Node(data) {
    this.data = data;
    this.id = data.id;
    this.depth = 0;
    this.open = true;
    this.height = 0;
    this.parent = null;
  }
  Node.prototype = {
    eachBefore: eachBefore, // 先序遍历
    eachAfter: eachAfter, // 后序遍历
    findNodeById: findNodeById,
    findAncestorsidsByNode: findAncestorsidsByNode,
    findChildrenidsByNode: findChildrenidsByNode
  };
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
        onclick: function onclick($this, id, node) {
          console.log(id, node);
        },
        selectNode: function selectNode($this, id, node, checked) {
          console.log(id, node, checked);
        }
      }
    }
  },
      html = '',
      indent = 18,
      caches = {},

  //  通用工具以及缓存创建的tree，防止创建一个页面多个tree
  tool = {
    deepCopy: function deepCopy(obj) {
      if (obj === null) return null;
      var o = Object.prototype.toString.apply(obj) === "[object Array]" ? [] : {};
      for (var i in obj) {
        o[i] = obj[i] instanceof Date ? new Date(obj[i].getTime()) : _typeof(obj[i]) === "object" ? tool.deepCopy(obj[i]) : obj[i];
      }
      return o;
    },
    getCache: function getCache(treeId) {
      return caches[treeId];
    },
    setCache: function setCache(treeId, cache) {
      if (caches[treeId]) {
        return;
      }
      caches[treeId] = cache;
    }
  },
      event = {
    close: function close($this, $ele, sons, root) {
      $this.removeClass('open');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _i3 = _step.value;

          $($ele.find("[data-id= " + _i3 + "]")).addClass('hide');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    expand: function expand($this, $ele, sons, root) {
      var recordOpen = [];
      $this.addClass('open');
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var i = _step2.value;

          var son = root.findNodeById(i);
          if (son.children && !$($ele.find("[data-id= " + i + "]")).hasClass('open')) {
            recordOpen = recordOpen.concat(root.findChildrenidsByNode(son));
          }
          if (recordOpen.indexOf(i) < 0) {
            $($ele.find("[data-id= " + i + "]")).removeClass('hide');
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    },
    highLight: function highLight($this, $ele, sons, ancestors) {
      if ($this.hasClass('active')) {
        $this.removeClass('active');
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = sons[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _i4 = _step3.value;

            $($ele.find("[data-id= " + _i4 + "]")).removeClass('active');
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        $this.addClass('active');
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = ancestors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _i5 = _step4.value;

            $($ele.find("[data-id= " + _i5 + "]")).addClass('active');
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = sons[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _i6 = _step5.value;

            $($ele.find("[data-id= " + _i6 + "]")).addClass('active');
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
    }
  };
  function appendHtml(node, settings) {
    if (node.id == -1) return;
    var isCheck = settings.setting.check.enable;
    var childrenLogo = settings.setting.expand;
    var hasClass = settings.setting.class;
    html += '<div class="item ' + (node.data.class ? node.data.class : "") + ' ' + (node.children ? "parent" : "") + ' ' + (node.children && node.open ? 'open' : '') + '" data-id="' + node.id + '"\n       ' + (hasClass ? "" : "style=padding-left:" + (node.depth - 1) * indent + "px") + '>\n          ' + (node.children && !node.data.class ? "<span class='expand'></span>" : "") + '\n          ' + (!node.children && childrenLogo && childrenLogo.children ? "<span class='" + childrenLogo.children + "'></span>" : "") + '\n          <span>' + node.data.name + '</span>\n          ' + (isCheck ? node.children ? "<span class='check-all'>全选</span>" : "<span class='check-box'></span>" : "") + '\n      </div>';
  }
  function defaultChildren(d) {
    return d.children;
  }
  function WhaleTree($ele, options) {
    if (!$ele.hasClass('whale-tree')) {
      $ele.addClass('whale-tree');
    }
    var treeId = $ele.attr('id');
    var _optionDefault = tool.deepCopy(_options);
    html = '', indent = 18;
    var settings = {
      setting: $.extend(true, {}, _optionDefault.setting, options.setting),
      data: options.data
    };
    var hasClass = settings.setting.class;
    if (hasClass) {
      $ele.addClass(hasClass);
    }
    var dataBox = {
      id: -1,
      name: 'all'
    };
    dataBox.children = settings.data;
    var root = new Node(dataBox);
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
    tool.setCache(treeId, root);
    root.eachBefore(function (node) {
      appendHtml(node, settings);
    }); // 先序遍历生成html字符串
    $ele.html(html);
    // 点击事件
    $ele.on('click', '.item', function (e) {
      e.stopPropagation();
      var $this = $(this);
      var id = $this.data('id');
      var node = root.findNodeById(id);
      var ancestors = root.findAncestorsidsByNode(node);
      var sons = root.findChildrenidsByNode(node);
      if (settings.setting.check && settings.setting.check.enable) {
        // 展开和收起，收起：就是儿子全hide；展开：儿子看是否已经展开
        if ($this.hasClass('open')) {
          event.close($this, $ele, sons, root);
        } else {
          event.expand($this, $ele, sons, root);
        }
      } else if (settings.setting.expand && settings.setting.expand.enable) {
        // 展开和收起，收起：就是儿子全hide；展开：儿子看是否已经展开
        if ($this.hasClass('open')) {
          event.close($this, $ele, sons, root);
        } else {
          event.expand($this, $ele, sons, root);
        }
      } else {
        // 高亮祖先节点 和 当前节点
        event.highLight($this, $ele, sons, ancestors);
      }
      settings.setting.callback.onclick ? settings.setting.callback.onclick($this, id, node.data) : _optionDefault.setting.callback.onclick($this, id, node.data);
    });
    // 选中操作
    $ele.find('.item').on('click', '.check-box, .check-all', function (e) {
      e.stopPropagation();
      var $parent = $(e.target).parent('.item');
      var $this = $(this);
      var id = $parent.data('id');
      var node = root.findNodeById(id);
      var ancestors = root.findAncestorsidsByNode(node);
      var sons = root.findChildrenidsByNode(node);
      var checked = true;
      node = [node.data];
      if ($this.hasClass('check-all')) {
        event.expand($parent, $ele, sons, root);
        if ($this.hasClass('checked')) {
          $this.removeClass('checked');
          $this.text('全选');
          checked = false;
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = sons[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var _i7 = _step6.value;

              node.push(root.findNodeById(_i7).data);
              $($ele.find("[data-id= " + _i7 + "] .check-box")).removeClass('checked');
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }
        } else {
          $this.addClass('checked');
          $this.text('取消全选');
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = sons[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _i8 = _step7.value;

              var hasChecked = $($ele.find("[data-id= " + _i8 + "] .check-box")).hasClass('checked');
              if (!hasChecked) {
                var sonNode = root.findNodeById(_i8).data;
                node.push(sonNode);
                $($ele.find("[data-id= " + _i8 + "] .check-box")).addClass('checked');
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      } else {
        if ($this.hasClass('checked')) {
          checked = false;
          $this.removeClass('checked');
        } else {
          $this.addClass('checked');
        }
      }
      settings.setting.callback.selectNode ? settings.setting.callback.selectNode($this, id, node, checked) : _optionDefault.setting.callback.selectNode($this, id, node, checked);
    });
  }
  function unSelectTree($ele, options) {
    $dom = $($ele.find("[data-id= " + options + "] .check-box"));
    if ($dom.hasClass('checked')) {
      $dom.removeClass('checked');
    } else {
      $dom.addClass('checked');
    }
  }
  $.fn.whaleTree = function (type, options) {
    if (type == 'init') {
      return this.each(function () {
        new WhaleTree($(this), options);
      });
    } else if (type == 'unSelect') {
      return new unSelectTree($(this), options);
    }
  };
})(jQuery);

/*!
 * Datepicker v0.6.4
 * https://github.com/fengyuanchen/datepicker
 *
 * Copyright (c) 2014-2017 Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2017-11-24T14:38:23.820Z
 */

// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
//     typeof define === 'function' && define.amd ? define(['jquery'], factory) :
//       (factory(global.jQuery));
// }(window,
;(function ($) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  var DEFAULTS = {
    // Show time picker section
    showTime: false,

    // Show the datepicker automatically when initialized
    autoShow: false,

    // Hide the datepicker automatically when picked
    autoHide: false,

    // Pick the initial date automatically when initialized
    autoPick: false,

    // Enable inline mode
    inline: false,

    // A element (or selector) for putting the datepicker
    container: null,

    // A element (or selector) for triggering the datepicker
    trigger: null,

    // The ISO language code (built-in: en-US)
    language: '',

    // The date string format
    format: 'MM/DD/YYYY',

    // The initial date
    date: null,

    // The start view date
    startDate: null,

    // The end view date
    endDate: null,

    // The start view when initialized
    startView: 0, // 0 for days, 1 for months, 2 for years

    // The start day of the week
    // 0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday,
    // 4 for Thursday, 5 for Friday, 6 for Saturday
    weekStart: 1,

    // Show year before month on the datepicker header
    yearFirst: true,

    // A string suffix to the year number.
    yearSuffix: '年',

    // Days' name of the week.
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

    // Shorter days' name
    daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

    // Shortest days' name
    daysMin: ['日', '一', '二', '三', '四', '五', '六'],

    // Months' name
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

    // Shorter months' name
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

    // A element tag for each item of years, months and days
    itemTag: 'li',

    // A class (CSS) for muted date item
    mutedClass: 'muted',

    // A class (CSS) for picked date item
    pickedClass: 'picked',

    // A class (CSS) for disabled date item
    disabledClass: 'disabled',

    // A class (CSS) for highlight date item
    highlightedClass: 'highlighted',

    // The template of the datepicker
    template: '<div class="datepicker-container">' + '<div class="datepicker-panel" data-view="years picker">' + '<ul>' + '<li data-view="years prev">&lsaquo;</li>' + '<li data-view="years current"></li>' + '<li data-view="years next">&rsaquo;</li>' + '</ul>' + '<ul data-view="years"></ul>' + '</div>' + '<div class="datepicker-panel" data-view="months picker">' + '<ul>' + '<li data-view="year prev">&lsaquo;</li>' + '<li data-view="year current"></li>' + '<li data-view="year next">&rsaquo;</li>' + '</ul>' + '<ul data-view="months"></ul>' + '</div>' + '<div class="datepicker-panel" data-view="days picker">' + '<ul>' + '<li data-view="month prev">&lsaquo;</li>' + '<li data-view="month current"></li>' + '<li data-view="month next">&rsaquo;</li>' + '</ul>' + '<ul data-view="week"></ul>' + '<ul data-view="days"></ul>' + '<div class="operation-bar" data-view="operation-bar">' + '<span class="now" data-view="now">现在</span>' + '<div class="right-box">' + '<span class="toggle" data-view="toggle">选择时间</span>' + '<span class="ok" data-view="ok">确定</span>' + '</div>' + '</div>' + '</div>' + '<div class="datepicker-panel" data-view="time picker">' + '<p class="title"><span>时</span><span>分</span><span>秒</span></p>' + '<ul data-view="hours" class="scroll-style"></ul>' + '<ul data-view="minutes" class="scroll-style"></ul>' + '<ul data-view="seconds" class="scroll-style"></ul>' + '<div class="operation-bar" data-view="operation-bar">' + '<span class="now" data-view="now">现在</span>' + '<div class="right-box">' + '<span class="toggle" data-view="toggle">选择日期</span>' + '<span class="ok" data-view="ok">确定</span>' + '</div>' + '</div>' + '</div>' + '</div>',

    // The offset top or bottom of the datepicker from the element
    offset: 10,

    // The `z-index` of the datepicker
    zIndex: 1000,

    // Filter each date item (return `false` to disable a date item)
    filter: null,

    // Event shortcuts
    show: null,
    hide: null,
    pick: null
  };

  var WINDOW = typeof window !== 'undefined' ? window : {};
  var NAMESPACE = 'datepicker';
  var EVENT_CLICK = 'click.' + NAMESPACE;
  var EVENT_SCROLL = 'scroll.' + NAMESPACE;
  var EVENT_FOCUS = 'focus.' + NAMESPACE;
  var EVENT_HIDE = 'hide.' + NAMESPACE;
  var EVENT_KEYUP = 'keyup.' + NAMESPACE;
  var EVENT_PICK = 'pick.' + NAMESPACE;
  var EVENT_RESIZE = 'resize.' + NAMESPACE;
  var EVENT_SHOW = 'show.' + NAMESPACE;
  var CLASS_HIDE = NAMESPACE + '-hide';
  var LANGUAGES = {};
  var VIEWS = {
    DAYS: 0,
    MONTHS: 1,
    YEARS: 2,
    TIMES: 3
  };

  var toString = Object.prototype.toString;

  function typeOf(obj) {
    return toString.call(obj).slice(8, -1).toLowerCase(); // Object.prototype.toString => [object type]
  }

  function isString(value) {
    return typeof value === 'string';
  }

  var isNaN = Number.isNaN || WINDOW.isNaN;

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  function isUndefined(value) {
    return typeof value === 'undefined';
  }

  function isDate(value) {
    return typeOf(value) === 'date';
  }

  function proxy(fn, context) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args2[_key2] = arguments[_key2];
      }

      return fn.apply(context, args.concat(args2));
    };
  }

  function selectorOf(view) {
    return '[data-view="' + view + '"]';
  }

  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  function getDaysInMonth(year, month) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  function getMinDay(year, month, day) {
    return Math.min(day, getDaysInMonth(year, month));
  }

  function parseFormat(format) {
    var source = String(format);
    var parts = source.match(/(Y|M|D|h|m|s)+/g);

    if (!parts) {
      throw new Error('Invalid date format.');
    }

    format = {
      source: source,
      parts: parts
    };

    $.each(parts, function (i, part) {
      switch (part) {
        case 'DD':
        case 'D':
          format.hasDay = true;
          break;

        case 'MM':
        case 'M':
          format.hasMonth = true;
          break;

        case 'YYYY':
        case 'YY':
          format.hasYear = true;
          break;

        case 'hh':
        case 'h':
          format.hasHour = true;
          break;

        case 'mm':
        case 'm':
          format.hasMinute = true;
          break;

        case 'ss':
        case 's':
          format.hasSecond = true;
          break;

        default:
      }
    });

    return format;
  }

  function getScrollableParent(node) {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return getScrollableParent(node.parentNode);
    }
  }

  var methods = {
    // Show the datepicker
    show: function show() {
      if (!this.built) {
        this.build();
      }

      if (this.shown) {
        return;
      }

      if (this.trigger(EVENT_SHOW).isDefaultPrevented()) {
        return;
      }

      this.shown = true;
      this.$picker.removeClass(CLASS_HIDE).on(EVENT_CLICK, $.proxy(this.click, this));
      this.showView(this.options.startView);

      if (!this.inline) {
        $(window).on(EVENT_RESIZE, this.onResize = proxy(this.place, this));
        $(document).on(EVENT_CLICK, this.onGlobalClick = proxy(this.globalClick, this));
        $(this.$scrollableParent).on(EVENT_SCROLL, this.onGlobalScroll = proxy(this.globalScroll, this));
        $(document).on(EVENT_KEYUP, this.onGlobalKeyup = proxy(this.globalKeyup, this));
        this.place();
      }
    },

    // Hide the datepicker
    hide: function hide() {
      if (!this.shown) {
        return;
      }

      if (this.trigger(EVENT_HIDE).isDefaultPrevented()) {
        return;
      }

      this.shown = false;
      this.$picker.addClass(CLASS_HIDE).off(EVENT_CLICK, this.click);

      if (!this.inline) {
        $(window).off(EVENT_RESIZE, this.onResize);
        $(document).off(EVENT_CLICK, this.onGlobalClick);
        $(document).off(EVENT_KEYUP, this.onGlobalKeyup);
        $(this.$scrollableParent).off(EVENT_SCROLL, this.onGlobalScroll);
      }
    },
    toggle: function toggle() {
      if (this.shown) {
        this.hide();
      } else {
        this.show();
      }
    },

    // Update the datepicker with the current input value
    update: function update() {
      var value = this.getValue();

      if (value === this.oldValue) {
        return;
      }

      this.setDate(value, true);
      this.oldValue = value;
    },

    /**
     * Pick the current date to the element
     *
     * @param {String} _view (private)
     */
    pick: function pick(_view) {
      var $this = this.$element;
      var date = this.date;

      if (this.trigger(EVENT_PICK, {
        view: _view || '',
        date: date
      }).isDefaultPrevented()) {
        return;
      }

      date = this.formatDate(this.date);
      this.setValue(date);

      if (this.isInput) {
        $this.trigger('input');
        $this.trigger('change');
      }
    },

    // Reset the datepicker
    reset: function reset() {
      this.setDate(this.initialDate, true);
      this.setValue(this.initialValue);

      if (this.shown) {
        this.showView(this.options.startView);
      }
    },

    /**
     * Get the month name with given argument or the current date
     *
     * @param {Number} month (optional)
     * @param {Boolean} short (optional)
     * @return {String} (month name)
     */
    getMonthName: function getMonthName(month, short) {
      var options = this.options;
      var monthsShort = options.monthsShort;
      var months = options.months;

      if ($.isNumeric(month)) {
        month = Number(month);
      } else if (isUndefined(short)) {
        short = month;
      }

      if (short === true) {
        months = monthsShort;
      }

      return months[isNumber(month) ? month : this.date.getMonth()];
    },

    /**
     * Get the day name with given argument or the current date
     *
     * @param {Number} day (optional)
     * @param {Boolean} short (optional)
     * @param {Boolean} min (optional)
     * @return {String} (day name)
     */
    getDayName: function getDayName(day, short, min) {
      var options = this.options;
      var days = options.days;

      if ($.isNumeric(day)) {
        day = Number(day);
      } else {
        if (isUndefined(min)) {
          min = short;
        }

        if (isUndefined(short)) {
          short = day;
        }
      }

      if (min) {
        days = options.daysMin;
      } else if (short) {
        days = options.daysShort;
      }

      return days[isNumber(day) ? day : this.date.getDay()];
    },

    /**
     * Get the current date
     *
     * @param {Boolean} formatted (optional)
     * @return {Date|String} (date)
     */
    getDate: function getDate(formatted) {
      var date = this.date;

      return formatted ? this.formatDate(date) : new Date(date);
    },

    /**
     * Set the current date with a new date
     *
     * @param {Date} date
     * @param {Boolean} _updated (private)
     */
    setDate: function setDate(date, _updated) {
      var filter = this.options.filter;

      if (isDate(date) || isString(date)) {
        date = this.parseDate(date);

        if ($.isFunction(filter) && filter.call(this.$element, date) === false) {
          return;
        }

        this.date = date;
        this.viewDate = new Date(date);

        if (!_updated) {
          this.pick();
        }

        if (this.built) {
          this.render();
        }
      }
    },

    /**
     * Set the start view date with a new date
     *
     * @param {Date} date
     */
    setStartDate: function setStartDate(date) {
      if (isDate(date) || isString(date)) {
        this.startDate = this.parseDate(date);

        if (this.built) {
          this.render();
        }
      }
    },

    /**
     * Set the end view date with a new date
     *
     * @param {Date} date
     */
    setEndDate: function setEndDate(date) {
      if (isDate(date) || isString(date)) {
        this.endDate = this.parseDate(date);

        if (this.built) {
          this.render();
        }
      }
    },

    /**
     * Parse a date string with the set date format
     *
     * @param {String} date
     * @return {Date} (parsed date)
     */
    parseDate: function parseDate(date) {
      var format = this.format;

      var parts = [];

      if (isDate(date)) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      } else if (isString(date)) {
        parts = date.match(/\D+/g) || [];
      }

      date = new Date();

      var length = format.parts.length;

      var year = date.getFullYear();
      var day = date.getDate();
      var month = date.getMonth();

      if (parts.length === length) {
        $.each(parts, function (i, part) {
          var value = parseInt(part, 10) || 1;

          switch (format.parts[i]) {
            case 'DD':
            case 'D':
              day = value;
              break;

            case 'MM':
            case 'M':
              month = value - 1;
              break;

            case 'YY':
              year = 2000 + value; // 默认基数为 2000 年
              break;

            case 'YYYY':
              year = value;
              break;

            default:
          }
        });
      }

      return new Date(year, month, day);
    },

    /**
     * Format a date object to a string with the set date format
     *
     * @param {Date} date
     * @return {String} (formatted date)
     */
    formatDate: function formatDate(date) {
      var format = this.format;

      var formatted = '';

      if (isDate(date)) {
        var year = date.getFullYear();
        var values = {
          D: date.getDate(),
          M: date.getMonth() + 1,
          YY: year.toString().substring(2),
          YYYY: year,
          h: date.getHours(),
          m: date.getMinutes(),
          s: date.getSeconds()
        };

        values.DD = (values.D < 10 ? '0' : '') + values.D;
        values.MM = (values.M < 10 ? '0' : '') + values.M;
        values.hh = (values.h < 10 ? '0' : '') + values.h;
        values.mm = (values.m < 10 ? '0' : '') + values.m;
        values.ss = (values.s < 10 ? '0' : '') + values.s;
        formatted = format.source;
        $.each(format.parts, function (i, part) {
          formatted = formatted.replace(part, values[part]);
        });
      }

      return formatted;
    },

    // Destroy the datepicker and remove the instance from the target element
    destroy: function destroy() {
      this.unbind();
      this.unbuild();
      this.$element.removeData(NAMESPACE);
    }
  };

  var handlers = {
    click: function click(e) {
      var $target = $(e.target);
      var options = this.options,
          viewDate = this.viewDate,
          format = this.format;

      e.stopPropagation();
      e.preventDefault();

      if ($target.hasClass('disabled')) {
        return;
      }

      var view = $target.data('view');
      var viewYear = viewDate.getFullYear();
      var viewMonth = viewDate.getMonth();
      var viewDay = viewDate.getDate();
      var viewHour = viewDate.getHours();
      var viewMinute = viewDate.getMinutes();
      var viewSecond = viewDate.getSeconds();

      switch (view) {
        case 'years prev':
        case 'years next':
          {
            viewYear = view === 'years prev' ? viewYear - 10 : viewYear + 10;
            this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
            this.renderYears();
            break;
          }

        case 'year prev':
        case 'year next':
          viewYear = view === 'year prev' ? viewYear - 1 : viewYear + 1;
          this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
          this.renderMonths();
          break;

        case 'year current':
          if (format.hasYear) {
            this.showView(VIEWS.YEARS);
          }

          break;

        case 'year picked':
          if (format.hasMonth) {
            this.showView(VIEWS.MONTHS);
          } else {
            $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
            this.hideView();
          }

          this.pick('year');
          break;

        case 'year':
          viewYear = parseInt($target.text(), 10);
          this.date = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));

          if (format.hasMonth) {
            this.viewDate = new Date(this.date);
            this.showView(VIEWS.MONTHS);
          } else {
            $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
            this.hideView();
          }

          this.pick('year');
          break;

        case 'month prev':
        case 'month next':
          viewMonth = view === 'month prev' ? viewMonth - 1 : viewMonth + 1;

          if (viewMonth < 0) {
            viewYear -= 1;
            viewMonth += 12;
          } else if (viewMonth > 11) {
            viewYear += 1;
            viewMonth -= 12;
          }

          this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
          this.renderDays();
          break;

        case 'month current':
          if (format.hasMonth) {
            this.showView(VIEWS.MONTHS);
          }

          break;

        case 'month picked':
          if (format.hasDay) {
            this.showView(VIEWS.DAYS);
          } else {
            $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
            this.hideView();
          }

          this.pick('month');
          break;

        case 'month':
          viewMonth = $.inArray($target.text(), options.monthsShort);
          this.date = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));

          if (format.hasDay) {
            this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
            this.showView(VIEWS.DAYS);
          } else {
            $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
            this.hideView();
          }

          this.pick('month');
          break;

        case 'day prev':
        case 'day next':
        case 'day':
          if (view === 'day prev') {
            viewMonth -= 1;
          } else if (view === 'day next') {
            viewMonth += 1;
          }

          viewDay = parseInt($target.text(), 10);
          this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.renderDays();

          if (view === 'day' && !options.showTime) {
            this.hideView();
          }

          this.pick('day');
          break;

        case 'day picked':
          this.hideView();
          this.pick('day');
          break;

        case 'hour':
          viewHour = parseInt($target.text());
          this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.renderTime();
          this.pick('hour');
          break;

        case 'minute':
          viewMinute = parseInt($target.text());
          this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.renderTime();
          this.pick('minute');
          break;

        case 'second':
          viewSecond = parseInt($target.text());
          this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMinute, viewSecond);
          this.renderTime();
          this.pick('second');
          break;

        case 'toggle':
          if (options.showTime && this.$daysPicker.is(':visible')) {
            this.showView(VIEWS.TIMES);
          } else {
            this.showView(VIEWS.DAYS);
          }
          break;

        case 'now':
          this.viewDate = new Date();
          this.date = this.viewDate;
          if (this.$daysPicker.is(':visible')) {
            this.renderDays();
            this.pick('day');
          } else if (this.$timePicker.is(':visible')) {
            this.renderTime();
            this.pick('hour');
            this.pick('minute');
            this.pick('second');
          }
          break;

        case 'ok':
          this.hideView();
          break;

        default:
      }
    },
    globalClick: function globalClick(_ref) {
      var target = _ref.target;
      var element = this.element,
          $trigger = this.$trigger;

      var trigger = $trigger[0];
      var hidden = true;

      while (target !== document) {
        if (target === trigger || target === element) {
          hidden = false;
          break;
        }

        target = target.parentNode;
      }

      if (hidden) {
        this.hide();
      }
    },
    globalScroll: function globalScroll(_ref) {
      var $target = $(_ref.target);
      if ($target === $('body')[0] || !this.shown) return;

      this.hide();
    },
    keyup: function keyup() {
      this.update();
    },
    globalKeyup: function globalKeyup(_ref2) {
      var target = _ref2.target,
          key = _ref2.key,
          keyCode = _ref2.keyCode;

      if (this.isInput && target !== this.element && this.shown && (key === 'Tab' || keyCode === 9)) {
        this.hide();
      }
    }
  };

  var render = {
    render: function render() {
      this.renderYears();
      this.renderMonths();
      this.renderDays();
      this.renderTime();
    },
    renderWeek: function renderWeek() {
      var _this = this;

      var items = [];
      var _options = this.options,
          weekStart = _options.weekStart,
          daysMin = _options.daysMin;

      weekStart = parseInt(weekStart, 10) % 7;
      daysMin = daysMin.slice(weekStart).concat(daysMin.slice(0, weekStart));
      $.each(daysMin, function (i, day) {
        items.push(_this.createItem({
          text: day
        }));
      });

      this.$week.html(items.join(''));
    },
    renderYears: function renderYears() {
      var options = this.options,
          startDate = this.startDate,
          endDate = this.endDate;
      var disabledClass = options.disabledClass,
          filter = options.filter,
          yearSuffix = options.yearSuffix;

      var viewYear = this.viewDate.getFullYear();
      var now = new Date();
      var thisYear = now.getFullYear();
      var year = this.date.getFullYear();
      var start = -5;
      var end = 6;
      var items = [];
      var prevDisabled = false;
      var nextDisabled = false;
      var i = void 0;

      for (i = start; i <= end; i += 1) {
        var date = new Date(viewYear + i, 1, 1);
        var disabled = false;

        if (startDate) {
          disabled = date.getFullYear() < startDate.getFullYear();

          if (i === start) {
            prevDisabled = disabled;
          }
        }

        if (!disabled && endDate) {
          disabled = date.getFullYear() > endDate.getFullYear();

          if (i === end) {
            nextDisabled = disabled;
          }
        }

        if (!disabled && filter) {
          disabled = filter.call(this.$element, date) === false;
        }

        var picked = viewYear + i === year;
        var view = picked ? 'year picked' : 'year';

        items.push(this.createItem({
          picked: picked,
          disabled: disabled,
          muted: i === start || i === end,
          text: viewYear + i,
          view: disabled ? 'year disabled' : view,
          highlighted: date.getFullYear() === thisYear
        }));
      }

      this.$yearsPrev.toggleClass(disabledClass, prevDisabled);
      this.$yearsNext.toggleClass(disabledClass, nextDisabled);
      this.$yearsCurrent.toggleClass(disabledClass, true).html(viewYear + start + yearSuffix + ' - ' + (viewYear + end) + yearSuffix);
      this.$years.html(items.join(''));
    },
    renderMonths: function renderMonths() {
      var options = this.options,
          startDate = this.startDate,
          endDate = this.endDate,
          viewDate = this.viewDate;

      var disabledClass = options.disabledClass || '';
      var months = options.monthsShort;
      var filter = $.isFunction(options.filter) && options.filter;
      var viewYear = viewDate.getFullYear();
      var now = new Date();
      var thisYear = now.getFullYear();
      var thisMonth = now.getMonth();
      var year = this.date.getFullYear();
      var month = this.date.getMonth();
      var items = [];
      var prevDisabled = false;
      var nextDisabled = false;
      var i = void 0;

      for (i = 0; i <= 11; i += 1) {
        var date = new Date(viewYear, i, 1);
        var disabled = false;

        if (startDate) {
          prevDisabled = date.getFullYear() === startDate.getFullYear();
          disabled = prevDisabled && date.getMonth() < startDate.getMonth();
        }

        if (!disabled && endDate) {
          nextDisabled = date.getFullYear() === endDate.getFullYear();
          disabled = nextDisabled && date.getMonth() > endDate.getMonth();
        }

        if (!disabled && filter) {
          disabled = filter.call(this.$element, date) === false;
        }

        var picked = viewYear === year && i === month;
        var view = picked ? 'month picked' : 'month';

        items.push(this.createItem({
          disabled: disabled,
          picked: picked,
          highlighted: viewYear === thisYear && date.getMonth() === thisMonth,
          index: i,
          text: months[i],
          view: disabled ? 'month disabled' : view
        }));
      }

      this.$yearPrev.toggleClass(disabledClass, prevDisabled);
      this.$yearNext.toggleClass(disabledClass, nextDisabled);
      this.$yearCurrent.toggleClass(disabledClass, prevDisabled && nextDisabled).html(viewYear + options.yearSuffix || '');
      this.$months.html(items.join(''));
    },
    renderDays: function renderDays() {
      var $element = this.$element,
          options = this.options,
          startDate = this.startDate,
          endDate = this.endDate,
          viewDate = this.viewDate,
          currentDate = this.date;
      var disabledClass = options.disabledClass,
          filter = options.filter,
          monthsShort = options.monthsShort,
          weekStart = options.weekStart,
          yearSuffix = options.yearSuffix;

      var viewYear = viewDate.getFullYear();
      var viewMonth = viewDate.getMonth();
      var now = new Date();
      var thisYear = now.getFullYear();
      var thisMonth = now.getMonth();
      var thisDay = now.getDate();
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth();
      var day = currentDate.getDate();
      var length = void 0;
      var i = void 0;
      var n = void 0;

      // Days of prev month
      // -----------------------------------------------------------------------

      var prevItems = [];
      var prevViewYear = viewYear;
      var prevViewMonth = viewMonth;
      var prevDisabled = false;

      if (viewMonth === 0) {
        prevViewYear -= 1;
        prevViewMonth = 11;
      } else {
        prevViewMonth -= 1;
      }

      // The length of the days of prev month
      length = getDaysInMonth(prevViewYear, prevViewMonth);

      // The first day of current month
      var firstDay = new Date(viewYear, viewMonth, 1);

      // The visible length of the days of prev month
      // [0,1,2,3,4,5,6] - [0,1,2,3,4,5,6] => [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]
      n = firstDay.getDay() - parseInt(weekStart, 10) % 7;

      // [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6] => [1,2,3,4,5,6,7]
      if (n <= 0) {
        n += 7;
      }

      if (startDate) {
        prevDisabled = firstDay.getTime() <= startDate.getTime();
      }

      for (i = length - (n - 1); i <= length; i += 1) {
        var prevViewDate = new Date(prevViewYear, prevViewMonth, i);
        var disabled = false;

        if (startDate) {
          disabled = prevViewDate.getTime() < startDate.getTime();
        }

        if (!disabled && filter) {
          disabled = filter.call($element, prevViewDate) === false;
        }

        prevItems.push(this.createItem({
          disabled: disabled,
          highlighted: prevViewYear === thisYear && prevViewMonth === thisMonth && prevViewDate.getDate() === thisDay,
          muted: true,
          picked: prevViewYear === year && prevViewMonth === month && i === day,
          text: i,
          view: 'day prev'
        }));
      }

      // Days of next month
      // -----------------------------------------------------------------------

      var nextItems = [];
      var nextViewYear = viewYear;
      var nextViewMonth = viewMonth;
      var nextDisabled = false;

      if (viewMonth === 11) {
        nextViewYear += 1;
        nextViewMonth = 0;
      } else {
        nextViewMonth += 1;
      }

      // The length of the days of current month
      length = getDaysInMonth(viewYear, viewMonth);

      // The visible length of next month (42 means 6 rows and 7 columns)
      n = 42 - (prevItems.length + length);

      // The last day of current month
      var lastDate = new Date(viewYear, viewMonth, length);

      if (endDate) {
        nextDisabled = lastDate.getTime() >= endDate.getTime();
      }

      for (i = 1; i <= n; i += 1) {
        var date = new Date(nextViewYear, nextViewMonth, i);
        var picked = nextViewYear === year && nextViewMonth === month && i === day;
        var _disabled = false;

        if (endDate) {
          _disabled = date.getTime() > endDate.getTime();
        }

        if (!_disabled && filter) {
          _disabled = filter.call($element, date) === false;
        }

        nextItems.push(this.createItem({
          disabled: _disabled,
          picked: picked,
          highlighted: nextViewYear === thisYear && nextViewMonth === thisMonth && date.getDate() === thisDay,
          muted: true,
          text: i,
          view: 'day next'
        }));
      }

      // Days of current month
      // -----------------------------------------------------------------------

      var items = [];

      for (i = 1; i <= length; i += 1) {
        var _date = new Date(viewYear, viewMonth, i);
        var _disabled2 = false;

        if (startDate) {
          _disabled2 = _date.getTime() < startDate.getTime();
        }

        if (!_disabled2 && endDate) {
          _disabled2 = _date.getTime() > endDate.getTime();
        }

        if (!_disabled2 && filter) {
          _disabled2 = filter.call($element, _date) === false;
        }

        var _picked = viewYear === year && viewMonth === month && i === day;
        var view = _picked ? 'day picked' : 'day';

        items.push(this.createItem({
          disabled: _disabled2,
          picked: _picked,
          highlighted: viewYear === thisYear && viewMonth === thisMonth && _date.getDate() === thisDay,
          text: i,
          view: _disabled2 ? 'day disabled' : view
        }));
      }

      // Render days picker
      // -----------------------------------------------------------------------

      this.$monthPrev.toggleClass(disabledClass, prevDisabled);
      this.$monthNext.toggleClass(disabledClass, nextDisabled);
      this.$monthCurrent.toggleClass(disabledClass, prevDisabled && nextDisabled).html(options.yearFirst ? viewYear + yearSuffix + ' ' + monthsShort[viewMonth] : monthsShort[viewMonth] + ' ' + viewYear + yearSuffix);
      this.$days.html(prevItems.join('') + items.join('') + nextItems.join(''));
    },
    renderTime: function renderTime() {
      var options = this.options;
      if (!options.showTime) return;

      var disabledClass = options.disabledClass || '';
      var hours = [];
      var minutes = [];
      var seconds = [];
      var viewDate = this.viewDate;
      var viewHour = viewDate.getHours();
      var viewMinute = viewDate.getMinutes();
      var viewSecond = viewDate.getSeconds();

      for (var i = 0; i < 24; i++) {
        var picked = viewHour === i;
        var disabled = false;
        var view = picked ? 'hour picked' : 'hour';
        hours.push(this.createItem({
          picked: picked,
          index: i,
          text: i,
          view: disabled ? 'hour disabled' : view
        }));
      }

      for (var i = 0; i < 60; i++) {
        var picked = viewMinute === i;
        var disabled = false;
        var view = picked ? 'minute picked' : 'minute';
        minutes.push(this.createItem({
          picked: picked,
          index: i,
          text: i,
          view: disabled ? 'minute disabled' : view
        }));
      }

      for (var i = 0; i < 60; i++) {
        var picked = viewSecond === i;
        var disabled = false;
        var view = picked ? 'second picked' : 'second';
        seconds.push(this.createItem({
          picked: picked,
          index: i,
          text: i,
          view: disabled ? 'second disabled' : view
        }));
      }

      this.$hours.html(hours);
      this.$minutes.html(minutes);
      this.$seconds.html(seconds);
    }
  };

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;

        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  // Classes
  var CLASS_TOP_LEFT = NAMESPACE + '-top-left';
  var CLASS_TOP_RIGHT = NAMESPACE + '-top-right';
  var CLASS_BOTTOM_LEFT = NAMESPACE + '-bottom-left';
  var CLASS_BOTTOM_RIGHT = NAMESPACE + '-bottom-right';
  var CLASS_PLACEMENTS = [CLASS_TOP_LEFT, CLASS_TOP_RIGHT, CLASS_BOTTOM_LEFT, CLASS_BOTTOM_RIGHT].join(' ');

  var Datepicker = function () {
    function Datepicker(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Datepicker);

      this.$element = $(element);
      this.element = element;
      this.options = $.extend({}, DEFAULTS, LANGUAGES[options.language], options);
      this.built = false;
      this.shown = false;
      this.isInput = false;
      this.inline = false;
      this.initialValue = '';
      this.initialDate = null;
      this.startDate = null;
      this.endDate = null;
      this.init();
    }

    _createClass(Datepicker, [{
      key: 'init',
      value: function init() {
        var $this = this.$element,
            options = this.options;
        var startDate = options.startDate,
            endDate = options.endDate,
            date = options.date;

        this.$trigger = $(options.trigger);
        this.isInput = $this.is('input') || $this.is('textarea');
        this.inline = options.inline && (options.container || !this.isInput);
        this.format = parseFormat(options.format);

        var initialValue = this.getValue();

        this.initialValue = initialValue;
        this.oldValue = initialValue;
        date = this.parseDate(date || initialValue);

        if (startDate) {
          startDate = this.parseDate(startDate);

          if (date.getTime() < startDate.getTime()) {
            date = new Date(startDate);
          }

          this.startDate = startDate;
        }

        if (endDate) {
          endDate = this.parseDate(endDate);

          if (startDate && endDate.getTime() < startDate.getTime()) {
            endDate = new Date(startDate);
          }

          if (date.getTime() > endDate.getTime()) {
            date = new Date(endDate);
          }

          this.endDate = endDate;
        }

        this.date = date;
        this.viewDate = new Date(date);
        this.initialDate = new Date(this.date);
        this.bind();

        if (options.autoShow || this.inline) {
          this.show();
        }

        if (options.autoPick) {
          this.pick();
        }
      }
    }, {
      key: 'build',
      value: function build() {
        if (this.built) {
          return;
        }

        this.built = true;

        var $this = this.$element,
            options = this.options;

        var $picker = $(options.template);

        this.$scrollableParent = $(getScrollableParent($this[0]));
        this.$picker = $picker;
        this.$week = $picker.find(selectorOf('week'));

        // Years view
        this.$yearsPicker = $picker.find(selectorOf('years picker'));
        this.$yearsPrev = $picker.find(selectorOf('years prev'));
        this.$yearsNext = $picker.find(selectorOf('years next'));
        this.$yearsCurrent = $picker.find(selectorOf('years current'));
        this.$years = $picker.find(selectorOf('years'));

        // Months view
        this.$monthsPicker = $picker.find(selectorOf('months picker'));
        this.$yearPrev = $picker.find(selectorOf('year prev'));
        this.$yearNext = $picker.find(selectorOf('year next'));
        this.$yearCurrent = $picker.find(selectorOf('year current'));
        this.$months = $picker.find(selectorOf('months'));

        // Days view
        this.$daysPicker = $picker.find(selectorOf('days picker'));
        this.$monthPrev = $picker.find(selectorOf('month prev'));
        this.$monthNext = $picker.find(selectorOf('month next'));
        this.$monthCurrent = $picker.find(selectorOf('month current'));
        this.$days = $picker.find(selectorOf('days'));

        // time view
        this.$timePicker = $picker.find(selectorOf('time picker'));
        this.$hours = $picker.find(selectorOf('hours'));
        this.$minutes = $picker.find(selectorOf('minutes'));
        this.$seconds = $picker.find(selectorOf('seconds'));

        // operation view
        this.$operationBar = $picker.find(selectorOf('operation-bar'));
        this.$operationNow = $picker.find(selectorOf('now'));
        this.$operationToggle = $picker.find(selectorOf('toggle'));
        this.$operationOk = $picker.find(selectorOf('ok'));

        if (this.inline) {
          $(options.container || $this).append($picker.addClass(NAMESPACE + '-inline'));
        } else {
          $(document.body).append($picker.addClass(NAMESPACE + '-dropdown'));
          $picker.addClass(CLASS_HIDE);
        }

        this.renderWeek();
      }
    }, {
      key: 'unbuild',
      value: function unbuild() {
        if (!this.built) {
          return;
        }

        this.built = false;
        this.$picker.remove();
      }
    }, {
      key: 'bind',
      value: function bind() {
        var options = this.options,
            $this = this.$element;

        if ($.isFunction(options.show)) {
          $this.on(EVENT_SHOW, options.show);
        }

        if ($.isFunction(options.hide)) {
          $this.on(EVENT_HIDE, options.hide);
        }

        if ($.isFunction(options.pick)) {
          $this.on(EVENT_PICK, options.pick);
        }

        if (this.isInput) {
          $this.on(EVENT_KEYUP, $.proxy(this.keyup, this));
        }

        if (!this.inline) {
          if (options.trigger) {
            this.$trigger.on(EVENT_CLICK, $.proxy(this.toggle, this));
          } else if (this.isInput) {
            $this.on(EVENT_FOCUS, $.proxy(this.show, this));
          } else {
            $this.on(EVENT_CLICK, $.proxy(this.show, this));
          }
        }
      }
    }, {
      key: 'unbind',
      value: function unbind() {
        var $this = this.$element,
            options = this.options;

        if ($.isFunction(options.show)) {
          $this.off(EVENT_SHOW, options.show);
        }

        if ($.isFunction(options.hide)) {
          $this.off(EVENT_HIDE, options.hide);
        }

        if ($.isFunction(options.pick)) {
          $this.off(EVENT_PICK, options.pick);
        }

        if (this.isInput) {
          $this.off(EVENT_KEYUP, this.keyup);
        }

        if (!this.inline) {
          if (options.trigger) {
            this.$trigger.off(EVENT_CLICK, this.toggle);
          } else if (this.isInput) {
            $this.off(EVENT_FOCUS, this.show);
          } else {
            $this.off(EVENT_CLICK, this.show);
          }
        }
      }
    }, {
      key: 'showView',
      value: function showView(view) {
        var $yearsPicker = this.$yearsPicker,
            $monthsPicker = this.$monthsPicker,
            $daysPicker = this.$daysPicker,
            $timePicker = this.$timePicker,
            $operationBar = this.$operationBar,
            format = this.format;

        if (this.options.showTime) {
          $operationBar.removeClass(CLASS_HIDE);
        } else {
          $operationBar.addClass(CLASS_HIDE);
        }

        if (format.hasYear || format.hasMonth || format.hasDay) {
          switch (Number(view)) {
            case VIEWS.YEARS:
              $monthsPicker.addClass(CLASS_HIDE);
              $daysPicker.addClass(CLASS_HIDE);
              $timePicker.addClass(CLASS_HIDE);

              if (format.hasYear) {
                this.renderYears();
                $yearsPicker.removeClass(CLASS_HIDE);
                this.place();
              } else {
                this.showView(VIEWS.DAYS);
              }

              break;

            case VIEWS.MONTHS:
              $yearsPicker.addClass(CLASS_HIDE);
              $daysPicker.addClass(CLASS_HIDE);
              $timePicker.addClass(CLASS_HIDE);

              if (format.hasMonth) {
                this.renderMonths();
                $monthsPicker.removeClass(CLASS_HIDE);
                this.place();
              } else {
                this.showView(VIEWS.YEARS);
              }

              break;

            case VIEWS.TIMES:
              $yearsPicker.addClass(CLASS_HIDE);
              $monthsPicker.addClass(CLASS_HIDE);
              $daysPicker.addClass(CLASS_HIDE);

              if (this.options.showTime) {
                this.renderTime();
                $timePicker.removeClass(CLASS_HIDE);
                this.place();
              } else {
                this.showView(VIEWS.DAYS);
              }
              break;

            // case VIEWS.DAYS:
            default:
              $yearsPicker.addClass(CLASS_HIDE);
              $monthsPicker.addClass(CLASS_HIDE);
              $timePicker.addClass(CLASS_HIDE);

              if (format.hasDay) {
                this.renderDays();
                $daysPicker.removeClass(CLASS_HIDE);
                this.place();
              } else {
                this.showView(VIEWS.MONTHS);
              }
          }
        }
      }
    }, {
      key: 'hideView',
      value: function hideView() {
        if (!this.inline && this.options.autoHide) {
          this.hide();
        }
      }
    }, {
      key: 'place',
      value: function place() {
        if (this.inline) {
          return;
        }

        var $this = this.$element,
            options = this.options,
            $picker = this.$picker;

        var containerWidth = $(document).outerWidth();
        var containerHeight = $(document).outerHeight();
        var elementWidth = $this.outerWidth();
        var elementHeight = $this.outerHeight();
        var width = $picker.width();
        var height = $picker.height();

        var _$this$offset = $this.offset(),
            left = _$this$offset.left,
            top = _$this$offset.top;

        var offset = parseFloat(options.offset);
        var placement = CLASS_TOP_LEFT;

        if (isNaN(offset)) {
          offset = 10;
        }

        if (top > height && top + elementHeight + height > containerHeight) {
          top -= height + offset;
          placement = CLASS_BOTTOM_LEFT;
        } else {
          top += elementHeight + offset;
        }

        if (left + width > containerWidth) {
          left += elementWidth - width;
          placement = placement.replace('left', 'right');
        }

        $picker.removeClass(CLASS_PLACEMENTS).addClass(placement).css({
          top: top,
          left: left,
          zIndex: parseInt(options.zIndex, 10)
        });
      }

      // A shortcut for triggering custom events

    }, {
      key: 'trigger',
      value: function trigger(type, data) {
        var e = $.Event(type, data);

        this.$element.trigger(e);

        return e;
      }
    }, {
      key: 'createItem',
      value: function createItem(data) {
        var options = this.options;
        var itemTag = options.itemTag;

        var item = {
          text: '',
          view: '',
          muted: false,
          picked: false,
          disabled: false,
          highlighted: false
        };
        var classes = [];

        $.extend(item, data);

        if (item.muted) {
          classes.push(options.mutedClass);
        }

        if (item.highlighted) {
          classes.push(options.highlightedClass);
        }

        if (item.picked) {
          classes.push(options.pickedClass);
        }

        if (item.disabled) {
          classes.push(options.disabledClass);
        }

        return '<' + itemTag + ' class="' + classes.join(' ') + '" data-view="' + item.view + '">' + item.text + '</' + itemTag + '>';
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        var $this = this.$element;

        return this.isInput ? $this.val() : $this.text();
      }
    }, {
      key: 'setValue',
      value: function setValue() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var $this = this.$element;

        if (this.isInput) {
          $this.val(value);
        } else {
          $this.text(value);
        }
      }
    }], [{
      key: 'setDefaults',
      value: function setDefaults() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        $.extend(DEFAULTS, LANGUAGES[options.language], options);
      }
    }]);

    return Datepicker;
  }();

  if ($.extend) {
    $.extend(Datepicker.prototype, render, handlers, methods);
  }

  if ($.fn) {
    var AnotherDatepicker = $.fn.datepicker;

    $.fn.datepicker = function jQueryDatepicker(option) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var result = void 0;

      this.each(function (i, element) {
        var $element = $(element);
        var data = $element.data(NAMESPACE);

        if (!data) {
          if (/destroy/.test(option)) {
            return;
          }

          var options = $.extend({}, $element.data(), $.isPlainObject(option) && option);

          data = new Datepicker(element, options);
          $element.data(NAMESPACE, data);
        }

        if (isString(option)) {
          var fn = data[option];

          if ($.isFunction(fn)) {
            result = fn.apply(data, args);
          }
        }
      });

      return isUndefined(result) ? this : result;
    };

    $.fn.datepicker.Constructor = Datepicker;
    $.fn.datepicker.languages = LANGUAGES;
    $.fn.datepicker.setDefaults = Datepicker.setDefaults;
    $.fn.datepicker.noConflict = function noConflict() {
      $.fn.datepicker = AnotherDatepicker;
      return this;
    };
  }
})(jQuery);

// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
//   typeof define === 'function' && define.amd ? define(['jquery'], factory) :
//   (factory(global.jQuery));
// }(this,
(function ($) {

  'use strict';

  $.fn.datepicker.languages['zh-CN'] = {
    format: 'yyyy年mm月dd日',
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    daysMin: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weekStart: 1,
    yearFirst: true,
    yearSuffix: '年'
  };
})(jQuery);

(function ($) {
  var _options = {
    date: new Date(), // 要渲染的日期
    schedule: {} // 日程信息
  };
  var year, month;
  var colorMap = ['green', 'blue', 'yellow'];
  var tmpl = '\n    <div class="header-bar">\n      <span class="today">\u4ECA\u5929</span>\n      <div class="day-week-year">\n        <span>\u65E5</span>\n        <span>\u5468</span>\n        <span class="active">\u6708</span>\n      </div>\n      <div class="switch-month">\n        <i class="iconfont icon-left1"></i>\n        <span class="current"></span>\n        <i class="iconfont icon-right1"></i>\n      </div>\n      <div class="toggle-btn">\n        <i class="iconfont icon-form active"></i>\n        <i class="iconfont icon-tabulation"></i>\n      </div>\n    </div>\n    <div class="pane">\n      <header class="week-bar">\n          <span class="week">\u661F\u671F\u65E5</span>\n          <span class="week">\u661F\u671F\u4E00</span>\n          <span class="week">\u661F\u671F\u4E8C</span>\n          <span class="week">\u661F\u671F\u4E09</span>\n          <span class="week">\u661F\u671F\u56DB</span>\n          <span class="week">\u661F\u671F\u4E94</span>\n          <span class="week">\u661F\u671F\u516D</span>\n      </header>\n      <div class="calendar-wrapper clearfix" id="bigCalendarView"></div>\n    </div>\n  ';

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
    nextMonthRetainDays = 7 - (days + weekday) % 7;
    var nextMonth = month === 11 ? 0 : month + 1;
    var nextMonthYear = nextMonth === 0 ? year + 1 : year;
    // 生成当前视图的所有日期
    var daysArray = [];
    for (var i = 0; i < weekday; i++) {
      daysArray.unshift({
        date: prevMonthDays - i,
        month: lastMonth,
        year: lastMonthYear
      });
    }
    for (i = 0; i < days; i++) {
      daysArray.push({
        date: i + 1,
        month: month,
        year: year
      });
    }
    for (i = 0; i < nextMonthRetainDays; i++) {
      daysArray.push({
        date: i + 1,
        month: nextMonth,
        year: nextMonthYear
      });
    }

    return daysArray;
  }

  function insertSchedule(daysArray, schedule) {
    var personNames = [];
    daysArray.forEach(function (day, idx) {
      var data = schedule[new Date(day.year, day.month, day.date)] || { schedule: [] };
      data.schedule.forEach(function (d) {
        if (d.person) {
          var personIdx = personNames.indexOf(d.person);
          if (personIdx > -1) {
            d.color = colorMap[personIdx];
          } else {
            personNames.push(d.person);
            d.color = colorMap[personNames.length] || 'yellow';
          }
        }
      });
      day.data = data;
    });
  }

  function renderBigCalendar($ele, options) {
    // 大日历插件
    var date = options.date;
    //当前是哪一年
    year = date.getFullYear();
    //当前是哪个月，注意这里的月是从0开始计数的
    month = date.getMonth(); // 0~11
    var today = date.getDate();
    var daysArray = genDatesArray(year, month);
    insertSchedule(daysArray, options.schedule);
    var tpl = '\n      {{each data as item i}}\n        <div class="day-item{{if (i + 1) % 7 === 0}} row-last-item{{/if}}">\n          <p class="day{{if item.month !== month}} not-month-day{{/if}}">\n            <span class="{{if item.date === date && item.month === month}}today{{/if}}">{{item.date}}</span>\n          </p>\n          <div class="schedule-container">\n            {{ each item.data.schedule as schedule scheduleIdx }}\n              <p class="schedule-title {{ schedule.color }}">{{ schedule.title }}</p>\n              <div class="detail hide">\n                <p>{{ schedule.detail.time }}</p>\n                <p class="content">{{ schedule.detail.content }}</p>\n                <p>{{ schedule.detail.company }}</p>\n                <p class="location">\n                  <i class="iconfont icon-local"></i>\n                  {{ schedule.detail.location }}\n                </p>\n              </div>\n            {{ /each }}\n          </div>\n        </div>\n      {{/each}}\n    ';
    var render = template.compile(tpl);
    var html = render({ date: today, month: month, data: daysArray });
    var $calendar = $(tmpl);
    $calendar.find('#bigCalendarView').html(html);
    $ele.html($calendar);

    $ele.find('.switch-month .current').html(year + '年' + (month + 1) + '月');
  }

  function BigCalendar($ele, options) {
    var settings = $.extend({}, _options, options);
    renderBigCalendar($ele, settings);
  }

  $.fn.bigCalendar = function (options) {
    if (!$.isPlainObject(options)) {
      options = {};
    }

    return this.each(function () {
      new BigCalendar($(this), options);
    });
  };
})(jQuery);

/*
    下拉select组件
*/

(function ($) {
  var defaultOptions = {};

  var methods = {
    /*
        初始化配置参数 params:options
        {
            placeholder:'请选择',
            defaultValue:'选项1',
            defaultKey:'1',
            data:[
                {key:'1',value:'选项1'},
                {key:'2',value:'选项2'},
            ],
            onChange:changeHandler(key,value)  //change回调函数
        }
     */
    init: function init(options) {
      defaultOptions = Object.assign({}, options);
      //初始化，并返回html
      var $this = $(this);
      if (options.noBorder) {
        $this.addClass('no-border');
      }
      $this.addClass('dropdown-select');
      var placeholder = '请选择';
      if (options && options.placeholder) {
        placeholder = options.placeholder;
      }
      $this.append('<div class="select-container"><span class="label">' + placeholder + '</span><span class="iconfont icon-dropdown-copy"></span><span class="iconfont icon-pickup2"></span></div>');

      if (options && options.defaultValue) {
        $this.find('.label').html(options.defaultValue);
      }
      var list = '无选项';
      if (options && options.data && Array.isArray(options.data) && options.data.length > 0) {
        list = '';
        for (var index = 0; index < options.data.length; index++) {
          var element = options.data[index];
          list += '<li><a href="javascript:;" key=' + element.key + '>' + element.value + '</a></li>';
        }
        if (options && options.defaultKey) {
          var matchItem = options.data.filter(function (item) {
            return item.key == options.defaultKey;
          });
          if (matchItem) {
            $this.find('.label').html(matchItem.value);
          }
        }
      }
      $this.append('<div class="list-container"><ul>' + list + '</ul></div>');
      if (options.width) {
        $this.css('width', options.width);
        $this.find('.select-container').css('width', options.width - 2);
        $this.find('.list-container').css('width', options.width - 2);
      }
      $this.on('mouseenter', function () {
        var listContanier = $(this).find('.list-container');
        var ul = $(this).find('ul');
        if (!ul.is(':visible')) {
          listContanier.show();
          ul.slideDown("fast");
        }
      });

      $this.on('mouseleave', function () {
        var listContanier = $(this).find('.list-container');
        var ul = $(this).find('ul');
        if (ul.is(':visible')) {
          listContanier.hide();
          ul.slideUp("fast");
        }
      });

      $this.on('click', 'ul li a', function () {
        var txt = $(this).text();
        var key = $(this).attr("key");
        var $label = $(this).closest('.dropdown-select').find('.label');
        var originValue = $label.html();
        $label.html(txt).attr('key', key);
        if (options && options.onChange && typeof options.onChange == 'function' && txt !== originValue) {
          options.onChange.call(this, key, txt);
        }
        $(this).closest('.dropdown-select').find('.list-container').hide();
      });
      return $this.prop("outerHTML");
    },
    //获取选择的选项对应的文本值
    getValue: function getValue() {
      var $this = $(this);
      var value = '';
      if ($this.find('.label').attr('key')) {
        value = $this.find('.label').text();
      }
      return value;
    },
    //获取选择的选项对应的key值
    getKey: function getKey() {
      var $this = $(this);
      var key = $this.find('.label').attr('key');
      return key ? key : '';
    },
    //重置
    reset: function reset(val, key) {
      var $this = $(this);
      val = val || '';
      key = key || '';
      $this.find('.label').text(val || defaultOptions.placeholder);
      $this.find('.label').attr('key', key);
    },
    destroy: function destroy() {
      $(this).off().children().remove();
    }
  };

  $.fn.dropdownSelect = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if ((typeof method === 'undefined' ? 'undefined' : _typeof(method)) === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.dropdownSelect');
    }
  };
})(jQuery);

;(function ($) {
  /**
  {
      width: 140,
      placeholder: '',
      defaultValue: ,
      data: A promise or list [{key: , value: }...],
      keyUnit:'key',                          //key值单位
      valUnit:'value',                        //value值单位
      requestData: {offset: 0, count: 10},
      requestPath: "/api/search/xxx",
      searchKey: 'key',
      requestMethod: 'GET',
      ajax: function(data, key, success, fail) {    // 模糊搜索调用的接口，data是通用的，key是关键词的键名
          $.ajax({
              url: '',
              method: 'GET',
              data: data,
              success: success(),
              failed: fail()
          })
      }
  }
  */
  var DEFAULT = {};
  var WhaleDropdownSelect = function WhaleDropdownSelect(element, options) {
    this.options = $.extend({}, DEFAULT, options);
    this.$body = $(document.body);
    this.$element = $(element);
    this.$promptBox = null;
  };
  var tmpl = '<div class="input-with-attaches">' + '<input type="text" class="input input-140" placeholder="刘飞">' + '<div class="attach">' + '<i class="find iconfont icon-SearchBox"></i>' + '</div>' + '<div class="whale-dropdown-select-container scroll-style">' + '<ul class="whale-dropdown-select-ul">' +
  // '<li class="whale-dropdown-select-li">赵白</li>' +
  // '<li class="whale-dropdown-select-li">钱生</li>' +
  // '<li class="whale-dropdown-select-li">孙丽</li>' +
  '</ul>' + '</div>';
  '</div>';
  WhaleDropdownSelect.prototype.init = function () {
    this.$element.append(tmpl);
    this.$promptBox = this.$element.find('.whale-dropdown-select-container');
    this.setWidth();
    this.setPlaceholder();
    if (this.options.defaultValue) {
      this.$element.data('value', this.options.defaultValue);
    }
    this.selectOption();
    this.$element.on('focus', '.input', $.proxy(function () {
      this.show();
    }, this));
    this.$element.on('blur', '.input', $.proxy(function () {
      // 规避blur在click之前触发的问题
      setTimeout($.proxy(function () {
        this.hide();
      }, this), 300);
    }, this));
    this.$element.on('keyup', '.input', $.proxy(function () {
      var that = this;
      var $input = that.$element.find('.input');
      if (that.options.requestPath && that.options.requestData) {
        that.options.requestData[that.options.searchKey] = $input.val().trim() || that.$element.data('value');
        $.ajax({
          url: that.options.requestPath,
          method: that.options.requestMethod,
          data: that.options.requestData,
          success: function success(data) {
            that.options.data = data.payload;
            that.show();
          },
          failed: function failed(err) {
            console.log(err);
          }
        });
      }
    }, this));
  };
  WhaleDropdownSelect.prototype.setWidth = function () {
    if (this.options.width) {
      this.$element.find('.input-with-attaches').css('width', this.options.width);
      this.$promptBox.css('width', parseInt(this.options.width - 2) + 'px');
      $(this.$element.find('input')).css('width', parseInt(this.options.width - 38) + 'px');
    }
  };
  WhaleDropdownSelect.prototype.setPlaceholder = function () {
    if (this.options.placeholder) {
      $(this.$element.find('input')).attr('placeholder', this.options.placeholder);
    }
  };
  WhaleDropdownSelect.prototype.show = function () {
    if (this.options.data) {
      var docfrag = document.createDocumentFragment();
      for (var i in this.options.data) {
        var li = document.createElement("li");
        var $li = $(li);
        var keyUnit = this.options.keyUnit || '';
        var valUnit = this.options.valUnit || '';
        var liHtml = this.options.data[i].html || this.options.data[i][valUnit] || this.options.data[i].value;
        $li.html(liHtml);
        $li.addClass('whale-dropdown-select-li');

        keyUnit ? $li.data('key', this.options.data[i][keyUnit]) : $li.data('key', this.options.data[i].key);
        valUnit ? $li.data('value', this.options.data[i][valUnit]) : $li.data('value', this.options.data[i].value);

        docfrag.appendChild(li);
      }
      $(this.$element.find('.whale-dropdown-select-ul')).empty().append(docfrag);
      this.$promptBox.show();
    }
  };
  WhaleDropdownSelect.prototype.hide = function () {
    this.$promptBox.hide();
  };
  WhaleDropdownSelect.prototype.toggle = function () {
    if (this.$promptBox.css('display') === 'none') {
      this.$promptBox.show();
    } else if (this.$promptBox.css('display') === 'block') {
      this.$promptBox.hide();
    }
  };
  WhaleDropdownSelect.prototype.selectOption = function () {
    var that = this;
    that.$element.on('click', '.whale-dropdown-select-li', function () {
      var $this = $(this);
      var value = $.trim($this.data('value') || $this.text());
      that.$element.find('.input').val(value);
      that.$element.data('value', value);

      var key = $.trim($this.data('key')) || '';
      if (key) {
        that.$element.find('.input').attr('data-key', key);
      }
    });
  };
  $.fn.whaleDropdownSelect = function (options) {
    return this.each(function () {
      var whaleDropdownSelect = new WhaleDropdownSelect(this, options);
      whaleDropdownSelect.init();
    });
  };
})(jQuery);

(function ($) {
  "use strict";
  /*
  模糊搜索远程接口配置
  ajax:{
    requestData: {offset: 0, count: 10},
    requestPath: UserNameUrl,
    searchKey: 'customerName',
    requestMethod: 'GET',
  },
  */

  var defaultOptions = {
    fuzzySearch: false,
    data: null, //模糊搜索列表数组[{keyUnit:xx,valUnit:yy}]
    width: 500,
    placeholder: '',
    keyUnit: '', //模糊搜索列表key
    valUnit: '', //模糊搜索列表value
    ajax: null,
    tagClass: function tagClass(item) {
      return 'label label-info';
    },
    focusClass: 'focus',
    itemValue: function itemValue(item) {
      return item ? item.toString() : item;
    },
    itemText: function itemText(item) {
      return this.itemValue(item);
    },
    itemTitle: function itemTitle(item) {
      return null;
    },
    freeInput: true,
    addOnBlur: true,
    maxTags: undefined,
    maxChars: undefined,
    confirmKeys: [], //确认添加，键盘按键码
    delimiter: ',',
    delimiterRegex: null,
    cancelConfirmKeysOnEmpty: false,
    onTagExists: function onTagExists(item, $tag) {
      $tag.hide().fadeIn();
    },
    trimValue: false,
    allowDuplicates: false,
    triggerChange: true
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.isInit = true;
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.hide();

    this.isSelect = element.tagName === 'SELECT';
    this.multiple = this.isSelect && element.hasAttribute('multiple');
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);
    this.$attach = $('<div class="attach"><i class="find iconfont icon-SearchBox"></i></div>');

    this.$element.before(this.$container);
    this.$container.append(this.$attach);

    this.build(options);
    this.isInit = false;
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function add(item, key, dontPushVal, options) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags) return;

      // Ignore falsey values, except false
      if (item !== false && !item) return;

      // Trim value
      if (typeof item === "string" && self.options.trimValue) {
        item = $.trim(item);
      }

      // Throw an error when trying to add an object while the itemValue option was not set
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && !self.objectItems) throw "Can't add objects when itemValue option is not set";

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/)) return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0) self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var delimiter = self.options.delimiterRegex ? self.options.delimiterRegex : self.options.delimiter;
        var items = item.split(delimiter);
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal) self.pushVal(self.options.triggerChange);
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item),
          itemTitle = self.options.itemTitle(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function (item) {
        return self.options.itemValue(item) === itemValue;
      })[0];
      if (existing && !self.options.allowDuplicates) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".tag", self.$container).filter(function () {
            return $(this).data("item") === existing;
          });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // if length greater than limit
      if (self.items().toString().length + item.length + 1 > self.options.maxInputLength) return;

      // raise beforeItemAdd arg
      var beforeItemAddEvent = $.Event('beforeItemAdd', {
        item: item,
        cancel: false,
        options: options
      });
      self.$element.trigger(beforeItemAddEvent);
      if (beforeItemAddEvent.cancel) return;

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element

      var $tag = $('<span class="tag ' + htmlEncode(tagClass) + (itemTitle !== null ? '" title="' + itemTitle : '') + '" data-key="' + key + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);
      $tag.after(' ');

      // Check to see if the tag exists in its raw or uri-encoded form
      var optionExists = $('option[value="' + encodeURIComponent(itemValue) + '"]', self.$element).length || $('option[value="' + htmlEncode(itemValue) + '"]', self.$element).length;

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !optionExists) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal) self.pushVal(self.options.triggerChange);

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength) self.$container.addClass('bootstrap-tagsinput-max');

      // If using typeahead, once the tag has been added, clear the typeahead value so it does not stick around in the input.
      if ($('.typeahead, .twitter-typeahead', self.$container).length) {
        self.$input.typeahead('val', '');
      }

      if (this.isInit) {
        self.$element.trigger($.Event('itemAddedOnInit', {
          item: item,
          options: options
        }));
      } else {
        self.$element.trigger($.Event('itemAdded', {
          item: item,
          options: options
        }));
      }
      self.$input.focusin();
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function remove(item, dontPushVal, options) {
      var self = this;

      if (self.objectItems) {
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object") item = $.grep(self.itemsArray, function (other) {
          return self.options.itemValue(other) == self.options.itemValue(item);
        });else item = $.grep(self.itemsArray, function (other) {
          return self.options.itemValue(other) == item;
        });

        item = item[item.length - 1];
      }

      if (item) {
        var beforeItemRemoveEvent = $.Event('beforeItemRemove', {
          item: item,
          cancel: false,
          options: options
        });
        self.$element.trigger(beforeItemRemoveEvent);
        if (beforeItemRemoveEvent.cancel) return;

        $('.tag', self.$container).filter(function () {
          return $(this).data('item') === item;
        }).remove();
        $('option', self.$element).filter(function () {
          return $(this).data('item') === item;
        }).remove();
        if ($.inArray(item, self.itemsArray) !== -1) self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal) self.pushVal(self.options.triggerChange);

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length) self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved', {
        item: item,
        options: options
      }));
    },

    /**
     * Removes all items
     */
    removeAll: function removeAll() {
      var self = this;

      $('.tag', self.$container).remove();
      $('option', self.$element).remove();

      while (self.itemsArray.length > 0) {
        self.itemsArray.pop();
      }self.pushVal(self.options.triggerChange);
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function refresh() {
      var self = this;
      $('.tag', self.$container).each(function () {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

        // Update tag's class and inner text
        $tag.attr('class', null);
        $tag.addClass('tag ' + htmlEncode(tagClass));
        $tag.contents().filter(function () {
          return this.nodeType == 3;
        })[0].nodeValue = htmlEncode(itemText);

        if (self.isSelect) {
          var option = $('option', self.$element).filter(function () {
            return $(this).data('item') === item;
          });
          option.attr('value', itemValue);
        }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function items() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element.
     */
    pushVal: function pushVal() {
      var self = this,
          val = $.map(self.items(), function (item) {
        return self.options.itemValue(item).toString();
      });

      self.$element.val(val, true);

      if (self.options.triggerChange) self.$element.trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function build(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      // When itemValue is set, freeInput should always be false
      if (self.objectItems) self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionFunction(self.options, 'tagClass');
      if (self.options.width) {
        self.$container.css('width', self.options.width + 'px');
      }

      //模糊搜索
      if (self.options.fuzzySearch) {

        //更新模糊搜索列表方法
        var updateList = function updateList(data) {
          var $optionsContainer = self.$container.find('.tagsinput-options-container');
          var listHtml = '';
          for (var index = 0; index < data.length; index++) {
            var element = data[index];
            listHtml += '<li class="tagsinput-options-li"><a key=' + element[self.options.keyUnit] + '>' + element[self.options.valUnit] + '</a></li>';
          }
          listHtml = listHtml || '<li class="tagsinput-options-li"><a disabled>无匹配</a></li>';
          $optionsContainer.find('ul').empty().append(listHtml);
          $optionsContainer.show();
        };

        //初始化模糊搜索列表
        self.$input.remove();
        var optionsContainerWidth = parseInt(self.$container.css('width')) + 12 + 'px';
        var optionsContainer = '<div class="tagsinput-options-container" style="width:' + optionsContainerWidth + '">' + '<ul class="tagsinput-options-ul">' + '</ul>' + '</div>';
        var inputwrapperHtml = '<span class="input-wrapper">' + optionsContainer + '</span>';
        self.$input = $('<input type="text">').prependTo($(inputwrapperHtml));
        self.$input.closest('.input-wrapper').appendTo(self.$container);

        //监听input事件
        self.$container.on('input', 'input', $.proxy(function (event) {
          var $input = $(event.target);
          var text = $input.val();
          if (text.length == 0) {
            self.$container.find('.tagsinput-options-container ').hide();
          } else {
            //模糊搜索列表数组
            if (self.options.data) {
              var filterOptionsData = self.options.data.filter(function (item) {
                return item[self.options.valUnit].toLowerCase().indexOf(text.toLowerCase()) !== -1;
              });
              updateList(filterOptionsData);
            }
            //模糊搜索调用远程ajax接口
            else if (self.options.ajax) {
                var ajaxObj = self.options.ajax;
                if (ajaxObj && ajaxObj.requestPath && ajaxObj.requestData) {
                  ajaxObj.requestData[ajaxObj.searchKey] = text;
                  $.ajax({
                    url: ajaxObj.requestPath,
                    method: ajaxObj.requestMethod,
                    data: ajaxObj.requestData,
                    success: function success(data) {
                      var filterOptionsData = data.payload;
                      updateList(filterOptionsData);
                    },
                    failed: function failed(err) {
                      console.log(err);
                    }
                  });
                }
              }
          }
        }, self));

        self.$container.on('click', '.tagsinput-options-container', $.proxy(function (event) {
          var _self$add;

          var $item = $(event.target);
          var key = $(event.target).attr('key');
          if ($item.attr('disabled')) {
            return;
          }
          self.add((_self$add = {}, _defineProperty(_self$add, self.options.keyUnit, $item.attr('key')), _defineProperty(_self$add, self.options.valUnit, $item.text()), _self$add), true);
          self.$input.val('');
          $item.closest('.tagsinput-options-container').hide();
        }, self));
        //点击空白处，隐藏模糊搜索列表，清空input
        $(document).on('click', function (event) {
          if (!$(event.target).is('.tagsinput-options-container a')) {
            self.$container.find('.tagsinput-options-container').hide();
            self.$input.val('');
          }
        });
      }
      //输入为空时，显示 placeholder
      if (self.options.placeholder) {
        self.$input.attr('placeholder', self.options.placeholder);
        self.$input.css('width', self.options.placeholder.length * 12 + 'px');
        self.$container.on('focusin', 'input', function () {
          self.$input.attr('placeholder', '');
          self.$input.css('width', 'auto');
        });
        self.$container.on('focusout', 'input', function () {
          if (self.items().length == 0) {
            self.$input.attr('placeholder', self.options.placeholder);
            self.$input.css('width', self.options.placeholder.length * 12 + 'px');
          }
        });
      }
      self.$container.on('click', $.proxy(function (event) {
        if (!self.$element.attr('disabled')) {
          self.$input.removeAttr('disabled');
        }
        self.$input.focus();
      }, self));

      // Toggle the 'focus' css class on the container when it has focus
      self.$container.on({
        focusin: function focusin() {
          self.$container.addClass(self.options.focusClass);
        },
        focusout: function focusout() {
          self.$container.removeClass(self.options.focusClass);
        }
      });

      self.$container.on('keydown', 'input', $.proxy(function (event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        if (self.$element.attr('disabled')) {
          self.$input.attr('disabled', 'disabled');
          return;
        }

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev.length) {
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next.length) {
                self.remove(next.data('item'));
              }
            }
            break;
          default:
          // ignore
        }

        // Reset internal input's size
        var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      self.$container.on('keypress', 'input', $.proxy(function (event) {
        var $input = $(event.target);

        if (self.$element.attr('disabled')) {
          self.$input.attr('disabled', 'disabled');
          return;
        }

        // Reset internal input's size
        var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function (event) {
        if (self.$element.attr('disabled')) {
          return;
        }
        self.remove($(event.target).closest('.tag').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
          self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function () {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function destroy() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput
     */
    focus: function focus() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function input() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function findInputWrapper() {
      var elt = this.$input[0],
          container = this.$container[0];
      while (elt && elt.parentNode !== container) {
        elt = elt.parentNode;
      }return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function (arg1, arg2, arg3) {
    var results = [];

    this.each(function () {
      var tagsinput = $(this).data('tagsinput');
      // Initialize a new tags input
      if (!tagsinput) {
        tagsinput = new TagsInput(this, arg1);
        $(this).data('tagsinput', tagsinput);
        results.push(tagsinput);

        if (this.tagName === 'SELECT') {
          $('option', $(this)).attr('selected', 'selected');
        }

        // Init tags from $(this).val()
        $(this).val($(this).val());
      } else if (!arg1 && !arg2) {
        // tagsinput already exists
        // no function, trying to init
        results.push(tagsinput);
      } else if (tagsinput[arg1] !== undefined) {
        // Invoke function on existing tags input
        if (tagsinput[arg1].length === 3 && arg3 !== undefined) {
          var retVal = tagsinput[arg1](arg2, null, arg3);
        } else {
          var retVal = tagsinput[arg1](arg2);
        }
        if (retVal !== undefined) results.push(retVal);
      }
    });

    if (typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;

  /**
   * Most options support both a string or number as well as a function as
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function (item) {
        return item[propertyName];
      };
    }
  }

  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function () {
        return value;
      };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');

  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus();
      var oSel = document.selection.createRange();
      oSel.moveStart('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return iCaretPos;
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function () {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
})(window.jQuery);
