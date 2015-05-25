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

__doc__ = '分类与内容关系 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer
from infopub.helpers.extensions import db

# 数据类
class CategoryEntryRelation(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    category_id = Column(Integer, nullable=False, index=True, doc=u'分类ID')
    entry_id = Column(Integer, nullable=False, index=True, doc=u'主体ID')
    entry_type = Column(Integer, nullable=False, index=True,
                        doc=u'类型：0-文章、1-快讯、2-代码、3-软件、4-讨论、5-问答、6-小贴士、7-图集、8-视频、9-音频、10-链接、11-引语、12-状态、13-文档、14-聊天、15-随笔、16-专辑')

    def add_relation(self, category_id, entry_id):
        pass

    def del_relation(self, category_id, entry_id):
        pass

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id
