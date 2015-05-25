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

__doc__ = '返回结果 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-08-1 14:16:55.049000'


class ResultCode(object):



    def __init__(self):
        pass

    SUCCESS = 0                 # 成功
    FAILED = 1                  # 失败
    SYSTEM_ERROR = 2            # 系统内部错误

    DATA_EXISTED = 100          # 数据已经存在
    DATA_NOT_EXIST = 101        # 数据不存在
