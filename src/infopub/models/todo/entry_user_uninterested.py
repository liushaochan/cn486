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

__doc__ = '内容/问题不感兴趣表 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, DateTime
from infopub.helpers.extensions import db
from flask_admin.contrib.sqlamodel import filters

# 数据类
class EntryUserUninterested(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    entry_id = Column(Integer, nullable=False, doc=u'内容ID')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    def __unicode__(self):
        return self.word

    def __repr__(self):
        return self.id

# 数据管理类
class EntryUserUninterestedAdmin(PermissionView):
    # 列表视图可见列
    list_columns = ('id', 'word', 'word_group_name', 'word_type_name', 'process_type_name')

    # 列表视图不可见列
    # excluded_list_columns = ['content']

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    sortable_columns = (
    'word', ('word_group_name', EntryUserUninterested.word_group), ('word_type_name', EntryUserUninterested.word_type),
    ('process_type_name', EntryUserUninterested.process_type))

    # 列表视图 列名别名
    # rename_columns = dict(title=u'Post Title')

    # 定义搜索列
    column_searchable_list = ('word', EntryUserUninterested.word)

    # 定义过滤列
    column_filters = (filters.FilterLike(EntryUserUninterested.word, u'单词'),
                      filters.FilterEqual(EntryUserUninterested.word_group, u'Word Group',
                                          options=(('0', 'sensitive'), ('1', 'advert'), ('2', 'spam'))),
                      filters.FilterEqual(EntryUserUninterested.word_type, 'Word Type',
                                          options=(('0', 'contain'), ('1', 'equal'), ('2', 'regex'))),
                      filters.FilterEqual(EntryUserUninterested.process_type, 'Process Type',
                                          options=(('0', 'replace'), ('1', 'check pending'))),
    )

    # 设置表单的属性和验证信息
    # form_args = dict(
    #    text=dict(label='Big Text', validators=[wtf.required(), Length(min=1, max=2000, message="Length range: 1 - 2000")])
    # )

    def __init__(self, session, name=None, category=None, endpoint=None, url=None):
        # 初始化
        super(EntryUserUninterestedAdmin, self).__init__(EntryUserUninterested, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    can_create = False
    can_edit = False
    can_delete = False


class EntryUserUninterestedService(object):
    @staticmethod
    def get_by_id(id):
        # ['username', 'nickname', 'email', 'homepage']
        return EntryUserUninterested.query.filter(EntryUserUninterested.id == id).first()

    @staticmethod
    def word_allowed(word):
        return True