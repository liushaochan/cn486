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
from infopub.models.category import Category
from infopub.models.content.software import Software
from infopub.models.tag import Tag
from runkit.humanize.localtime import sys_now
from runkit.web.utils.views import get_remote_ip

__doc__ = '配置API'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:04'

from infopub.models.user import User
from flask import current_app
from werkzeug.local import LocalProxy

ds = LocalProxy(lambda: current_app.extensions['security'].datastore)


def get_single_preprocessor(instance_id=None, **kw):
    """Accepts a single argument, `instance_id`, the primary key of the
    instance of the model to get.

    """
    print 'success' if ds.find_role('bogus') is None else 'failure'
    print 'get_single_preprocessor: ', instance_id

    return True


def get_many_preprocessor(search_params=None, **kw):
    """Accepts a single argument, `search_params`, which is a dictionary
    containing the search parameters for the request.

    """
    # if current_user and current_user.is_authenticated() and current_user.has_role('admin'):
    #     print current_user.email
    # else:
    #     raise ProcessingException(description='Not Authorized',
    #                               code=401)

    # print '11111111111111'
    # print '11111111111111'
    # print '11111111111111'
    # print '11111111111111'
    # print '@@@@@@@@@@@@@@@@@get_many_preprocessor: ', search_params, kw
    # print current_app
    # print current_user
    # print request.headers
    return True


def patch_single_preprocessor(instance_id=None, data=None, **kw):
    """Accepts two arguments, `instance_id`, the primary key of the
    instance of the model to patch, and `data`, the dictionary of fields
    to change on the instance.

    """
    print 'patch_single_preprocessor: ', instance_id
    return True


def patch_many_preprocessor(search_params=None, data=None, **kw):
    """Accepts two arguments: `search_params`, which is a dictionary
    containing the search parameters for the request, and `data`, which
    is a dictionary representing the fields to change on the matching
    instances and the values to which they will be set.

    """
    print 'get_many_preprocessor: ', search_params
    return True


def post_preprocessor(data=None, **kw):
    """Accepts a single argument, `data`, which is the dictionary of
    fields to set on the new instance of the model.

    """
    print 'get_many_preprocessor: ', data, kw
    print 'get_many_preprocessor: ', data, kw
    print 'get_many_preprocessor: ', data, kw
    print 'get_many_preprocessor: ', data, kw
    print 'get_many_preprocessor: ', data, kw
    print 'get_many_preprocessor: ', data, kw

    data['created_ip'] = get_remote_ip()
    data['upward_time'] = sys_now().strftime('%Y-%m-%d @ %I:%M %p')
    return True


def delete_preprocessor(instance_id=None, **kw):
    """Accepts a single argument, `instance_id`, which is the primary key
    of the instance which will be deleted.

    """
    print 'delete_preprocessor: ', instance_id
    return True


def configure(manager):
    manager.create_api(Category, methods=['GET'], url_prefix='/api/v1',
                       preprocessors={
                           'GET_SINGLE': [get_single_preprocessor],
                           'GET_MANY': [get_many_preprocessor],
                           'PATCH_SINGLE': [patch_single_preprocessor],
                           'PATCH_MANY': [patch_many_preprocessor],
                           'POST': [post_preprocessor],
                           'DELETE': [delete_preprocessor]
                       })

    manager.create_api(Software, methods=['GET'], url_prefix='/api/v1',
                       preprocessors={
                           'GET_SINGLE': [get_single_preprocessor],
                           'GET_MANY': [get_many_preprocessor],
                           'PATCH_SINGLE': [patch_single_preprocessor],
                           'PATCH_MANY': [patch_many_preprocessor],
                           'POST': [post_preprocessor],
                           'DELETE': [delete_preprocessor]
                       })

    manager.create_api(Tag, methods=['GET'],  url_prefix='/api/v1')

    manager.create_api(User, methods=['GET', 'POST', 'DELETE'], url_prefix='/api/v1',
                       exclude_columns=['password', 'user_detail'],
                       preprocessors={
                           'GET_SINGLE': [get_single_preprocessor],
                           'GET_MANY': [get_many_preprocessor],
                           'PATCH_SINGLE': [patch_single_preprocessor],
                           'PATCH_MANY': [patch_many_preprocessor],
                           'POST': [post_preprocessor],
                           'DELETE': [delete_preprocessor]
                       })
