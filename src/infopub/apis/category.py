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
from infopub.forms.category import CategoryForm

from infopub.forms.user import UserForm

from flask import Blueprint, abort, request
from jinja2 import TemplateNotFound
from flask import Flask, render_template, current_app
from flask.ext.mail import Mail
from flask.ext.security import login_required, roles_required, roles_accepted
from flask.ext.security.decorators import http_auth_required, \
     auth_token_required, auth_required
from flask.ext.security.utils import encrypt_password
from infopub.models.category import Category
from infopub.utils.login import member_login_required
from runkit.web.utils.views import get_query_info
from runkit.web.views.render import render_html, render_json
from werkzeug.local import LocalProxy

__doc__ = '网站账户view'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2013-02-14 23:33'


module = Blueprint('category_api', __name__, url_prefix='/api/v1/category/', template_folder='templates')

# 获取全部的栏目信息：名称、....


@module.route('/')
def index():
    return 'OK'


@module.route('/create', methods=("POST",))
@member_login_required
def create():
    """
    创建栏目
    """
    # curl 'http://127.0.0.1:5000/category/v1/create'

    form = CategoryForm(request.form)
    model = Category()
    form.populate_obj(model)
    model.save()

    return render_json({"code": 0})


@module.route('/<int:page>_<int:page_size>.json', methods=("POST", "GET"))
# @member_login_required
def get_list(page=1, page_size=20):
    """
    获取栏目列表
    :param page:        指定页
    :param page_size:   每页的条目数

    :param q:   查询关键词
    :param s:   排序字段
    :param o:   排序次序（asc、desc）
    :return:
    """
    # GET /category/v1/1_20.json
    # curl 'http://127.0.0.1:5000/category/v1/1_20.json?q=www&s=created_at&o=asc'

    query, sort, order = get_query_info(request)

    _total, _pages, _list = Category.get_page_with_query(query, sort, order, page, page_size)

    print _total, _pages
    print _list

    return render_json({"data_list": _list, "total": _total, "page": page, "page_size": page_size})
