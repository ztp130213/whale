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
    init: function (options) {
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
          list += '<li><a href="javascript:;" key=' + element.key + '>' + element.value + '</a></li>'
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
    getValue: function () {
      var $this = $(this);
      var value = '';
      if ($this.find('.label').attr('key')) {
        value = $this.find('.label').text();
      }
      return value;
    },
    //获取选择的选项对应的key值
    getKey: function () {
      var $this = $(this);
      var key = $this.find('.label').attr('key');
      return key ? key : '';
    },
    //重置
    reset: function (val, key) {
      var $this = $(this);
      val = val || '';
      key = key || '';
      $this.find('.label').text(val || defaultOptions.placeholder);
      $this.find('.label').attr('key', key);
    },
    destroy: function () {
      $(this).off()
        .children().remove()
    }
  };

  $.fn.dropdownSelect = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.dropdownSelect');
    }

  };

})(jQuery);
