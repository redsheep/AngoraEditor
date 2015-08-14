/**
* @author RedSheep <redsheep@foxmail.com>
* @copyright
* @license
*/
/**
* AngoraEditor.PropertyGridManager constructor
*
* Instantiate <code>AngoraEditor.PropertyGridManager</code> object.
* @class AngoraEditor.PropertyGridManager
* @classdesc
* @constructor
*/
AngoraEditor.PropertyGrid = function (editor) {
	/**
	* @property {AngoraEditor} - reference of editor
	*/
	this.editor = editor;
	/**
	* @property {Array} - property of node
	*/
	this.data = [];
	/**
	* @property {number} - selected row of property grid
	*/
	this.selectedrow = null;

	this.delay=0;
	this.dbclick=false;
	/**
	* @property {jquery object}
	*/
	this.Dom = $('#attributes');

	this.category={
		textProperty:['text','fontFamily','fontColor'],
		numberProperty:['x','y','width','height','rotation','alpha',
		'mass','fontSize','gravityX','gravityY','maxParticles',
		'lifespan','frequency'],
		floatProperty:['scaleX','scaleY','anchorX','anchorY'],
		boolProperty:['physics','dynamics','collideWorldBounds',
		'fixedRotation','visible'],
		editorProperty:['animations','tilemap','audio','tracks','font',
		'image','bodyShape']
	};
	this.groups={
		general:['id','x','y','width','height','rotation','alpha',
		'visible','image','scaleX','scaleY','anchorX','anchorY'],
		font:['text','font','fontFamily','fontColor','fontSize'],
		physics:['physics','dynamics','collideWorldBounds',
		'fixedRotation','bodyShape'],
		particle:['gravityX','gravityY','maxParticles',
		'lifespan','frequency']
	};

	this.setupCallback();

}
AngoraEditor.PropertyGrid.prototype = {
	setupCallback:function(){
		var editor=this.editor;
		var self=this;
		$('#addProperty').click(function(){
			editor.Manager.node.addProperty();
		});
		setInterval(function(){
			self.delay++;
		}, 100);
		this.Dom.propertygrid({
			data : this.data,
			showGroup : true,
			onBeginEdit: function(index,row){
				self.selectedrow=index;
			},
			onEndEdit : function (index, field, changes) {
				self.selectedrow=null;
				var name = field['name'];
				var value = field['value'];
				switch (name) {
					case 'image':
					case 'assetatlas':
					case 'font':
					case 'audio':
					var dlg = editor.Manager.view.showResourceEditor();
					dlg.onConfirm = function(resID){
						editor.Manager.gameNode.updateProperty(name,resID);
						var res = editor.Manager.resource.get(resID);
						editor.Manager.gameNode.updateProperty('width',res.width);
						editor.Manager.gameNode.updateProperty('height',res.height);
					}
					break;
					case 'tilemap':
					editor.Manager.view.showTilemapEditor();
					break;
					case 'animations':
					editor.Manager.view.showAnimationEditor();
					break;
					case 'tracks':
					editor.Manager.view.showAudioEditor();
					break;
					default:
					if(!isNaN(value)) value=parseFloat(value);
					editor.Manager.gameNode.updateProperty(name,value);
					break;
				}
			}/*,
			onClickRow:function(index, field){
				if(!self.dbclick){
					self.dbclick=true;
					setTimeout(function(){
						self.dbclick=false;
					},500);
					return;
				}
				var name = field['name'];
				var value = field['value'];
				switch (name) {
					case 'image':
					case 'assetatlas':
					case 'font':
					case 'audio':
					var dlg = editor.Manager.view.showResourceEditor();
					dlg.onConfirm = function(resID){
						editor.Manager.gameNode.updateProperty(name,resID);
						var res = editor.Manager.resource.get(resID);
						editor.Manager.gameNode.updateProperty('width',res.width);
						editor.Manager.gameNode.updateProperty('height',res.height);
					}
					break;
					case 'tilemap':
					editor.Manager.view.showTilemapEditor();
					break;
					case 'animations':
					editor.Manager.view.showAnimationEditor();
					break;
					case 'tracks':
					editor.Manager.view.showAudioEditor();
					break;
					default:
					break;
				}
			}*/
		});
	},
	/**
	* add a new property into the property grid
	* @method add
	* @param {string} key
	* @param {string} value
	* @param {string} grp
	*/
	add : function (key, value, grp, append) {
		var type = 'none';
		if(this.category.textProperty.contains(key)){
			type='text';
		}else if(this.category.numberProperty.contains(key)){
			type='numberbox';
		}else if(this.category.floatProperty.contains(key)){
			type={"type":"numberbox","options":{"precision":1}};
		}else if(this.category.boolProperty.contains(key)){
			type={"type":"checkbox","options":{"on":true,"off":false}};
		}else if(this.category.editorProperty.contains(key)){
			type='none';
		}
		for(var g in this.groups){
			if(this.groups[g].contains(key)){
				grp=g;
			}
		}
		if(append)
		this.Dom.propertygrid('appendRow',{name:key,value:value,group:grp,editor:type});
		else
		this.data.push({name:key,value:value,group:grp,editor:type});
	},
	/**
	* update attribute property row
	* @method updateRow
	* @param {string} attr
	* @param {string} value
	*/
	findRow : function(attr){
		var index=-1;//this.grid.propertygrid('getRowIndex',attr);//this.propertyIndex[attr];
		var rows = this.Dom.propertygrid('getRows');
		for( i in rows){
			if(rows[i].name==attr){
				return i;
			}
		}
	},
	updateRow : function (attr, value, delay) {
		if(delay==true && this.delay%7!=0) return;
		var index=this.findRow(attr);
		//rows[index]['value'] = value;
		this.Dom.propertygrid('updateRow', {
			index : index,
			row : {value:value}
		});
	},
	/**
	* reset property row
	* @method remove
	* @param {string} id
	*/
	remove : function (attr) {
		//var row = this.grid.propertygrid('getSelected');
		//var index = this.grid.propertygrid('getRowIndex', row);
		//var index = this.propertyIndex[id];
		var index=this.findRow(attr);
		this.Dom.propertygrid('deleteRow', index);
	},
	/**
	* refresh the property grid
	* @method refresh
	* @param
	*/
	refresh : function () {
		this.Dom.propertygrid('loadData', this.data);
	},
	/**
	* reset the property grid
	* @method reset
	* @param
	*/
	reset : function () {
		this.data=[];
		this.Dom.propertygrid('loadData', this.data);
	}
}

AngoraEditor.PropertyGrid.prototype.constructor = AngoraEditor.PropertyGrid;
