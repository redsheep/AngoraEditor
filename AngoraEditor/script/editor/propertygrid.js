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
AngoraEditor.PropertyGridManager = function (editor) {
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
	/**
	 * @property {jquery object}
	 */
	this.grid = null;
	/**
	 * @property {Object} - attribute row index
	 */
	this.propertyIndex = {};

	this.setup();
	
	this.editingObject=null;
}
AngoraEditor.PropertyGridManager.prototype = {
	/**
	 * setup
	 * @method setup
	 * @param
	 */
	setup : function () {
		var editor=this.editor;
		this.grid = $('#attributes').propertygrid({
		data : '',
		showGroup : true,
		onBeginEdit: function(index,row){
			editor.ui.propertyGrid.editingObject=editor.node.selected.id;
		},
		onEndEdit : function (index, field, changes) {
			var editingObject=editor.node.get(editor.ui.propertyGrid.editingObject);
			var name = field['name'];
			var value = field['value'];
			if(editingObject==null){
				editor.scene.setConfig(name,field['group'],value);
			}else{
				switch (name) {
				case 'id':
					editor.ui.nodeTree.updateNode(editingObject.id, value);
					editor.attr.setAttr(editingObject, 'id', value);
					break;
				default:
					editor.attr.setAttr(editingObject,name,value);
					break;
				}
			}
			editingObject=null;
		},
		onDblClickRow:function(index, field){
			var name = field['name'];
			var value = field['value'];
			switch (name) {
			case 'image':
			case 'assetatlas':
				editor.ui.showResourceEditor(function () {
					var id = editingObject['id'];
					editor.attr.setAttr(editingObject, name, id);
				});
				break;
			case 'animations':
				editor.ui.showAnimationEditor(function(){
					//alert(JSON.stringify(editor.res.anim));
					//editor.node.selected['animations']=editor.res.anim;
					//editor.attr.setAttr(editor.node.selected, 'animations', editor.res.anim);
				});
				break;
			case 'font':
				editor.ui.showResourceEditor(function(){
					var id = editingObject['id'];
					editor.attr.setAttr(editingObject, name, id);
				});
				break;
			case 'audio':
				editor.ui.showResourceEditor(function () {
					var id = editingObject['id'];
					editor.attr.setAttr(editingObject, 'audio', id);
				});
				break;
			case 'tracks':
				editor.ui.showAudioEditor(function () {
					console.log('audio modify complete!');
				});
				break;
			default:
				break;
			}				
		}
	});
	},
	/**
	 * setup property grid from json data
	 * @method
	 * @param
	 */
	loadData : function (data) {
		this.reset();
		var count=0;
		this.propertyIndex={};
		for( i in data){
			if(i=='events'||i=='input'){
				continue;
			}else if(typeof data[i]==='object'){
				for(j in data[i]){
					this.add(j, data[i][j], i);
					this.propertyIndex[j]=count;
					count++;
				}
			}else{
				this.add(i, data[i]);
				this.propertyIndex[i]=count;
				count++;
			}
		}
		this.refresh();
	},
	/**
	 * refresh the property grid
	 * @method refresh
	 * @param 
	 */
	refresh : function () {
		this.grid.propertygrid('loadData', this.data);
	},
	/**
	 * add a new property into the property grid
	 * @method add
	 * @param {string} key
	 * @param {string} value
	 * @param {string} grp	 
	 */
	add : function (key, value, grp) {
		switch(key){
			case 'id'	:	group='general';type='text';break;
			case 'type'	:	group='general';type='none';break;
			case 'visible':	group='general';type={"type":"checkbox","options":{"on":true,"off":false}};break;
			case 'image':	group='general';type='none';break;
			case 'frame':	group='general';type='numberbox';break;
			case 'assetatlas':group='general';type='none';break;
			case 'animations':group='general';type='none';break;
			case 'atlasWidth':group='general';type='numberbox';break;
			case 'atlasHeight':group='general';type='numberbox';break;
			case 'ref'	:	group='general';type='none';break;
			case 'x'	:	group='general';type='numberbox';break;
			case 'y'	:	group='general';type='numberbox';break;
			case 'width':	group='general';type='numberbox';break;
			case 'height':	group='general';type='numberbox';break;
			case 'scaleX':	group='general';type={"type":"numberbox","options":{"precision":1}};break;
			case 'scaleY':	group='general';type={"type":"numberbox","options":{"precision":1}};break;
			case 'physics':	group='physics';type={"type":"checkbox","options":{"on":true,"off":false}};break;
			case 'dynamic':	group='physics';type={"type":"checkbox","options":{"on":true,"off":false}};break;
			case 'enable':	group='physics';type={"type":"checkbox","options":{"on":true,"off":false}};break;
			case 'collideWorldBounds':	group='world';type={"type":"checkbox","options":{"on":true,"off":false}};break;
			case 'mass'	:	group='physics';type='numberbox';break;
			case 'text'	:	group='general';type='text';break;
			case 'font' :	group='general';type='none';break;
			case 'fontSize':group='font';type='numberbox';break;
			case 'fontFamily':group='font';type='none';break;
			case 'audio':	group='audio';type='none';break;
			case 'tracks':	group='audio';type='none';break;
			case 'delay':	group='general';type='numberbox';break;
			case 'maxParicles':	group='emitter';type='numberbox';break;
			case 'frequency':	group='emitter';type='none';break;
			case 'angle':	group='emitter';type='none';break;
			case 'lifespan':	group='particle';type='none';break;
			case 'gravity':	group='particle';type='none';break;
			case 'minspeedX':	group='particle';type='none';break;
			case 'maxspeedX':	group='particle';type='none';break;
			case 'minspeedY':	group='particle';type='none';break;
			case 'maxspeedY':	group='particle';type='none';break;
			default		:	group='custom';type='text';break;
		}
		if(typeof grp!='undefined')
			group=grp;
		if(grp=='tracks' || grp=='animations')
			type='none';
		this.data.push({name:key,value:value,group:group,editor:type});
	},
	/**
	 * update attribute property row
	 * @method updateRow
	 * @param {string} attr
	 * @param {string} value
	 */
	updateRow : function (attr, value) {
		var index = this.propertyIndex[attr];
		var rows = $('#attributes').datagrid('getRows');
		rows[index]['value'] = value;
		this.grid.propertygrid('updateRow', {
			index : index,
			row : rows[index]
		});
	},
	/**
	 * reset property row
	 * @method remove
	 * @param {string} id
	 */
	remove : function (id) {
		//var row = this.grid.propertygrid('getSelected');
		//var index = this.grid.propertygrid('getRowIndex', row);
		var index = this.propertyIndex[id];
		this.grid.propertygrid('deleteRow', index);
	},
	/**
	 * set property value
	 * @method set
	 * @param {string} attr
	 * @param {string} value
	 */
	set : function (attr,value) {
		this.data[attr] = value;
		editor.scene.curSceneNodes.nodes[nodeID][attr] = value;
	},
	/**
	 * reset the property grid
	 * @method reset
	 * @param
	 */
	reset : function () {
		this.data=[];
		this.grid.propertygrid('loadData', []);
	}
}

AngoraEditor.PropertyGridManager.prototype.constructor = AngoraEditor.PropertyGridManager;
