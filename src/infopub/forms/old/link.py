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

__doc__ = '友情链接 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-20 06:22:44.754000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, SelectField, IntegerField
from wtforms.validators import required, NumberRange
from infopub.bases.validators import length, url, email
from flask.ext.wtf import Form

class LinkNewForm(Form):
    """
    新建 Links 的表单
    """

    
    link_group = SelectField(_("link.link_group"),
                description=u'分组：0-合作伙伴、1-友情链接、2-其他链接',
                choices=[('0', _("Partner link")), ('1', _("Friend link")), ('2', _("Other link"))],
                validators=[
                    required(message=_("link_group is required")),
            ])
    
    title = TextField(_("link.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=2, max=50, message=_("Length range: 2 - 50"))
            ])

    weight = IntegerField(_("link.weight"),
                description=u'权重',
                default=1,
                validators=[
                    required(message=_("weight is required")),
                    NumberRange(min=1, max=1000, message=_("weight range: 0 - 1000"))
            ])

    link = TextField(_("link.link"),
                description=u'链接',
                validators=[
                    url(message=_("link is not a valid URL")),
                    required(message=_("link is required")),
                    length(min=11, max=100, message=_("Length range: 11 - 100"))
            ])
    
    logo = TextField(_("link.logo"),
                description=u'图标',
                validators=[
                    url(message=_("logo is not a valid URL")),
                    length(min=11, max=100, message=_("Length range: 11 - 100"))
            ])
    
    email = TextField(_("link.email"),
                description=u'邮箱',
                validators=[
                    email(message=_("email is not a valid email")),
                    length(min=6, max=50, message=_("Length range: 6 - 50"))
            ])
    
    link_status = SelectField(_("link.link_status"),
                description=u'链接状态：0-草稿、1-待审核、2-已发布',
                choices=[('0', u'草稿'), ('1', u'待审'), ('2', u'发布')],
                validators=[
            ])
    
    desc = TextField(_("link.desc"),
                description=u'备注',
                validators=[
                    length(min=1, max=200, message=_("Length range: 1 - 200"))
            ])
    
    def validate_link(self, field):
        # unique
        pass
    

class LinkEditForm(Form):
    """
    编辑 Links 的表单
    """

    
    link_group = SelectField(_("link.link_group"),
                description=u'分组：0-合作伙伴、1-友情链接、2-其他链接',
                choices=[('0', _("Partner link")), ('1', _("Friend link")), ('2', _("Other link"))],
                validators=[
                    required(message=_("link_group is required")),
            ])
    
    title = TextField(_("link.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=2, max=50, message=_("Length range: 2 - 50"))
            ])

    weight = IntegerField(_("link.weight"),
        description=u'权重',
        default=1,
        validators=[
            required(message=_("weight is required")),
            NumberRange(min=1, max=1000, message=_("weight range: 0 - 1000"))
        ])

    link = TextField(_("link.link"),
                description=u'链接',
                validators=[
                    url(message=_("link is not a valid URL")),
                    required(message=_("link is required")),
                    length(min=11, max=100, message=_("Length range: 11 - 100"))
            ])
    
    logo = TextField(_("link.logo"),
                description=u'图标',
                validators=[
                    url(message=_("logo is not a valid URL")),
                    length(min=11, max=100, message=_("Length range: 11 - 100"))
            ])
    
    email = TextField(_("link.email"),
                description=u'邮箱',
                validators=[
                    email(message=_("email is not a valid email")),
                    length(min=6, max=50, message=_("Length range: 6 - 50"))
            ])
    
    link_status = SelectField(_("link.link_status"),
                description=u'链接状态：0-草稿、1-待审核、2-已发布',
                choices=[('0', u'草稿'), ('1', u'待审'), ('2', u'发布')],
                validators=[
            ])
    
    desc = TextField(_("link.desc"),
                description=u'备注',
                validators=[
                    length(min=1, max=200, message=_("Length range: 1 - 200"))
            ])
    
    def validate_link(self, field):
        # unique
        pass
    
