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


class Article(db.Model, Entry):
    __tablename__ = 'article'

    scores = Column(Integer, nullable=False, default=0, doc=u'分数')
    difficulty = Column(Integer, nullable=False, default=0, doc=u'深浅度')

    num_useful = Column(Integer, nullable=False, default=0, doc=u'有用数')
    num_useless = Column(Integer, nullable=False, default=0, doc=u'无用数')

    num_discuss = Column(Integer, nullable=False, default=0, doc=u'讨论/回复/回答数')
