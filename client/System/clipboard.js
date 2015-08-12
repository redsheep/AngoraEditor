/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * 
 *
 * 
 * @class 
 * @classdesc
 * @constructor
 */
AngoraEditor.ClipBoardManager = function (editor) {
	/**
	 * @property 
	 */
	this.editor = editor;
	
	this.object = null;
	
	this.setup();
}
AngoraEditor.ClipBoardManager.prototype = {
	/**
	* 
	*
	* @method 
	* @param 
	*/	
	setup : function(){
		
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/	
	copy : function(node){
		this.object=node;
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/	
	pasteTo : function(x,y){
		this.editor.ui.nodeTree.unselect();
		this.editor.node.selected=null;
		var newnode=this.editor.node.clone(this.object);
		newnode.x=x;
		newnode.y=y;
		this.editor.node.add(newnode);
		this.editor.gamePane.add(newnode);
		this.editor.ui.nodeTree.addNode(newnode);
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	duplicate : function(node){
		this.copy(node);
		this.pasteTo(node.x,node.y);
	}
	
}