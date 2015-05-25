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
from wtforms_components.fields import AjaxField


__doc__ = '用户表单'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-06-02 7:46 PM'


class CategoryForm(ModelForm):
    class Meta:
        from infopub.models.category import Category
        model = Category

        # exclude = ['num_entries', 'num_discuss', 'num_attention']
        # exclude = ['created_at', 'updated_at']

        field_args = {
            'category_name': {'label': _('Category Name'), 'description': '栏目的名称，必填的哦'}
        }

    @classmethod
    def get_session(cls):
        return db.session

    # submit = SubmitField(_("Add"))

    # demo = AjaxField(data_url='http://127.0.0.1:5000/demo', data=)