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
from infopub.bases.validators import int_value_verify
from infopub.configs.permissions import member, supervisor
from infopub.models.comment import CommentService

__doc__ = 'comments 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-19 02:25:40.197000'

from flask import request, jsonify
from flask import Blueprint
from flask.globals import g

comment = Blueprint('comment', __name__)

@comment.route('/accepted/<int:id>/')
@member.require(403)
def accepted(id):
    """
    接受
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=CommentService.accepted(id, user_id),
        data_id=id)


@comment.route('/useful/<int:id>/')
@member.require(403)
def useful(id):
    """
    无用
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=CommentService.useful(id, user_id),
        data_id=id)


@comment.route('/useless/<int:id>/')
@member.require(403)
def useless(id):
    """
    有用
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=CommentService.useless(id, user_id),
        data_id=id)


@comment.route('/supports/<int:id>/')
@member.require(403)
def supports(id):
    """
    支持
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=CommentService.supports(id, user_id),
        data_id=id)


@comment.route('/oppositions/<int:id>/')
@member.require(403)
def oppositions(id):
    """
    反对
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=CommentService.oppositions(id, user_id),
        data_id=id)


@comment.route('/comment_status/<int:id>/<int:status>')
@supervisor.require(403)
def comment_status(id, status):
    """
    设置回复状态
    """

    return jsonify(success=CommentService.comment_status(id, status),
        data_id=id)


@comment.route('/favorites/', methods=("POST",))
@member.require(401)
def favorites():
    """
    收藏 评论/回复
    """

    entry_id = request.args.get('comment_id', None)
    title = request.args.get('title', None)
    tags = request.args.get('tags', None)
    description = request.args.get('description', None)

    int_value_verify(entry_id)

    user_id = g.user.id

    return jsonify(success=CommentService.favorite(user_id, entry_id, title, tags, description),
        data_id=entry_id)


