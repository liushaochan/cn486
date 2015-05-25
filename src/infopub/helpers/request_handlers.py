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

from flask import g

__doc__ = 'http请求处理'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:54'


def configure(app):
    @app.before_first_request
    def initialize():
        print("Called only once, when the first request comes in")

    @app.before_request
    def before_request():
        print 'before_request'

    @app.before_request
    def authenticate():
        print 'authenticate'
        # g.user = getattr(g.identity, 'user', None)

    # todo 不能使用
    # @app.after_request
    # def after_request():
    #     print 'after_request'

