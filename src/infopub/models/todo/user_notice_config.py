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
from infopub.configs.admin import PermissionView

__doc__ = '通告用户的配置 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, Boolean, DateTime
from infopub.helpers.extensions import db
from infopub.bases.localtime import sys_now

# 数据类
class UserNoticeConfig(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    user_id = Column(Integer, nullable=False, doc=u'发送人ID')
    concerned_me = Column(Boolean, nullable=False, default=True, doc=u'有人关注了我')
    asked_me_question = Column(Boolean, nullable=False, default=True, doc=u'有人问了我一个问题')
    invite_me_question = Column(Boolean, nullable=False, default=True, doc=u'有人邀请我回答一个问题')
    with_new_answer = Column(Boolean, nullable=False, default=True, doc=u'我关注的问题有了新答案')
    have_private_message = Column(Boolean, nullable=False, default=True, doc=u'有人向我发送私信')
    send_email = Column(Boolean, nullable=False, default=True, doc=u'发送邮件')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')


    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id


class UserNoticeConfigService(object):
    @staticmethod
    def get_list_for_show():
        return []#self.get_list()