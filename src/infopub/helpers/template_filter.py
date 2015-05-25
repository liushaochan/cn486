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

from runkit.web.helpers import template_filter

__doc__ = '模板中使用的过滤器'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-12 11:27'


def configure(app):
    template_filter.configure(app)

    @app.template_filter()
    def demo(value):
        return 'DEMO: ' + value
