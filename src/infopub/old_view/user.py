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
from infopub.configs.permissions import supervisor

__doc__ = 'users 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-19 02:25:39.786000'

from flask import request, flash, jsonify, redirect, url_for
from flask import Blueprint
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from werkzeug.exceptions import abort


user = Blueprint('user', __name__)

@user.route('/active/<int:id>/')
@supervisor.require(403)
def active(id):
    """
    'active'
    """

    return jsonify(success=True,
                   data_id=id)


@user.route('/banned/<int:id>/')
@supervisor.require(403)
def banned(id):
    """
    'banned'
    """

    return jsonify(success=True,
                   data_id=id)


@user.route('/silenced/<int:id>/')
@supervisor.require(403)
def silenced(id):
    """
    'silenced'
    """

    return jsonify(success=True,
                   data_id=id)


@user.route('/normal/<int:id>/')
@supervisor.require(403)
def normal(id):
    """
    'normal'
    """

    return jsonify(success=True,
                   data_id=id)