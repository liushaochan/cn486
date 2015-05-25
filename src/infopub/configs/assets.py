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

__doc__ = 'TODO'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-05-03 22:50'

from flask.ext.assets import Bundle

css = Bundle(
    "assets/bootstrap/css/bootstrap.min.css",
    "css/style.css",
    filters="cssmin",
    output="public/css/common.css"
)

js = Bundle(
    "assets/jquery/jquery-2.0.3.min.js",
    "assets/bootstrap/js/bootstrap.min.js",
    "js/plugins.js",
    Bundle(
        "js/script.js",
        filters="jsmin"
    ),
    output="public/js/common.js"
)
