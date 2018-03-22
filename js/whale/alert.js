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
        "danger": "wrong",
      },
      // 默认配置
      defaults: {
          id: '',
          autoClose: true,      // 自动关闭
          closeTime: 3000,      // 自动关闭时间，不少于1000
          withTime: false,      // 添加计时  会在文字后面添加  ...10
          type: 'success',      // 提示类型, ['success', 'danger', 'warning', 'info']
          isDetail: true,       // 是否为详细类型弹窗
          position: ['center', [-0.42, 0]], // 位置,第一个写位置; 后面是相对于window的偏移，如果是1跟-1之间为百分比, [top, right]
          title: '',            // 标题
          close: '',            // 需绑定关闭事件的按钮
          speed: 'normal',      // fadeIn / fadeOut 速度
          isOnly: true,         // 是否只出现一个
          minTop: 10,           //最小Top
          onShow: function () {
          },  // 打开后回调
          onClose: function () {
          },  // 关闭后回调
          onNoMoreAlert: function () {
          },  // 点击不再显示后回调
      },

      // 提示框模版
      detailTmpl:
          '<div class="whale-alert alert-dismissable clearfix alert-detail ${Type}">' +
              '<i class="type-icon iconfont icon-toast-${State}"></i>' +
              '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' +
                  '<i class="close-white-icon iconfont icon-close"></i>' +
              '</button>' +
              '<h4 style="white-space: nowrap;">' +
                  '${Title}' +
              '</h4>' +
              '<p>' +
                  '<span class="msg">${Content}</span>' +
                  '<span class="no-more-alert"><i class="checkbox iconfont icon-non-check"></i>不再提示</span>' +
              '</p>' +
          '</div>',
      basicTmpl:
          '<div class="whale-alert alert-dismissable clearfix alert-basic ${Type}">' +
              '<p class="msg">' +
                  '${Content}' +
              '</p>' +
              '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' +
                  '<i class="close-white-icon iconfont icon-close"></i>' +
              '</button>' +
          '</div>',

      noMoreAlertList: [],

      // 初始化函数
      init: function (msg, options) {
          if (this.noMoreAlertList.indexOf(options.id) > -1) return false;

          this.options = $.extend({}, this.defaults, options);

          this.create(msg);
          this.setCss();

          this.bindEvent();

          return this.alertDiv;
      },

      template: function (tmpl, data) {
          $.each(data, function (k, v) {
              tmpl = tmpl.replace('${' + k + '}', v);
          });
          return $(tmpl);
      },

      // 创建提示框
      create: function (msg) {
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
      setCss: function () {
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
      bindEvent: function () {
          this.bindShow();
          this.bindClose();
          this.bindNoMoreAlert();

          if ($.browser && $.browser.msie && $.browser.version == '6.0') {
              this.bindScroll();
          }
      },

      // 显示事件
      bindShow: function () {
          var ops = this.options;
          this.alertDiv.fadeIn(ops.speed, function () {
              ops.onShow($(this));
          });
      },

      // 关闭事件
      bindClose: function () {
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
      bindNoMoreAlert: function () {
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
          })
      },

      // IE6滚动跟踪
      bindScroll: function () {
          var alertDiv = this.alertDiv,
              top = alertDiv.offset().top - $(window).scrollTop();
          $(window).scroll(function () {
              alertDiv.css("top", top + $(window).scrollTop());
          })
      },

      // 检测是否为手机浏览器
      checkMobile: function () {
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
      arg = arg || {}
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
          }
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
  }
})(jQuery);
