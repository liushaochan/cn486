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

__doc__ = 'message 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-03-01 08:19:37.778000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, HiddenField, SubmitField
from wtforms.validators import required
from flask.ext.wtf import Form
from infopub.bases.validators import length

class MessageNewForm(Form):
    """
    新建 Message 的表单
    """

    
    title = TextField(_("message.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=2, max=50, message=_("Length range: 2 - 50"))
            ])
    
    sender_id = TextField(_("message.sender_id"),
                description=u'发送人ID',
                validators=[
                    required(message=_("sender_id is required")),
            ])
    
    receiver_id = TextField(_("message.receiver_id"),
                description=u'接收人ID',
                validators=[
                    required(message=_("receiver_id is required")),
            ])
    
    content = TextField(_("message.content"),
                description=u'内容',
                validators=[
                    required(message=_("content is required")),
                    length(min=2, max=400, message=_("Length range: 2 - 400"))
            ])
    
    msg_status = TextField(_("message.msg_status"),
                description=u'链接状态：0-未读、1-已读、2-已删除',
                validators=[
            ])
    

    next = HiddenField()

    submit = SubmitField(_("Submit"))


class MessageEditForm(Form):
    """
    编辑 Messages 的表单
    """

    
    title = TextField(_("message.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=2, max=50, message=_("Length range: 2 - 50"))
            ])
    
    sender_id = TextField(_("message.sender_id"),
                description=u'发送人ID',
                validators=[
                    required(message=_("sender_id is required")),
            ])
    
    receiver_id = TextField(_("message.receiver_id"),
                description=u'接收人ID',
                validators=[
                    required(message=_("receiver_id is required")),
            ])
    
    content = TextField(_("message.content"),
                description=u'内容',
                validators=[
                    required(message=_("content is required")),
                    length(min=2, max=400, message=_("Length range: 2 - 400"))
            ])
    
    msg_status = TextField(_("message.msg_status"),
                description=u'链接状态：0-未读、1-已读、2-已删除',
                validators=[
            ])
    

    id = HiddenField()

    next = HiddenField()

    submit = SubmitField(_("Submit"))

class MessageSendForm(Form):
    """
    新建 Message 的表单
    """


    title = TextField(_("message.title"),
        description=u'标题',
        validators=[
            required(message=_("title is required")),
            length(min=2, max=50, message=_("Length range: 2 - 50"))
        ])

    content = TextField(_("message.content"),
        description=u'内容',
        validators=[
            required(message=_("content is required")),
            length(min=2, max=400, message=_("Length range: 2 - 400"))
        ])


    next = HiddenField()

    submit = SubmitField(_("Submit"))
