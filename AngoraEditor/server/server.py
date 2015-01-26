from bottle import route, run, static_file, request, response
import os
import shutil
import releaseJS

@route('/style/<filename:path>')
def send_style(filename):
    return static_file(filename, root='../style')
@route('/script/<filename:path>')
def send_script(filename):
    return static_file(filename, root='../script')
@route('/data/<filename:path>')
def send_data(filename):
    return static_file(filename, root='../data')
@route('/dialog/<filename:path>')
def send_dialog(filename):
    return static_file(filename+'.html', root='../dialog')
@route('/demo/<filename:path>')
def send_demo(filename):
    return static_file(filename, root='../demo')
@route('/workspace/<filename:path>')
def send_file(filename):
    return static_file(filename, root='../workspace')

@route('/main')
def hello():
    print 'test'
    return static_file('index.html' , root="../")

@route('/createTemplate')
def createTemplate():
    path = request.query.get('path')
    src = request.query.get('src')
    dest = request.query.get('dest')
    print 'create %s from template %s'%('%s/%s'%(path,dest),src)
    shutil.copy2('../template/'+src,'%s/%s'%('../'+path[1:],dest))
    return 'sucess'#static_file(filename, root='./',mimetype='text')

@route('/mkdir')
def mkdir():
    path = request.query.get('path')
    print 'create directory %s'%path
    os.mkdir('../'+path[1:])
    return 'sucess'#static_file(filename, root='./',mimetype='text')

@route('/read/<filename:path>')
def readFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    print 'read from %s success'%filename
    return static_file(filename, root='../',mimetype='text')

@route('/remove/<filename:path>')
def removeFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    os.remove('../'+filename)
    print 'remove from %s success'%filename
    return 'sucess'

@route('/write', method='POST')
def writeFile():
    path = request.forms.get('path')
    data = request.forms.get('data')
    #print 'post',path,data
    f=open('../'+path[1:],'w+')
    f.write(data)
    print 'write to %s success'%path
    return 'success'

@route('/files/<filepath:path>', method='POST')
def uploadFile(filepath):
    #files = request.files.data
    #print request.forms.get('files')
    #for item in request.files:
    #uploads=[]
    print filepath
    upload = request.files.get('upload')
    upload.save('../'+filepath,True)
    filename = upload.filename
    print filename
    #uploads.append(filename)
    #for f in files:
    #    print 'data: %s'% f.filename
    return filename

@route('/release/<filepath:path>')
def releaseFile(filepath):
    releaseJS.releaseProject('../'+filepath+'/')
    return 'success'

run(host='localhost', port=8080, debug=True)
