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
from infopub.bases.validators import is_username, length, url, email
from infopub.models.user import User, UserService
from infopub.models.word_forbidden import WordForbidden, WordForbiddenService
from infopub.models.word_reserved import WordReserved, WordReservedService


class LoginForm(Form):
    """
    登录表单
    """
    login = TextField(_("Email address"),
        validators=[required(message=_("You must provide an email")),
                    email(message=_("A valid email address is required"))])

    password = PasswordField(_("Password"),
        validators=[required(message=_("You must provide an password"))])

    recaptcha = TextField(_("Recaptcha"),
        validators=[]) # required(message=_("You must provide an captcha"))

    remember = BooleanField(_("Remember me"))

    next = HiddenField()

    def validate_recaptcha(self, field):
        if 'need_verify' not in session or not session['need_verify']:
            return

        if 'verify' not in session or session['verify'] != str(field.data).upper():
            raise ValidationError, gettext("This captcha is not matching")

    submit = SubmitField(_("Login"))


class SignupForm(Form):
    """
    注册的表单
    """
    username = TextField(_("Username"),
        #validators=[length(min=3, max=20, message=_("Length range: 3 - 20")), is_username])
        validators=[length(min=2, max=20, message=_("Length range: 3 - 20"))])

    password = PasswordField(_("Password"),
        validators=[required(message=_("Password required"))])

    password_again = PasswordField(_("Password again"),
        validators=[equal_to("password", message=_("Passwords don't match"))])

    email = TextField(_("Login email address"),
        validators=[required(message=_("Email address required")),
                    email(message=_("A valid email address is required"))])

    gender = SelectField(_("user.gender"),
        description=u'性别：0-保密、1-男、2-女',
        choices=[('0', u'保密'), ('1', u'男'), ('2', u'女')],
        default=1,
        validators=[
            required(message=_("gender is required")),
            ])

    recaptcha = TextField(_("Recaptcha"),
        validators=[required(message=_("You must provide an captcha"))])

    next = HiddenField()

    submit = SubmitField(_("Signup"))

    def validate_username(self, field):
        # todo
        # 用户名不允许重复
        if UserService.count_by_username(field.data) > 0:
            raise ValidationError, gettext("This username is taken")

        # 不能有敏感词、保留词
        if not WordReservedService.word_allowed(field.data):
            raise ValidationError, gettext("This username is taken")

        if not WordForbiddenService.word_allowed(field.data):
            raise ValidationError, gettext("This username is taken")

    def validate_nickname(self, field):
#        # 昵称不允许重复
#        if not UserService.count_by_nickname(field.data):
#            raise ValidationError, gettext("This nickname is taken")

        if not WordReservedService.word_allowed(field.data):
            raise ValidationError, gettext("This nickname is taken")

        if not WordForbiddenService.word_allowed(field.data):
            raise ValidationError, gettext("This nickname is taken")

    def validate_email(self, field):
        # email不允许重复
        if UserService.count_by_email(field.data) > 0:
            raise ValidationError, gettext("This email is taken")

    def validate_recaptcha(self, field):
        if 'need_verify' not in session or not session['need_verify']:
            return

        if 'verify' not in session or session['verify'] != str(field.data).upper():
            raise ValidationError, gettext("This captcha is not matching")

class RecoverPasswordForm(Form):
    """
    取回密码
    """
    email = TextField(_("Your email address"),
        validators=[
            required(message=_("email is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100")),
            email(message=_("A valid email address is required"))
        ])

    #def validate_email(self, field):
        # email是否存在
    #    if User.check_email_valid(field.data):
    #        raise ValidationError, gettext("This email is not exist")

    submit = SubmitField(_("Find password"))


class ChangePasswordForm(Form):
    """
    修改密码
    """
    password_old = PasswordField(_("Old Password"),
        validators=[required(message=_("Old password is required"))])

    password = PasswordField(_("New Password"),
        validators=[required(message=_("New Password is required"))])

    password_again = PasswordField(_("Password again"),
        validators=[equal_to("password", message=_("Passwords don't match"))])

    id = HiddenField()

    def validate_password_old(self, field):
        # 验证旧密码是否正确
        if not UserService.check_pwd_by_id(int(self.id.data), field.data):
            raise ValidationError, gettext("This old password is error")

    submit = SubmitField(_("Save"))

class PeopleEditForm(Form):
    """
    编辑 账户 的表单
    """

    nickname = TextField(_("user.nickname"),
        description=u'昵称',
        validators=[
            required(message=_("nickname is required")),
            length(min=2, max=20, message=_("Length range: 2 - 20"))
        ])

    homepage = TextField(_("user.homepage"),
        description=u'个人主页',
        validators=[
            url(message=_("homepage is not a valid URL")),
            length(min=0, max=50, message=_("Length range: 11 - 50"))
        ])

    avatar = TextField(_("user.avatar"),
        description=u'头像',
        validators=[
            #url(message=_("avatar is not a valid URL")),
            length(min=0, max=50, message=_("Length range: 11 - 50"))
        ])

    gender = SelectField(_("user.gender"),
        description=u'性别：0-保密、1-男、2-女',
        choices=[('0', u'保密'), ('1', u'男'), ('2', u'女')],
        validators=[
            required(message=_("gender is required")),
            ])

    bio = TextAreaField(_("user.bio"),
        description=u'自我介绍',
        validators=[
            length(min=0, max=200, message=_("Length range: 1 - 200"))
        ])

    interest = TextAreaField(_("user.interest"),
        description=u'研究领域/兴趣范围（多个用，分开）',
        validators=[
        ])

    def validate_nickname(self, field):
        # todo
    #        # 昵称不允许重复
    #        if not UserService.count_by_nickname(field.data):
    #            raise ValidationError, gettext("This nickname is taken")
        if not WordReservedService.word_allowed(field.data):
            raise ValidationError, gettext("This nickname is taken")


    id = HiddenField()

    next = HiddenField()

    submit = SubmitField(_("Submit"))

class BatchFakeAcountForm(Form):
    """
    批量假用户
    """
    email_list = TextAreaField(_("Your email address"),
        validators=[
            required(message=_("email list is required"))
        ])

    submit = SubmitField(_("Bacth register"))


class BatchFakeAcountAttachedForm(Form):
    """
    批量假用户
    """
    email_list = TextAreaField(_("Your email address"),
        validators=[
            required(message=_("email list is required"))
        ])

    submit = SubmitField(_("Bacth attached"))


