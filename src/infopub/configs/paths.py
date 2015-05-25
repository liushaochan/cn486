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

import os

__doc__ = '项目中用的路径'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-02-09 16:06'

# 获取app根目录
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
LOGS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../logs/'))
WEB_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../webroot/'))

UPLOADS_PATH = os.path.join(WEB_ROOT, 'uploads')

MEDIA_ROOT = os.path.join(WEB_ROOT, 'media')
STATIC_ROOT = os.path.join(WEB_ROOT, 'static')
ASSETS_ROOT = os.path.join(WEB_ROOT, 'assets')
USER_AVATAR_UPLOAD_FOLDER = os.path.join(UPLOADS_PATH, 'avatar')
