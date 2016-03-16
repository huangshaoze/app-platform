Ext.ns('Home');
var MENU_URL = CONTEXT_PATH + "/menu/queryMenusByUser";
Home.Logout = function() {//退出系统
	Ext.MessageBox.confirm('退出系统', "您确认退出系统吗？", function(a,b,c){
		if(a == 'yes'){
			window.location.href = "/j_spring_security_logout";
			//window.location.href = "/j_spring_cas_security_logout";
		}			
	});
};

Home.personConfig = function() {//个人设置
	alert("开发中。。。");	
};

Home.ClickNode = function(view, record) {
	if (!record.isLeaf()) {
		return;
	}
	Home.ClickTopTab(record);
};

Home.ClickTopTab = function(record) {
	var b = Ext.getCmp("centerTabPanel");
	var panelId = "HomePanel_" + record.get('id');
	var d = b.getComponent(panelId);
	var src = CONTEXT_PATH + record.get('resAction');
	if (d == null) {
		var panelItem = Ext.create('Ext.ux.IFrame', {
			id:panelId,
            title: record.get('text'),
            loadMask: 'Loading...',
            src:src
		});
		d = b.add(panelItem);
		b.setActiveTab(d);
	} else {
		b.setActiveTab(d);
	}
};

//添加页面到tab
Home.AddTab = function(id, name, action) {
	var b = Ext.getCmp("centerTabPanel");
	var panelId = "HomePanel_" + id;
	var d = b.getComponent(panelId);
	if (d == null) {
		var panelItem = Ext.create('Ext.ux.IFrame', {
			id:panelId,
            title: name,
            loadMask: 'Loading...',
            src:action
		});
		d = b.add(panelItem);
		b.setActiveTab(d);
	} else {
		b.setActiveTab(d);
	}	
};

//根据页面ID关闭此页面
Home.closeTab = function(id) {
	var panelId = "HomePanel_" + id;
	var b = Ext.getCmp("centerTabPanel");
	var d = b.getItem(panelId);
	if (d != null) {
		b.remove(d);
	}
};

Ext.define('HomePage', {
	extend: 'Ext.container.Viewport',
	layout: 'border',
    initComponent: function () { 
	   	 this.north = Ext.create("Ext.panel.Panel", {  
	         region: 'north',
	         height: 65,
	         border: false,
	         frame: true,
	         contentEl: "app-header",
	         id: "north-Panel"
	     }); 
		 this.center = Ext.create('Ext.tab.Panel', {
			 id:'centerTabPanel',
	         region: 'center', 
	         deferredRender: true,
	         enableTabScroll: true,
	         activeTab: 0,
			 defaults: {
				autoScroll: true,
				closable: true
			 },
			 plugins: Ext.create('Ext.ux.TabCloseMenu'),
	         items: [{
	        	 	xtype:'uxiframe',
	                title: '我的工作台',
	                closable: false,
	                iconCls: 'house',
	                autoScroll: true,
	                frame:true,  
	                loadMask: 'Loading...',
	                src:"/home/index"
	         }]
	     });
		 this.west = Ext.create('Ext.panel.Panel', {
			 region: 'west',
	         id: 'west-panel', 
	         title: '导航菜单',
	         iconCls : "application_side_boxes",  
	         split: true,
	         autoScroll: true,
	         width: 200,
	         minWidth: 175,
	         maxWidth: 400,
	         collapsible: true,
	         animCollapse: true,
	         margins: '0 0 0 5',
	         layout: 'accordion',
	         items:[],
	         flag:true
		 });
		 this.south = Ext.create('Ext.panel.Panel', {
			 region: 'south',
	         id: 'south-panel', 	       
	         html:'<center>统一接口平台 - 上海屹通版权所有 2014-2015</center>'
		 });
	     //动态加载菜单
	 	 this.loadWestMenu();    	
    	 this.items = [this.north, this.center, this.west, this.south];
    	 this.callParent();
    },
    loadWestMenu: function() {//加载菜单
		var westPanel = Ext.getCmp("west-panel");
		var thiz = this;
		Ext.Ajax.request({
			url: MENU_URL,
			success: function(response, options) {
				var arr = eval(response.responseText);
				var panelComponents = [];
				for (var i = 0; i < arr.length; i++) {
					var root = arr[i];
					var panel = thiz.createTreePanel(root);
					panelComponents.push(panel);
				}
				westPanel.add(panelComponents);
			}
		});
    },
    createTreePanel: function(root) {//创建菜单树组件
		var panel = Ext.create('Ext.tree.Panel', {
			title: root.text,
			iconCls: root.iconCls == null?"picture" : root.iconCls,
		    layout: 'fit',
		    animate: true,
		    border: false,
		    expanded: true,
		    autoScroll: true,
		    store: Ext.create('Ext.data.TreeStore', {
		    	proxy: {
	       	         type: 'ajax',
	    	         actionMethods:'post',
	    	         url: MENU_URL,
	    	         reader: {
	    	             type: 'json'
	    	         }
                },
                fields:['id', 'text', 'resAction', 'theSort', 'iconCls', 'menuSeq', 'leaf'],
                root : {  
                    id : root.id
                }
		    }),
		    rootVisible: false,
			listeners: {
				itemclick: Home.ClickNode
			}
		});
		return panel;
    }
});


/***风格转换****************/
function changeStyle(style) {
    Ext.util.CSS.swapStyleSheet("theme", "resources/css/" + style + ".css");
}

Ext.onReady(function(){
    Ext.create('HomePage');
});