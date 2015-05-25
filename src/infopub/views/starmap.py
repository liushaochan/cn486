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
import datetime

from flask.ext.login import current_user
from flask.ext.security.views import _commit
from flask import Blueprint, request, flash, after_this_request, redirect
from infopub.forms.software import SoftwareForm
from infopub.models.category import Category
from infopub.models.content.entry import Entry
from infopub.utils.login import member_login_required, starmap_login_required
from flask import render_template, current_app
from flask.ext.security import login_user
from flask.ext.security.utils import get_post_login_redirect
from runkit.humanize.localtime import datetime_to_int
from runkit.web.views.render import render_html, render_json
from werkzeug.local import LocalProxy
from flask.ext.babelex import gettext as _

__doc__ = '星球管理员入口'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2013-02-14 23:33'


module = Blueprint('starmap', __name__, url_prefix='/starmap', template_folder='templates')
_security = LocalProxy(lambda: current_app.extensions['security'])
# 获取全部的栏目信息：名称、....


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

    return render_html('content/index.html', url_base=request.base_url)


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


@module.route('/create', methods=("POST", "GET"))
@member_login_required
def create():
    """
    创建新的文章
    @param category_id:
    @return:
    """

    new_templates = 'entry/create.html'
    form = SoftwareForm(request.form, next=request.args.get('next', None), entry_type=1)

    if request.method == 'POST' and form.validate():
        # 获取指定的表单数据
        entry = Entry()
        form.populate_obj(entry)
        category = Category.get_by_id(int(1))

        is_draft = False

        #if form.draft.data:
        #    is_draft = True
        print entry.title
        if not Entry.add_or_update(category, entry, is_draft, True):
            flash(_("Internal error"), "failed")
            return render_template(new_templates, form=form, category=category, current_category=category)

        flash(_("Create success"), "success")

        #next_url = form.next.data

        # todo wqq: 这里能否不做跳转，送回json数据返回ID号，由前端去做处理
        #if not next_url or next_url == request.path:
        #    next_url = url_for('portal.entry', slug=entry.slug)

        return render_json({"success": "true", "id":        entry.id})
    elif form.errors:
        print "oooooooooooooooooooooooooooo", form.validate()
        for error_name, error_value in form.errors.iteritems():
            print "error: %s %s" % (error_name, error_value)
        flash(_("Cause an error"), "failed")
    return render_html(new_templates, form=form)


def row2dict1(row):
    d = {}
    for columnName in row.__table__.columns.keys():
        v = getattr(row, columnName)
        if isinstance(v, datetime.datetime):
            v = datetime_to_int(v)
        d[columnName] = v

@module.route('/list/<int:page>', methods=("POST", "GET"))
@member_login_required
def get_list(page):
    # GET /entry/list/1/20.html
    _total, _pages, _list = Entry.get_page_by_category(1, "", "", "id", "DESC", 1)

    return render_json({"list": _list, "total": _total, "page": page, "page_size": 20})
