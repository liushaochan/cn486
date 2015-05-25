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
from sqlalchemy.sql.expression import and_
from infopub.bases.localtime import sys_now
from infopub.configs.admin import PermissionView

__doc__ = '用户与内容的交互 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, DateTime
from infopub.helpers.extensions import db

# 数据类
class EntryUserInteract(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    user_id = Column(Integer, nullable=False, index=True, doc=u'用户ID')
    entry_id = Column(Integer, nullable=False, index=True, doc=u'主体ID')

    has_favorites = Column(Integer, nullable=False, default=0, doc=u'已经收藏')
    has_retweet = Column(Integer, nullable=False, default=0, doc=u'已经转发')
    has_views = Column(Integer, nullable=False, default=0, doc=u'已经阅读')
    has_supports = Column(Integer, nullable=False, default=0, doc=u'已经支持')
    has_oppositions = Column(Integer, nullable=False, default=0, doc=u'已经反对')
    has_useful = Column(Integer, nullable=False, default=0, doc=u'已经说有用')
    has_useless = Column(Integer, nullable=False, default=0, doc=u'已经无用')
    has_thanks = Column(Integer, nullable=False, default=0, doc=u'已经感谢')
    has_uninterested = Column(Integer, nullable=False, default=0, doc=u'已经不感兴趣')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

# 数据管理类
class EntryUserInteractAdmin(PermissionView):
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
        super(EntryUserInteractAdmin, self).__init__(EntryUserInteract, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    can_create = False
    can_edit = False
    can_delete = False


class EntryUserInteractService(object):
    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        return model.id

    @staticmethod
    def get_by_entry_and_user_id(entry_id, user_id):
        return EntryUserInteract.query.filter(
            and_(EntryUserInteract.entry_id == entry_id, EntryUserInteract.user_id == user_id)).first()

