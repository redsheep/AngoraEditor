/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.NodeAttrManager constructor
 *
 * Instantiate <code>AngoraEditor.NodeAttrManager</code> object.
 * @class AngoraEditor.NodeAttrManager
 * @classdesc
 * @constructor
 */
AngoraEditor.NodeAttrManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	
	this.updatedelay=0;
}
AngoraEditor.NodeAttrManager.prototype = {
	/**
	* get attribute of node
	* @method getAttr
	* @param {Object} node
	* @param {string} attr
	*/
	getAttr : function (node, attr) {
		return node[attr];
	},
	/**
	* set attribute of node to value
	* @method setAttr
	* @param {Object} node
	* @param {string} attr
	* @param {string} value
	*/
	setAttr : function (node, attr, value) {
		var delay=false;
		this.editor.scene.isNodeChanged=true;
		switch(attr){
		case 'id':
			this.editor.node.changeID(node.id,value);
			this.editor.ui.propertyGrid.updateRow(attr,value);
			this.editor.ui.gamePane.update(node,attr,value);
			node.id=value;
			return;
		case 'physics':
			break;
		case 'frame':
			var res=this.editor.res.get(node.image);
			value=Math.max(Math.min(value,res.Xframe*res.Yframe-1),0);
			break;
		case 'nwidth':
			attr='width';
			break;
		case 'nheight':
			attr='height';
			break;
		case 'width':
			node['width']=value;
			var res=this.editor.res.get(node.image);
			var scale=value/res.width;
			if(res.type=='spritesheet'){
				scale=value/(res.width/res.Xframe);
			}
			attr='scaleX';
			value=scale;
			break;
		case 'height':
			node['height']=value;
			var res=this.editor.res.get(node.image);
			var scale=value/res.height;
			if(res.type=='spritesheet'){
				scale=value/(res.height/res.Yframe);
			}
			attr='scaleY';
			value=scale;
			break;
		case 'scaleX':
			var res=this.editor.res.get(node.image);
			var width=res.width*value;
			if(res.type=='spritesheet'){
				width=(res.width/res.Xframe)*value;
			}
			node['width']=width;
			this.editor.ui.propertyGrid.updateRow('width',width);
			break;
		case 'scaleY':
			var res=this.editor.res.get(node.image);
			var height=res.height*value;
			if(res.type=='spritesheet'){
				height=(res.height/res.Yframe)*value;
			}
			node['height']=height;
			this.editor.ui.propertyGrid.updateRow('height',height);
			break;
		case 'tracks':
		case 'animations':
			node[attr]=value;
			return;
		case 'dx':
			if(typeof node.anchorX!='undefined')
			value=parseInt(value)+parseInt(node.width)*parseFloat(node.anchorX);
			if(this.updatedelay++%32!=0)
				delay=true;
			attr='x';
			break;
		case 'dy':
			if(typeof node.anchorY!='undefined')
			value=parseInt(value)+parseInt(node.height)*parseFloat(node.anchorY);
			if(this.updatedelay++%33!=0)
				delay=true;
			attr='y';
			break;
		case 'anchorX':
			var x=parseInt(node.x)-parseInt(node.width)*parseFloat(node.anchorX)+parseInt(node.width)*parseFloat(value);
			node['x']=x;
			this.editor.ui.propertyGrid.updateRow('x',x);
			break;
		case 'anchorY':
			var y=parseInt(node.y)-parseInt(node.height)*parseFloat(node.anchorY)+parseInt(node.height)*parseFloat(value);
			node['y']=y;
			this.editor.ui.propertyGrid.updateRow('y',y);
			break;
		default:
			break;
		}
		if(typeof node[attr]==='undefined')return;
		node[attr]=value;
		this.editor.ui.propertyGrid.updateRow(attr,value,delay);
		this.editor.ui.gamePane.update(node,attr,value);
	},
	/**
	* add attribute to node
	* @method addAttr
	* @param {Object} node
	* @param {string} attr
	* @param {string} value
	*/
	addAttr : function (node, attr, value, addToGrid) {
		//var node=editor.node.get(nodeID);
		if(typeof node.custom==='undefined')node.custom={};
		node['custom'][attr] = value;
		//if (node.id == this.editor.node.selected.id)
		if(addToGrid)this.editor.ui.propertyGrid.add(attr, value, 'custom', true);
		
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* add event attribute to node
	* @method addEvent
	* @param {Object} node
	* @param {string} attr
	* @param {string} value
	*/	
	addEvent : function(node,attr,value){
		if(typeof node.events=='undefined')
			node.events={};
		node.events[attr]=value;
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* remove attribute from node
	* @method removeAttr
	* @param {Object} node
	* @param {string} attr
	*/	
	removeAttr : function (node, attr) {
		//var node = this.node.get(nodeID);
		/*if(typeof node[attr]==='object'){
			if (node.id == this.editor.node.selected.id){
				for(i in node[attr]){
					this.editor.ui.propertyGrid.remove(i);
				}
			}
		}*/
		delete node[attr];
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* get default value of attribute
	* @method getDefault
	* @param {string} attr
	*/
	getDefault : function (attr) {
		switch(attr){
			case 'x':return 0;
			case 'y':return 0;
			case 'height':return 64;
			case 'width': return 64;
			case 'image':return 'default';
			case 'animations':return '';
			case 'frame':return 0;
			case 'scaleX':return 1;
			case 'scaleY':return 1;
			case 'anchorX':return 0;
			case 'anchorY':return 0;
			case 'rotation':return 0;
			case 'physics':return false;
			case 'text':return 'text';
			case 'fontSize':return 12;
			case 'fontFamily':return 'Arial';
			case 'lifespan':return 1000.0;
			case 'atlasWidth':return 64;
			case 'atlasHeight':return 64;
			case 'delay':return 100;
			case 'maxParticles':return 30;
			case 'lifespan':return 100;
			case 'gravity': return 900;
			case 'frequency':return 100;
			case 'alpha':return 1;
			case 'angle':return 0;
			case 'minspeedX':return 0;
			case 'maxspeedX':return 100;
			case 'minspeedY':return 0;
			case 'maxspeedY':return 100;
			case 'dynamic':return true;
			case 'body':return 'default';
			case 'mass':return 10;
			case 'fixedRotation':return true;
			case 'clsname':return '';
			case 'basecls':return '';
			case 'audio':return '';
			case 'tracks':return '';
			case 'follow':return '';
			case 'font':return '';
			case 'fontSize':return 32;
			case 'fontFamily':return 'Arial';
			case 'fontColor':return '#000';
			case 'textAlign':return 'left';
			case 'tileW':return 32;
			case 'tileH':return 32;
			case 'tilesetW':return 32;
			case 'tilesetH':return 32;
			case 'tilemap':return '';
			case 'delay':return 100;
			default:return null;
		}
	}
}
