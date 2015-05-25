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
from wtforms.fields.core import SelectField

__doc__ = 'comment 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.812000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, HiddenField, SubmitField, TextAreaField
from wtforms.validators import required
from flask.ext.wtf import Form
from infopub.bases.validators import length

class CommentNewForm(Form):
    """
    新建 Comment 的表单
    """

    
    slug = TextField(_("comment.slug"),
                description=u'固定地址',
                validators=[
                    length(min=4, max=50, message=_("Length range: 4 - 50"))
            ])

    author_id = HiddenField(_("comment.author_id"),
            description=u'作者ID',
            validators=[
                    required(message=_("author_id is required")),

        ])

    
    comment = TextAreaField(_("comment.comment"),
                description=u'回复内容',
                validators=[
                    required(message=_("comment is required")),
            ])
    
    def validate_slug(self, field):
        # unique
        pass
    

    next = HiddenField()

    submit = SubmitField(_("Add comment"))

    cancel = SubmitField(_("Cancel"))


class CommentEditForm(Form):
    """
    编辑 Comment 的表单
    """

    
#    parent_id = TextField(_("comment.parent_id"),
#                description=u'父ID',
#                validators=[
#                    required(message=_("parent_id is required")),
#            ])
#
#    entry_id = TextField(_("comment.entry_id"),
#                description=u'主体ID',
#                validators=[
#                    required(message=_("entry_id is required")),
#            ])
#
#    author_id = TextField(_("comment.author_id"),
#                description=u'作者ID',
#                validators=[
#                    required(message=_("author_id is required")),
#            ])
#
#    slug = TextField(_("comment.slug"),
#                description=u'固定地址',
#                validators=[
#                    required(message=_("slug is required")),
#                    length(min=4, max=50, message=_("Length range: 4 - 50"))
#            ])
    
    comment = TextAreaField(_("comment.comment"),
                description=u'回复内容',
                validators=[
                    required(message=_("comment is required"))
            ])

    author_id = HiddenField(_("comment.author_id"),
        description=u'作者ID',
        validators=[
                required(message=_("author_id is required"))

    ])
    
    comment_status = SelectField(_("comment.comment_status"),
                default=0,
                description=u'评论状态：0-显示、1-待审、2-禁止',
                choices=[('0', _(u"显示")), ('1', _(u"待审")), ('2', _(u"禁止"))],
                validators=[
                    required(message=_("comment_status is required"))
            ])


#    def validate_slug(self, field):
#        # unique
#        pass
#
#
#    id = HiddenField()
#
#    next = HiddenField()
#
#    submit = SubmitField(_("Submit"))
