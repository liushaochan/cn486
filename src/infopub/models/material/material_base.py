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

from flask.ext.sqlalchemy import BaseQuery
from runkit.model.bases import BaseMixin
from runkit.model.bases import VersionMinxin
from runkit.model.ext_types import DenormalizedText
from runkit.model.utils import JsonSerializer
from runkit.web.flask_ext.admin_manager import ModelAdmin
from sqlalchemy import Text

__doc__ = '素材 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

# from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from runkit.web.flask_ext.sql import db


# 数据类
class CommonFileJsonSerializer(JsonSerializer):
    __json_hidden__ = []


class MaterialFileQuery(BaseQuery):

    def jsonify(self):
        for _file in self.all():
            yield _file.json

    def getall(self):
        return self.order_by(CommonFile.id.desc())

# material_thumbnail_file = db.Table('material_thumbnail_files',
#               db.Column('category_id', db.Integer(), db.ForeignKey('category.id')),
#               db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))


# 数据类
class CommonFile(CommonFileJsonSerializer, BaseMixin, VersionMinxin):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    # material_type = Column(Integer, nullable=False, default=0, doc=u'素材类型：0-图像、1-视频、2-声音、3-多媒体')

    # 包含的缩略图
    # todo 多个缩略图，是否存ID就可以了
    # thumb_files = db.relationship('ThumbnailFile', secondary=material_thumbnail_file,
    #                              backref=db.backref('material_thumbnail_files', lazy='dynamic'))

    thumbnail_id_list = db.Column(DenormalizedText, nullable=True, default=set(), doc=u'缩略图ID列表')

#    read_pointer = Column(Integer, nullable=False, doc=u'')
#    read_money = Column(Integer, nullable=False, doc=u'')
    download_times = db.Column(Integer, nullable=False, doc=u'下载次数')

    title = db.Column(String(200), doc=u'标题：用于显示与搜索')

    origin_filename = db.Column(String(100), nullable=False, doc=u'原始文件名')
    origin_fileext = db.Column(String(10), nullable=False, doc=u'原始文件扩展名')

    save_relative_path = db.Column(String(100), nullable=False, doc=u'文件保存的相对路径')

    # 是否应该转成int，方便查询
    # todo 多种格式（.gif .png .jpg .tif） -> int
    file_type = db.Column(String(100), nullable=True, doc=u'文件类型')

    file_size = db.Column(Integer, nullable=False, doc=u'文件大小')
    file_signature = db.Column(String(32), doc=u'文件签名，md5：54f1850b91edf5a4e750df57b911360b')

    status = db.Column(Integer, default=0, doc=u'状态：0-未审核、1-已审核、2-已禁止')

    description = db.Column(Text, doc=u'描述/备注')

    slug = db.Column(String(50), unique=True, index=True, doc=u'固定地址')

    adder_id = db.Column(Integer, default=0, doc=u'传缩略图的用户')

    # 消费金币/银币
    consume_gold_cost = db.Column(Integer, default=0, doc=u'消费金牌数')
    consume_silver_cost = db.Column(Integer, default=0, doc=u'消费银牌数')


    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

    @staticmethod
    def get_by_id(id):
        #global simple_cache
        #key = 'AnnexFile_%d' % id
        #print key
        #if key in simple_cache:
        #    query = loads(simple_cache[key], scoped_session=db.session)
        #else:
        query = CommonFile.query.filter(CommonFile.id == id).first()
        #serialized = dumps(query)
        #simple_cache[key] =  serialized

        return query

    @staticmethod
    def get_by_AnnexFile_id(id):
        #global simple_cache
        #key = 'AnnexFile_%d' % id
        #print key
        #if key in simple_cache:
        #    query = loads(simple_cache[key], scoped_session=db.session)
        #else:
        query = CommonFile.query.filter(CommonFile.AnnexFile_id == id)
        #serialized = dumps(query)
        #simple_cache[key] =  serialized

        return query

    @staticmethod
    def get_by_slug(slug):
        query = CommonFile.query.filter(CommonFile.slug == slug).first()

        return query

# 数据管理类
class AnnexFileAdmin(ModelAdmin):
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

    can_create = False
    can_edit = False
    can_delete = False

