from bottle import route, run, static_file, request, response
import os
import shutil
import releaseJS
import docs
import json

##@route('/style/<filename:path>')
##def send_style(filename):
##    return static_file(filename, root='../style')
##@route('/script/<filename:path>')
##def send_script(filename):
##    return static_file(filename, root='../script')
##@route('/data/<filename:path>')
##def send_data(filename):
##    return static_file(filename, root='../data')
##@route('/dialog/<filename:path>')
##def send_dialog(filename):
##    return static_file(filename+'.html', root='../dialog')
##@route('/demo/<filename:path>')
##def send_demo(filename):
##    return static_file(filename, root='../demo')
##@route('/workspace/<filename:path>')
##def send_file(filename):
##    return static_file(filename, root='../workspace')
@route('/docs/<filename:path>')
def searchdocs(filename):
    cls = request.query.get('cls')
    args = request.query.get('args')
    return docs.search(cls,args)

# Static Routes
@route('/client/<filename:path>')
def javascripts(filename):
    return static_file(filename, root='../client/')

@route('/dependencies/<filename:path>')
def stylesheets(filename):
    return static_file(filename, root='../dependencies/')

@route('/workspace/<filename:path>')
def stylesheets(filename):
    return static_file(filename, root='../workspace/')

@route('/dialog/<filename:path>')
def send_dialog(filename):
    return static_file(filename+'.html', root='../client/UIComponent/dialog')

@route('/main')
def hello():
    print 'test'
    return static_file('index.html' , root="../")

@route('/copy')
def copyfile():
    path = request.query.get('path')
    src = request.query.get('src')
    dest = request.query.get('dest')
    print 'create %s from template %s'%('%s/%s'%(path,dest),src)
    shutil.copy2('../client'+src,'%s/%s'%('../'+path[1:],dest))
    return 'sucess'#static_file(filename, root='./',mimetype='text')

@route('/mkdir')
def mkdir():
    path = request.query.get('path')
    print 'create directory %s'%path
    os.mkdir('../'+path[1:])
    return 'sucess'#static_file(filename, root='./',mimetype='text')

@route('/read/data/<filename:path>')
def readFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    print 'read from %s success'%filename
    return static_file(filename, root='../client/resources',mimetype='text')

@route('/read/workspace/<filename:path>')
def readFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    print 'read from %s success'%filename
    return static_file(filename, root='../workspace',mimetype='text')

@route('/read/template/<filename:path>')
def readFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    print 'read from %s success'%filename
    return static_file(filename, root='../client/template',mimetype='text')

@route('/remove/<filename:path>')
def removeFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    os.remove('../'+filename)
    print 'remove from %s success'%filename
    return 'sucess'

@route('/exist/<filename:path>')
def removeFile(filename):
    #response.content_type = 'text/html; charset=UTF-8'
    if(os.path.exists('../'+filename)):
        return 'true'
    else:
        return 'false'

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
    '''print filepath
    upload = request.files.get('upload')
    upload.save('../'+filepath,True)
    filename = upload.filename
    print filename
    return filename'''
    uploadfiles=[];
    num_files=int(request.forms.get('num_files'))
    multiple=request.forms.get('multiple')[0].upper()=='T'
    if not multiple:
        upload = request.files.get('image0')
        upload.save('../'+filepath,True)
        print upload.filename
        return upload.filename
    else:
        for i in range(0,num_files):
            upload = request.files.get('image%d'%i)
            upload.save('../'+filepath,True)
            uploadfiles.append(upload.filename)
            print upload.filename
        return json.dumps(uploadfiles)

@route('/temp', method='POST')
def readTempFile():
    upload = request.files.get('upload')
    return upload.file.read()
    #return f.read()

@route('/release/<filepath:path>')
def releaseFile(filepath):
    releaseJS.releaseProject('../'+filepath+'/')
    return 'success'

run(host='localhost', port=8080, debug=True)
