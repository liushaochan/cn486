# !/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
# Copyright (c) 2011 - 2035 HangZhou JingChuang Information Technology CO.,Ltd.
# 杭州精创信息技术有限公司
#
# http://www.jcing.com
#
# All rights reserved.
#

from exceptions import Exception

from flask.globals import g
from runkit.humanize.localtime import sys_now
from runkit.model.bases import IdMixin
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db
from sqlalchemy.schema import Column
from sqlalchemy.types import Text, String
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash
from runkit.model.utils import JsonSerializer


__doc__ = '系统配置 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'


# 数据类
class SystemConfigJsonSerializer(JsonSerializer):
    __json_hidden__ = []


# 数据类
class SystemConfig(SystemConfigJsonSerializer, db.Model, IdMixin):
    __tablename__ = 'system_config'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    # group -> int
    group = Column(String(50), nullable=False, doc=u'分组')
    title = Column(String(50), nullable=False, unique=True, doc=u'标题')
    key_name = Column(String(50), nullable=False, unique=True, index=True, doc=u'键名')
    key_value = Column(Text, nullable=False, doc=u'键值')
    key_type = Column(String(20), nullable=False, doc=u'键值类型')
    note = Column(Text, doc=u'备注')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        from infopub.configs.setups import init_app_config

        init_app_config(app)

        return model.id

    @classmethod
    def add(cls, group, title, key_name, key_value, key_type, note):
        model = SystemConfig()
        model.group = group
        model.title = title
        model.key_name = key_name
        model.key_value = key_value
        model.key_type = key_type
        model.note = note

        db.session.add(model)
        db.session.commit()

    @classmethod
    def get_list(cls):
        return cls.query.all()

    @staticmethod
    def get_by_key(key):
        value = SystemConfig.query.filter(SystemConfig.key_name == key).first()
        if value:
            return value.key_value
        else:
            return ""


# 数据管理类
class SystemConfigAdmin(ModelAdmin):
    # roles_accepted = ('admin',)

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

    # def __init__(self, session, name=None, category=None, endpoint=None, url=None):
    #     # 初始化
    #     super(SystemConfigAdmin, self).__init__(SystemConfig, session, name, category, endpoint, url)
    #     # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = SystemConfig()
            form.populate_obj(model)

            SystemConfig.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            SystemConfig.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False

    # def is_accessible(self):
    #     if g.user is None:
    #         return False
    #     return g.user.is_administrator
