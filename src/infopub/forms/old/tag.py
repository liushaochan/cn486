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

__doc__ = 'tag 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.913000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField
from wtforms.validators import required
from flask.ext.wtf import Form
from infopub.bases.validators import length, url

class TagNewForm(Form):
    """
    新建 Tags 的表单
    """
    
    tag_name = TextField(_("tag.tag_name"),
                description=u'标签名',
                validators=[
                    required(message=_("tag_name is required")),
                    length(min=1, max=50, message=_("Length range: 1 - 50"))
            ])
    
    slug = TextField(_("tag.slug"),
        description=u'固定地址',
        validators=[
            required(message=_("slug is required")),
            length(min=1, max=50, message=_("Length range: 1 - 50"))
        ])

    logo = TextField(_("tag.logo"),
        description=u'图标',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=11, max=100, message=_("Length range: 11 - 100"))
        ])

    feature_image = TextField(_("tag.feature_image"),
        description=u'特色图地址',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=11, max=100, message=_("Length range: 11 - 100"))
        ])

    description = TextField(_("tag.description"),
        description=u'描述',
        validators=[
        ])

    meta_title = TextField(_("tag.meta_title"),
        description=u'针对搜索引擎设置的标题',
        validators=[
            length(max=100, message=_("Length max: 100"))
        ])

    meta_keywords = TextField(_("tag.meta_keywords"),
        description=u'针对搜索引擎设置的关键词',
        validators=[
            length(max=200, message=_("Length max: 200"))
        ])

    meta_description = TextField(_("tag.meta_description"),
        description=u'针对搜索引擎设置的描述',
        validators=[
            length(max=200, message=_("Length max: 200"))
        ])


    def validate_tag_name(self, field):
        # unique
        pass
    
    def validate_slug(self, field):
        # unique
        pass
    

class TagEditForm(Form):
    """
    编辑 Tags 的表单
    """

    tag_name = TextField(_("tag.tag_name"),
        description=u'标签名',
        validators=[
            required(message=_("tag_name is required")),
            length(min=1, max=50, message=_("Length range: 1 - 50"))
        ])

    slug = TextField(_("tag.slug"),
        description=u'固定地址',
        validators=[
            required(message=_("slug is required")),
            length(min=1, max=50, message=_("Length range: 1 - 50"))
        ])

    logo = TextField(_("tag.logo"),
        description=u'图标',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=11, max=100, message=_("Length range: 11 - 100"))
        ])

    feature_image = TextField(_("tag.feature_image"),
        description=u'特色图地址',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=11, max=100, message=_("Length range: 11 - 100"))
        ])

    description = TextField(_("tag.description"),
        description=u'描述',
        validators=[
        ])

    meta_title = TextField(_("tag.meta_title"),
        description=u'针对搜索引擎设置的标题',
        validators=[
            length(max=100, message=_("Length max: 100"))
        ])

    meta_keywords = TextField(_("tag.meta_keywords"),
        description=u'针对搜索引擎设置的关键词',
        validators=[
            length(max=200, message=_("Length max: 200"))
        ])

    meta_description = TextField(_("tag.meta_description"),
        description=u'针对搜索引擎设置的描述',
        validators=[
            length(max=200, message=_("Length max: 200"))
        ])


    def validate_tag_name(self, field):
        # unique
        pass

    def validate_slug(self, field):
        # unique
        pass
