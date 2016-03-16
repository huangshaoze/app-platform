var PAGESIZE= 3;
var ROLEGRID;//角色组件全局变量
var BINDUSERGRID;//角色绑定的用户列表组件全局变量
var ROLE_GRID_STORE_URL = '/role/pageQueryRoles'; //角色列表
var ROLE_RESOURCE_GRID_STORE_URL = '/role/queryResources4Role';//根据角色查询该角色赋予的资源
var ROLE_USER_GRID_STORE_URL = '/role/queryUsers4Role';//根据角色查询该角色下的用户
var AUTH_USER_GRID;//角色绑定用户GRID组件
var AUTH_RESOURCE_GRID;//角色绑定资源GRID组件
var USER_RES_TAB;//角色绑定用户与角色绑定资源TABPANEL组件
//判断角色编码格式的正则表达式
Ext.apply(Ext.form.VTypes, {
    roleCode: function(val, field){
    	var reg =/ROLE_[\w+]/;
		if (reg.exec(field.getValue()))
          return true;
    },
    roleCodeText: '用户编码不满足ROLE_格式'
});

/*********************************添加、修改角色RoleForm组件*****************
 *author        ： zhuzengpeng
 *description   : 添加、修改角色FORM组件
 *date          : 2015-02-11
***********************************************************************/
Ext.define('RoleForm', {
	extend: 'UxFormPanel',
	bodyStyle:"padding: 5 0 0",
    fieldDefaults: {
        autoFitErrors: false
    },
	layout: {
        type: 'form',
        columns: 1
    },
    plugins: {
        ptype: 'datatip'
    },
    buttonAlign :'center',
    initComponent: function () { 
    	this.idHidden = this.createHidden('id');
    	this.name = this.createTextField('角色名称', 'name', '100%', false, '');
    	this.code = this.createTextField('角色编码', 'code', '100%', false, '', 'roleCode');   	
    	this.descn =this.createTextArea('描述', 'descn', '60', '100%', true);
    	
        this.buttons = [
                        {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},
                        {text: '修改', width: 20,iconCls:'edit', hidden: true, handler: this.updateFormClick, scope: this},
                        {text: '清空', width: 20, iconCls:'redo',  handler: this.resetFormClick, scope: this},
                        {text: '关闭', width: 20,iconCls:'cross', handler: this.onCloseClick, scope: this}
                     ];
    	this.items = [this.name, this.code, this.descn, this.idHidden];
    	//必须调用callParent方法
    	this.callParent();
    },
    addFormClick : function() {    	
	 	 var thisForm = this.getForm();
    	 if(thisForm.isValid()) {
    		 thisForm.submit({
                 waitMsg: '正在提交数据...',
                 url: '/role/insertRole', 
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", "添加成功!");
                 	ROLEGRID.roleInsertWindow.hide();
                 	ROLEGRID.store.load();
                 },
                 failure: function(form, action) {
                 	Ext.MessageBox.alert("系统提示:", "添加失败!【"+action.result.message + "】");
                 }
         	});
         }   	
    },
    updateFormClick: function() {   	
        if(this.getForm().isValid()) {
        	this.getForm().submit({
                waitMsg: '正在提交数据...',
                url: '/role/updateRole', 
                method: 'POST',
                success: function(form, action) { 
                	Ext.MessageBox.alert("系统提示:", "修改成功!");
                	ROLEGRID.roleUpdateWindow.hide();
                	ROLEGRID.store.load();
                	ROLEGRID.getSelectionModel().deselectAll();
                },
                failure: function(form, action) {
                	Ext.MessageBox.alert("系统提示:", "修改失败!");
                }
        	});
        }    	
    },
    resetFormClick: function() {
    	this.getForm().reset();
    },
    onCloseClick:function() {
    	this.ownerCt.hide();
    }
});

