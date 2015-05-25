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
from infopub.configs.admin import PermissionView

__doc__ = '标签与栏目关系 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer
from infopub.helpers.extensions import db

# 数据类
class TagCategoryRelation(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    category1_id = Column(Integer, nullable=False, default=0, index=True, doc=u'第一级分类ID')
    category2_id = Column(Integer, nullable=False, default=0, index=True, doc=u'第二级分类ID')
    category3_id = Column(Integer, nullable=False, default=0, index=True, doc=u'第三级分类ID')

    tag_id = Column(Integer, nullable=False, index=True, doc=u'标签ID')

    num_entries = Column(Integer, nullable=False, default=0, index=True, doc=u'内容数')

    @property
    def tag(self):
        return None #TagService.get_by_id(self.tag_id)

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

# 数据管理类
class TagCategoryRelationAdmin(PermissionView):
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
        super(TagCategoryRelationAdmin, self).__init__(TagCategoryRelation, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    can_create = False
    can_edit = False
    can_delete = False


class TagCategoryRelationService(object):
    @staticmethod
    def add_relation(category, tag_id_list):
        """
        标签的分类关联、计数
        @param category:
        @param tag_id_list:
        @return:
        """

        for tag_id in tag_id_list:
            if category.current_level == 1:
                # 已经存在关系?
                relation = TagCategoryRelation.query.filter(
                    and_(TagCategoryRelation.category1_id == category.id, TagCategoryRelation.category2_id == 0,
                         TagCategoryRelation.category3_id == 0, TagCategoryRelation.tag_id == tag_id)).first()
                if relation:
                    relation.num_entries = TagCategoryRelation.__table__.c.num_entries + 1
                else:
                    relation = TagCategoryRelation()
                    relation.tag_id = tag_id
                    relation.num_entries = 1
                    relation.category1_id = category.id
                db.session.add(relation)

            if category.current_level == 2:
                relation = TagCategoryRelation.query.filter(
                    and_(TagCategoryRelation.category1_id == category.path[0].id,
                         TagCategoryRelation.category2_id == category.id, TagCategoryRelation.category3_id == 0,
                         TagCategoryRelation.tag_id == tag_id)).first()
                if relation:
                    relation.num_entries = TagCategoryRelation.__table__.c.num_entries + 1
                else:
                    relation = TagCategoryRelation()
                    relation.tag_id = tag_id
                    relation.num_entries = 1
                    relation.category1_id = category.path[0].id
                    relation.category2_id = category.path[1].id
                db.session.add(relation)

            if category.current_level == 3:
                relation = TagCategoryRelation.query.filter(
                    and_(TagCategoryRelation.category1_id == category.path[0].id,
                         TagCategoryRelation.category2_id == category.path[1].id,
                         TagCategoryRelation.category3_id == category.id, TagCategoryRelation.tag_id == tag_id)).first()
                if relation:
                    relation.num_entries = TagCategoryRelation.__table__.c.num_entries + 1
                else:
                    relation = TagCategoryRelation()
                    relation.tag_id = tag_id
                    relation.num_entries = 1
                    relation.category1_id = category.path[0].id
                    relation.category2_id = category.path[1].id
                    relation.category3_id = category.path[2].id
                db.session.add(relation)

        db.session.commit()

    @staticmethod
    def del_relation(category, tag_id_list):
        for tag_id in tag_id_list:
            if category.current_level == 1:
                # 已经存在关系?
                relation = TagCategoryRelation.query.filter(
                    and_(TagCategoryRelation.category1_id == category.id, TagCategoryRelation.category2_id == 0,
                         TagCategoryRelation.category3_id == 0, TagCategoryRelation.tag_id == tag_id)).first()
                if relation:
                    relation.num_entries = TagCategoryRelation.__table__.c.num_entries - 1

            if category.current_level == 2:
                relation = TagCategoryRelation.query.filter(
                    and_(TagCategoryRelation.category1_id == category.path[0].id,
                         TagCategoryRelation.category2_id == category.id, TagCategoryRelation.category3_id == 0,
                         TagCategoryRelation.tag_id == tag_id)).first()
                if relation:
                    relation.num_entries = TagCategoryRelation.__table__.c.num_entries - 1

            if category.current_level == 3:
                relation = TagCategoryRelation.query.filter(
                    and_(TagCategoryRelation.category1_id == category.path[0].id,
                         TagCategoryRelation.category2_id == category.path[1].id,
                         TagCategoryRelation.category3_id == category.id, TagCategoryRelation.tag_id == tag_id)).first()
                if relation:
                    relation.num_entries = TagCategoryRelation.__table__.c.num_entries - 1

        db.session.commit()
