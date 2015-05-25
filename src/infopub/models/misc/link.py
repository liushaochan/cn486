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

__doc__ = '链接 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from infopub.helpers.extensions import db, cache
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash
from sqlalchemy.sql.expression import and_
from infopub.bases.localtime import sys_now
from infopub.bases.model_base import Order
from infopub.forms.link import LinkNewForm, LinkEditForm
from infopub.configs.admin import PermissionView

# 数据类
class Link(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    link_group = Column(Integer, nullable=False, doc=u'分组：0-合作伙伴、1-友情链接、2-其他链接')
    weight = Column(Integer, nullable=False, default=1, doc=u'权重')

    link = Column(String(100), nullable=False, unique=True, doc=u'链接')
    email = Column(String(50), doc=u'邮箱')
    title = Column(String(50), nullable=False, doc=u'标题')
    logo = Column(String(100), doc=u'图标')
    link_status = Column(Integer, doc=u'链接状态：0-草稿、1-待审核、2-已发布')
    description = Column(String(200), doc=u'备注')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

# 数据管理类
class LinkAdmin(PermissionView):
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

    def get_create_form(self):
        return LinkNewForm

    def get_edit_form(self):
        return LinkEditForm

    def create_model(self, form):
        try:
            model = Link()
            form.populate_obj(model)

            LinkService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            LinkService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False

    def __init__(self, session, name=None, category=None, endpoint=None, url=None):
        # 初始化
        super(LinkAdmin, self).__init__(Link, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'


class LinkService(object):
    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        # 清除缓存
        cache.delete('partner_links')
        cache.delete('friend_links')
        cache.delete('other_links')

        return model.id

    @staticmethod
    def get_partner_link():
        return Link.query.filter(and_(Link.link_group == 0, Link.link_status == 2)).order_by(
            '%s %s' % ('weight', Order.DESC)).all()

    @staticmethod
    def get_friend_link():
        return Link.query.filter(and_(Link.link_group == 1, Link.link_status == 2)).order_by(
            '%s %s' % ('weight', Order.DESC)).all()

    @staticmethod
    def get_other_link():
        return Link.query.filter(and_(Link.link_group == 2, Link.link_status == 2)).order_by(
            '%s %s' % ('weight', Order.DESC)).all()
