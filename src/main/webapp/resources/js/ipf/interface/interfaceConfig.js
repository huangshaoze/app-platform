var PAGESIZE= 20;
var USERGRID;//用户列表组件全局变量
var BINDROLEGRID;//用户绑定的角色列表组件全局变量
var USER_GRID_STORE_URL = '/user/pageQueryUsers.json'; //用户列表
var USER_ROLE_GRID_STORE_URL = '/user/getAllRolesByUserId';//根据用户信息查询该用户所属角色
var USER_ROLE_RELATION_STORE_URL = '/user/pageQueryRoles4User.json';//用户授予角色时显示的角色关系列表

/*********************************添加、修改用户FORM组件*****************
 *author        ： zhu.zengpeng
 *description   : 添加、修改用户FORM组件
 *date          : 2014-06-16
******************************************************************/
Ext.define('UserInfoForm', {
	extend: 'UxFormPanel',
	bodyStyle:"padding: 5 0 0",
    fieldDefaults: {
        autoFitErrors: false
    },
	layout: {
        type: 'form',
        columns: 2
    },
    plugins: {
        ptype: 'datatip'
    },
    buttonAlign :'center',
    initComponent: function () { 
    	this.idHidden = this.createHidden('id');
    	this.userName = this.createTextField('用户名称', 'userName', '100%', false, '');
    	this.userCode = this.createTextField('登陆帐号', 'userCode', '100%', false, '');
    	this.orgName = this.createTreeCombo('所属机构', 'orgName', '/org/queryOrgs.json', '100%', false);
    	this.gender   = this.createDictCombo('性别:','gender', '100%', 'CORE.GENDER', false);
    	this.phoneNo = this.createTextField('电话号码', 'phoneNo', '100%', true, '一般指的是固定电话');
    	this.mPhoneNo = this.createTextField('移动号码', 'mPhoneNo', '100%', true, '');
    	this.email = this.createTextField('邮箱', 'email', '100%', true, '', 'email');
    	this.birthday = this.createDateField('出生日期', 'birthday', 'Y-m-d', '100%', 'false');    	
    	
        this.buttons = [
                        {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},
                        {text: '修改', width: 20,iconCls:'edit', hidden: true, handler: this.updateFormClick, scope: this},
                        {text: '清空', width: 20, iconCls:'redo',  handler: this.resetFormClick, scope: this},
                        {text: '关闭', width: 20,iconCls:'cross', handler: this.onCloseClick, scope: this}
                     ];
    	this.items = [this.userName, this.userCode, this.orgName, this.gender, this.phoneNo, this.mPhoneNo, this.email, this.birthday, this.idHidden];
    	//必须调用callParent方法
    	this.callParent();
    },
    addFormClick : function() {
	   	 var userCode = this.userCode.getValue();
	 	 var orgId = this.orgName.getHiddenValue();
	 	 var thisForm = this.getForm();
		 //校验userCode是否存在
	 	 if(userCode == "") {
	 		Ext.Msg.alert('系统提示','登陆账号不能为空！');
	 		return;
	 	 }
    	 if(thisForm.isValid()) {
    		 thisForm.submit({
                 waitMsg: '正在提交数据...',
                 url: '/user/insertUser.json', 
                 params:{orgId:orgId},
                 method: 'POST',
                 success: function(form, action) { 
                 	Ext.MessageBox.alert("系统提示:", "添加成功!");
                 	USERGRID.userInsertWindow.hide();
                 	USERGRID.store.load();
                 },
                 failure: function(form, action) {
                	 Ext.MessageBox.alert("系统提示:", "添加失败!【"+action.result.message + "】");
                 }
         	});
         }     	
    },
    updateFormClick: function() {
    	var orgId = this.orgName.getHiddenValue();
        if(this.getForm().isValid()) {
        	this.getForm().submit({
                waitMsg: '正在提交数据...',
                url: '/user/updateUser.json', 
                params:{orgId:orgId},
                method: 'POST',
                success: function(form, action) { 
                	Ext.MessageBox.alert("系统提示:",  "修改成功!");
                	USERGRID.userUpdateWindow.hide();
                	USERGRID.store.load();
                	USERGRID.getSelectionModel().deselectAll();
                },
                failure: function(form, action) {
                	Ext.MessageBox.alert("系统提示:",  "修改失败!");
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

/*********************************添加用户弹窗组件**********************
 *author        ： zhu.zengpeng
 *description   : 添加用户弹窗组件
 *date          : 2014-06-16
******************************************************************/
Ext.define('UserInfoInsertWindow', {
	extend: 'Ext.window.Window',
	title:'新增用户',
	width:400,
	closeAction:'hide',
	initComponent:function() {
		this.userInfoForm = Ext.create('UserInfoForm');
		this.userInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].show();   //显示添加按钮;
		this.userInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1].hide();   //隐藏修改按钮;
		this.items = [this.userInfoForm];
		this.callParent();
	}
});

/*********************************修改用户弹窗组件**********************
 *author        ： zhu.zengpeng
 *description   : 修改用户弹窗组件
 *date          : 2014-06-16
******************************************************************/
Ext.define('UserInfoUpdateWindow', {
	extend: 'Ext.window.Window',
	title:'修改用户',
	width:400,
	closeAction:'hide',
	initComponent:function() {
		this.userInfoForm = Ext.create('UserInfoForm');
		this.userInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].hide();   //隐藏添加按钮;
		this.userInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1].show();   //显示修改按钮;
		this.items = [this.userInfoForm];
		this.callParent();
	}
});

/*********************************用户列表组件*************************
 *author        ： zhu.zengpeng
 *description   : 用户列表组件(GRID)
 *date          : 2014-06-16
******************************************************************/
Ext.define('UserInfoGrid', {
	extend: 'UxGridPanel',
	region:'center',
	title: '用户数据',
	columnLines: true,
	selType: 'checkboxmodel',
	viewConfig:{  
		   enableTextSelection:true  
	}  ,		
	initComponent:function(){
		this.userInsertWindow = Ext.create('UserInfoInsertWindow');
		this.userUpdateWindow = Ext.create('UserInfoUpdateWindow');
    	this.store = Ext.create('Ext.data.Store', {
		 pageSize: PAGESIZE,
		 proxy: {
	         type: 'ajax',
	         actionMethods:'post',
	         url: USER_GRID_STORE_URL,
	         reader: {
	             type: 'json',
	             root : 'rows',
	             totalProperty  : 'total'
	         }
	     },
		 fields:['id', 'userName', 'userCode', 'orgId', 'orgName', 'gender', 'gender_Name',
		         'phoneNo', 'mPhoneNo', 'email', 'birthday', 'lastLogin', 'ipAddress']
    	});
    	this.tbar = Ext.create('Ext.toolbar.Toolbar', {
    		items:[
    		        {text:'添加',iconCls: 'add',handler: this.onAddClick, scope:this},
               	'-',{text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},
               	'-',{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this},
               	'-',{text:'重置密码',iconCls: 'setting',handler:this.onResetPwdClick,scope:this},
               	'->',{xtype:'textfield', fieldLabel:'用户名', labelAlign:'right', id:'userName_text_toolbar'},
               	'-',{xtype:'button', text:'查询', iconCls:'query', scope:this, handler:this.onQuery},
               		{xtype:'button', text:'高级查询', iconCls:'query', scope:this, handler:this.onAdvancedQuery}
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
    	                {header:'用户名称',dataIndex:'userName',width:120,sortable: true},
    	            	{header:'登陆帐号',dataIndex:'userCode',width:120,sortable: true},
    	            	{header:'所属机构',dataIndex:'orgName',width:120,sortable: true},
    	            	{header:'性别',dataIndex:'gender_Name',width:60,sortable: true},
    	            	{header:'电话号码',dataIndex:'phoneNo',width:100,sortable: true},
    	            	{header:'移动号码',dataIndex:'mPhoneNo',width:100,sortable: true},
    	            	{header:'邮箱',dataIndex:'email',width:160,sortable: true},
    	            	{header:'出生日期',dataIndex:'birthday',width:100,sortable: true},
    	            	{header:'上次登陆时间',dataIndex:'lastLoginTime',width:100,sortable: true},
    	            	{header:'上次登陆IP',dataIndex:'ipAddress',width:100,sortable: true}
    	            	];   
        this.listeners = {
            "itemdblclick": { fn: this.onDblclickClick, scope: this} 		//响应双击事件
        };
    	//必须调用下面方法。。
        this.callParent();
    },
    onAddClick : function() {
    	var win = this.userInsertWindow;
    	win.userInfoForm.getForm().reset();
    	win.userInfoForm.userCode.readOnly = false;
    	win.show();
    },
    onModifyClick: function() {
    	var selModel = USERGRID.getSelectionModel();
	    if (selModel.hasSelection()) {
	       var selected = selModel.getSelection();
	       if(selected.length > 1) {
	    	   Ext.Msg.alert('系统提示', '不能修改多条记录..');
	    	   return;
	       }
	       var win = this.userUpdateWindow;
	       win.userInfoForm.getForm().reset();
		   win.userInfoForm.userCode.readOnly = true;
		   win.show();
		   win.userInfoForm.getForm().loadRecord(selected[0]);
		   win.userInfoForm.orgName.setValue(selected[0].data.orgName);
		   win.userInfoForm.orgName.setHiddenValue(selected[0].data.orgId);
       }
       else {
           Ext.Msg.alert("系统提示", "请选择一条记录!");
       }
    },
    onDeleteClick: function() {
    	var selModel = USERGRID.getSelectionModel();
        if (selModel.hasSelection()) {
        	var selected = selModel.getSelection();
            Ext.Msg.confirm("提醒信息", "确定要删除这" + selected.length + "条信息吗？", function (button) {
                if (button == "yes") {                   
                    var Ids = []; //要删除的id
                    Ext.each(selected, function (item) {
                        Ids.push(item.data.id);
                    });
			       	Ext.Ajax.request({
				       	   url:'/user/deleteUsers.json',
				       	   method : 'POST', 
				       	   params: { ids: Ids},
			               success: function(resp, opts) { 
				               	Ext.MessageBox.alert("系统提示:", "删除成功!");
				               	USERGRID.store.load();
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
			               success: function(resp, opts) { 
			               		Ext.MessageBox.alert("系统提示:", "重置成功!");
			               },
			               failure: function(resp, opts) {
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
    	BINDROLEGRID.setTitle("用户绑定的角色---" + record.data.userName);
    	BINDROLEGRID.userId = record.data.id;
    	BINDROLEGRID.store.load({
    		params:{userId : record.data.id},
    		//加载成功后,根据用户拥有的角色自动选中绑定角色中的数据
    		callback:function(records, operation) {
    			var selMod = BINDROLEGRID.getSelectionModel();
    			selMod.deselectAll(true);
    			for(var i =0; i<records.length; i++) {
    				if(records[i].data.checked == 'true') {
            			selMod.select(i, true, true);    				
    				}
    			}
    		}
    	});
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

/*********************************用户绑定的角色列表组件******************
 *author        ： zhu.zengpeng
 *description   : 用户绑定的角色列表组件,此列表不分页
 *date          : 2014-06-16
******************************************************************/
Ext.define('BindRoleGrid', {
	extend: 'UxGridPanel',
	userId:'',
	region:'east',
	title: '用户绑定的角色',
	collapsible: true,
	width: 300,
	columnLines: true,
	selModel:Ext.create('Ext.selection.CheckboxModel',{
		checkOnly:true,
		showHeaderCheckbox: false,
		listeners : {
            "select" : {  
                fn : function(e, record, rowIndex) { 
        		    var sb = Ext.getCmp('right-statusbar');
        	       	Ext.Ajax.request({
     		       	   url:'/user/bindRole.json',
     		       	   method : 'POST', 
     		       	   params: {operatorId: BINDROLEGRID.userId, ids: record.data.roleId},
     	               success: function(resp, opts) { 
     	                	sb.setStatus({
     	                		text: '绑定角色【' + record.data.name + '】成功!',
     	                        clear: true
     	                    });
     	               },
     	               failure: function(resp, opts) {
    	                	sb.setStatus({
     	                		text: '绑定角色【' + record.data.name + '】失败!',
     	                        clear: true 
     	                    });     	               
	                	}
        	       	});	        		    
                }  
            },			
            "deselect" : {  
                 fn : function(e, record, rowIndex) {  
         		     var sb = Ext.getCmp('right-statusbar');
         		     Ext.Ajax.request({
     		       	   url:'/user/unBindRole.json',
     		       	   method : 'POST', 
     		       	   params: {operatorId: BINDROLEGRID.userId, ids: record.data.roleId},
     	               success: function(resp, opts) { 
     	                     sb.setStatus({
     	                         text: '取消角色【' + record.data.name + '】成功!',
     	                         clear: true 
     	                     });
     	               },
     	               failure: function(resp, opts) {
   	                     sb.setStatus({
 	                         text: '取消角色【' + record.data.name + '】失败!',
 	                         clear: true 
 	                     });     	               
     	               }
         	       	 });         		     

                 }  
             } 
		}
	}),
    bbar: Ext.create('Ext.ux.StatusBar', {
        defaultText: '',
        id: 'right-statusbar',
        statusAlign: 'right'
    }),
    initComponent:function(){
    	this.store = Ext.create('Ext.data.Store', {
		 pageSize: PAGESIZE,
		 proxy: {
	         type: 'ajax',
	         actionMethods:'post',
	         url: USER_ROLE_GRID_STORE_URL,
	         reader: {
	             type: 'json'
	         }
	     },
		 fields:['name', 'code', 'checked', 'roleId']
    	});
    	this.columns = [Ext.create('Ext.grid.RowNumberer'),
    	                { header: '角色名称',  dataIndex: 'name', width:120 },
    	                { header: '角色编码',  dataIndex: 'code', width:125}];    	
    	//必须调用下面方法。。
        this.callParent();
    }
});

/*********************onReady 组件渲染及处理*************************************************/
Ext.onReady(function(){
		Ext.tip.QuickTipManager.init();						//开启快速提示
		Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
		
	    USERGRID = Ext.create('UserInfoGrid');
	    BINDROLEGRID = Ext.create('BindRoleGrid');
		USERGRID.store.loadPage(1);
		Ext.create('Ext.container.Viewport', {
		    layout: 'border',
	        defaults: {
	            split: true
	        },
		    items: [USERGRID, BINDROLEGRID]
		});	
});