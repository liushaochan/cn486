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

from infopub.defines.entry import ENTRY_TYPE_MODEL_CLASSNAME, ENTRY_TYPE_FORM_CLASSNAME
from flask import Blueprint, abort, request, flash, url_for, redirect
from infopub.defines.result import ResultCode
from infopub.models.category import Category
from infopub.utils.login import member_login_required
from flask import render_template
from runkit.web.views.render import render_html, render_json
from flask.ext.babelex import gettext as _

__doc__ = '内容（文章、新闻等）的创建/编辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2013-02-14 23:33'


module = Blueprint('entry', __name__, url_prefix='/entry', template_folder='templates')


@module.route('/')
def index():
    return render_json({'code': ResultCode.SUCCESS})


@module.route('/create', methods=("POST", "GET"))
@member_login_required
def create():
    """
    创建新的文章
    http://127.0.0.1:5000/entry/create?category_id=1

    @param category_id:
    @return:
    """

    try:
        category_id = int(request.args.get('category_id', 0))
    except:
        category_id = 0
        abort(404)

    category = Category.get_by_id(category_id)

    if not category:
        abort(404)

    # 处理各类权限
    # if category.show_role:
    #     if not g.user or category.show_role > g.user.role:
    #         abort(404)
    #

    new_templates = category.create_template

    FormClass = globals()[ENTRY_TYPE_FORM_CLASSNAME[category.entry_type.code]]
    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]
    form = FormClass(request.form, next=request.args.get('next', None),
                        entry_type=category.entry_type)

    if request.method == 'POST':
        if form.validate():
            # 获取指定的表单数据
            entry = ModelClass()
            form.populate_obj(entry)

            is_draft = False

            if form.draft.data:
                is_draft = True

            if not ModelClass.add_or_update(category, entry, is_draft, True):
                flash(_("Internal error"), "failed")
                return render_template(new_templates, form=form, category=category, current_category=category)

            flash(_("Create success"), "success")

            next_url = form.next.data

            if not next_url or next_url == request.path:
                print 'category.slug: ', category.slug
                print 'entry.slug: ', entry.slug
                next_url = url_for('frontend.show', category_slug=category.slug, entry_slug=entry.slug)

            return redirect(next_url)
        elif form.errors:
            if __debug__:
                print "form errors", form.validate()

            for error_name, error_value in form.errors.iteritems():
                if __debug__:
                    print "error: %s %s" % (error_name, error_value)

            flash(_("Cause an error"), "failed")

    return render_html(new_templates, form=form)


@module.route('/edit', methods=("POST", "GET"))
@member_login_required
def edit():
    # http://127.0.0.1:5000/entry/edit?category_id=1&entry_id=1
    # int_value_verify(id)

    try:
        category_id = int(request.args.get('category_id', 0))
    except:
        category_id = 0
        abort(404)

    category = Category.get_by_id(category_id)

    if not category:
        abort(404)

    # 处理各类权限
    # if category.show_role:
    #     if not g.user or category.show_role > g.user.role:
    #         abort(404)
    #

    FormClass = globals()[ENTRY_TYPE_FORM_CLASSNAME[category.entry_type.code]]
    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]

    try:
        entry_id = int(request.args.get('entry_id', 0))
    except:
        entry_id = 0
        abort(404)

    entry = ModelClass.get_by_id(entry_id)
    if not entry:
        abort(404)

    # if entry.author.id != g.user.id and not g.user.is_supervisor:
    #     abort(404)
    #
    # if entry.entry_status != EntryStatus.published and not g.user.is_supervisor:
    #     abort(404)
    #
    # if entry.category.show_role:
    #     if not g.user or entry.category.show_role > g.user.role:
    #         abort(404)

    category = entry.category

    edit_template = category.edit_template

    if request.method == 'GET':
        form = FormClass(next=request.args.get('next', None), id=entry_id, obj=entry)
    else:
        form = FormClass(next=request.args.get('next', None), id=entry_id)
        if form.validate():
            form.populate_obj(entry)

            is_draft = False

            if form.draft.data:
                is_draft = True

            if not ModelClass.add_or_update(category, entry, is_draft, True):
                flash(_("Internal error"), "failed")
                return render_template(edit_template, form=form, form_id=entry_id, category=category, entry_type=entry.entry_type, current_category=category)

            next_url = form.next.data

            if not next_url or next_url == request.path:
               next_url = url_for('frontend.show', category_slug=category.slug, entry_slug=entry.slug)

            return redirect(next_url)
        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    return render_template(edit_template, form=form, form_id=entry_id, category=category, entry_type=entry.entry_type, current_category=category)


