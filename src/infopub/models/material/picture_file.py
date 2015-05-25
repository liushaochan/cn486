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
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash

__doc__ = '图片文件 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'


# 数据类
class PictureFileJsonSerializer(JsonSerializer):
    __json_hidden__ = []


# 数据类
class PictureFile(PictureFileJsonSerializer, db.Model, BaseMixin, TimestampMixin):
    __tablename__ = 'picture_file'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    # size = db.Column(Text, nullable=False, doc=u'尺寸列表，保存为[w_h,w_h]这样的形式')

    # 真实宽度、高度
    width = db.Column(Integer,  doc=u'width')
    height = db.Column(Integer, doc=u'height')

    # 近似宽度、高度
    closest_width = db.Column(Integer,  doc=u'closest_width')
    closest_height = db.Column(Integer, doc=u'closest_height')

    # 周长、对角线

    # 尺寸
    # todo，需要定义规范：是否和ppi要关联
    dimensions = db.Column(Integer, doc=u'尺寸规格：小、中、大、超大')

    source_signature = db.Column(String(32), doc=u'原始图片的md5值，同一组表示是相同内容的素材，比如：不同尺寸、不同格式（png、jpeg）')

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

        return super(PictureFile, self).save(commit)

    @classmethod
    def get_by_id(cls, id_):
        # todo cache
        # print 'Category id:', id_, type(id_)

        return cls.query.get(int(id_))

    @classmethod
    def get_by_file_signature(cls, file_signature):
        return cls.query.filter(PictureFile.file_signature == file_signature).first()


# 数据管理类
class PictureFileAdmin(ModelAdmin):
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
        super(PictureFileAdmin, self).__init__(PictureFile, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = PictureFile()
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


