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
from infopub.models.content.entry import Entry
from runkit.web.flask_ext.sql import db

__doc__ = '内容 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, Text
# from infopub.helpers.extensions import db, app, gfw


class Answer(db.Model, Entry):
    __tablename__ = 'answer'

    best_answer_id = Column(Integer, nullable=False, index=True, default=0, doc=u'最佳答案ID')
    answer_users = Column(Text, default='[]', doc=u'回答人数')
    popularity_answer_id = Column(Integer, nullable=False, index=True, default=0, doc=u'人气答案ID')

    num_supports = Column(Integer, nullable=False, default=0, doc=u'支持数')
    num_oppositions = Column(Integer, nullable=False, default=0, doc=u'反对数')

    num_thanks = Column(Integer, nullable=False, default=0, doc=u'感谢数')

    num_discuss = Column(Integer, nullable=False, default=0, doc=u'讨论/回复/回答数')