/*********************************添加角色弹窗组件RoleInsertWindow**********************
 *author        ： zhuzengpeng
 *description   : 添加角色弹窗组件
 *date          : 2015-02-11
***********************************************************************************/
Ext.define('RoleInsertWindow', {
	extend: 'Ext.window.Window',
	title:'添加角色',
	width:400,
	closeAction:'hide',
	initComponent:function() {
		this.roleForm = Ext.create('RoleForm');
		this.roleForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].show();   //显示添加按钮;
		this.roleForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1].hide();   //隐藏修改按钮;
		this.items = [this.roleForm];
		this.callParent();
	}
});

/*********************************修改角色弹窗组件RoleUpdateWindow**********************
 *author        ： zhuzengpeng
 *description   : 修改角色弹窗组件
 *date          : 2015-02-11
**********************************************************************************/
Ext.define('RoleUpdateWindow', {
	extend: 'Ext.window.Window',
	title:'更新角色',
	width:400,
	closeAction:'hide',
	initComponent:function() {
		this.roleForm = Ext.create('RoleForm');
		this.roleForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].hide();   //隐藏添加按钮;
		this.roleForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1].show();   //显示修改按钮;
		this.items = [this.roleForm];
		this.callParent();
	}
});

/*********************************角色列表组件*************************
 *author        ： zhuzengpeng
 *description   : 角色列表组件(GRID)
 *date          : 2015-02-11
******************************************************************/
Ext.define('RoleGrid', {
	extend: 'UxGridPanel',
	region:'west',
	width:500,
	title: '角色数据',
	columnLines: true,
	selType: 'checkboxmodel',
	viewConfig:{  
		   enableTextSelection:true  
	}  ,		
	initComponent:function(){
		this.roleInsertWindow = Ext.create('RoleInsertWindow');
		this.roleUpdateWindow = Ext.create('RoleUpdateWindow');
    	this.store = Ext.create('Ext.data.Store', {
		 pageSize: PAGESIZE,
		 proxy: {
	         type: 'ajax',
	         actionMethods:'post',
	         url: ROLE_GRID_STORE_URL,
	         reader: {
	             type: 'json',
	             root : 'rows',
	             totalProperty  : 'total'
	         }
	     },
		 fields:['id', 'name', 'code', 'enabled', 'descn']
    	});
    	this.tbar = Ext.create('Ext.toolbar.Toolbar', {
    		items:[
    		        {text:'添加',iconCls: 'add',handler: this.onAddClick, scope:this},
               	'-',{text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},
               	'-',{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this}
               ]
    	}),
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: '显示{0}到{1}条,一共{2}条',
            emptyMsg: "没有记录"
        }),
    	this.columns = [{xtype: 'rownumberer', width: 50, align:'center', text:'序号'},
    	                {header:'ID',dataIndex:'id',width:100,sortable: true,hidden:true},
    	                {header:'角色名称',dataIndex:'name',width:140,sortable: true},
    	            	{header:'角色编码',dataIndex:'code',width:160,sortable: true},
    	            	{header:'描述',dataIndex:'descn',width:120,sortable: true,  
    	                    renderer: function(value,metaData,record) {  
    	                        metaData.tdAttr = 'data-qtip="' + value + '"';  
    	                        return value;  
    	                    }
    	            	}
    	            	];   
        this.listeners = {
            "itemdblclick": { fn: this.onDblclickClick, scope: this} 		//响应双击事件
        };
    	//必须调用下面方法。。
        this.callParent();
    },
    onAddClick : function() {
    	var win = this.roleInsertWindow;
    	win.roleForm.getForm().reset();
    	win.show();
    },
    onModifyClick: function() {
    	var selModel = ROLEGRID.getSelectionModel();
	    if (selModel.hasSelection()) {
	       var selected = selModel.getSelection();
	       if(selected.length > 1) {
	    	   Ext.Msg.alert('系统提示', '不能修改多条记录..');
	    	   return;
	       }
	       var win = this.roleUpdateWindow;
	       win.roleForm.getForm().reset();
	       win.roleForm.code.readOnly = true;
		   win.show();
		   win.roleForm.getForm().loadRecord(selected[0]);
       }
       else {
           Ext.Msg.alert("系统提示", "请选择一条记录!");
       }
    },
    onDeleteClick: function() {
    	var selModel = ROLEGRID.getSelectionModel();
        if (selModel.hasSelection()) {
        	var selected = selModel.getSelection();
            Ext.Msg.confirm("提醒信息", "确定要删除这" + selected.length + "条信息吗？", function (button) {
                if (button == "yes") {                   
                    var Ids = []; //要删除的id
                    Ext.each(selected, function (item) {
                        Ids.push(item.data.id);
                    });
			       	Ext.Ajax.request({
				       	   url:'/role/deleteRoles',
				       	   method : 'POST', 
				       	   params: { ids: Ids},
			               success: function(resp, opts) { 
				               	Ext.MessageBox.alert("系统提示:", "删除成功!");
				               	ROLEGRID.store.load();
			               },
			               failure: function(resp, opts) {
			               	 	Ext.MessageBox.alert("系统提示:", "删除失败!");
			               }
				       	});
                }
            });
        }
        else {
            Ext.Msg.alert("系统提示", "请选择一条记录！");
        }
    },   
    onAuthoriteClick:function() {
    	var selModel = USERGRID.getSelectionModel();
	    if (selModel.hasSelection()) {
	       var selected = selModel.getSelection();
	       if(selected.length > 1) {
	    	   Ext.Msg.alert('系统提示', '不能修改多条记录..');
	    	   return;
	       }
	       var win = this.userRoleRelationWindow;
		   win.show();
       }
       else {
           Ext.Msg.alert("系统提示", "请选择一条记录!");
       }
    },
    onResetPwdClick: function() {//重置密码
    	var selModel = USERGRID.getSelectionModel();
	    if (selModel.hasSelection()) {
	       var selected = selModel.getSelection();
	       if(selected.length > 1) {
	    	   Ext.Msg.alert('系统提示', '不能选择多条记录..');
	    	   return;
	       }
	       var userId = selected[0].data.id;
	       Ext.Msg.confirm("提醒信息", "确定要重置此用户密码吗?(重置成000000)",function(btn){
				if (btn == 'yes') {
			       	Ext.Ajax.request({
				       	   url:'/user/resetPwd',
				       	   method : 'POST', 
				       	   params: { userId: userId},
			               success: function(form, action) { 
			               		Ext.MessageBox.alert("系统提示:", "重置成功!");
			               },
			               failure: function(form, action) {
			            	    Ext.MessageBox.alert("系统提示:","重置失败!");
			               }
				    });					
				}
	       });	       
        }
        else {
           Ext.Msg.alert("系统提示", "请选择一条记录!");
        }   	
    },
    onDblclickClick: function(view, record, item) {
    	var roleId = record.data.id;
    	var baseParams = {roleId:roleId};
    	//绑定用户操作
    	AUTH_USER_GRID.setTitle("绑定用户---" + record.data.name);
    	AUTH_USER_GRID.roleId = roleId;
    	Ext.apply(AUTH_USER_GRID.store.proxy.extraParams, baseParams);
    	AUTH_USER_GRID.store.load();
    	//授权资源操作
    	AUTH_RESOURCE_GRID.setTitle("授权资源---" + record.data.name);
    	AUTH_RESOURCE_GRID.roleId = roleId;
    	Ext.apply(AUTH_RESOURCE_GRID.store.proxy.extraParams, baseParams);
    	AUTH_RESOURCE_GRID.store.load();
    },
    onQuery: function() {//查询按钮
    	var userName = Ext.getCmp("userName_text_toolbar").getValue();
    	var baseParams = {userName:userName};
    	Ext.apply(USERGRID.store.proxy.extraParams, baseParams);
    	USERGRID.store.loadPage(1);
    },
    onAdvancedQuery: function() {//高级查询
    	alert(22);
    }
    
});

