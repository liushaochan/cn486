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
from infopub.bases.localtime import sys_now
from infopub.configs.admin import PermissionView

__doc__ = '用户追随、关注 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, DateTime
from infopub.helpers.extensions import db

# 数据类
class UserFollow(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    from_user_id = Column(Integer, nullable=False, doc=u'跟随者')
    to_user_id = Column(Integer, nullable=False, doc=u'关注的人')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    def __unicode__(self):
        return '%d' % self.id

    def __repr__(self):
        return self.id


class UserFollowService(object):
    @staticmethod
    def get_by_id(id):
        # ['username', 'nickname', 'email', 'homepage']
        return UserFollow.query.filter(UserFollow.id == id).first()
