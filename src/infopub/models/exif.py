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

__doc__ = '交换图像文件（Exchangeable Image File） 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'


# 数据类
class ExifJsonSerializer(JsonSerializer):
    __json_hidden__ = []


# 数据类
class Exif(ExifJsonSerializer, db.Model, BaseMixin, TimestampMixin):
    __tablename__ = 'material'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    material_type = Column(Integer, nullable=False, default=0, doc=u'素材类型：0-图像、1-视频、2-声音、3-多媒体')
    file_name = Column(String(100), nullable=False, doc=u'文件名')
    file_ext = Column(String(100), nullable=False, doc=u'文件扩展名')
    file_path = Column(String(100), nullable=False, doc=u'文件路径')
    file_type = Column(String(100), nullable=False, doc=u'文件类型')
    file_size = Column(Integer, nullable=False, doc=u'文件大小')
    file_signature = Column(String(50), doc=u'文件签名')
    thumbnail_file = Column(String(100), doc=u'缩略图文件')
    url = Column(String(100), nullable=False, unique=True, doc=u'链接')
    material_group = Column(Integer, default=0, doc=u'分组')
    title = Column(String(50), doc=u'标题')
    material_status = Column(Integer, default=0, doc=u'素材状态：0-未审核、1-已审核、2-已禁止')
    description = Column(String(200), doc=u'备注')

    added_user_id = Column(Integer, default=0, doc=u'传素材的用户')

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

        return super(Exif, self).save(commit)

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


