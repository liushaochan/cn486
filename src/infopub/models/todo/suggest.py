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

__doc__ = '建议 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from infopub.helpers.extensions import db
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash

# 数据类
class Suggest(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    sender_id = Column(Integer, nullable=False, default=0, doc=u'发送人ID')
    email = Column(String(50), doc=u'邮箱')
    nickname = Column(String(20), doc=u'昵称')
    suggest_type = Column(Integer, nullable=False, doc=u'类型：0-功能、1-用户体验、2-其它')
    title = Column(String(50), nullable=False, doc=u'标题')
    content = Column(String(2000), nullable=False, doc=u'内容')
    suggest_status = Column(Integer, doc=u'状态：0-未处理、1-已处理、2-已删除')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

# 数据管理类
class SuggestAdmin(PermissionView):
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
        super(SuggestAdmin, self).__init__(Suggest, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = Suggest()
            form.populate_obj(model)

            SuggestService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            SuggestService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False


class SuggestService(object):
    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        return model.id
