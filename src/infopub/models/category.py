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

from math import ceil

from flask import current_app
from flask.ext.sqlalchemy import BaseQuery
from infopub.defines.category import READ_PERMISSION_CHOICES, \
    POST_PERMISSION_CHOICES, CATEGORY_TYPES_CHOICES, AUDIT_TYPES_CHOICES, CATEGORY_STATUS_CHOICES, \
    CategoryType, ReadPermission, PostPermission, AuditType, CategoryStatus
from infopub.defines.entry import ENTRY_TYPE_CHOICES, EntryType, ENTRY_TYPE_MODEL_CLASSNAME
from runkit.humanize.localtime import sys_now

from runkit.model.bases import TimestampMixin, BaseMixin
from runkit.model.ext_types import DenormalizedText
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db
from exceptions import Exception
from sqlalchemy import types
from sqlalchemy.ext.declarative.api import declared_attr

from sqlalchemy.types import Text, String, Integer, DateTime
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash
from runkit.model.utils import JsonSerializer
from sqlalchemy_utils import ChoiceType
from infopub.models.user import User, Role
from flask.ext.admin.form import rules


__doc__ = '分类 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'


category_show_roles = db.Table('category_show_roles',
              db.Column('category_id', db.Integer(), db.ForeignKey('category.id')),
              db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

category_post_roles = db.Table('category_post_roles',
              db.Column('category_id', db.Integer(), db.ForeignKey('category.id')),
              db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

category_managers = db.Table('category_managers',
              db.Column('category_id', db.Integer(), db.ForeignKey('category.id')),
              db.Column('user_id', db.Integer(), db.ForeignKey('user.id')))


class CategoryJsonSerializer(JsonSerializer):
    __json_hidden__ = []


class CategoryQuery(BaseQuery):

    def jsonify(self):
        for entry in self.all():
            yield entry.json

    def getall(self):
        return self.order_by(Category.id.desc())


# 数据类
class Category(CategoryJsonSerializer, db.Model, BaseMixin, TimestampMixin):
    __tablename__ = 'category'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    query_class = CategoryQuery

    # 这个版本只支持2级分类
    # parent_id = db.Column(Integer, index=True, doc=u'父ID')
    # current_level = db.Column(Integer, nullable=False, default=1, index=True, doc=u'当前层级')

    # 路径ID
    #path_id = db.Column(String(100), nullable=False, unique=True, doc=u'路径ID')

    # parent_id = db.Column(db.Integer(), db.ForeignKey('categories.id'))
    # parent = db.relationship('Category',
    #                          primaryjoin = ('Category.parent_id == Category.id'),
    #                          remote_side=[id], backref=db.backref("children"))

    category_name = db.Column(String(50), nullable=False, unique=True, doc=u'分类名')
    slug = db.Column(String(50), nullable=False, unique=True, index=True, doc=u'固定地址')

    logo = db.Column(String(200), doc=u'图标地址')
    feature_image = db.Column(String(200), doc=u'特色图地址')

    thumbs_width = db.Column(Integer, nullable=False, default=256, doc=u'缩略图宽度')
    thumbs_height = db.Column(Integer, nullable=False, default=256, doc=u'缩略图高度')

    display_order = db.Column(Integer, nullable=False, index=True, default=1, doc=u'显示次序')

    body = db.Column(db.Text, doc=u'描述')
    body_html = db.Column(db.Text, doc=u'描述')

    # 阅读权限
    # 无限制、注册用户、仅自己、指定角色
    read_permission = db.Column(ChoiceType(READ_PERMISSION_CHOICES, types.Integer()),
                             default=ReadPermission.unrestraint, nullable=False, index=True, doc=u'阅读权限')

    # 能浏览的角色
    # read_roles = db.Column(DenormalizedText, nullable=False, default=set(), doc=u'能查看的角色：空-不限')
    read_roles = db.relationship('Role', secondary=category_show_roles,
                                 backref=db.backref('category_show_roles', lazy='dynamic'))

    # 投递/发表权限
    # 不能发布、注册用户、指定角色
    post_permission = db.Column(ChoiceType(POST_PERMISSION_CHOICES, types.Integer()),
                             default=PostPermission.not_post, nullable=False, index=True, doc=u'投递权限')

    # 支持投稿的角色
    # post_roles = db.Column(DenormalizedText, nullable=False, default=set(), doc=u'能投稿的角色：空-不限')
    post_roles = db.relationship('Role', secondary=category_post_roles,
                                 backref=db.backref('category_post_roles', lazy='dynamic'))

    # 栏目管理员
    # managers = db.Column(DenormalizedText, nullable=False, default=set(), doc=u'栏目管理员：空-没有管理员')
    managers = db.relationship('User', secondary=category_managers,
                               backref=db.backref('category_managers', lazy='dynamic'))

    # 栏目类型：0-普通栏目、1-链接栏目（链接至某个页面）
    #   普通栏目使用list_template
    category_type = db.Column(ChoiceType(CATEGORY_TYPES_CHOICES, types.Integer()), nullable=False,
                           default=CategoryType.inside, doc=u'0-普通栏目、1-链接栏目（链接至某个页面）')
    category_url = db.Column(String(200), doc=u'链接至某个页面的地址')

    list_template = db.Column(String(100), nullable=False, default='/archives/list.html', doc=u'列表页模板')
    create_template = db.Column(String(100), nullable=False, default='/archives/create.html', doc=u'创建页模板')
    edit_template = db.Column(String(100), nullable=False, default='/archives/edit.html', doc=u'编辑页模板')
    show_template = db.Column(String(100), nullable=False, default='/archives/show.html', doc=u'显示页模板')
    search_template = db.Column(String(100), nullable=False, default='/archives/search.html', doc=u'搜索结果页模板')
    download_template = db.Column(String(100), nullable=False, default='/archives/download.html', doc=u'下载页模板')

    # 文章URL自动生成规则
    # 文章标题: {title_name}
    # 文章ID: {title_id}
    # 栏目名: {category_name}
    # 栏目固定地址: {category_slug}
    # 时间戳: {timestamp}
    # 时间: {time}
    # 日期: {date}
    entry_url_rule = db.Column(String(100), nullable=False, default='archives/{title_id}', doc=u'文章编码规则')

    # META Title（栏目标题）
    meta_title = db.Column(String(100), doc=u'针对搜索引擎设置的标题')

    # META Keywords（栏目关键词）
    meta_keywords = db.Column(String(200), doc=u'针对搜索引擎设置的关键词')

    # META Description（栏目描述）
    meta_description = db.Column(String(200), doc=u'针对搜索引擎设置的描述')

    # todo 移到redis中
    # num_entries = db.Column(Integer, nullable=False, default=0, doc=u'内容（文章、新闻....）数')
    # num_attention = db.Column(Integer, nullable=False, default=0, doc=u'关注数')

    # 栏目下包含的内容
    # entries = db.Column(DenormalizedText, nullable=True, default=set(), doc=u'栏目下包含的内容')

    # 内容的类型
    entry_type = db.Column(ChoiceType(ENTRY_TYPE_CHOICES, types.Integer()), nullable=False,
                        default=EntryType.article, index=True, doc=u'栏目下的内容类型')

    need_audit = db.Column(ChoiceType(AUDIT_TYPES_CHOICES, types.Integer()), nullable=False,
                        default=AuditType.not_need, doc=u'栏目下的文章是否需要审核：0-不需要、1-需要')

    category_status = db.Column(ChoiceType(CATEGORY_STATUS_CHOICES, types.Integer()), nullable=False,
                             default=CategoryStatus.open, doc=u'分类状态：0-开放、1-锁定、2-禁用')

    def __unicode__(self):
        return self.category_name

    def __repr__(self):
        return self.id

    @property
    def url(self):
        if self.category_type.code == CategoryType.link:
            return self.category_url

        return '%s/' % self.slug

    @property
    def num_entries(self):
        ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[self.entry_type.code]]
        return ModelClass.count_by_category_id(self.id)

    def save(self, commit=True):
        if self.slug[0] == '/':
            self.slug = self.slug[1:]

        if self.slug[-1:] == '/':
            self.slug = self.slug[0:-1]

        current_app.config['content_updated_time'] = sys_now()

        return super(Category, self).save(commit)

    def delete(self, commit=True):
        # 已经有内容（文章、新闻...）的分类不能删除
        ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[self.entry_type.code]]
        _count = ModelClass.count_by_category_id(self.id)

        if _count:
            raise Exception(u'已经有文章的分类不能删除')

        return super(Category, self).delete(commit)

    def add_thumbnail_id(self, thumbnail_id):
        self.thumbnail_id_list.add(thumbnail_id)

    def remove_thumbnail_id(self, thumbnail_id):
        self.thumbnail_id_list.remove(thumbnail_id)

    @classmethod
    def get_all_with_status(cls, status):
        # todo cache
        return Category.query.filter(Category.category_status == status).all()

    @classmethod
    def get_all(cls):
        # todo cache
        return Category.query.all()

    @classmethod
    def get_by_id(cls, id_):
        # todo cache
        # print 'Category id:', id_, type(id_)
        return cls.query.get(int(id_))

    @classmethod
    def get_by_slug(cls, slug):
        # todo cache
        return Category.query.filter(Category.slug == slug).first()

    @classmethod
    def get_page_with_query(cls, query, sort, order, page, page_size):
        if query:
            q = cls.query.filter_by(category_name=query)
        else:
            q = cls.query

        if q is None:
            return 0, 0, []

        _total = q.count()
        _list = q.order_by('%s %s' % (sort, order)).limit(page_size).offset(page_size * (page - 1)).all()
        #_list = db.session.query(Entry).from_statement("SELECT * FROM entry WHERE category_id =:category_id").params(category_id=category.id).all()

        _pages = int(ceil(_total / float(page_size)))

        data_list = []
        for obj in _list:
            _dict = obj.to_dict()
            _dict['url'] = obj.url
            data_list.append(_dict)

        return _total, _pages, data_list

    @classmethod
    def move_order(cls, category_id, num):
        # todo 可以对栏目顺序进行调整（显示次序）
        pass


