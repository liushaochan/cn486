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

__doc__ = "账户的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

from flask.ext.principal import RoleNeed, Permission

# 高级管理员
administrator = Permission(RoleNeed('administrator'))

# 管理员
supervisor = Permission(RoleNeed('supervisor'))

# 高级编辑
senior_editor = Permission(RoleNeed('senior_editor'))

# 责任编辑
executive_editor = Permission(RoleNeed('executive_editor'))

# 主编
chief_editor = Permission(RoleNeed('chief_editor'))

# 编辑
editor = Permission(RoleNeed('editor'))

# 版主、仲裁者
moderator = Permission(RoleNeed('moderator'))

# 合作伙伴
partner = Permission(RoleNeed('partner'))

# 认证会员
verified_member = Permission(RoleNeed('verified'))

# 普通会员
member = Permission(RoleNeed('member'))

# this is assigned when you want to block a permission to all
# never assign this role to anyone !
null = Permission(RoleNeed('null'))
