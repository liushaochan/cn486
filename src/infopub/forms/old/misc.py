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

__doc__ = "账户的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

from flask.ext.wtf import Form, TextAreaField, HiddenField, BooleanField,\
    PasswordField, SubmitField, TextField, ValidationError,\
    required, equal_to

from flask.ext.babelex import gettext, lazy_gettext as _

from flask import session
from wtforms.fields import SelectField
from wtforms.validators import length, url, email
from infopub.bases.validators import is_username
from infopub.models.user import User, UserService
from infopub.models.word_forbidden import WordForbidden, WordForbiddenService
from infopub.models.word_reserved import WordReserved, WordReservedService

class TemplateForm(Form):

    html = TextAreaField(_("HTML"), validators=[
        required(message=_("HTML required"))])

    submit = SubmitField(_("Save"))
    cancel = SubmitField(_("Cancel"))
