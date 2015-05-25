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
from sqlalchemy.types import Integer
# from infopub.helpers.extensions import db, app, gfw


class Forum(db.Model, Entry):
    __tablename__ = 'forum'

    best_answer_id = Column(Integer, nullable=False, index=True, default=0, doc=u'最佳答案ID')

    num_discuss = Column(Integer, nullable=False, default=0, doc=u'讨论/回复/回答数')

    #消费金币/银币
    consume_gold_cost = Column(Integer, default=0, doc=u'消费金牌数')
    consume_silver_cost = Column(Integer, default=0, doc=u'消费银牌数')

    #赏金金币/银币
    reward_gold_cost = Column(Integer, default=0, doc=u'赏金（金牌）')
    reward_silver_cost = Column(Integer, default=0, doc=u'赏金（银牌）')

