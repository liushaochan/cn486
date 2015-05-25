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


from flask import Blueprint, request, after_this_request, redirect
from flask import Blueprint, send_from_directory, current_app
from flask.ext.login import current_user
from flask.ext.security import login_user
from flask.ext.security.utils import get_post_login_redirect
from flask.ext.security.views import _commit
from infopub.models.category import Category
from infopub.utils.login import starmap_login_required
from werkzeug.local import LocalProxy
from runkit.web.views.render import render_html

__doc__ = 'edit'
__author__ = 'wuqingqiang@gmail.com'
__version__ = 1.0
__time__ = '2012-02-12 11:14'

module = Blueprint('content', __name__, url_prefix='/content', template_folder='templates')

_security = LocalProxy(lambda: current_app.extensions['security'])


@module.route('/')
@starmap_login_required
# @roles_required('admin')
def index():
    # redirect("/static/log/index.html")
    # print request
    # print request.host_url
    #
    # print request.full_path
    #
    # print
    # print dir(request)

    # current_app.logger.error(u'请注意：出现内部错误')
    # raise Exception('ERROR123')
    # raise Exception(u'出现内部错误123456qqq')
    print current_user.username, current_user.is_authenticated()

    #todo 获取栏目列表
    return render_html('content/index.html', url_base=request.base_url, category_list=Category.get_all())


@module.route('/login')
def login():

    form_class = _security.login_form
    form = form_class()

    if form.validate_on_submit():
        login_user(form.user, remember=form.remember.data)
        after_this_request(_commit)

        if not request.json:
            return redirect(get_post_login_redirect(form.next.data))

    return render_html('content/login.html', login_user_form=form)

