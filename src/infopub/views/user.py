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

from flask import Blueprint
from flask.ext.security import login_required, roles_required, roles_accepted
from runkit.web.views.render import render_html

__doc__ = '用户个人view'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-02-10 15:05'

module = Blueprint('user', __name__, url_prefix='/u', template_folder='templates')


@module.route('/')
def index():
    return 'user index.html'


@module.route('/profile')
@login_required
def profile():
    """
    显示用户的个人信息
    :return:
    """
    return render_html('user/members.html', content='Profile Page')


