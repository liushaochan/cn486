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
from flask import Blueprint, request
from infopub.defines.result import ResultCode
from infopub.models.category import Category
from runkit.web.views.render import render_json

__doc__ = '内容（文章、新闻等）的创建/编辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2013-02-14 23:33'


module = Blueprint('entry_api', __name__, url_prefix='/api/v1/entry', template_folder='templates')


@module.route('/')
def index():
    return render_json({'code': ResultCode.SUCCESS})


@module.route('create', methods=("POST", ))
# @member_login_required
def create():
    """
    创建新的文章
    http://127.0.0.1:5000/entry/v1/create?category_id=1

    @param category_id:
    @return:
    """

    try:
        category_id = int(request.args.get('category_id', 0))
    except:
        return render_json({'code': ResultCode.FAILED, 'message': u'category_id无效'})

    category = Category.get_by_id(category_id)

    if not category:
        return render_json({'code': ResultCode.FAILED, 'message': u'没有有效的分类/栏目'})

    # 处理各类权限
    # if category.show_role:
    #     if not g.user or category.show_role > g.user.role:
    #         abort(404)
    #

    FormClass = globals()[ENTRY_TYPE_FORM_CLASSNAME[category.entry_type.code]]
    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]
    form = FormClass(request.form, next=request.args.get('next', None),
                        entry_type=category.entry_type)

    if request.method == 'GET':
        return render_json({'code': ResultCode.FAILED, 'message': u'仅支持POST请求'})

    if form.validate():
        # 获取指定的表单数据
        entry = ModelClass()
        form.populate_obj(entry)

        is_draft = False

        if form.draft.data:
            is_draft = True

        # print category.to_dict()
        # todo user.id
        if not ModelClass.add_or_update(category, entry, is_draft, True):
            return render_json({'code': ResultCode.FAILED, 'message': u'add_or_update error'})

        return render_json({'code': ResultCode.SUCCESS, 'data': entry})
    elif form.errors:
        if __debug__:
            print "form errors", form.validate()

        _list = []
        for error_name, error_value in form.errors.iteritems():
            if __debug__:
                print "error: %s %s" % (error_name, error_value)
            _list.append((error_name, error_value))

        return render_json({'code': ResultCode.SYSTEM_ERROR, 'message': _list})


@module.route('/edit', methods=("POST", ))
# @member_login_required
def edit():
    # http://127.0.0.1:5000/entry/edit?category_id=1&entry_id=1
    # int_value_verify(id)

    try:
        category_id = int(request.args.get('category_id', 0))
    except:
        return render_json({'code': ResultCode.FAILED, 'message': u'category_id无效'})

    category = Category.get_by_id(category_id)

    if not category:
        return render_json({'code': ResultCode.FAILED, 'message': u'没有有效的分类/栏目'})

    # 处理各类权限
    # if category.show_role:
    #     if not g.user or category.show_role > g.user.role:
    #         abort(404)
    #

    if request.method == 'GET':
        return render_json({'code': ResultCode.FAILED, 'message': u'仅支持POST请求'})

    FormClass = globals()[ENTRY_TYPE_FORM_CLASSNAME[category.entry_type.code]]
    ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[category.entry_type.code]]

    try:
        entry_id = int(request.args.get('entry_id', 0))
    except:
        return render_json({'code': ResultCode.DATA_NOT_EXIST, 'message': u'内容数据不存在, entry_id: %d' %
                                                                          request.args.get('entry_id', 0)})

    entry = ModelClass.get_by_id(entry_id)
    if not entry:
        return render_json({'code': ResultCode.DATA_NOT_EXIST, 'message': u'内容数据不存在, class: %s, entry_id: %d' %
                                                                          (ModelClass.__tablename__, entry_id)})

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

    form = FormClass(request.form, next=request.args.get('next', None), entry_type=category.entry_type)

    if form.validate():
        form.populate_obj(entry)

        is_draft = False

        if form.draft.data:
            is_draft = True

        if not ModelClass.add_or_update(category, entry, is_draft, True):
            return render_json({'code': ResultCode.FAILED, 'message': u'add_or_update error'})

        return render_json({'code': ResultCode.SUCCESS, 'data': entry})
    elif form.errors:
        _list = []
        for error_name, error_value in form.errors.iteritems():
            if __debug__:
                print "error: %s %s" % (error_name, error_value)
            _list.append((error_name, error_value))

        return render_json({'code': ResultCode.SYSTEM_ERROR, 'message': _list})
