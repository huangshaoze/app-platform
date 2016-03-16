var USERGRID = null;//用户列表组件全局变量
var ORGTREE = null; //组织机构树组件全局变量
var ORG_TREE_URL = '/org/queryOrgs.json'; //机构树
var USER_GRID_STORE_URL = '/org/queryUsers4CascadeOrg.json';//根据组织机构查询用户列表
var PAGESIZE= 20;
var SELECTNODE = null;//组织机构树选中的当前节点
/*********************************添加、修改组织机构FORM组件**************
 *author        ： zhu.zengpeng
 *description   : 添加、修改组织机构FORM组件
 *date          : 2014-06-20
******************************************************************/
Ext.define('OrgInfoForm', {
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
    	this.parentId = this.createHidden('parentId');
    	this.parentName = this.createDisplyField('父机构名称', '100%');
    	this.orgName = this.createTextField('机构名称', 'name', '100%', false, '');
    	this.areaCode   = this.createDictCombo('所属区域:','areaCode', '100%', 'CORE.ORG.AREA', false);
    	this.theSort = this.createNumberField('顺序', 'theSort', '100%', false);
    	this.descn = this.createTextArea('描述', 'descn', 80, '100%', true);
        this.buttons = [
                        {text: '保存', width: 20,iconCls: 'save', hidden: false, handler: this.addFormClick, scope: this},
                        {text: '修改', width: 20,iconCls:'edit', hidden: true, handler: this.updateFormClick, scope: this},
                        {text: '清空', width: 20, iconCls:'redo',  handler: this.resetFormClick, scope: this},
                        {text: '关闭', width: 20,iconCls:'delete', handler: this.onCloseClick, scope: this}
                     ];
    	this.items = [this.parentName, this.orgName, this.areaCode, this.theSort, this.descn, this.idHidden];
    	//必须调用callParent方法
    	this.callParent();
    },
    addFormClick : function() {
    	 var thisForm = this.getForm();
	   	 if(thisForm.isValid()) {
			 thisForm.submit({
	             waitMsg: '正在提交数据...',
	             url: '/org/insertOrg', 
	             method: 'POST',
	             success: function(form, action) { 
	             	Ext.MessageBox.alert("系统提示:", "添加成功!");
	             	ORGTREE.orgInsertWindow.hide();
	             },
	             failure: function(form, action) {
	            	 Ext.MessageBox.alert("系统提示:", "添加失败!【"+action.result.message + "】");
	             }
	     	});
	     }    	
    },
    updateFormClick: function() {
    	
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
Ext.define('OrgInfoInsertWindow', {
	extend: 'Ext.window.Window',
	title:'新增组织机构',
	width:400,
	closeAction:'hide',
	initComponent:function() {
		this.orgInfoForm = Ext.create('OrgInfoForm');
		this.orgInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].show();   //显示添加按钮;
		this.orgInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1].hide();   //隐藏修改按钮;
		this.items = [this.orgInfoForm];
		this.callParent();
	}
});

/*********************************修改组织机构弹窗组件**********************
 *author        ： zhu.zengpeng
 *description   : 修改组织机构弹窗组件
 *date          : 2014-06-20
*********************************************************************/
Ext.define('OrgInfoUpdateWindow', {
	extend: 'Ext.window.Window',
	title:'修改组织机构',
	width:400,
	closeAction:'hide',
	initComponent:function() {
		this.orgInfoForm = Ext.create('OrgInfoForm');
		this.orgInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].hide();   //隐藏添加按钮;
		this.orgInfoForm.getDockedItems('toolbar[dock="bottom"]')[0].items.items[1].show();   //显示修改按钮;
		this.items = [this.orgInfoForm];
		this.callParent();
	}
});

