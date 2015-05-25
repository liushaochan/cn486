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
from math import ceil

from sqlalchemy.sql.expression import and_
from infopub.configs.admin import PermissionView


__doc__ = '用户收藏信息 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, Text, DateTime
from infopub.helpers.extensions import db

# 数据类
class Favorites(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    collector_id = Column(Integer, nullable=False, index=True, doc=u'收藏者ID')
    entry_id = Column(Integer, nullable=False, index=True, doc=u'主体ID')
    title = Column(String(100), nullable=False, doc=u'标题')
    tags = Column(String(512), doc=u'标签')
    entry_type = Column(Integer, nullable=False, doc=u'主体类型:0-16是内容/主贴、1000是回复/评论')
    author_id = Column(Integer, nullable=False, index=True, doc=u'作者ID')
    description = Column(Text, nullable=False, doc=u'描述')
    # todo 美味书签、百度收藏

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    @property
    def entry(self):
        from infopub.models.content.entry import EntryService

        return EntryService.get_by_id(self.entry_id)

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

# 数据管理类
class FavoritesAdmin(PermissionView):
    # 列表视图可见列
    # list_columns = ('title', 'user')

    # 列表视图不可见列
    # excluded_list_columns = .content

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
        super(FavoritesAdmin, self).__init__(Favorites, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    can_create = False
    can_edit = False
    can_delete = False


class FavoritesService(object):
    @staticmethod
    def get_favorites(collector_id, entry_type, page, size):
        if entry_type:
            q = Favorites.query.filter(and_(Favorites.collector_id == collector_id, Favorites.entry_type == entry_type))
        else:
            q = Favorites.query.filter(Favorites.collector_id == collector_id)

        _total = q.count()
        _list = q.order_by('-id').limit(size).offset(size * (page - 1))

        _pages = int(ceil(_total / float(size)))

        return _total, _pages, _list

    @staticmethod
    def add_favorites(collector_id, entry_id, author_id, title, tags, description, entry_type):
        # 加数据

        favorites = Favorites()
        favorites.entry_type = entry_type
        favorites.entry_id = entry_id
        favorites.title = title
        favorites.description = description
        favorites.author_id = author_id
        favorites.collector_id = collector_id

        # todo 开始处理tags
        if tags:
            print tags
        #            tags = get_tags_service().add_tags(tags)
        #            favorites.tags = tags

        db.session.add(favorites)
        db.session.commit()

        if not favorites.id:
            return False

        # 开始处理标签的文章关联
        if tags:
            print tags
            # todo 建立关系
            #get_tags_service().tag_add_entries(tags, entry_type, id)

        return True

    @staticmethod
    def cancel_by_id(id, collector_id):
        Favorites.query.filter(and_(Favorites.id == id, Favorites.collector_id == collector_id)).delete()

        db.session.commit()
        return True