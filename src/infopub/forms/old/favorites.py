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

__doc__ = 'favorites 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-03-07 08:58:06.513000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, HiddenField, SubmitField
from wtforms.validators import required
from flask.ext.wtf import Form
from infopub.bases.validators import length

class FavoritesNewForm(Form):
    """
    新建 Favorites 的表单
    """

    
    title = TextField(_("favorites.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    tags = TextField(_("favorites.tags"),
                description=u'标签',
                validators=[
                    length(min=1, max=512, message=_("Length range: 1 - 512"))
            ])
    
    description = TextField(_("favorites.description"),
                description=u'描述',
                validators=[
                    required(message=_("description is required")),
            ])
    

    next = HiddenField()

    submit = SubmitField(_("Submit"))


class FavoritesEditForm(Form):
    """
    编辑 Favorites 的表单
    """

    
    title = TextField(_("favorites.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    tags = TextField(_("favorites.tags"),
                description=u'标签',
                validators=[
                    length(min=1, max=512, message=_("Length range: 1 - 512"))
            ])
    
    description = TextField(_("favorites.description"),
                description=u'描述',
                validators=[
                    required(message=_("description is required")),
            ])
    

    id = HiddenField()

    next = HiddenField()

    submit = SubmitField(_("Submit"))