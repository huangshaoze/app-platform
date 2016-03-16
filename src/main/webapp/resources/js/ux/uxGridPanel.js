/*********************************GridPanel扩展类*******************
 *author        ： zhuzengpeng
 *description   : GridPanel扩展类,把经常使用的创建组件抽取成方法,方便调用
 *date          : 2015-02-11
******************************************************************/
Ext.define('UxGridPanel', {
    extend: 'Ext.grid.Panel',
    createTextField: function(fieldLabel, name, anchor, blankText, vtype, maxLength, maxLengthText,inputType, colspan) {    //生成一个通用的TextField
        var tf = Ext.create('Ext.form.field.Text', {
            fieldLabel: fieldLabel,
            name: name,
            xtype: 'textfield',
            readOnly: false,
            allowBlank: false,
            anchor: anchor,
            emptyText: '该选项为必填项,请输入内容...',
            vtype: vtype,
            maxLength: maxLength,
            maxLengthText: maxLengthText,
            inputType:inputType,
            colspan: colspan	        	
        }); 
        return tf;
    }
});