# 数据管理类
class CategoryAdmin(ModelAdmin):
    from infopub.forms.category import CategoryForm

    # 列表视图可见列
    column_list = ('id', 'category_name', 'slug', 'display_order', 'created_at')

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    column_sortable_list = ('id', 'category_name', 'slug', 'display_order', 'created_at')

    # 定义搜索列
    column_searchable_list = ('category_name', 'slug')

    # 定义过滤列
    column_filters = ('category_name', 'slug')

    # def get_create_form(self):
    #     from infopub.forms.category import CategoryForm
    #     return CategoryForm
    #
    # def get_edit_form(self):
    #     from infopub.forms.category import CategoryForm
    #     return CategoryForm
    #
    def create_model(self, form):
        try:
            model = Category()
            form.populate_obj(model)
            return model.save()
        except Exception as ex:
            self.session.rollback()
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)
            return model.save()
        except Exception as ex:
            self.session.rollback()
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False

    def delete_model(self, model):
        try:
            model.delete(model)
            return True
        except Exception as ex:
            self.session.rollback()

            if self._debug:
                raise

            flash(_('Failed to delete model. %(error)s', error=str(ex)), 'error')
            return False

    form_base_class = CategoryForm

    form_create_rules = [
        rules.FieldSet(
            ('category_name',
             'slug',
             'logo',
             'feature_image',
             'thumbs_width',
             'thumbs_height',
             'display_order'),
            'Base Info'),
        rules.FieldSet(
            ('read_permission',
             'read_roles',
             'post_permission',
             'post_roles',
             'need_audit',
             'managers'),
            'Permission'),
        rules.FieldSet(
            ('category_type',
             'category_url',
             'entry_url_rule',
             'entry_type',
             'category_status'),
            'Ext Info'),
        rules.FieldSet(
            ('list_template',
             'create_template',
             'edit_template',
             'show_template',
             'search_template',
             'download_template'),
            'Html Template'),
        rules.FieldSet(
            ('meta_title',
             'meta_keywords',
             'meta_description'),
            'SEO Meta'),
        rules.FieldSet(
            ('body',
             'body_html'),
            'BODY'),
    ]

    form_edit_rules = form_create_rules

    # 自定义模板
    # create_template = 'admin/category/create.html'
    # edit_template = 'admin/category/edit.html'
    # list_template = 'admin/category/list.html'
