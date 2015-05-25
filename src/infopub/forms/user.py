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
from infopub.models.user import User
from wtforms import StringField, SubmitField
from wtforms_alchemy import ModelForm
from flask.ext.babelex import lazy_gettext as _


__doc__ = '用户表单'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-06-02 7:46 PM'

from flask_security.forms import RegisterForm, Required


class ExtendedRegisterForm(RegisterForm):
    username = StringField('User Name', [Required()])


class UserForm(ModelForm):
    class Meta:
        model = User
        field_args = {
            'email': {'label': _('Email Address'), 'description': 'user email'}
        }

    @classmethod
    def get_session(cls):
        return db.session

    submit = SubmitField(_("Add"))
