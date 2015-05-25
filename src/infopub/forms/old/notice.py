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

__doc__ = 'notice 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-03-07 08:58:06.408000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, HiddenField, SubmitField, SelectField
from wtforms.validators import required
from flask.ext.wtf import Form
from infopub.bases.validators import length

class NoticeNewForm(Form):
    """
    新建 Notice 的表单
    """

    title = TextField(_("notices.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=2, max=50, message=_("Length range: 2 - 50"))
            ])
    
    content = TextField(_("notices.content"),
                description=u'内容',
                validators=[
                    required(message=_("content is required")),
                    length(min=2, max=400, message=_("Length range: 2 - 400"))
            ])
    
    deadline = TextField(_("notices.deadline"),
                description=u'截止时间',
                validators=[
                    required(message=_("deadline is required")),
            ])
    
    notice_status = SelectField(_("notices.notice_status"),
                description=u'状态：0-未发布、1-发布、2-已删除',
                choices=[('0', _(u"未发布")), ('1', _(u"发布")), ('2', _(u"已删除")),],
                validators=[
            ])
    

    next = HiddenField()

    submit = SubmitField(_("Submit"))


class NoticeEditForm(Form):
    """
    编辑 Notice 的表单
    """

    title = TextField(_("notices.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=2, max=50, message=_("Length range: 2 - 50"))
            ])
    
    content = TextField(_("notices.content"),
                description=u'内容',
                validators=[
                    required(message=_("content is required")),
                    length(min=2, max=400, message=_("Length range: 2 - 400"))
            ])

    deadline = TextField(_("notices.deadline"),
                description=u'截止时间',
                validators=[
                    required(message=_("deadline is required")),
            ])
    
    notice_status = SelectField(_("notices.notice_status"),
        description=u'状态：0-未发布、1-发布、2-已删除',
        choices=[('0', _(u"未发布")), ('1', _(u"发布")), ('2', _(u"已删除")),],
        validators=[
        ])
    

    id = HiddenField()

    next = HiddenField()

    submit = SubmitField(_("Submit"))