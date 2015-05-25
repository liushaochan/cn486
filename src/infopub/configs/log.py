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

import logging

__doc__ = '日志配置'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2014-04-06 3:09 PM'

LOG_PATH = '/work/jcing/logs/cn486/'
LOG_FOEMAT_PREFIX = '[%(levelname)1.1s %(asctime)s] %(module)s:%(lineno)d'
LOG_LEVEL = logging.NOTSET

LOG_DB_COLLECTION = 'logging_srv'
LOG_DB_LEVEL = None

LOG_DB_HOST = None
LOG_DB_PORT = None
LOG_DB_NAME = None