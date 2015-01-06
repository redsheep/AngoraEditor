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
AngoraEditor.CustomNode = function () {}
AngoraEditor.CustomNode.prototype = {}
AngoraEditor.CustomNode.prototype.constructor = AngoraEditor.CustomNode;
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
AngoraEditor.CustomNodeManager = function (editor) {
	/**
	 * @property 
	 */
	this.editor = editor;
}
AngoraEditor.CustomNodeManager.prototype = {
	/**
	* 
	*
	* @method 
	* @param 
	*/
	create : function (nodeID) {
		CustomeNode node = new CustomeNode();
		return node;
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	removeScript : function (nodeID) {
		node = editor.node.get(nodeID);
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	addScript : function (nodeID, scriptPath) {
		node = editor.node.get(nodeID);
	}
}
AngoraEditor.CustomNodeManager.prototype.constructor = AngoraEditor.CustomNodeManager;
