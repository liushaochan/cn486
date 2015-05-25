# !/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
# Copyright (c) 2011 - 2035 HangZhou JingChuang Information Technology CO.,Ltd.
# 杭州精创信息技术有限公司
#
# http://www.jcing.com
#
# All rights reserved.
#


from runkit.web.flask_ext.sql import db
from wtforms import TextField, SubmitField
from wtforms_alchemy import ModelForm
from flask.ext.babelex import lazy_gettext as _


__doc__ = '用户表单'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-06-02 7:46 PM'


class TagForm(ModelForm):
    class Meta:
        from infopub.models.tag import Tag
        model = Tag

        # exclude = ['num_entries']
        # exclude = ['created_at', 'updated_at']

        field_args = {
        }

    @classmethod
    def get_session(cls):
        return db.session

    # submit = SubmitField(_("Add"))