/*********************************组织机构树*************************
 *author        ： zhu.zengpeng
 *description   : 显示组织机构树
 *date          : 2014-06-20
*****************************************************************/
Ext.define('OrgTree', {
	extend: 'Ext.tree.Panel',
	region:'west',
	title: '组织机构树',
	width: 300,
	collapsible: true,
	autoScroll :true,
    rootVisible:false,
    initComponent: function () { 
		this.orgInsertWindow = Ext.create('OrgInfoInsertWindow');
		this.orgUpdateWindow = Ext.create('OrgInfoUpdateWindow');
    	this.store = Ext.create('Ext.data.TreeStore', {  
	        root : {  
	            id:'0',
	            expanded : true,
	            hidden:true
	        },
        	proxy: {
       	         type: 'ajax',
    	         actionMethods:'post',
    	         url: ORG_TREE_URL,
    	         reader: {
    	             type: 'json'
    	         }
            },
            fields:['id', 'text', 'areaCode', 'parentId', 'theSort', 'orgSeq', 'descn']
	    });
    	this.tbar = Ext.create('Ext.toolbar.Toolbar', {
    		items:[
    		        {text:'刷新',iconCls: 'refresh',handler: this.onAddClick, scope:this},
               	'-',{text:'展开',iconCls: 'expand',handler:this.onModifyClick,scope:this},
               	'-',{text:'收起',iconCls: 'collapse',handler:this.onDeleteClick,scope:this}
               ]
    	});
    	this.rightMenu = Ext.create('Ext.menu.Menu', {
    	    items: [{
				text : '添加同级节点',
				iconCls : 'add',
				handler : this.onAddSiblingNode,
				scope : this
			}, '-', {
				text : '添加子节点',
				iconCls : 'add',
				handler : this.onAddChildNode,
				scope : this
			}, '-', {
				text : '修改节点',
				iconCls : 'edit',
				handler : this.onUpdateNode,
				scope : this
			}, '-', {
				text : '删除节点',
				iconCls : 'delete',
				handler : this.onDeleteNode,
				scope : this
			}, '-', {
				text : '保存排序',
				iconCls : 'save',
				handler : this.onSaveOrder,
				scope : this
			}, '-', {
				text : '刷新节点',
				iconCls : 'refresh',
				handler : this.onRefreshNode,
				scope : this
			}, '-', {
				text : '添加用户',
				iconCls : 'user_add',
				handler : this.onAddUser,
				scope : this
			}]
    	});
    	//注册响应事件
        this.listeners = {
            "itemdblclick": { fn: this.onDblclickClick, scope: this}, 		//响应双击事件
            "itemcontextmenu" : {fn: function(view, record, item, index, e, eOpts) {
            	e.preventDefault();
            	SELECTNODE = record;
            	this.rightMenu.showAt(e.getXY());
             },scope : this
            }
        };    	
    	//必须调用callParent方法
    	this.callParent();
    },
    onDblclickClick: function() {
    	alert(11);
    },
    onAddSiblingNode: function() {//添加同级节点
    	var parentNode = SELECTNODE.parentNode;
    	this.orgInsertWindow.orgInfoForm.getForm().reset();
    	this.orgInsertWindow.orgInfoForm.parentId.setValue(parentNode.data.id);
    	this.orgInsertWindow.orgInfoForm.parentName.setValue(parentNode.data.text);
    	this.orgInsertWindow.show();
    },
    onAddChildNode: function() {//添加子节点
    	var parentNode = SELECTNODE;
    	this.orgInsertWindow.orgInfoForm.getForm().reset();
    	this.orgInsertWindow.orgInfoForm.parentId.setValue(parentNode.data.id);
    	this.orgInsertWindow.orgInfoForm.parentName.setValue(parentNode.data.text);
    	this.orgInsertWindow.show();    	
    },
    onUpdateNode: function() {//修改节点
    	var parentNode = SELECTNODE.parentNode;
    	var updateForm = this.orgUpdateWindow.orgInfoForm;
    	updateForm.getForm().reset();
    	updateForm.parentName.setValue(parentNode.data.text);
    	updateForm.orgName.setValue(SELECTNODE.data.text);
    	updateForm.areaCode.setValue(SELECTNODE.data.areaCode);
    	updateForm.theSort.setValue(SELECTNODE.data.theSort);
    	updateForm.descn.setValue(SELECTNODE.data.descn);
    	this.orgUpdateWindow.show();      	
    },
    onSaveOrder: function() {//保存排序
    	
    },
    onRefreshNode: function() {//刷新节点
    	
    }
});


/*********************************用户列表组件*************************
 *author        ： zhu.zengpeng
 *description   : 显示机构下的用户列表
 *date          : 2014-06-20
******************************************************************/
Ext.define('UserInfoGrid', {
	extend: 'UxGridPanel',
	region:'center',
	title: '用户列表',
	collapsible: true,
	columnLines: true,
    constructor:function(){
    	this.store = Ext.create('Ext.data.Store', {
		 pageSize: PAGESIZE,
		 proxy: {
	         type: 'ajax',
	         actionMethods:'post',
	         url: USER_GRID_STORE_URL,
	         reader: {
	             type: 'json'
	         }
	     },
		 fields:['name', 'code', 'checked', 'roleId']
    	});
    	this.columns = [Ext.create('Ext.grid.RowNumberer'),
    	                { header: '角色名称',  dataIndex: 'name', width:120 },
    	                { header: '角色编码',  dataIndex: 'code', width:125}]; 
    	this.tbar = Ext.create('Ext.toolbar.Toolbar', {
    		items:[
    		        {text:'添加',iconCls: 'add',handler: this.onAddClick, scope:this},
               	'-',{text:'修改',iconCls: 'edit',handler:this.onModifyClick,scope:this},
               	'-',{text:'删除',iconCls: 'delete',handler:this.onDeleteClick,scope:this},
               	'-',{text:'重置密码',iconCls: 'setting',handler:this.onResetPwdClick,scope:this}
               ]
    	}),
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: '显示{0}到{1}条,一共{2}条',
            emptyMsg: "没有记录"
        }),
    	//必须调用下面方法。。
        this.callParent(arguments);
    },
    initComponent: function () { 
    	//必须调用callParent方法
    	this.callParent();
    }
});

/*********************onReady 组件渲染及处理*************************************************/
Ext.onReady(function(){
		Ext.QuickTips.init();								//开启快速提示
		Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"

	    ORGTREE = Ext.create('OrgTree');
	    USERGRID = Ext.create('UserInfoGrid');
//
		Ext.create('Ext.container.Viewport', {
		    layout: 'border',
	        defaults: {
	            split: true
	        },
		    items: [ORGTREE, USERGRID]
		});	
});