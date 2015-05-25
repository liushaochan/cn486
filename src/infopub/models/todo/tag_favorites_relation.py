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

__doc__ = '标签与内容关系 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer
from infopub.helpers.extensions import db

# 数据类
class TagFavoritesRelation(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    entry_type = Column(Integer, nullable=False,
                        doc=u'类型：0-文章、1-快讯、2-代码、3-软件、4-讨论、5-问答、6-小贴士、7-图集、8-视频、9-音频、10-链接、11-引语、12-状态、13-文档、14-聊天、15-随笔')
    entry_id = Column(Integer, nullable=False, index=True, doc=u'主体ID')
    tag_id = Column(Integer, nullable=False, index=True, doc=u'标签ID')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

# 数据管理类
class TagFavoritesRelationAdmin(PermissionView):
    # 列表视图可见列
    # list_columns = ('title', 'user')

    # 列表视图不可见列
    # excluded_list_columns = ['content']

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    # sortable_columns = ('title', ('user', User.username), 'date')

    # 列表视图 列名别名
    # rename_columns = dict(title=u'Post Title')

    # 定义搜索列
    # column_searchable_list = ('title', User.username)

    # 定义过滤列
    # column_filters = ('user',
    #                  'title',
    #                  'date',
    #                  filters.FilterLike(Post.title, 'Fixed Title', options=(('test1', 'Test 1'), ('test2', 'Test 2'))))

    # 设置表单的属性和验证信息
    # form_args = dict(
    #    text=dict(label='Big Text', validators=[wtf.required(), Length(min=1, max=2000, message="Length range: 1 - 2000")])
    # )

    def __init__(self, session, name=None, category=None, endpoint=None, url=None):
        # 初始化
        super(TagFavoritesRelationAdmin, self).__init__(TagFavoritesRelation, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    can_create = False
    can_edit = False
    can_delete = False
