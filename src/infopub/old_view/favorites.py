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
from flask.globals import g
from infopub.bases.flask_ext import query_condition
from infopub.bases.model_base import PER_PAGE
from infopub.models.favorites import FavoritesService

__doc__ = 'favorites 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-03-07 08:58:06.591000'

from flask import request, flash, jsonify, redirect, url_for
from flask import Blueprint
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from werkzeug.exceptions import abort

from infopub.bases.validators import int_value_verify

from infopub.configs.permissions import supervisor, member


favorites = Blueprint('favorites', __name__)

@favorites.route('/cancel/<int:id>/', methods=("GET","POST"))
@member.require(403)
def cancel(id):
    """
    删除 favorites
    返回 删除的记录数
    """

    int_value_verify(id)

    return jsonify(success=FavoritesService.cancel_by_id(id, g.user.id),
        data_id=id)
