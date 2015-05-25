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

__doc__ = '邀请回答 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from flask.ext.babelex import lazy_gettext as _
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, DateTime
from infopub.helpers.extensions import db

# 数据类
class QuestionInvite(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    question_id = Column(Integer, nullable=False, doc=u'问题ID')
    sender_id = Column(Integer, nullable=False, doc=u'发送人ID')
    receiver_id = Column(Integer, nullable=False, doc=u'接收人ID')
    invite_type = Column(Integer, nullable=False, default=0, doc=u'邀请类型')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')

    @property
    def word_type_name(self):
        return [_("contain"), _("equal"), _("regex")][self.word_type]

    @property
    def word_group_name(self):
        return [_("sensitive"), _("advert"), _("spam"), _("sex")][self.word_group]

    @property
    def process_type_name(self):
        return [_("replace"), _("check pending")][self.process_type]

    def __unicode__(self):
        return self.word

    def __repr__(self):
        return self.id


class QuestionInviteService(object):
    @staticmethod
    def get_by_id(id):
        # ['username', 'nickname', 'email', 'homepage']
        return QuestionInvite.query.filter(QuestionInvite.id == id).first()

    @staticmethod
    def word_allowed(word):
        return True