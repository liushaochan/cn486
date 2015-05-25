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
from infopub.bases.validators import int_value_verify
from infopub.forms.message import MessageSendForm
from infopub.models.message import Message, MessageService
from infopub.models.user import UserService

__doc__ = 'messages 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-03-01 08:19:37.857000'

from flask import request, flash, jsonify, redirect, url_for
from flask import Blueprint
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from werkzeug.exceptions import abort
from flask.globals import g
from infopub.configs.permissions import member, supervisor

message = Blueprint('message', __name__)

@message.route('/send/<username>/', methods=("GET","POST"))
@member.require(401)
def send(username):
    """
    新建 messages
    """

    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    form = MessageSendForm(next=request.args.get('next', None))

    if form.validate_on_submit():

        # 获取指定的表单数据
        messages = Message()
        form.populate_obj(messages)

        message.sender_id = g.user.id
        message.receiver_id = user.id

        # 保存数据
        id = MessageService.add(messages)

        if not id:
            flash(_("Internal error"), "failed")
            return render_template("messages/send.html", form=form, receiver=username)

        flash(_("Create success"), "success")

        next_url = form.next.data

        if not next_url or next_url == request.path:
            return render_template("messages/send_success.html", form=form, receiver=username)

        return redirect(next_url)
    elif form.errors:
        for error_name, error_value in form.errors.iteritems():
            # todo log
            print "error: %s %s" % (error_name, error_value)
        flash(_("Cause an error"), "failed")

    return render_template("messages/send.html", form=form, receiver=username)

@message.route('/<int:id>.html')
@member.require(401)
def read(id):
    """
    显示 messages
    """

    int_value_verify(id)

    messages = MessageService.get_by_id(id)

    if messages['msg_status'] == 0:
        messages_srv.update_read_status_by_id(id)

    if not messages:
        abort(404)

    return render_template("messages/read.html", messages=messages)

@message.route('/destroy/<int:id>/', methods=("GET","POST"))
@supervisor.require(403)
def destroy(id):
    """
    删除 messages
    返回 删除的记录数
    """

    int_value_verify(id)

    messages_srv = get_messages_service()
    count = messages_srv.del_by_id(id)

    return jsonify(success=count==1,
        data_id=id)

@message.route('/new_nums/', methods=("GET","POST"))
@member.require(401)
def new_nums():
    """
    获取新 messages 条数
    """

    count = MessageService.get_count_by_user_id(g.user.id)

    return jsonify(count=count)

