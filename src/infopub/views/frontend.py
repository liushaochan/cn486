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

import os

from flask import request, render_template
from flask import send_from_directory, current_app
from infopub.defines.entry import ENTRY_TYPE_FORM_CLASSNAME, ENTRY_TYPE_MODEL_CLASSNAME
from infopub.models.category import Category
from infopub.utils.login import member_login_required
from flask import Blueprint, abort
from runkit.web.utils.views import get_query_info
from runkit.web.views.render import render_html, render_json


# 不要移除

__doc__ = 'home'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-12 11:14'

module = Blueprint('frontend', __name__)


@module.route('/')
def index():
    return render_html('portal/home.html', category_slug="home", url_base=request.base_url)


@module.route('/sc.html')
def sc():
    return render_html('portal/sc.html', category_slug="psd", url_base=request.base_url)


@module.route('/lg.html')
def lg():
    return render_html('portal/lg.html', category_slug="app", url_base=request.base_url)


@module.route('/bz.html')
def bz():
    return render_html('portal/bz.html', category_slug="Cartoon_wallpaper", url_base=request.base_url)


@module.route('/test.html')
def test():
    return render_html('portal/test.html', url_base=request.base_url)


@module.route('/t2.html')
def t2():
    return render_html('portal/t2.html', url_base=request.base_url)


@module.route('/t3.html')
def t3():
    return render_html('portal/t3.html', url_base=request.base_url)


@module.route('/home')
def home():
    return render_html('portal/home.html')


@module.route('/about')
def about():
    return render_html('portal/about.html')


@module.route('/rss')
@member_login_required
def rss():
    return 'rss index'


# @roles_accepted('admin', 'developer')
@module.route('/template_files/<path:filename>')
def template_files(filename):
    template_path = os.path.join(current_app.root_path,
                                 current_app.template_folder)
    return send_from_directory(template_path, filename)


@module.route('/media/<path:filename>')
def media(filename):
    return send_from_directory(current_app.config.get('MEDIA_ROOT'), filename)


def render_entry(request):
    print request.path
    path = request.path
    base_path = os.path.basename(path)
    print request.full_path
    print path, base_path

    return 'render_entry path: %s - %s' % (path, base_path)


def render_category(request):
    print request.path
    path = request.path
    base_path = os.path.split(path)
    print request.full_path
    print path, base_path

    return 'render_category path: %s' % path


@module.route('/', defaults={'path': ''})
@module.route('/<path:path>')
def catch_all(path):
    base_path = os.path.basename(path)

    if not base_path:
        return render_category(request)
    else:
        return render_entry(request)


@module.route('/<category_slug>/<path:entry_slug>.html')
#@cache.cached(timeout=10)
def show(category_slug, entry_slug):
    """
    显示内容（文章，etc）
    @param slug:
    @return:
    """

    category = Category.get_by_slug(category_slug)

    if not category:
        abort(404)

    FormClass = globals()[ENTRY_TYPE_FORM_CLASSNAME[category.entry_type.code]]
    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]

    entry = ModelClass.query.filter_by(slug=entry_slug).first()

    if entry is None:
        abort(404)

    # # todo g.user.is_supervisor
    # if entry.entry_status != EntryStatus.published:
    #     if g.user and not g.user.is_supervisor:
    #         return render_template('common/entry_pending.html')
    #
    # if entry.category.show_role:
    #     if not g.user or entry.category.show_role > g.user.role:
    #         abort(404)
    #
    # query, sort, order, page = query_condition()
    #
    #
    #
    # return render_show(entry, sort, order, page)
    category = entry.category

    show_template = category.show_template

    return render_template(
        show_template,
        current_category=entry.category,
        category_slug=entry.category,
        entry=entry,
        page_url=entry.slug,
    )


@module.route('/<category_slug>', methods=("POST", "GET"))
@module.route('/<category_slug>/<int:page>_<int:page_size>.html', methods=("POST", "GET"))
# @member_login_required
def show_list(category_slug, page=1, page_size=20):
    """
    显示指定栏目下的内容列表
    :param category_slug:
    :param page:
    :param page_size:
    :return:
    """
    # GET /software/1/1_20
    # curl 'http://127.0.0.1:5000/software/1_20.html?q=www&s=created_at&o=asc'

    query, sort, order = get_query_info(request)

    category = Category.get_by_slug(category_slug)

    if not category:
        abort(404)

    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]

    _total, _pages, _list = ModelClass.get_page_by_category_id(category.id, sort, order, page, page_size)

    return render_html(category.list_template, data_list=_list, category_slug=category_slug, total=_total, page=page, page_size=page_size)


@module.route('/<category_slug>/<int:page>_<int:page_size>.json', methods=("POST", "GET"))
# @member_login_required
def get_list(category_slug, page=1, page_size=20):
    """
    获取指定栏目下的内容列表
    :param category_slug:
    :param page:
    :param page_size:
    :return:
    """
    # GET /entry/1/1_20.html
    # curl 'http://127.0.0.1:5000/software/1_20.json?q=www&s=created_at&o=asc'

    query, sort, order = get_query_info(request)

    category = Category.get_by_slug(category_slug)

    if not category:
        abort(404)

    # 通过反射获得数据类
    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]

    _total, _pages, _list = ModelClass.get_page_by_category_id(category.id, sort, order, page, page_size)

    return render_json({"data_list": _list, "total": _total, "page": page, "page_size": page_size})

