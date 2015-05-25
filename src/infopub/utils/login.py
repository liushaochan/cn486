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

__doc__ = '用户登录装饰器'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:04'

from functools import wraps
from flask import current_app
from flask.ext.login import current_user


def admin_login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_authenticated():
            current_app.login_manager.login_view = "account.admin_login"
            return current_app.login_manager.unauthorized()
        return func(*args, **kwargs)
    return decorated_view


def member_login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_authenticated():
            current_app.login_manager.login_view = "account.member_login"
            return current_app.login_manager.unauthorized()
        return func(*args, **kwargs)
    return decorated_view


#星球人员登陆
def starmap_login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_authenticated():
            current_app.login_manager.login_view = "starmap.login"
            return current_app.login_manager.unauthorized()
        return func(*args, **kwargs)
    return decorated_view

