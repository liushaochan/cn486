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
from runkit.system.named_constants import Constants

__doc__ = '分类/栏目常量定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-08-17 22:27'


class CategoryType(Constants):
    inside = 1
    link = 2

CATEGORY_TYPES_CHOICES = [
    (CategoryType.inside, u'普通栏目'),
    (CategoryType.link, u'链接栏目')
]


class CategoryStatus(Constants):
    open = 1
    lock = 2
    disable = 3

CATEGORY_STATUS_CHOICES = [
    (CategoryStatus.open, u'开放'),
    (CategoryStatus.lock, u'锁定'),
    (CategoryStatus.disable, u'禁用')
]


class AuditType(Constants):
    not_need = 1
    need = 2

AUDIT_TYPES_CHOICES = [
    (AuditType.not_need, u'不需要'),
    (AuditType.need, u'需要')
]


class ReadPermission(Constants):
    unrestraint = 1
    registered = 2
    specified = 3

READ_PERMISSION_CHOICES = [
    (ReadPermission.unrestraint, u'无限制'),
    (ReadPermission.registered, u'注册用户'),
    (ReadPermission.specified, u'指定角色')
]


class PostPermission(Constants):
    not_post = 1
    registered = 2
    specified = 3

POST_PERMISSION_CHOICES = [
    (PostPermission.not_post, u'不能发布'),
    (PostPermission.registered, u'注册用户'),
    (PostPermission.specified, u'指定角色')
]
