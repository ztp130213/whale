// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global ZeroClipboard, anchors */

!function ($) {
  'use strict';

  $(function () {

    // Scrollspy
    var $window = $(window)
    var $body = $(document.body)

    $body.scrollspy({
      target: '.bs-docs-sidebar'
    })
    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    // Kill links
    $('.bs-docs-container [href="#"]').click(function (e) {
      e.preventDefault()
    })

    // Sidenav affixing
    setTimeout(function () {
      var $sideBar = $('.bs-docs-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop = $sideBar.offset().top
            var sideBarMargin = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.bs-docs-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          },
          bottom: function () {
            return (this.bottom = $('.bs-docs-footer').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100)

      // Theme toggler
      ; (function () {
        var $stylesheetLink = $('#bs-theme-stylesheet')
        var $themeBtn = $('.bs-docs-theme-toggle')

        var activateTheme = function () {
          $stylesheetLink.attr('href', $stylesheetLink.attr('data-href'))
          $themeBtn.text('Disable theme preview')
          localStorage.setItem('previewTheme', true)
        }

        if (localStorage.getItem('previewTheme')) {
          activateTheme()
        }

        $themeBtn.click(function () {
          var href = $stylesheetLink.attr('href')
          if (!href || href.indexOf('data') === 0) {
            activateTheme()
          } else {
            $stylesheetLink.attr('href', '')
            $themeBtn.text('Preview theme')
            localStorage.removeItem('previewTheme')
          }
        })
      })();

    // Tooltip and popover demos
    $('.tooltip-demo').tooltip({
      selector: '[data-toggle="tooltip"]',
      container: 'body'
    })
    $('.popover-demo').popover({
      selector: '[data-toggle="popover"]',
      container: 'body'
    })

    // Demos within modals
    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // Popover demos
    $('.bs-docs-popover').popover()

    // Button state demo
    $('#loading-example-btn').on('click', function () {
      var $btn = $(this)
      $btn.button('loading')
      setTimeout(function () {
        $btn.button('reset')
      }, 3000)
    })

    // Modal relatedTarget demo
    $('#exampleModal').on('show.bs.modal', function (event) {
      var $button = $(event.relatedTarget)      // Button that triggered the modal
      var recipient = $button.data('whatever')  // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var $modal = $(this)
      $modal.find('.modal-title').text('New message to ' + recipient)
      $modal.find('.modal-body input').val(recipient)
    })

    // Activate animated progress bar
    $('.bs-docs-activate-animated-progressbar').on('click', function () {
      $(this).siblings('.progress').find('.progress-bar-striped').toggleClass('active')
    })

    // Config ZeroClipboard
    ZeroClipboard.config({
      moviePath: '/assets/flash/ZeroClipboard.swf',
      hoverClass: 'btn-clipboard-hover'
    })

    // Insert copy to clipboard button before .highlight
    $('.highlight').each(function () {
      var btnHtml = '<div class="zero-clipboard"><span class="btn-clipboard">Copy</span></div>'
      $(this).before(btnHtml)
    })
    var zeroClipboard = new ZeroClipboard($('.btn-clipboard'))
    var $htmlBridge = $('#global-zeroclipboard-html-bridge')

    // Handlers for ZeroClipboard
    zeroClipboard.on('load', function () {
      $htmlBridge
        .data('placement', 'top')
        .attr('title', 'Copy to clipboard')
        .tooltip()


      // Copy to clipboard
      zeroClipboard.on('dataRequested', function (client) {
        var highlight = $(this).parent().nextAll('.highlight').first()
        client.setText(highlight.text())
      })

      // Notify copy success and reset tooltip title
      zeroClipboard.on('complete', function () {
        $htmlBridge
          .attr('title', 'Copied!')
          .tooltip('fixTitle')
          .tooltip('show')
          .attr('title', 'Copy to clipboard')
          .tooltip('fixTitle')
      })
    })

    // tagscloud demo
    var tagsAll = ['新能源汽车', '金融科技', '新零售', '智能投顾', '一带一路', '新三板', 'A轮',
      '上市公司', '外资企业', 'P2P', '创新企业', '个人独资', '合伙企业', '有限责任公司', '股份制公司',
      '集团公司', '指标性企业', '垄断性企业', '高风险企业', '效益依赖企业', '高负债经营企业', '银行类', '投资类', '保险类',
      '信贷业务', '证券业务', '绿色金融', '大型国企', '人工智能', '无人超市', '出海企业', '互联网医疗'];
    var tags = []
    for (var i = 0; i < tagsAll.length; i++) {
      var item = {};
      item.value = tagsAll[i];
      item.href = "";
      tags.push(item);
    }
    $("#tagscloud-demo").whaleTagsCloud({ tags: tags, width: 520, radiusX: 80, radiusY: 200, radiusZ: 80 });
    // 组织架构图
    var treeData = {
      "name": "深圳市大疆创新科技有限公司",
      "children": [
        {
          "name": "深圳市大疆无人机技术有限公司",
          "value": "50.9%",
          "extra": "大股东",
        },
        {
          "name": "深圳市大疆灵眸技术有限公司",
          "value": "50.9%",
        },
        {
          "name": "深圳市大疆软件科技有限公司",
          "value": "50.9%",
          "children": [
            {
              "name": "Enos",
              "value": "50.9%",
            },
            {
              "name": "Noam",
              "value": "0.9%",
            }
          ]
        },
        {
          "name": "北京大疆文化传媒有限责任公司",
          "value": "50.9%",
          "children": [
            {
              "name": "Enos",
              "value": "50.9%",
            },
            {
              "name": "Noam",
              "value": "50.9%",
            }
          ]
        },
        {
          "name": "上海飞来科技有限公司",
          "value": "0.9%",
        },
        {
          "name": "深圳市大疆百旺科技有限公司",
          "value": "0.9%",
        }
      ]
    }
    $('#structure-demo').structure({ data: treeData });
    // 力图
    var forceData = {
      vertexes: [{
        _id: 'Company/1',
        name: 'a',
      }, {
        _id: 'Company/2',
        name: 'bao sifjs iaod foia suh foi sudf hoiu'
      }, {
        _id: 'Person/3',
        name: 'c'
      }, {
        _id: 'Company/4',
        name: 'd'
      }],
      edges: [{
        _id: 'Invest/1',
        _from: 'Company/1',
        _to: 'Company/2',
        label: '投资1元'
      }, {
        _id: 'Invest/2',
        _from: 'Company/2',
        _to: 'Company/1',
        label: '投资2元'
      }, {
        _id: 'Officer/3',
        _from: 'Person/3',
        _to: 'Company/1',
        label: '董事'
      }, {
        _id: 'Invest/4',
        _from: 'Company/2',
        _to: 'Company/4',
        label: '投资3元'
      }]
    }

    $('#force-demo').force('init', {
      data: forceData,
      height: 300,
    })
    // 雷达图
    whaleRadial({
      selector: '#radial-demo',
      width: 160,
      height: 160,
      radius: 50,
      data: {
        fieldNames: ['注册', '营收', '存款', '融资', '结算'],
        values: [
          [80000, 20000, 30000, 40000, 50000]
        ]
      },
      min: 0,
      max: 100000,
    })
    // tree graph
    var treeData1 =
      {
        "name": "Top Level",
        "children": [
          { "name": "Level 2: A" },
          { "name": "Level 2: A" },
          {
            "name": "Level 2: A",
            "children": [
              { "name": "Son of A" },
              { "name": "Daughter of A" }
            ]
          },
          {
            "name": "Level 2: B",
            "children": [
              { "name": "Son of B" },
              { "name": "Daughter of B" }
            ]
          },
          { "name": "Level 2: A" },
          { "name": "Level 2: A" },
        ]
      };

    $('#tree-demo').treeGraph(treeData1)
    // Hide copy button when no Flash is found
    // or wrong Flash version is present
    // treemap
    $.get('/assets/json/flare.json')
      .then(function (data) {
        $('#treemap-demo').treemap({
          data: data,
          width: 650,
          height: 470,
          onChangePath: function (path) {
            console.log(path)
          }
        })
      });

    // 柱状图
    $('#histogram-demo').histogram({
      data: [
        { x: 100, time: '2010-7-1' },
        { x: 200, time: '2011-7-1' },
        { x: 300, time: '2012-7-1' },
        { x: 400, time: '2013-7-1' }
      ],
      xRange: [new Date(2009, 7, 1), new Date(2014, 7, 1)],
      yRange: [0, 500],
      key: 'x',
      label: 'x'
    })

    // 折柱混合图
    $('#linehistogram-demo').lineHistogram({
      data: [
        { x: 100, y: 200000, time: '2010-7-1' },
        { x: 200, y: 800000, time: '2011-7-1' },
        { x: 300, y: 600000, time: '2012-7-1' },
        { x: 400, y: 400000, time: '2013-7-1' }
      ],
      xRange: [new Date(2009, 7, 1), new Date(2014, 7, 1)],
      yLineRange: [0, 10e5],
      yHistoRange: [0, 500],
      lineKey: 'y',
      histoKey: 'x',
      lineLabel: 'y',
      histoLabel: 'x',
      lineLegend: 'y',
      histoLegend: 'x'
    });
    // whale-alert
    ['success', 'warning', 'danger', 'positive'].forEach(function (type, idx) {
      $('#' + type + 'DetailBtn').click(function () {
        console.log('12345678');
        $.whaleAlert(type + '线索信息，可在“我收藏的线索”中看到', {
          id: '收藏' + idx,
          title: '收藏' + type,
          position: ['top-right', [10, 10]],
          type: type,
          onNoMoreAlert: function (ele) {
            console.log(ele);
          },
          autoClose: false
        });
      });
      $('#' + type + 'BasicBtn').click(function () {
        $.whaleAlert(type + '提示的文案!', {
          position: ['top-right', [10, 10]],
          type: type,
          isDetail: false,
          autoClose: false
        });
      });
    })
    $.whaleAlert('欢迎来到🐳2号');

    // whale tree
    var setting = {
      check: {
        enable: true
      },
      expand: {
        enable: true
      },
      class: 'new-css-style'
    };
    var zNodes = [{
      name: '标签管理',
      id: 1,
      open: true, // 是否展开
      checked: false, // 当setting内check的enable为true时起效
      children: [{
        name: '基本信息',
        id: 11,
        children: [{
          name: '用户类型',
          id: 111
        }, {
          name: '地理信息',
          id: 112,
          children: [{
            name: '城市类型',
            id: 1121
          }, {
            name: '行政区域',
            id: 1122,
            checked: true
          }, {
            name: '住所类型',
            id: 1123,
            children: [{
              name: '小区',
              id: 11231
            }, {
              name: '写字楼',
              id: 11232,
              open: true,
              children: [{
                name: '租金',
                id: 112321,
                class: '租金'
              }]
            }]
          }]
        }, {
          name: '电视使用',
          id: 113
        }, {
          name: '内容偏好',
          id: 114
        }]
      }, {
        name: '用户群管理',
        id: 12,
        children: [{
          name: '经理管理',
          id: 121
        }]
      }]
    }, {
      name: '内容管理',
      id: 2,
      open: true, // 是否展开
      checked: false, // 当setting内check的enable为true时起效
    }, {
      name: '行情管理',
      id: 3,
      open: true, // 是否展开
      checked: false, // 当setting内check的enable为true时起效
    }];
    $('#treeDemo').whaleTree('init', { data: zNodes });
    $('#checkTreeDemo').whaleTree('init', { data: zNodes, setting: setting });
    zeroClipboard.on('noflash wrongflash', function () {
      $('.zero-clipboard').remove();
      ZeroClipboard.destroy();
    })
  })

  // datepicker
  $('.datepicker-section [data-toggle="datepicker"]').each(function (idx) {
    $(this).datepicker({
      trigger: $($('.datepicker-section .datepicker-trigger')[idx]),
      format: 'YYYY-MM-DD',
      autoHide: true
    });
  })
  $('[data-toggle="datepicker"]').on('pick.datepicker', function (e) {
    console.log(e.date);
  });

  $('#datetimepicker').datepicker({
    showTime: true,
    trigger: $('#datetimepickerTrigger'),
    format: 'YYYY-MM-DD hh:mm:ss',
    autoHide: true,
    autoShow: true,
    autoPick: true
  });
  // 大日历
  $('#bigCalendar').bigCalendar({
    date: new Date(),
    schedule: {},
  });
  // 下拉单选
  $('#dropdown-selection-demo').dropdownSelect('init', {
    placeholder: '请选择',
    data: [{
      key: '1',
      value: '选项1'
    },
    {
      key: '2',
      value: '选项2'
    },
    ]
  });
  $(".dropdown-selection-input-demo").whaleDropdownSelect({
    width: 140,
    data: [
      { key: 1, value: '赵白' },
      { key: 2, value: '钱生' },
      { key: 3, value: '孙丽' },
    ]
  });
}(jQuery);

; (function () {
  'use strict';
  anchors.options.placement = 'left';
  anchors.add('.bs-docs-section > h1, .bs-docs-section > h2, .bs-docs-section > h3, .bs-docs-section > h4, .bs-docs-section > h5')
})();
