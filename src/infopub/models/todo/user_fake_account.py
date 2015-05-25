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
from infopub.helpers.sql import db
from sqlalchemy.sql.expression import and_
from infopub.bases.localtime import sys_now

__doc__ = '马甲 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime

# 数据类
class UserFakeAccount(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')
    user_id = Column(Integer, nullable=False, index=True, doc=u'用户编码')
    fake_account_id = Column(Integer, nullable=False, index=True, doc=u'马甲编码')
    fake_account_name = Column(String(50), nullable=False, doc=u'马甲名称')
    fake_account_email = Column(String(50), nullable=False, doc=u'邮箱')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id


class UserFakeAccountService(object):
    @staticmethod
    def get_by_user_id(user_id):
        return UserFakeAccount.query.filter(UserFakeAccount.user_id == user_id).all()

    @staticmethod
    def check_exist(user_id, fake_account_id):
        return UserFakeAccount.query.filter(
            and_(UserFakeAccount.user_id == user_id, UserFakeAccount.fake_account_id == fake_account_id)).count() > 0

    @staticmethod
    def get_by_fake_account_id(fake_account_id):
        return UserFakeAccount.query.filter(UserFakeAccount.fake_account_id == fake_account_id).first()

    @staticmethod
    def add(user_id, fake_account_id, fake_account_name, email):
        a = UserFakeAccount()
        a.user_id = user_id
        a.fake_account_id = fake_account_id
        a.fake_account_name = fake_account_name
        a.fake_account_email = email
        a.created_time = sys_now()
        a.updated_time = a.created_time

        db.session.add(a)
        db.session.commit()
