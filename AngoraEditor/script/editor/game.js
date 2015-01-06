/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.GameManager constructor
 *
 * Instantiate <code>AngoraEditor.GameManager</code> object.
 * @class AngoraEditor.GameManager
 * @classdesc
 * @constructor
 */
AngoraEditor.GameManager=function(editor){
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor		=editor; 
	/**
	 * @property {Object} - width and height of game display
	 */
	this.display	=null;//default:800*600
	/**
	 * @property {Object} - configuration of game sound
	 */	
	this.sound		=null;//default:disable
	/**
	 * @property {Object} - configuration of game physics
	 */	
	this.physics	=null;//default:'p2'
	/**
	 * @property {Object} - configuration of game script
	 */	
	this.script		=null;//default:'javascript';
	/**
	 * @property {Object} - configuration of game gui
	 */	
	this.GUI		=null;//default:'jqueryUI';
	/**
	 * @property {Object} - configuration of game plugin
	 */		
	this.plugins	=null;
	
}
AngoraEditor.GameManager.prototype={
	/**
	* Description setup game configuration
	*
	* @method setup
	* @param {Object} config - game configuration
	*/
	setup: function(config){
		var editor=this.editor;
		var configfile=editor.project.currentProject.configFile;
		if(typeof config==='undefined'){
			if(editor.file.existFile(configfile)){
				config=JSON.parse(editor.file.readFile(configfile));
			}else{
				editor.file.createFile(configfile);
				config={};			
			}
		}
		this.set('display',config.display);
		this.set('sound',config.sound);
		this.set('physics',config.physics);
		this.set('script',config.script);
		this.set('GUI',config.GUI);
		this.set('plugins',config.plugins);
		this.set('startScene', config.startScene);
		this.editor.file.writeFile(configfile,JSON.stringify(config,null,2));
	},
	/**
	* Description 
	*
	* @method setup
	* @param {string} id
	*/	
	get: function(id){
		return this[id];
	},
	/**
	* Description set game configuration
	*
	* @method setup
	* @param {string} id - key
	* @param {string} value - value
	*/
	set: function(id,value){
		if(typeof value === 'undefined'){
			value=this.getDefault(id);
			this[id]=value;
		}else{
			this[id]=value;
		}
	},
	/**
	* Description 
	*
	* @method setup
	* @param {string} id
	*/	
	getDefault: function(id){
		switch(id){
			case 'display'	:	return {width:800,height:600}; break;
			case 'sound'	:	return {slient:true,volume:1}; break;
			case 'physics'	:	return 'p2'; break;
			case 'script'	: 	return 'javascript'; break;
			case 'GUI'		:	return 'jqueryUI'; break;
			case 'plugins'	:	return null; break;
			default			:	return null; break;
		}
	}
}

AngoraEditor.GameManager.prototype.constructor=AngoraEditor.GameManager;