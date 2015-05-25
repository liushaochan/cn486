#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
# Copyright (c) 2011 - 2035 HangZhou JingChuang Information Technology CO.,Ltd.
# 杭州精创信息技术有限公司
#
# http://www.jcing.com
#
# All rights reserved.
#

import hashlib
import os
from flask import session
from flask.globals import g
from flask.helpers import url_for, make_response, send_from_directory
from flask_mail import Message
from werkzeug.exceptions import abort
from infopub.configs.permissions import member

__doc__ = "前端的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

from flask import request,\
    redirect

from flask.ext.babelex import gettext as _
from flask.templating import render_template

from flask import Blueprint

misc = Blueprint('misc', __name__)

#def allowed_file(filename):
#    return '.' in filename and\
#           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@misc.route('/photo/<id>.<ext>')
def photo(id, ext):
    photo = MaterialService.get_by_id(id)
    if photo is None:
        abort(404)

    # http://127.0.0.1:5000/static/uploads/photos/2012628/1340897676.jpg
    return redirect(photo.url)
    #return send_from_directory(PHOTOS_RELATIVE_PATH, photo.file_name+photo.file_ext)

@misc.route("/upload_img/", methods=("POST",))
@member.require(401)
def upload_img():
    # 原始文件名，表单名固定，不可配置
    oriName = request.args.get('fileName', '').strip()

    # 上传图片框中的描述表单名称，
    title = request.args.get('pictitle', '').strip()

    # 文件上传状态,当成功时返回SUCCESS，其余值将直接返回对应字符窜并显示在图片预览框，同时可以在前端页面通过回调函数获取对应字符窜
    state = "FAILED"

    # 重命名后的文件名
    fileName=""
    print "==============================================================================================="
    # print dir(request.files)
    print request.files['file']
    if 'file' in request.files:
        file = request.files['file']
        name, ext = os.path.splitext(file.filename)
        ext = ext[1:]

        m = hashlib.md5()
        m.update(file.read())
        # todo 为何多2个字节？
        size = file.tell()-2
        file.seek(0)

        material = MaterialService.get_by_file_signature(m.hexdigest())

        if not material:
            # 按日期存放
            folder_name, file_name = build_date_folder_file()
            filename = photos.save(file, folder=folder_name, name='%s.%s' % (file_name, ext))

            material = Material()
            material.added_user_id = g.user.id
            material.file_name = file_name
            material.file_ext = ext
            material.file_path = folder_name
            material.file_type = ext
            material.file_size = size
            material.file_signature = m.hexdigest()
            material.thumbnail_file = ''
            material.url = photos.url(filename)
            material.title = title
            MaterialService.add_or_update(material)


        # 向浏览器返回数据json数据
        result = {
            'url':      url_for('misc.photo', id=material.id, ext=ext),   # 保存后的文件路径
            'title':    title,   # 文件描述，对图片来说在前端会添加到title属性上
            'original': oriName,   # 原始文件名
            'error': 0,
            'state':    'SUCCESS'  # 上传状态，成功时返回SUCCESS,其他任何值将原样返回至图片上传框中
        }

    #    echo "{'url':'".$fileName."','title':'".$title."','original':'".$oriName."','state':'".$state."'}";

        return json_encode(result)

    # todo
    # UploadNotAllowed
    # 文件大小

    return json_encode({'state': state})

@misc.route("/upload_att/", methods=("POST",))
@member.require(401)
def upload_att():
    """
    """

    # 文件上传状态,当成功时返回SUCCESS，其余值将直接返回对应字符窜
    state = "SUCCESS"


    if 'Filedata' in request.files:
        file = request.files['Filedata']
        name, ext = os.path.splitext(file.filename)
        ext = ext[1:]

        # todo 存到附件库中
        # 按日期存放
        folder_name, file_name = build_date_folder_file()
        filename = attachments.save(file, folder=folder_name, name='%s.%s' % (file_name, ext))

        # 向浏览器返回数据json数据
        result = {
            'url':      attachments.url(filename),   # 保存后的文件路径
            'fileType':    ext,   # 文件描述，对图片来说在前端会添加到title属性上
            'state':    'SUCCESS'  # 上传状态，成功时返回SUCCESS,其他任何值将原样返回至图片上传框中
        }

        return json_encode(result)

    return json_encode({'state': state})

from flask import send_file
import StringIO

@misc.route("/dl/")
def download():
    strIO = StringIO.StringIO()
    strIO.write('Hello from Dan Jacob and Stephane Wirtel !')
    strIO.seek(0)
    return send_file(strIO,
        attachment_filename="testing.txt",
        as_attachment=True)
    # send_file是多线程？会阻塞网站访问？
    # 使用nginx？
    #file = get_file(request.args.get("_id"))
    #response = make_response(file["content"])
    #response.headers["Content-type"] = "text/plain"
    #return response

@misc.route('/validate_code/')
def validate_code():
    code = build_captcha_key()

    print code, session['verify']
    return draw_captcha_key(code)

@misc.route("/about.html")
def about():
    return render_template("misc/about.html")

@misc.route("/contact.html")
def contact():
    return render_template("misc/contact.html")

@misc.route("/mail.html")
def mail_test():

    msg = Message("Hello",
                  sender="admin@infopub.org",
                  recipients=["test@infopub.org"])

    msg.body = "testing"
    msg.html = "<b>testing</b>"

    result = mail.send(msg)
    return 'OK:' + result

@misc.route("/goto/", methods=("GET",))
def goto():
    url = request.args.get('url', '').strip()
    print 'url:', url
    # curl -I http://127.0.0.1:5000/misc/goto/?url=http://news.163.com/12/0325/04/7TDR2TP300014AED.html
    return redirect(url)

@misc.route('/pygments.css')
def pygments_css():
    #from pygments.styles import get_style_by_name
    #val =  get_style_by_name('colorful')
    #print val
    #return val
    #return pygments_style_defs('tango'), 200, {'Content-Type': 'text/css'}

    import pygments.formatters.html
    formater = pygments.formatters.html.HtmlFormatter(style='native')
    return formater.get_style_defs('.codehilite'), 200, {'Content-Type': 'text/css'}