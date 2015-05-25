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

from runkit.humanize.localtime import sys_now
from runkit.model.bases import BaseMixin, TimestampMixin

from runkit.model.utils import JsonSerializer
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db
from sqlalchemy import Text
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash

__doc__ = '缩略图文件 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'


# 数据类
class ThumbnailFileJsonSerializer(JsonSerializer):
    __json_hidden__ = []


# 数据类
class ThumbnailFile(ThumbnailFileJsonSerializer, db.Model, BaseMixin, TimestampMixin):
    __tablename__ = 'thumbnail_file'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    title = db.Column(String(200), doc=u'标题：用于显示与搜索')

    width = Column(Integer,  doc=u'width')
    height = Column(Integer, doc=u'height')

    save_relative_path = db.Column(String(100), nullable=False, doc=u'文件保存的相对路径')
    file_size = db.Column(Integer, nullable=False, doc=u'文件大小')
    file_signature = db.Column(String(32), doc=u'文件签名，md5：54f1850b91edf5a4e750df57b911360b')

    source_signature = db.Column(String(32), doc=u'原始图片的md5值，同一组表示是相同内容的素材，比如：不同尺寸、不同格式（png、jpeg）')
    status = db.Column(Integer, default=0, doc=u'状态：0-未审核、1-已审核、2-已禁止')

    slug = Column(String(50), unique=True, index=True, doc=u'固定地址')

    adder_id = Column(Integer, default=0, doc=u'传缩略图的用户')

    def __unicode__(self):
        return '%d' % self.id

    def __repr__(self):
        return self.id

    # @staticmethod
    # def add_or_update(model):
    #     model.updated_time = sys_now()
    #
    #     if not model.id:
    #         model.created_time = model.updated_time
    #         db.session.add(model)
    #
    #     db.session.commit()
    #
    #     return model.id

    def save(self, commit=True):

        return super(ThumbnailFile, self).save(commit)

    @classmethod
    def get_by_id(cls, id_):
        # todo cache
        # print 'Category id:', id_, type(id_)

        return cls.query.get(int(id_))

    @classmethod
    def get_by_file_signature(cls, file_signature):
        return cls.query.filter(Material.file_signature == file_signature).first()


# 数据管理类
class MaterialAdmin(ModelAdmin):
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
        super(MaterialAdmin, self).__init__(Material, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = Material()
            form.populate_obj(model)

            model.save()
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            model.save()
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False