/*************************角色绑定用户列表组件AuthUserGrid***************
 *author        ： zhuzengpeng
 *description   : 角色绑定用户列表组件(GRID)
 *date          : 2015-02-13
******************************************************************/
Ext.define('AuthUserGrid', {
	extend: 'UxGridPanel',
	roleId:'',
	title: '绑定用户',
	columnLines: true,
	selModel:Ext.create('Ext.selection.CheckboxModel',{
		checkOnly:true,		
		showHeaderCheckbox: false,
		listeners : {
            "select" : {  
                fn : function(e, record, rowIndex) {
        		    var sb = Ext.getCmp('right-statusbar-usergrid');     
        	       	Ext.Ajax.request({
        	       	   url:'/role/bindUser',
      		       	   method : 'POST', 
      		       	   params: {roleId: AUTH_USER_GRID.roleId, ids: record.data.id},
      	               success: function(resp, opts) { 
      	                	sb.setStatus({
      	                		text: '绑定用户【' + record.data.userName + '】成功!',
      	                        clear: true 
      	                    });
      	               },
      	               failure: function(resp, opts) {
     	                	sb.setStatus({
      	                		text: '绑定用户【' + record.data.userName + '】失败!'
      	                    });
      	               }
         	       	});	
                }  
            },			
            "deselect" : {  
                 fn : function(e, record, rowIndex) {  
         		    var sb = Ext.getCmp('right-statusbar-usergrid');  
         	       	Ext.Ajax.request({
         	       	   url:'/role/unBindUser',
       		       	   method : 'POST', 
       		       	   params: {roleId: AUTH_USER_GRID.roleId, ids: record.data.id},
       	               success: function(resp, opts) { 
       	                	sb.setStatus({
       	                		text: '取消绑定用户【' + record.data.userName + '】成功!',
       	                        clear: true 
       	                    });
       	               },
       	               failure: function(resp, opts) {
      	                	sb.setStatus({
       	                		text: '取消绑定用户【' + record.data.userName + '】失败!'
       	                    });
       	               }
          	       	});
                 }  
             } 
		}
	}),
	viewConfig:{  
		   enableTextSelection:true  
	}  ,		
	initComponent:function(){
    	this.store = Ext.create('Ext.data.Store', {
		 pageSize: PAGESIZE,
		 proxy: {
	         type: 'ajax',
	         actionMethods:'post',
	         url: ROLE_USER_GRID_STORE_URL,
	         reader: {
	             type: 'json',
	             root : 'rows',
	             totalProperty  : 'total'
	         }
	     },
		 fields:['id', 'userName', 'userCode', 'orgId', 'orgName', 'gender', 'gender_Name',
		         'phoneNo', 'mPhoneNo', 'email', 'birthday', 'lastLogin', 'ipAddress', 'counter']
    	});
        this.tbar = Ext.create('Ext.ux.StatusBar', {
            defaultText: '',
            id: 'right-statusbar-usergrid',
            statusAlign: 'right',
            items:[
                  	{xtype:'textfield', fieldLabel:'用户名', labelAlign:'right', id:'userName_text_toolbar',labelWidth:45},
                  	'-',{xtype:'button', text:'查询', iconCls:'query', scope:this, handler:this.onQuery}
                  ]
        }),
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: '显示{0}到{1}条,一共{2}条',
            emptyMsg: "没有记录"
        }),
    	this.columns = [{xtype: 'rownumberer', width: 50, align:'center', text:'序号'},
    	                {header:'userId',dataIndex:'id',width:100,sortable: true,hidden:true},
    	                {header:'用户名称',dataIndex:'userName',width:120,sortable: true},
    	            	{header:'登陆帐号',dataIndex:'userCode',width:120,sortable: true},
    	            	{header:'所属机构',dataIndex:'orgName',width:120,sortable: true},
    	            	{header:'性别',dataIndex:'gender',width:60,sortable: true},
    	            	{header:'电话号码',dataIndex:'phoneNo',width:100,sortable: true, hidden:true},
    	            	{header:'移动号码',dataIndex:'mPhoneNo',width:100,sortable: true, hidden:true},
    	            	{header:'邮箱',dataIndex:'email',width:160,sortable: true, hidden:true},
    	            	{header:'出生日期',dataIndex:'birthday',width:100,sortable: true, hidden:true}
    	            	];   
    	//必须调用下面方法。。
        this.callParent();
    }, 
    onQuery: function() {//查询按钮
    	var userName = Ext.getCmp("userName_text_toolbar").getValue();
    	var baseParams = {userName:userName};
    	Ext.apply(AUTH_USER_GRID.store.proxy.extraParams, baseParams);
    	AUTH_USER_GRID.store.loadPage(1);
    }
    
});

