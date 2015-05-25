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
from math import ceil
from infopub.bases.flask_ext import query_condition
from infopub.models.notice import NoticeService

__doc__ = 'notice 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-03-07 08:58:06.487000'

from flask import request, flash, jsonify, redirect, url_for
from flask import Blueprint
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from werkzeug.exceptions import abort
from infopub.bases.model_base import PER_PAGE

from infopub.bases.validators import int_value_verify


notice = Blueprint('notice', __name__)


@notice.route("/<int:page>.json")
def json(page=1):
    """
    显示 notice 列表
    """

    int_value_verify(page)

    query, sort, order, page = query_condition()

    # todo
    # query['notice_status'] = 1

    notice_list = [] # NoticeService.get_page(query, _fields, page, PER_PAGE, sort, order)

    count = 0 # notice_srv.count(query)

    page_total = int(ceil(count / float(PER_PAGE)))

    return jsonify(notice_list=notice_list, page_total=page_total, current_page=page)