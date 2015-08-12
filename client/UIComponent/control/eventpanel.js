/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.EventPaneManager constructor
 *
 * Instantiate <code>AngoraEditor.EventPaneManager</code> object.
 * @class AngoraEditor.EventPaneManager
 * @classdesc
 * @constructor
 */
AngoraEditor.EventPanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */
	this.Dom=$('#events');

	this.data=[];

	this.setupCallback();
}
AngoraEditor.EventPanel.prototype = {
	/**
	* setup the property grid from DOM
	* @method setup
	* @param
	*/
	setupCallback: function(){
		var editor=this.editor;
		$('#addEvent').click(function(){
			if(editor.node.selected==null)return;
		});
		this.Dom.propertygrid({
			data : this.events,
			showGroup : true,
			scrollbarSize : 0,
			onDblClickRow:function(index, field){
				var name = field['name'];
				var value = field['value'];
				if(value!=''){
					return;
				}else{
					//editor.Manager.node.addEvent(name,value);
					this.add(event,value);
				}
			}
		});
	},
	/**
	* add a event to the event property grid
	* @method add
	* @param {string} event - event name
	* @param {string} callback - callback name
	* @param {string} grp - group name
	*/
	add: function(event,callback,grp){
		var group=grp;
		if(typeof group ==='undefined')
			group='default';
		var type='none';
		switch(event){
		case 'onInputUp':
		case 'onInputDown':
		case 'onInputOver':
		case 'onInputOut':
			group='mouse'
			break;
		case 'onOutOfBounds':
		case 'onEnterBounds':
			group='worldBounds';
			break;
		case 'onAnimationComplete':
		case 'onAnimationLoop':
		case 'onAnimationStart':
			group='animation';
			break;
		default:group=group;break;
		}
		this.data.push({name:event,value:callback,group:group,editor:type});
	},
	/**
	* update the selected row of event property grid
	* @method update
	* @param {number} index - selected row
	* @param {string} value - callback name
	*/
	update: function(index, value){
		this.Dom.propertygrid('updateRow',{
			index: index,
			row: { value : value }
		});
	},
	/**
	* remove the value of selected row from event property grid
	* @method remove
	* @param {number} index - selected row
	*/
	remove: function(index){
		this.Dom.propertygrid('updateRow',{
			index: index,
			row:{ value : '' }
		});
	},
	refresh:function(){
		
	},
	/**
	* empty the event property grid
	* @method reset
	* @param
	*/
	reset: function(){
		this.data=[];
		this.Dom.propertygrid('loadData', []);
	}
}

AngoraEditor.EventPanel.prototype.constructor = AngoraEditor.EventPanel;