/*************************角色绑定资源列表组件AuthResourceGrid***********
 *author        ： zhuzengpeng
 *description   : 角色绑定资源列表组件AuthResourceGrid
 *date          : 2015-02-13
******************************************************************/
Ext.define('AuthResourceGrid', {
	extend: 'UxGridPanel',
	title: '授权资源',
	roleId:'',
	columnLines: true,
	selModel:Ext.create('Ext.selection.CheckboxModel',{
		checkOnly:true,		
		showHeaderCheckbox: false,
		listeners : {
            "select" : {  
                fn : function(e, record, rowIndex) {
        		    var sb = Ext.getCmp('right-statusbar-resgrid');     
        	       	Ext.Ajax.request({
        	       	   url:'/role/bindResource',
      		       	   method : 'POST', 
      		       	   params: {roleId: AUTH_RESOURCE_GRID.roleId, ids: record.data.id},
      	               success: function(resp, opts) { 
      	                	sb.setStatus({
      	                		text: '授权资源【' + record.data.name + '】成功!',
      	                        clear: true 
      	                    });
      	               },
      	               failure: function(resp, opts) {
     	                	sb.setStatus({
      	                		text: '授权资源【' + record.data.name + '】失败!'
      	                    });
      	               }
         	       	});	
                }  
            },			
            "deselect" : {  
                 fn : function(e, record, rowIndex) {  
         		    var sb = Ext.getCmp('right-statusbar-resgrid');  
         	       	Ext.Ajax.request({
         	       	   url:'/role/unBindResource',
       		       	   method : 'POST', 
       		       	   params: {roleId: AUTH_RESOURCE_GRID.roleId, ids: record.data.id},
       	               success: function(resp, opts) { 
       	                	sb.setStatus({
       	                		text: '取消授权资源【' + record.data.name + '】成功!',
       	                        clear: true 
       	                    });
       	               },
       	               failure: function(resp, opts) {
      	                	sb.setStatus({
       	                		text: '取消授权资源【' + record.data.name + '】失败!'
       	                    });
       	               }
          	       	});
                 }  
             } 
		}
	}),
	viewConfig:{  
		   enableTextSelection:true  
	},		
	initComponent:function(){
    	this.store = Ext.create('Ext.data.Store', {
		 pageSize: PAGESIZE,
		 proxy: {
	         type: 'ajax',
	         actionMethods:'post',
	         url: ROLE_RESOURCE_GRID_STORE_URL,
	         reader: {
	             type: 'json',
	             root : 'rows',
	             totalProperty  : 'total'
	         }
	     },
		 fields:['id', 'name', 'type', 'counter', 'action', 'descn']
    	});
        this.tbar = Ext.create('Ext.ux.StatusBar', {
            defaultText: '',
            id: 'right-statusbar-resgrid',
            statusAlign: 'right',
            items:[
                  	{xtype:'textfield', fieldLabel:'资源名称', labelAlign:'right', id:'resname_text_toolbar',labelWidth:65},
                  	'-',{xtype:'button', text:'查询', iconCls:'query', scope:this, handler:this.onQuery}
                  ]
        }),
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: '显示{0}到{1}条,一共{2}条',
            emptyMsg: "没有记录"
        }),
    	this.columns = [{xtype: 'rownumberer', width: 50, align:'center', text:'序号'},
    	                {header:'ID',dataIndex:'id',width:100,sortable: true,hidden:true},
    	                {header:'资源名称',dataIndex:'name',width:150,sortable: true},
    	            	{header:'资源类型',dataIndex:'type',width:100,sortable: true,
    	                	renderer:function(value){
    	                		if(value == "url") {
    	                			return "URL";
    	                		}else if(value == "method") {
    	                			return "方法";                			
    	                		}else if(value == "menu") {
    	                			return "菜单";                			
    	                		}else {
    	                			return value;
    	                		}
    	                	}                    	
    	                },
    	            	{header:'是否授权',dataIndex:'counter',width:80,sortable: true,hidden:true,
    	                	renderer:function(value){
    	                		if(value == 0) {
    	                			return "<span style='color:red;font-weight:bold;'>未授权</span>";
    	                		}else if(value == 1) {
    	                			return "<span style='color:green;font-weight:bold;'>授权</span>";          			
    	                		}else {
    	                			return value;
    	                		}
    	                	}
    	                },
    	                {header:'资源路径',dataIndex:'action',width:150,sortable: true},
    	            	{header:'资源描述',dataIndex:'descn',width:125,sortable: true,  
    	                    renderer: function(value,metaData,record) {  
    	                        metaData.tdAttr = 'data-qtip="' + value + '"';  
    	                        return value;  
    	                    }
    	                }
    	            	];   
        this.listeners = {
            "itemdblclick": { fn: this.onDblclickClick, scope: this} 		//响应双击事件
        };
    	//必须调用下面方法。。
        this.callParent();
    },
    onQuery: function() {//查询按钮
    	var resName = Ext.getCmp("resname_text_toolbar").getValue();
    	var baseParams = {resName:resName};
    	Ext.apply(AUTH_RESOURCE_GRID.store.proxy.extraParams, baseParams);
    	AUTH_RESOURCE_GRID.store.loadPage(1);
    }  
});
/*********************onReady 组件渲染及处理*************************************************/
Ext.onReady(function(){
		Ext.tip.QuickTipManager.init();								//开启快速提示
		Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
		
		ROLEGRID = Ext.create('RoleGrid');
		ROLEGRID.store.loadPage(1);
		//角色绑定用户
		AUTH_USER_GRID =  Ext.create('AuthUserGrid');
		AUTH_USER_GRID.store.on('load', function(store, records, successful) {
			var selMod = AUTH_USER_GRID.getSelectionModel();
			selMod.deselectAll(true);
			for(var i =0; i<records.length; i++) {
				if(records[i].data.counter == "1") {
        			selMod.select(i, true, true);    				
				}
			}
		});
		//角色授信资源
		AUTH_RESOURCE_GRID = Ext.create('AuthResourceGrid');
		AUTH_RESOURCE_GRID.store.on('load', function(store, records, successful) {
			var selMod = AUTH_RESOURCE_GRID.getSelectionModel();
			selMod.deselectAll(true);
			for(var i =0; i<records.length; i++) {
				if(records[i].data.counter == "1") {
        			selMod.select(i, true, true);    				
				}
			}
		});		
		USER_RES_TAB = Ext.create(Ext.tab.Panel, {
			region:'center',
			items:[AUTH_USER_GRID, AUTH_RESOURCE_GRID]
		});
		Ext.create('Ext.container.Viewport', {
		    layout: 'border',
	        defaults: {
	            split: true
	        },
		    items: [ROLEGRID, USER_RES_TAB]
		});	
});