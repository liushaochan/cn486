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

from flask import request, flash, jsonify, redirect, url_for
from flask import Blueprint
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from infopub.defines.result import ResultCode
from runkit.web.views.render import render_json
from werkzeug.exceptions import abort
from infopub.models.tag import Tag
from runkit.data.serialization import json_encode

__doc__ = 'tag 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-19 02:25:40.302000'


module = Blueprint('tag', __name__, url_prefix='/tag', template_folder='templates')


@module.route("/")
@module.route("/index-<int:page>.html")
def index(page=1):
    tags_list = []
    page_total = 1

    return render_template("tags/hot_tags.html", tags_list=tags_list, page_total=page_total, current_page=page)


@module.route('/tag_name.json')
def tag_name_ajax():
    list = []

    result = Tag.query.filter_by().order_by('tag_name desc').all()

    for c in result:
        list.append({'id':c.id, 'tag_name':c.tag_name})

    return json_encode(list)

@module.route("/add/<tag>")
def add_tag(tag):
    """
    快速加一个tag
    @param tag:
    @return:
    """

    tag = Tag.add_tag(tag)
    return jsonify(success=True, tag=tag)


@module.route('/v1/create', methods=("POST", ))
# @member_login_required
def create_v1():
    tag_name = request.form.get('tag_name', '')
    slug = request.form.get('slug', '')

    print '212121', tag_name, slug
    tag = Tag.add_tag(tag_name, slug)

    return render_json({'code': ResultCode.SUCCESS, 'data': tag})

@module.route('/v1/edit', methods=("POST", ))
# @member_login_required
def edit_v1():
    # http://127.0.0.1:5000/tag/v1/edit?tag_id=1
    # curl 'http://127.0.0.1:5000/tag/v1/edit?tag_id=1' -d 'tag_name=test1&slug=test1'

    tag_id = request.args.get('tag_id', '')

    tag_name = request.form.get('tag_name', '')
    slug = request.form.get('slug', '')

    print '212121', tag_name, slug
    tag = Tag.get_by_id(tag_id)
    tag.tag_name = tag_name
    tag.slug = slug
    tag.save()
    # tag = Tag.add_tag(tag_name, slug)

    return render_json({'code': ResultCode.SUCCESS, 'data': tag.to_dict()})
