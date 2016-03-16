/*********************onReady 组件渲染及处理*************************************************/
Ext.onReady(function(){
		Ext.QuickTips.init();								//开启快速提示
		Ext.form.Field.prototype.msgTarget = 'side';        //提示方式"side"
		
		var loginPanel = Ext.create('Ext.form.Panel', {
			renderTo:'login',
			items:[{xtype:'textfield', name:'j_username', fieldLabel:'用户名', allowBlank:false},
			       {xtype:'textfield', inputType:'password', name:'j_password', fieldLabel:'密码', allowBlank:false}],
			buttonAlign:'left',
			buttons:[{text:'登陆', scope:this, handler: function() {
				var form = loginPanel.getForm();
				if(form.isValid()) {
					form.submit({
                        waitMsg: '正在提交数据...',
                        url: 'j_spring_security_check', 
                        method: 'POST',
                        success: function(form, action) { 
                        	window.location = "/";
                        },
                        failure: function(form, action) {
                        	Ext.MessageBox.alert("系统提示:", "登陆失败!");
                        }
                	});
                }
			}}]
		});
		

});