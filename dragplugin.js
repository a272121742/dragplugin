(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'lodash'], factory);
    } else if (typeof exports !== 'undefined') {
        try { jQuery = require('jquery'); } catch (e) {}
        try { _ = require('lodash'); } catch (e) {}
        factory(jQuery, _);
    } else {
        factory(jQuery, _);
    }
})(function($, _) {
  $.fn.dragplugin = function(opts,a) {
    var defaultOptions = {
      sidebar : '.grid-sidebar',
      center : '.grid-center',
      edit : '.grid-edit',
      save : '.grid-save',
      load : '.grid-load',
      clear : '.grid-clear',
      remove : '.grid-remove',
      onDragMode : false
    };

    var container = $(this);
    var options = $.extend({}, defaultOptions, options);

    var panelTemplate = '<div class="grid-stack-item-content  panel panel-info"></div>';
    var headTemplate = '<div class="panel-heading clearfix"></div>';
    var bodyTemplate = '<div class="panel-body"></div>';
    var buttonTemplate = '<div class="btn-group pull-right" role="toolbar" aria-label="Left Align">'
                            + '<a href="#" class="btn btn-default btn-sm">'
                                + '<span class="glyphicon glyphicon-remove grid-remove" aria-hidden="true"></span>'
                            + '</a>'
                        + '</div>';
    var titleTemplate = '<h3 class="panel-title pull-left" data-toggle="tooltip" data-placement="bottom" title=""></h3>'
    var resizableHandleTemplate = '<div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90; display: none;"></div>';

    var dragModule = (function(){
      return {
        container : container,
        sidebar : null,
        sidebarContainer : null,
        sidebarSerializedData : {},
        center : null,
        centerContainer : null,
        centerSerializedData : {},
        // 初始化边栏
        initSidebar : function(){
          var sidebarContainer = this.sidebarContainer = $(options.sidebar).gridstack({
            disableResize : true,
            cellHeight : 36,
            width: 2,
            // 参阅JQuery UI draggable
            draggable : {
              revert: 'invalid',
              handle: '.panel-heading',
              scroll: false,
              appendTo: 'body'
            }
          });
          this.sidebar = sidebarContainer.data('gridstack');
          this.sidebar.isCenter = false;
        },
        // 初始化中心
        initCenter : function(){
          var centerContainer = this.centerContainer = $(options.center).gridstack({
            acceptWidgets: options.sidebar + ' ' + '.grid-stack-item',
            placeholderText: '请选择位置放下',
            width: 12,
            draggable : {
              revert: 'invalid',
              handle : '.panel-heading',
              scroll: false,
              appendTo : 'body'
            }
          });
          this.center = centerContainer.data('gridstack');
          this.center.isCenter = true;
        },
        // 创建插件元素
        createWidgetElement : function(_id, _title, _body){
          var panel = $(panelTemplate);
          var title = $(titleTemplate).attr('title', _title).html(_title);
          var head = $(headTemplate).append(title);
          var body = $(bodyTemplate).html(_body);
          return $('<div>').attr('id', _id).append(panel.append(head).append(body)).append(resizableHandleTemplate);
        },
        // 添加插件元素
        addWidgetElement : function(grid, id, title, body, x, y, width, height){
          var self = this;
          var widget = self.createWidgetElement(id, title, body);
          grid.addWidget(widget, x, y, width, height, true);
          grid.resizable(widget, grid.isCenter);
        },
        // 获取序列化数据
        getSerializedData : function(elClass){
          return _.map($(elClass + '> .grid-stack-item:visible'), function (el) {
            el = $(el);
            var node = el.data('_gridstack_node');
            return {
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
              title: el.find('.panel-title').html().trim(),
              body: el.find('.panel-body').html().trim()
            };
          });
        },
        // 设置序列化数据
        setSerializedData : function(grid, serializedData){
          var self = this;
          grid.removeAll();
          var data = GridStackUI.Utils.sort(serializedData);
          _.each(data, function (node) {
            self.addWidgetElement(grid, '', node.title, node.body, node.x, node.y, node.width, node.height);
          });
        },
        // 注册事件
        events : function(){
          var self = this;
          var container = self.container;
          var sidebar = self.sidebar;
          var sidebarContainer = self.sidebarContainer;
          var center = self.center;
          var centerContainer = self.centerContainer;
          // 删除
          centerContainer.delegate(options.remove, 'click', function(){
            var widget = $(this).parents('.grid-stack-item');
            var height = widget.height();
            if(center.grid.nodes.length === 1){
              alert('请至少保留一个可配置窗口');
              return;
            }

            // var dataGsCurrentHeight = parseInt(centerContainer.attr('data-gs-current-height'));
            center.resize(widget, 4, 4)
            center.removeWidget(widget);
            widget.find('.panel-title').next().remove();
            widget.attr('data-gs-width', 2);
            widget.attr('data-gs-height', 2);
            sidebar.addWidget(widget);
            sidebar.resizable(widget, false);
          });
          // 添加后追加buttom，并求改为可拖拽样式
          centerContainer.on('added', function(event, items){
            items.forEach(function(item){
              var widget = item.el;
              widget.find('.panel-title').after(buttonTemplate);
              // 源码bug，需要移除最后一项，否则无法拖动
              widget.children().last().remove();
              // widget.removeClass('ui-resizable-disabled');
              center.resizable(widget, true);
            });
          });
          // 编辑按钮
          container.delegate(options.edit, 'click', function(){
            self.edit(this.checked);
          });
          // 保存按钮
          container.delegate(options.save, 'click', function(){
            self.save();
            return false;
          });
          // 读取按钮
          container.delegate(options.load, 'click', function(){
            self.load();
            return false;
          });
          // 清空按钮
          container.delegate(options.clear, 'click', function(){
            self.clear();
            return false;
          });
        },
        
        init : function(){
          var self = this;
          self.initSidebar();
          self.initCenter();
          self.events();
          self.edit(options.onEditModel);
        },
        edit : function(onEditModel){
          var self = this;
          self.center.setStatic(!onEditModel);
          self.sidebar.setStatic(!onEditModel);
          if(!!onEditModel){
            self.container.find('.grid-stack').addClass('grid-stack-onEditModel');
          }else{
            self.container.find('.grid-stack').removeClass('grid-stack-onEditModel');
          }
        },
        save : function(){
          var self = this;
          self.centerSerializedData = self.getSerializedData(options.center);
          self.sidebarSerializedData = self.getSerializedData(options.sidebar);
        },
        load : function(){
          var self = this;
          self.setSerializedData(self.center, self.centerSerializedData);
          self.setSerializedData(self.sidebar, self.sidebarSerializedData);
        },
        clear : function(){
          var self = this;
          self.center.removeAll();
          self.sidebar.removeAll();
        }
      };
    })();

    dragModule.init();

    var result = {
      edit : dragModule.edit.bind(dragModule),
      save : dragModule.save.bind(dragModule),
      load : dragModule.load.bind(dragModule),
      clear : dragModule.clear.bind(dragModule),
      addWidget : dragModule.addWidgetElement.bind(dragModule),
      data : function(grid){
        this.save();
        switch(grid){
          case options.center : return {center : dragModule.centerSerializedData};
          case options.sidebar : return {sidebar : dragModule.sidebarSerializedData};
          default : return {sidebar : dragModule.sidebarSerializedData, center : dragModule.centerSerializedData};
        }
      },
      options : options
    };
    return result;
  };
});