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

from exceptions import Exception
from flask import current_app
from runkit.humanize.localtime import sys_now
from runkit.model.bases import BaseMixin, TimestampMixin
from runkit.model.ext_types import DenormalizedText
from runkit.model.utils import JsonSerializer
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, Text, String, DateTime
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash

__doc__ = '标签 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'


# 数据类

class TagBaseJsonSerializer(JsonSerializer):
    __json_hidden__ = []


# 数据类
class TagBase(TagBaseJsonSerializer, db.Model, BaseMixin, TimestampMixin):
    # __tablename__ = 'tag'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    tag_name = Column(String(50), nullable=False, unique=True, index=True, doc=u'标签名')
    slug = Column(String(50), nullable=False, index=True, doc=u'固定地址')

    logo = Column(String(200), doc=u'图标地址')
    feature_image = Column(String(200), doc=u'特色图地址')
    # thumbnail_id_list = db.Column(DenormalizedText, nullable=True, default=set(), doc=u'缩略图ID列表')

    thumbs_width = Column(Integer, nullable=False, default=256, doc=u'缩略图宽度')
    thumbs_height = Column(Integer, nullable=False, default=256, doc=u'缩略图高度')

    # description = Column(Text, doc=u'描述')
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)

    # META Title（栏目标题）
    meta_title = Column(String(100), doc=u'针对搜索引擎设置的标题')

    # META Keywords（栏目关键词）
    meta_keywords = Column(String(200), doc=u'针对搜索引擎设置的关键词')

    # META Description（栏目描述）
    meta_description = Column(String(200), doc=u'针对搜索引擎设置的描述')

    # num_entries = Column(Integer, nullable=False, default=0, index=True, doc=u'内容数')

    # 通常用于用户自定义标签，或者说未得到官方认可
    tag_status = Column(Integer, nullable=False, default=0, doc=u'标签状态：0-开放、1-私有')

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

    def save(self, commit=True):
        if self.slug[0] == '/':
            self.slug = self.slug[1:]

        if self.slug[-1:] == '/':
            self.slug = self.slug[0:-1]

        self.slug.replace('/', '_')

        current_app.config['content_updated_time'] = sys_now()

        return super(TagBase, self).save(commit)

    def add_thumbnail_id(self, thumbnail_id):
        self.thumbnail_id_list.add(thumbnail_id)

    def remove_thumbnail_id(self, thumbnail_id):
        self.thumbnail_id_list.remove(thumbnail_id)

    def delete(self, commit=True):
        # todo 已经有内容（文章、新闻...）的tag不能删除
        ModelClass = globals()[ENTRY_TYPE_MODEL_CLASSNAME[self.entry_type.code]]
        _count = ModelClass.count_by_category_id(self.id)

        if _count:
            raise Exception(u'已经有文章的分类不能删除')

        return super(TagBase, self).delete(commit)

    @staticmethod
    def inc_entry_count(tag_id_list):
        for tag_id in tag_id_list:
            tag = TagBase.get_by_id(tag_id)
            tag.num_entries = TagBase.__table__.c.num_entries + 1
            tag.updated_time = sys_now()

        db.session.commit()

    @staticmethod
    def dec_entry_count(tag_id_list):
        for tag_id in tag_id_list:
            tag = TagBase.get_by_id(tag_id)
            tag.num_entries = TagBase.__table__.c.num_entries - 1
            tag.updated_time = sys_now()

        db.session.commit()

    @classmethod
    def get_by_id(cls, id_):
        # todo cache
        return cls.query.get(int(id_))

    @staticmethod
    def get_by_slug(slug):
        return TagBase.query.filter(TagBase.slug == slug).first()

    @staticmethod
    def get_all_tags():
        return TagBase.query.all()

    @staticmethod
    def get_hot_tags(category, limit=20):
        """
        获取热门标签，20个
        """

        if category:
            result = db.session.execute(
                """
                select tag_id, sum(num_entries) as num_entries from tag_category_relation where tag_category_relation.category%d_id = %d and num_entries>0 group by tag_id
                ORDER BY num_entries DESC
                LIMIT %d OFFSET 0
                """ % (category.current_level, category.id, limit)
            )
        else:
            result = db.session.execute(
                """
                select id as tag_id, slug, tag_name, num_entries from tag where num_entries>0
                ORDER BY num_entries DESC
                LIMIT %d OFFSET 0
                """ % limit
            )

        _list = []
        for row in result:
            if 'slug' in row:
                _list.append({'id': row['tag_id'], 'slug': row['slug'], 'tag_name': row['tag_name'],
                              'num_entries': row['num_entries']})
            else:
                tag = TagBase.get_by_id(row['tag_id'])
                _list.append({'id': row['tag_id'], 'slug': tag.slug, 'tag_name': tag.tag_name,
                              'num_entries': row['num_entries']})

        return _list


    ##################### del #######################
    def get_by_tagname(self, tag_name, fields=None):
        _tag = self.get_by_key('tag_name', tag_name, fields)
        return _tag

    def entry_count_by_id(self, tag_id, entry_type):
        _service = get_tags_entries_relation_service()

        return _service.count({'tag_id': tag_id, 'entry_type': entry_type})

    def add_tags(self, tags_str):
        # 开始处理tags
        tags = {}
        tag_set = set()

        # 取出标签，转小写，去重复
        for tag in tags_str.split(','):
            _tag = tag.strip()
            if _tag:
                tag_set.add(_tag.lower())

        for tag in tag_set:
            tags[str(self.add_tag(tag))] = tag

        return tags

    @staticmethod
    def add_tag(tag_name, slug=None):
        if not len(tag_name):
            return None
            #        todo
        _tag = TagBase.query.filter(TagBase.tag_name == tag_name).first()
        if _tag:
            id = _tag.id
            tag_name = _tag.tag_name
            slug = _tag.slug
        else:
            # p = pinyin()
            tag = TagBase()
            # slug = p.pinyin(tag_name)
            # slug = tag_name
            tag.tag_name = tag_name
            tag.slug = slug
            tag.description = tag_name
            tag.meta_title = tag_name
            tag.meta_keywords = tag_name
            tag.meta_description = tag_name
            tag.logo = ""
            tag.feature_image = ""

            id_ = tag.save()

        return {'id': id_, 'tag_name': tag_name, 'slug': slug}


    def tag_add_entries(self, tags, entry_type, entry_id):
        # 标签-文章对应关系

        _service = get_tags_entries_relation_service()
        for tag_id, tag_name in tags.iteritems():
            _tag_id = int(tag_id)
            _tag = self.get_by_id(_tag_id, ['num_entries_%d' % entry_type])
            if _tag:
                try:
                    _tag['num_entries_%d' % entry_type] += 1
                except Exception:
                    _tag['num_entries_%d' % entry_type] = 1

                self.update_by_id(_tag_id, _tag)
            else:
                print 'error'

            tags_entries_relation = tags_entries_relation_default.copy()
            tags_entries_relation['entry_type'] = entry_type
            tags_entries_relation['entry_id'] = entry_id
            tags_entries_relation['tag_id'] = _tag_id

            _service.add(tags_entries_relation)

    def tag_update_entries(self, del_tags_id, new_tags, entry_type, entry_id):
        _service = get_tags_entries_relation_service()
        for tag_id in del_tags_id:
            _tag_id = int(tag_id)
            _tag = self.get_by_id(_tag_id, ['num_entries_%d' % entry_type])
            if _tag:
                try:
                    _tag['num_entries_%d' % entry_type] -= 1
                except Exception:
                    _tag['num_entries_%d' % entry_type] = 0

                self.update_by_id(_tag_id, _tag)
            else:
                print 'error'

            _service.del_by_condition({'entry_type': entry_type, 'entry_id': entry_id, 'tag_id': _tag_id})

        if new_tags:
            self.tag_add_entries(new_tags, entry_type, entry_id)


# 数据管理类
class TagAdmin(ModelAdmin):

    # 列表视图可见列
    column_list = ('tag_name', 'slug')

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
        from infopub.forms.tag import TagForm
        return TagForm

    def get_edit_form(self):
        from infopub.forms.tag import TagForm
        return TagForm

    # def __init__(self, session, name=None, category=None, endpoint=None, url=None):
    #     # 初始化
    #     super(TagAdmin, self).__init__(Tag, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = TagBase()
            form.populate_obj(model)

            TagBase.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            TagBase.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False


