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
from runkit.wtforms.validators import length, url, email

__doc__ = 'user 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.343000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, HiddenField, SubmitField, PasswordField, SelectField
from wtforms.validators import required
from flask.ext.wtf import Form
# from infopub.bases.validators import length, url, email

class UserNewForm(Form):
    """
    新建 User 的表单
    """

    
    username = TextField(_("user.username"),
                description=u'用户名',
                validators=[
                    required(message=_("username is required")),
                    length(min=2, max=20, message=_("Length range: 2 - 20"))
            ])
    
    nickname = TextField(_("user.nickname"),
                description=u'昵称',
                validators=[
                    required(message=_("nickname is required")),
                    length(min=2, max=20, message=_("Length range: 2 - 20"))
            ])
    
    password = PasswordField(_("user.password"),
                description=u'密码',
                validators=[
                    required(message=_("password is required")),
                    length(min=6, max=20, message=_("Length range: 6 - 20"))
            ])
    
    email = TextField(_("user.email"),
                description=u'邮箱',
                validators=[
                    email(message=_("email is not a valid email")),
                    required(message=_("email is required")),
                    length(min=6, max=50, message=_("Length range: 6 - 50"))
            ])
    
    homepage = TextField(_("user.homepage"),
                description=u'个人主页',
                validators=[
                    url(message=_("homepage is not a valid URL")),
                    length(min=11, max=50, message=_("Length range: 11 - 50"))
            ])
    
    avatar = TextField(_("user.avatar"),
                description=u'头像',
                validators=[
                    url(message=_("avatar is not a valid URL")),
                    length(min=11, max=50, message=_("Length range: 11 - 50"))
            ])
    
    gender = SelectField(_("user.gender"),
                description=u'性别：0-保密、1-男、2-女',
                choices=[('0', u'保密'), ('1', u'男'), ('2', u'女')],
                validators=[
                    required(message=_("gender is required")),
            ])
    
    role = SelectField(_("user.role"),
                description=u'用户角色',
                choices=[('0', u'受限的'), ('10', u'普通会员'), ('11', u'热心会员'), ('12', u'支柱会员'), ('13', u'资深会员'), ('100', u'合作伙伴'), ('1000', u'编辑'), ('2000', u'版主、仲裁者'), ('10000', u'管理员'), ('10100', u'高级管理员')],
                validators=[
                    required(message=_("role is required")),
            ])
    
    rank = TextField(_("user.rank"),
                description=u'用户头衔',
                validators=[
                    required(message=_("rank is required")),
            ])
    
    bio = TextField(_("user.bio"),
                description=u'自我介绍',
                validators=[
                    length(min=1, max=200, message=_("Length range: 1 - 200"))
            ])
    
    interest = TextField(_("user.interest"),
                description=u'研究领域/兴趣范围（多个用，分开）',
                validators=[
            ])
    
    user_status = SelectField(_("user.user_status"),
                description=u'用户状态：0-未激活、100:被禁止、101:被禁言、1-正常',
                choices=[('0', u'未激活'), ('1', u'正常'), ('100', u'被禁止'), ('101', u'被禁言')],
                validators=[
                    required(message=_("user_status is required")),
            ])
    
    def validate_username(self, field):
        # unique
        pass
    
    def validate_email(self, field):
        # unique
        pass
    

    next = HiddenField()

    submit = SubmitField(_("Submit"))


class UserEditForm(Form):
    """
    编辑 User 的表单
    """

    
    username = TextField(_("user.username"),
                description=u'用户名',
                validators=[
                    required(message=_("username is required")),
                    length(min=2, max=20, message=_("Length range: 2 - 20"))
            ])
    
    nickname = TextField(_("user.nickname"),
                description=u'昵称',
                validators=[
                    required(message=_("nickname is required")),
                    length(min=2, max=20, message=_("Length range: 2 - 20"))
            ])
    
    email = TextField(_("user.email"),
                description=u'邮箱',
                validators=[
                    email(message=_("email is not a valid email")),
                    required(message=_("email is required")),
                    length(min=6, max=50, message=_("Length range: 6 - 50"))
            ])
    
    homepage = TextField(_("user.homepage"),
                description=u'个人主页',
                validators=[
                    url(message=_("homepage is not a valid URL")),
                    length(min=11, max=50, message=_("Length range: 11 - 50"))
            ])
    
    avatar = TextField(_("user.avatar"),
                description=u'头像',
                validators=[
                    url(message=_("avatar is not a valid URL")),
                    length(min=11, max=50, message=_("Length range: 11 - 50"))
            ])
    
    gender = SelectField(_("user.gender"),
                description=u'性别：0-保密、1-男、2-女',
                choices=[('0', u'保密'), ('1', u'男'), ('2', u'女')],
                validators=[
                    required(message=_("gender is required")),
            ])

    role = SelectField(_("user.role"),
                description=u'用户角色',
                choices=[('0', u'受限的'), ('10', u'普通会员'), ('11', u'热心会员'), ('12', u'支柱会员'), ('13', u'资深会员'), ('100', u'合作伙伴'), ('1000', u'编辑'), ('2000', u'版主、仲裁者'), ('10000', u'管理员'), ('10100', u'高级管理员')],
                validators=[
                    required(message=_("role is required")),
            ])
    
#    rank = TextField(_("user.rank"),
#                description=u'用户头衔',
#                validators=[
#                    required(message=_("rank is required")),
#            ])
    
    bio = TextField(_("user.bio"),
                description=u'自我介绍',
                validators=[
                    length(min=1, max=200, message=_("Length range: 1 - 200"))
            ])
    
    interest = TextField(_("user.interest"),
                description=u'研究领域/兴趣范围（多个用，分开）',
                validators=[
            ])
    
    user_status = SelectField(_("user.user_status"),
                description=u'用户状态：0-未激活、100:被禁止、101:被禁言、1-正常',
                choices=[('0', u'未激活'), ('1', u'正常'), ('100', u'被禁止'), ('101', u'被禁言')],
                validators=[
                    required(message=_("user_status is required")),
            ])
    
    def validate_username(self, field):
        # unique
        pass
    
    def validate_email(self, field):
        # unique
        pass
    

    id = HiddenField()

    next = HiddenField()

    submit = SubmitField(_("Submit"))