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
from infopub.defines.result import ResultCode
from runkit.web.views.render import render_json

__doc__ = 'TODO'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-10-14 23:58'

module = Blueprint('thumbnail', __name__, url_prefix='/thumb', template_folder='templates')


@module.route('/')
def index():
    return render_json({'code': ResultCode.SUCCESS})


# todo
@module.route('/upload')
def upload():
    """
    上传一张缩略图
    :return:
    """
    return render_json({'code': ResultCode.SUCCESS})


@module.route('/get/<int:id_>')
def get(id_):
    """
    获取一张缩略图
    :return:
    """
    return render_json({'code': ResultCode.SUCCESS})


@module.route('/show/<int:id_>')
@module.route('/show/<int:id_>/<int:w>_<int:h>')
def show(id_, w=0, h=0):
    """
    显示一张缩略图
    :return:
    """
    return render_json({'code': ResultCode.SUCCESS})


@module.route('/delete/<int:id_>')
def delete(id_):
    """
    删除一张缩略图
    :return:
    """
    return render_json({'code': ResultCode.SUCCESS})
