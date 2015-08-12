
AngoraEditor.UIComponent.OpenProjectDialog=function(editor){
  this.editor=editor;
  this.href = '/dialog/openProject';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
  //this.onConfirm = null;
  //this.onCreate = null;
}
AngoraEditor.UIComponent.OpenProjectDialog.prototype={
  show: function () {
    self=this;
    $.get(this.href,function(data){
      $('#dd').html(data);
      self.onLoad(self);
    });
  },
  onShow:function(self){
    $('#dd').dialog({
      title: self.href.split('/').pop(),
      left:(window.innerWidth-self.width)/2,
      top:(window.innerHeight-self.height)/2,
      width: self.width,
      height: self.height,
      resizable: self.resize,
      closed: false,
      cache: false,
      //href: path,
      modal: self.modal
      //onLoad: self.onLoad(self),
      //onClose: self.onClose(self)
    });
  },
  onLoad:function(self){
    var editor=self.editor;
    editor.Data.getAllProjects(function(data){
      var projects=JSON.parse(data);
      for (var key in projects) {
        var project = projects[key];
        if (typeof project != 'undefined'){
          var projectdiv = "<div class='project'>" +
          "<span class='projectName'>" + project.name + "</span>" +
          "<span class='projectDir'>" + project.path + "</span>" +
          "<span class='descibe'>" + project.describe + "</span>" +
          "</div>";
          $('#projects').append(projectdiv);
        }
      }
      self.onShow(self);
    });
    $("#projects").delegate('.project','click',function (e) {
      var selected = $(".selected");
      if (selected.length > 0)
      selected.removeClass("selected");
      $(this).addClass("selected");
    });
    $("#newbtn").click(function () {
      self.onCreate();
      //win.close();
    });
    $("#openbtn").click(function () {
      var selected = $(".selected");
      var project = {};
      project['name'] = selected.children(".projectName")[0].innerHTML;
      project['path'] = selected.children(".projectDir")[0].innerHTML;
      self.onConfirm(project);
      $('#dd').dialog('close');
    });
    $("#removebtn").click(function () {
      editor.UI.confirm("Warning","Are you comfirm to remove this project?",function(r){
        if (r) {
          var selected = $(".selected");
          var name = selected.children(".projectName")[0].innerHTML;
          var dir = selected.children(".projectDir")[0].innerHTML;
          for (var i in projects) {
            if (projects[i].name == name) {
              editor.project.remove(i);
              break;
            }
          }
          selected.remove();
        } else {
          editor.UI.alert("Warning","Cannot remove the project");
        }
      });
    });
    $("#importbtn").click(function(){
      editor.project.importProject(function(project){
        var projectdiv = "<div class='project'>" +
        "<span class='projectName'>" + project.name + "</span>" +
        "<span class='projectDir'>" + project.path + "</span>" +
        "<span class='descibe'>" + project.describe + "</span>" +
        "</div>"
        $('#projects').append(projectdiv);
      });
    });
  },
  onClose:function(self){ },
  onCreate:function(){ },
  onConfirm:function(project){ }
}

AngoraEditor.UIComponent.OpenProjectDialog.constructor=AngoraEditor.UIComponent.OpenProjectDialog;
