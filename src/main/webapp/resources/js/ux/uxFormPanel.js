/*********************************FormPanel扩展类*******************
 *author        ： zhuzengpeng
 *description   : FormPanel扩展类,把经常使用的创建组件抽取成方法,方便调用
 *date          : 2015-02-11
******************************************************************/
var TEXTTPL_REQUIRED = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

/**
 * FORMPANEL公共父类,把一些常用的属性设定好,并提供一些常用的组件创建方法
 */
Ext.define('UxFormPanel', {
    extend: 'Ext.form.Panel',
    /**
     * 一个基本文本框表单项组件
     * @param fieldLabel  域标签。它被附加了labelSeparator， 其位置和大小被labelAlign、 labelWidth和labelPad配置确认。
     * @param name 表单项名称
     * @param anchor 
     * @param allowBlank  指定为false将会只允许值的长度>0(默认为true)
     * @param tooltip 鼠标指向输入框时显示的内容
     * @param vtype 一个校验类型名，在Ext.form.field.VTypes中定义(默认为null)
     * @param maxLength 校验时表单项允许输入的最大长度。
     * @param maxLengthText 如果 *maximum length** 校验失败时显示的出错文本
     * @param inputType 输入类型 输入栏的类型属性---例如radio,text,password,file。Defaults to: "text"
     * @param colspan 
     * @returns
     */
    createTextField: function(fieldLabel, name, anchor, allowBlank, tooltip, vtype, colspan) {    //生成一个通用的TextField
        var tf = Ext.create('Ext.form.field.Text', {
            fieldLabel: fieldLabel,
            labelAlign:'right',
            name: name,
            xtype: 'textfield',
            allowBlank: allowBlank,
            anchor: anchor,
            vtype: vtype,
            colspan: colspan,
            beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED,
            tooltip: tooltip
        }); 
        return tf;
    },
    /**
     * 数值型的文本表单项
     * @param fieldLabel 域标签。它被附加了labelSeparator， 其位置和大小被labelAlign、 labelWidth和labelPad配置确认。
     * @param name 表单项名称
     * @param anchor
     * @param allowBlank 指定为false将会只允许值的长度>0(默认为true)
     * @param tooltip 鼠标指向输入框时显示的内容
     * @param decimalPrecision 小数点后允许的最大精度。Defaults to: 2
     * @param colspan
     * @returns
     */
    createNumberField: function(fieldLabel, name, anchor, allowBlank, tooltip, decimalPrecision, colspan) {    //生成一个通用的TextField
        var nf = Ext.create('Ext.form.field.Number', {
            fieldLabel: fieldLabel,
            labelAlign:'right',
            name: name,
            anchor: anchor,
            allowBlank: allowBlank,
            tooltip:tooltip,
            decimalPrecision :decimalPrecision ,//设置小数点后最大精确位数(默认为 2)。
            cls:'forbiddenZH',//禁用中文输入法
            colspan: colspan,
            beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED
        });
        return nf;
    },
    /**
     * 创建密码输入框
     * @param fieldLabel
     * @param name
     * @param anchor
     * @param allowBlank
     * @param tooltip
     * @param maxLength
     * @param maxLengthText
     * @returns
     */
    createPassWordField: function(fieldLabel, name, anchor, allowBlank, tooltip, maxLength, maxLengthText) {  //生成一个通用的密码输入框  
        var tf = Ext.create('Ext.form.field.Text', {
            fieldLabel: fieldLabel,
            labelAlign:'right',
            name: name,
            xtype: 'textfield',
            inputType :'password',
            anchor: anchor,
            allowBlank: allowBlank,
            tooltip:tooltip,
            maxLength: maxLength,
            maxLengthText: maxLengthText,
            beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED
        });
        return tf;
    },
    /**
     * 下拉选择框(通过AJAX请求从服务器端请求数据)
     * @param fieldLabel
     * @param valueField
     * @param displayField
     * @param url
     * @param formName
     * @param anchor
     * @param allowBlank
     * @param extra1
     * @param extra2
     * @param colspan
     * @returns
     */
    createCombo: function(fieldLabel, valueField, displayField, url, formName, anchor, allowBlank, extra1, extra2, colspan) {    //生成一个通用的ComboBox
    	var combo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: fieldLabel,
            emptyText: '请选择...',
            queryMode: 'remote',
            hiddenName :formName,
            name:formName,
            anchor: anchor,
            allowBlank: allowBlank,
            blankText:'请选择...',
            forceSelection: true,
            lastQuery: '',
            displayField: displayField,
            valueField: valueField,
            store: Ext.create('Ext.data.Store', {
            	proxy: {
	       	         type: 'ajax',
	    	         actionMethods:'post',
	    	         url: url,
	    	         reader: {
	    	             type: 'json'
	    	         }
                },
                fields:[valueField, displayField]
            }),
            editable : false,
            beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED,
            listConfig: {
                getInnerTpl: function() {
                    return '<div data-qtip="{displayField}">{displayField}</div>';
                }
            }
        });
        return combo;
    }, 
    /**
     * 下拉选择框(从本地读取数据)
     * @param fieldLabel
     * @param valueField
     * @param displayField
     * @param anchor
     * @param jsonData 本地JSON数组,格式：[{'valueField':'1','displayField':'男'},{'valueField':'2','displayField':'女'}];
     * @param formName
     * @returns
     */
    createMemoryCombo: function(fieldLabel,valueField, displayField, anchor, jsonData, formName) {
	   	 var combo = Ext.create('Ext.form.field.ComboBox', {
	           fieldLabel: fieldLabel,
	           labelAlign:'right',
	           emptyText: '请选择...',
	           isFormField: true,
	           anchor: anchor,
	           queryMode: 'local',
	           name: formName,
	           hiddenName :formName,
	           allowBlank: false,
	           blankText:'请选择...',
	           forceSelection: true,
	           displayField: displayField,
	           valueField: valueField,
	           store: Ext.create('Ext.data.Store', {
	        	   fields: [
					        {name: valueField},
					        {name: displayField}
					    ],
				   data: jsonData
	           }),
	           editable : false,
	           beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED,
	           listConfig: {
	               getInnerTpl: function() {
	                   return '<div data-qtip="{displayField}">{displayField}</div>';
	               }
	           }
	       });
	       return combo;
   },
   createDateField: function(fieldLabel, name, format, anchor, allowBlank) {
	   	var df =  Ext.create('Ext.form.field.Date', {
				fieldLabel: fieldLabel,
				labelAlign:'right',
				name: name,
				format: format,
				anchor: anchor,
				allowBlank: true,
				editable:false,//不能手动输入
				blankText: '请选择时间',
				beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED
			});
			return df;
   },
   /**
    * 生成一个通用的查询数据字典combo,此函数依赖于ST.ux.ExtField.js文件
    * @param fieldLabel
    * @param formName
    * @param anchor
    * @param dictTypeCode
    * @param showAll 是否显示全部 true/false
    * @returns {ST.ux.ExtField.ComboBox}
    */
   createDictCombo: function(fieldLabel, formName, anchor, dictTypeCode, allowBlank, colspan) {    //生成一个通用的ComboBox
	   	var combo = Ext.create('Ext.form.field.ComboBox', {
	        fieldLabel: fieldLabel,
	        labelAlign:'right',
	        emptyText: '请选择...',
	        queryMode: 'remote',
	        hiddenName :formName,
	        name:formName,
	        anchor: anchor,
	        allowBlank: allowBlank,
	        blankText:'请选择...',
	        forceSelection: true,
	        lastQuery: '',
	        displayField: 'name',
	        valueField: 'code',
	        store: Ext.create('Ext.data.Store', {
	        	proxy: {
	       	         type: 'ajax',
	    	         actionMethods:'post',
	    	         url: '/dict/queryDictEntries',
	    	         reader: {
	    	             type: 'json'
	    	         }
	            },
	            fields:['code', 'name']
	        }),
	        editable : false,
	        beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED,
            listConfig: {
                getInnerTpl: function() {
                    return '<div data-qtip="{name}">{name}</div>';
                }
            }	        		
	    });
	   	combo.store.load({params: {dictTypeCode: dictTypeCode}});
	    return combo;
   },
   /**
    * 创建下拉树
    * @param fieldLabel 标签
    * @param name 
    * @param url 请求URL
    * @param anchor 
    * @returns
    */
   createTreeCombo: function(fieldLabel, name, url, anchor, allowBlank) {
	   	var df = Ext.create('Ext.form.field.Picker', {
			fieldLabel:fieldLabel,
			hiddenValue:'',
			labelAlign:'right',
			anchor:anchor,
			allowBlank:allowBlank,
			beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED,
		    createPicker: function() {
		        return Ext.create('Ext.tree.Panel', {
		        	pickerField: this,
		            hidden: true,
		            height : self.treeHeight||300,  
		            rootVisible : false,//是否显示根节点
					autoScroll :true,
		            floating: true,
		            minHeight: 300,
				    store : Ext.create('Ext.data.TreeStore', {  
				        root : {  
				            id:'0',
				            expanded : true,
				            hidden:true
				        },
			        	proxy: {
			       	         type: 'ajax',
			    	         actionMethods:'post',
			    	         url: url,
			    	         reader: {
			    	             type: 'json'
			    	         }
			            },
			            fields:['id', 'text']
				    }),
				    listeners:{
		                select: function(thisTree, record, index, obj ){
		                	this.pickerField.setHiddenValue(record.data.id);
		                    this.pickerField.setValue(record.data.text);
		                    this.pickerField.collapse();
		                }
		            }
		        });
		    },
		    setHiddenValue: function(value) {
		    	this.hiddenValue = value;
		    },
		    getHiddenValue: function() {
		    	return this.hiddenValue;
		    }
		});
		return df;
   },
   /**
    * 创建数值输入框
    * @param decimalPrecision 小数点后允许的最大精度。
    */
   createNumberField: function(fieldLabel, name, anchor, allowBlank, tooltip, decimalPrecision, colspan) {    //生成一个通用的TextField
       var nf = Ext.create('Ext.form.field.Number', {
           fieldLabel: fieldLabel,
           labelAlign:'right',
           name: name,
           readOnly: false,
           allowBlank: allowBlank,
           decimalPrecision :decimalPrecision ,//设置小数点后最大精确位数(默认为 2)。
           anchor: anchor,
           blankText: '该选项为必填项,请输入内容...',
           colspan: colspan,
           beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED
       });
       return nf;
   },
   createTextArea: function(fieldLabel,name,height,anchor, allowBlank, tooltip, colspan) {
	   	var ta = Ext.create('Ext.form.field.TextArea', {
		   	    fieldLabel:fieldLabel,
		   	    labelAlign:'right',
		        name:name,
		        height:height,
		        anchor:anchor,
		        colspan:colspan,
		        beforeLabelTextTpl: allowBlank ? '':TEXTTPL_REQUIRED,
		        tooltip:tooltip
	   	});
	   	return ta;
   },  
   /**
    * 创建一个仅仅用来显示(display-only)的文本表单项
    * @param fieldLabel
    * @param anchor
    * @param colspan
    * @returns
    */
   createDisplyField: function(fieldLabel, anchor, colspan) {
	   	var ta = Ext.create('Ext.form.field.Display', {
	   	    fieldLabel:fieldLabel,
	   	    labelAlign:'right',
	        anchor:anchor,
	        colspan:colspan
	   	});
	   	return ta;	   
   },
   /**
    * 创建一个隐含域对象
    * @param fieldLabel
    * @param name
    * @returns {Ext.form.Hidden}
    */
   createHidden: function(name) {
	   	var hidden = Ext.create('Ext.form.field.Hidden', {
	   	    name:name
	   	});
	   	return hidden;
   }
});