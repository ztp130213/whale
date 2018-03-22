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
  var DEFAULT = {}
  var WhaleDropdownSelect = function(element, options) {
      this.options             = $.extend({}, DEFAULT, options)
      this.$body               = $(document.body)
      this.$element            = $(element)
      this.$promptBox          = null
  }
  var tmpl =
      '<div class="input-with-attaches">' +
          '<input type="text" class="input input-140" placeholder="刘飞">' +
          '<div class="attach">' +
              '<i class="find iconfont icon-SearchBox"></i>' +
          '</div>' +
          '<div class="whale-dropdown-select-container scroll-style">' +
              '<ul class="whale-dropdown-select-ul">' +
                  // '<li class="whale-dropdown-select-li">赵白</li>' +
                  // '<li class="whale-dropdown-select-li">钱生</li>' +
                  // '<li class="whale-dropdown-select-li">孙丽</li>' +
              '</ul>' +
          '</div>'
      '</div>'
  WhaleDropdownSelect.prototype.init= function() {
      this.$element.append(tmpl)
      this.$promptBox = this.$element.find('.whale-dropdown-select-container')
      this.setWidth();
      this.setPlaceholder();
      if (this.options.defaultValue) {
          this.$element.data('value', this.options.defaultValue)
      }
      this.selectOption()
      this.$element.on('focus', '.input', $.proxy(function() {
          this.show();
      }, this))
      this.$element.on('blur', '.input', $.proxy(function() {
          // 规避blur在click之前触发的问题
          setTimeout($.proxy(function() {this.hide()}, this), 300);
      }, this))
      this.$element.on('keyup', '.input', $.proxy(function() {
          var that = this
          var $input = that.$element.find('.input');
          if (that.options.requestPath && that.options.requestData) {
              that.options.requestData[that.options.searchKey] = $input.val().trim() || that.$element.data('value');
              $.ajax({
                  url: that.options.requestPath,
                  method: that.options.requestMethod,
                  data: that.options.requestData,
                  success: function (data) {
                      that.options.data = data.payload;
                      that.show();
                  },
                  failed: function (err) {
                      console.log(err)
                  }
              })
          }
      }, this))
  }
  WhaleDropdownSelect.prototype.setWidth = function() {
      if (this.options.width) {
          this.$element.find('.input-with-attaches').css('width', this.options.width)
          this.$promptBox.css('width', parseInt(this.options.width - 2) + 'px')
          $(this.$element.find('input')).css('width', parseInt(this.options.width - 38) + 'px')
      }
  }
  WhaleDropdownSelect.prototype.setPlaceholder = function() {
      if (this.options.placeholder) {
          $(this.$element.find('input')).attr('placeholder', this.options.placeholder)
      }
  }
  WhaleDropdownSelect.prototype.show = function() {
      if (this.options.data) {
          var docfrag = document.createDocumentFragment()
          for (var i in this.options.data) {
              var li = document.createElement("li");
              var $li = $(li);
              var keyUnit = this.options.keyUnit || '';
              var valUnit = this.options.valUnit || '';
              var liHtml = this.options.data[i].html || this.options.data[i][valUnit] || this.options.data[i].value;
              $li.html(liHtml);
              $li.addClass('whale-dropdown-select-li');

              keyUnit ? $li.data('key', this.options.data[i][keyUnit]) : $li.data('key', this.options.data[i].key)
              valUnit ? $li.data('value', this.options.data[i][valUnit]) : $li.data('value', this.options.data[i].value)

              docfrag.appendChild(li);
          }
          $(this.$element.find('.whale-dropdown-select-ul')).empty().append(docfrag)
          this.$promptBox.show();
      }
  }
  WhaleDropdownSelect.prototype.hide = function() {
      this.$promptBox.hide();
  }
  WhaleDropdownSelect.prototype.toggle= function() {
      if (this.$promptBox.css('display') === 'none') {
          this.$promptBox.show();
      } else if (this.$promptBox.css('display') === 'block') {
          this.$promptBox.hide();
      }
  }
  WhaleDropdownSelect.prototype.selectOption= function() {
      var that = this
      that.$element.on('click', '.whale-dropdown-select-li' , function() {
          var $this = $(this)
          var value = $.trim($this.data('value') || $this.text())
          that.$element.find('.input').val(value)
          that.$element.data('value', value)

          var key =$.trim($this.data('key')) || '';
          if(key){
              that.$element.find('.input').attr('data-key',key)
          }

      })
  }
  $.fn.whaleDropdownSelect = function(options) {
      return this.each(function() {
          var whaleDropdownSelect = new WhaleDropdownSelect(this, options)
          whaleDropdownSelect.init()
      });
  };
}(jQuery));
