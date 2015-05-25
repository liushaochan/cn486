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

from runkit.web.helpers import error_handlers

__doc__ = 'infopub error handle'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-06-02 2:49 PM'


def configure(app):
    error_handlers.configure(app)

