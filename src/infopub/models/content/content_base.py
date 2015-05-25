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
from time import time
from flask.ext.sqlalchemy import BaseQuery
from flask.globals import g, request
from flask.helpers import flash
from infopub.defines.entry import ENTRY_SOURCE_TYPE_CHOICES, ENTRY_RECOMMEND_CHOICES, ENTRY_COMMENT_STATUS_CHOICES, \
    ENTRY_VIEW_STATUS_CHOICES, ENTRY_STATUS_CHOICES, EntryStatus, EntryViewStatus, EntryType, EntrySourceType, \
    EntryRecommend, EntryCommentStatus, ENTRY_TYPE_CHOICES
from infopub.models.category import Category
from infopub.models.comment import Comment
from runkit.dao.dao_base import PER_PAGE
from runkit.data.serialization import json_decode
from runkit.humanize.localtime import sys_now, format_time_with_path, format_date_with_path
from runkit.model.bases import Order, IdMixin, BaseMixin, TimestampMixin, VersionMinxin
from runkit.model.ext_types import DenormalizedText
from runkit.string.text import extract_summary
from runkit.system.named_constants import Constants
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db
from runkit.web.utils.views import get_remote_ip
from sqlalchemy import types
from sqlalchemy.sql.expression import and_
from sqlalchemy_utils import ChoiceType
from werkzeug.exceptions import abort
from infopub.models.user import UserService

__doc__ = '内容 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, Text, DateTime
# from infopub.helpers.extensions import db, app, gfw
from flask.ext.babelex import lazy_gettext as _
import datetime
from runkit.model.utils import JsonSerializer
from flask.ext.admin.form import rules


# 数据类
class EntryJsonSerializer(JsonSerializer):
    __json_hidden__ = []


class EntryQuery(BaseQuery):

    def jsonify(self):
        for entry in self.all():
            yield entry.json

    def get_all(self):
        return self.order_by(Entry.id.desc())


# 数据类
class Entry(EntryJsonSerializer, BaseMixin, VersionMinxin):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}
    TagClass = None

    category_id = Column(Integer, nullable=False, index=True, doc=u'分类ID')
    author_id = Column(Integer, nullable=False, index=True, doc=u'作者ID')
    published_id = Column(Integer, nullable=False, index=True, default=0, doc=u'发布人ID')

    entry_type = Column(ChoiceType(ENTRY_TYPE_CHOICES, types.Integer()), nullable=False,
                        default=EntryType.article, index=True, doc=u'类型')

    title = Column(String(200), nullable=False, doc=u'标题')
    # content = Column(Text, doc=u'内容')

    body = db.Column(db.Text)
    body_html = db.Column(db.Text)

    summary = Column(String(200), doc=u'摘要')

    tag_id_list = Column(DenormalizedText, doc=u'标签ID列表')
    tag_list = Column(DenormalizedText, doc=u'标签文本列表')

    logo = Column(String(200), doc=u'图标地址')

    thumbnail_id_list = db.Column(DenormalizedText, nullable=True, default=set(), doc=u'缩略图ID列表')

    thumbs_width = Column(Integer, nullable=False, default=256, doc=u'缩略图宽度')
    thumbs_height = Column(Integer, nullable=False, default=256, doc=u'缩略图高度')

    source_title = Column(String(200), doc=u'来源标题')
    source_url = Column(String(200), doc=u'来源地址')

    source_type = Column(ChoiceType(ENTRY_SOURCE_TYPE_CHOICES, types.Integer()), nullable=False,
                         default=EntrySourceType.original, doc=u'来源类型：0-原创、1-翻译、2-转帖、3-专稿')

    slug = Column(String(200), unique=True, index=True, doc=u'固定地址')

    recommend = Column(ChoiceType(ENTRY_RECOMMEND_CHOICES, types.Integer()), nullable=False,
                       default=EntryRecommend.general, doc=u'推荐级别：0-默认（未推荐）、1-不错、2-良好、3-精华')

    comment_status = Column(ChoiceType(ENTRY_COMMENT_STATUS_CHOICES, types.Integer()), nullable=False,
                            default=EntryCommentStatus.open, doc=u'评论状态：0-允许、1-关闭')
    view_status = Column(ChoiceType(ENTRY_VIEW_STATUS_CHOICES, types.Integer()), nullable=False,
                         default=EntryViewStatus.open, doc=u'显示状态：0-公开、1-私有、2-仅作者可见、3-隐藏')
    entry_status = Column(ChoiceType(ENTRY_STATUS_CHOICES, types.Integer()), nullable=False,
                          default=EntryStatus.draft, doc=u'内容状态：0-草稿、1-待审、2-已删除、3-发布、4-已接受')

    be_modified = Column(Integer, nullable=False, default=0, doc=u'被别人修改了')

    num_favorites = Column(Integer, nullable=False, default=0, doc=u'收藏数')
    num_retweet = Column(Integer, nullable=False, default=0, doc=u'转发数')
    num_views = Column(Integer, nullable=False, default=0, doc=u'阅读数')
    num_comments = Column(Integer, nullable=False, default=0, doc=u'评论/回复数')

    num_uninterested = Column(Integer, nullable=False, default=0, doc=u'不感兴趣数')

    # 置顶周期、推首页周期、
    #文章排序：（置顶周期）		标题样式：
    on_top = Column(Integer, nullable=False, default=0, doc=u'是否置顶')
    on_top_period = Column(Integer, nullable=True, default=14, doc=u'置顶周期: 缺省2周')
    on_portal = Column(Integer, nullable=False, default=0, doc=u'是否首页显示')
    on_portal_period = Column(Integer, nullable=True, default=14, doc=u'首页显示周期: 缺省2周')

    created_ip = Column(Integer, nullable=False, doc=u'创建时的IP')

    upward_time = Column(DateTime, nullable=False, doc=u'贴子互动/变更时间')
    published_time = Column(DateTime, doc=u'发布时间')

    ranking = Column(Integer, nullable=False, default=0, index=True, doc=u'热门度、权重')

    # 最后回复ID
    last_comment_id = Column(Integer, doc=u'最后回复ID')

    # 文档文件ID列表
    document_id_list = Column(DenormalizedText, default='[]', doc=u'文档文件ID列表')

    # 普通文件ID列表
    general_id_list = Column(DenormalizedText, default='[]', doc=u'普通文件ID列表')

    # 图片文件ID列表
    picture_id_list = Column(DenormalizedText, default='[]', doc=u'图片文件ID列表')

    @property
    def last_comment(self):
        return Comment.get_by_id(self.last_comment_id)

    @property
    def hot_support_comment(self):
        return Comment.get_hot_support_comment(self.id)

    @property
    def author(self):
        return UserService.get_brief_by_id(self.author_id)

    @property
    def author_name(self):
        return UserService.get_brief_by_id(self.author_id).nickname

    @property
    def category(self):
        print 'self.category_id: ', self.category_id
        return Category.get_by_id(self.category_id)

    @property
    def category_name(self):
        return Category.get_by_id(self.category_id).category_name

    @property
    def tags(self):
        tag_list = []

        for _id in self.tag_id_list:
            # todo
            tag_list.append(self.TagClass.get_by_id(_id))
        return tag_list

    @property
    def permissions(self):
        if g.user:
            return {
                'can_edit': self.author.id == g.user.id or g.user.is_supervisor,
                'can_del': self.author.id == g.user.id or g.user.is_supervisor
            }
        else:
            return {
                'can_edit': 0,
                'can_del': 0
            }

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

    @classmethod
    def get_by_id(cls, id_):
        #global simple_cache
        #key = 'entry_%d' % id
        #print key
        #if key in simple_cache:
        #    query = loads(simple_cache[key], scoped_session=db.session)
        #else:
        # todo cache
        return cls.query.get(int(id_))
        #serialized = dumps(query)
        #simple_cache[key] =  serialized
        # return query

    @staticmethod
    def get_entries_total():
        _total = Entry.query.filter(
            and_(Entry.entry_status == EntryStatus.published, Entry.view_status == EntryViewStatus.open)).count()
        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages

    @staticmethod
    def get_latest_entries_by_type(entry_type, page, size):
        return Entry.query.filter(and_(Entry.entry_type == entry_type, Entry.entry_status == EntryStatus.published,
                                       Entry.view_status == EntryViewStatus.open)).order_by(
            '%s %s' % ('id', Order.DESC)).limit(size).offset(size * (page - 1))

    @staticmethod
    def get_all_entries():
        return Entry.query.filter(
            and_(Entry.entry_status == EntryStatus.published, Entry.view_status == EntryViewStatus.open)).order_by(
            '%s %s' % ('id', Order.DESC)).all()

    @staticmethod
    def get_latest_entries(page, size):
        return Entry.query.filter(
            and_(Entry.entry_status == EntryStatus.published, Entry.view_status == EntryViewStatus.open)).order_by(
            '%s %s' % ('id', Order.DESC)).limit(size).offset(size * (page - 1))

    @staticmethod
    def get_by_category(category_id, page, size):
        return Entry.query.filter(and_(Entry.on_portal == True, Entry.entry_status == EntryStatus.published,
                                       Entry.view_status == EntryViewStatus.open,
                                       Entry.category_id == category_id)).order_by(
            'on_top DESC, %s %s' % ('upward_time', Order.DESC)).limit(size).offset(size * (page - 1))

    @staticmethod
    def get_by_entry_type(entry_type, page, size):
        return Entry.query.filter(and_(Entry.on_portal == True, Entry.entry_status == EntryStatus.published,
                                       Entry.view_status == EntryViewStatus.open,
                                       Entry.entry_type == entry_type)).order_by(
            'on_top DESC, %s %s' % ('upward_time', Order.DESC)).limit(size).offset(size * (page - 1))

    @staticmethod
    def get_latest_portal_entries(page, size):
        return Entry.query.filter(and_(Entry.on_portal == True, Entry.entry_status == EntryStatus.published,
                                       Entry.view_status == EntryViewStatus.open)).order_by(
            'on_top DESC, %s %s' % ('upward_time', Order.DESC)).limit(size).offset(size * (page - 1))

    @staticmethod
    def get_hot_entries(page, size):
        return Entry.query.filter(
            and_(Entry.entry_status == EntryStatus.published, Entry.view_status == EntryViewStatus.open)).order_by(
            '%s %s' % ('num_comments', Order.DESC)).limit(size).offset(size * (page - 1))

    @staticmethod
    def get_page_by_tag(tag, query, sort, order, page):
        q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
            TagEntryRelation.tag_id == tag.id)
        if q is None:
            abort(404)

        _total = q.count()
        _list = q.order_by('-entry.id').limit(PER_PAGE).offset(PER_PAGE * (page - 1)).all()
        #_list = db.session.query(Entry).from_statement("SELECT * FROM entry WHERE category_id =:category_id").params(category_id=category.id).all()

        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages, _list

    @classmethod
    def get_page_by_category(cls, category, tag, query, sort, order, page):
        # /栏目/search?q=mysql&catalog=7
        # /栏目/list?show=reply
        # /search?q=[python]+mysql+using+sqlalchemy
        # 查询规则：
        #
        # 根据 category.current_level 决定从Entry的哪一个category_id查询，一个3级
        #      category1_id、category2_id、category3_id、


        #q = None
        q = cls.query.filter_by(category_id=category)
        #if tag:
        #    if category.current_level == 1:
        #        q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
        #            and_(Entry.category1_id == category.id, TagEntryRelation.tag_id == tag.id))
        #
        #    if category.current_level == 2:
        #        q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
        #            and_(Entry.category2_id == category.id, TagEntryRelation.tag_id == tag.id))
        #
        #    if category.current_level == 3:
        #        q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
        #            and_(Entry.category3_id == category.id, TagEntryRelation.tag_id == tag.id))
        #else:
            #if category.current_level == 1:
            #    q = Entry.query.filter_by(category1_id=category.id)
            #
            #if category.current_level == 2:
            #    q = Entry.query.filter_by(category2_id=category.id)
            #
            #if category.current_level == 3:
            #    q = Entry.query.filter_by(category3_id=category.id)

        if q is None:
            abort(404)

        _total = q.count()
        #print '123:%s %s' % (sort, order)
        _list = q.order_by('%s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE * (page - 1)).all()
        #_list = db.session.query(Entry).from_statement("SELECT * FROM entry WHERE category_id =:category_id").params(category_id=category.id).all()

        _pages = int(ceil(_total / float(PER_PAGE)))

        entry_list = []
        for e in _list:
            entry_list.append(e.to_dict())

        return _total, _pages, entry_list

    @classmethod
    def get_page_by_category_id(cls, category, sort, order, page, page_size=20):
        # /栏目/search?q=mysql&catalog=7
        # /栏目/list?show=reply
        # /search?q=[python]+mysql+using+sqlalchemy
        # 查询规则：
        #
        q = cls.query.filter_by(category_id=category)

        if q is None:
            abort(404)

        _total = q.count()

        _list = q.order_by('%s %s' % (sort, order)).limit(page_size).offset(page_size * (page - 1)).all()

        _pages = int(ceil(_total / float(PER_PAGE)))

        entry_list = []
        for e in _list:
            entry_list.append(e.to_dict())

        return _total, _pages, entry_list

    @classmethod
    def get_page_by_category_and_entryType(cls, category, tag, query, sort, order, page, entryType):
        # /栏目/search?q=mysql&catalog=7
        # /栏目/list?show=reply
        # /search?q=[python]+mysql+using+sqlalchemy
        # 查询规则：
        #
        # 根据 category.current_level 决定从Entry的哪一个category_id查询，一个3级
        #      category1_id、category2_id、category3_id、


        q = None

        if tag:
            if category.current_level == 1:
                q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
                    and_(Entry.category1_id == category.id, TagEntryRelation.tag_id == tag.id))

            if category.current_level == 2:
                q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
                    and_(Entry.category2_id == category.id, TagEntryRelation.tag_id == tag.id))

            if category.current_level == 3:
                q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
                    and_(Entry.category3_id == category.id, TagEntryRelation.tag_id == tag.id))
        else:
            if category.current_level == 1:
                q = Entry.query.filter_by(category1_id=category.id, entry_type=entryType)

            if category.current_level == 2:
                q = Entry.query.filter_by(category2_id=category.id, entry_type=entryType)

            if category.current_level == 3:
                q = Entry.query.filter_by(category3_id=category.id, entry_type=entryType)

        if q is None:
            abort(404)

        _total = q.count()
        #print '123:%s %s' % (sort, order)
        _list = q.order_by('on_top DESC, %s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE * (page - 1))
        #_list = db.session.query(Entry).from_statement("SELECT * FROM entry WHERE category_id =:category_id").params(category_id=category.id).all()

        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages, _list

    @staticmethod
    def get_page_by_entryType(sort, order, page, entryType):
        # 根据类型获取文章列表

        q = None
        q = Entry.query.filter_by(entry_type=entryType)

        if q is None:
            abort(404)
        print "entrytype============================================================================="
        print q.count()
        print "entrytype============================================================================="
        _total = q.count()
        _list = q.order_by('on_top DESC, %s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE * (page - 1))

        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages, _list

    @staticmethod
    def get_entry_list_by_tag_id(tag_id, page=1, page_size=PER_PAGE, sort=None, order=None):
        q = Entry.query.join(TagEntryRelation, TagEntryRelation.entry_id == Entry.id).filter(
            TagEntryRelation.tag_id == tag_id)

        _total = q.count()
        _list = q.order_by('-entry.id').limit(PER_PAGE).offset(PER_PAGE * (page - 1))
        #_list = db.session.query(Entry).from_statement("SELECT * FROM entry WHERE category_id =:category_id").params(category_id=category.id).all()
        _pages = int(ceil(_total / float(PER_PAGE)))
        return _total, _pages, _list

    @staticmethod
    def get_page_by_user(user_id, tag, entry_type, query, sort, order, page):
        q = None

        if entry_type:
            q = Entry.query.filter(and_(Entry.author_id == user_id, Entry.entry_type == entry_type))
        else:
            q = Entry.query.filter(and_(Entry.author_id == user_id))

        if q is None:
            abort(404)

        _total = q.count()
        _list = q.order_by('-entry.id').limit(PER_PAGE).offset(PER_PAGE * (page - 1))

        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages, _list

    @staticmethod
    def add_or_update(category, entry, is_draft, is_auto_save_img=False):
        # 保存数据

        is_new = False

        if entry.id is None:
            # 是新建的数据
            is_new = True
            # todo wqq:如果是管理员权限才能允许表单递交author_id
            #if not g.user.is_supervisor:
            #    entry.author_id = g.user.id
            entry.author_id = 1
            entry.created_ip = get_remote_ip()
            # entry.created_time = sys_now()
            # entry.updated_time = entry.created_time
            entry.upward_time = sys_now()
            entry.category_id = category.id
            entry.entry_type = category.entry_type

        #if is_auto_save_img:
        #    # 是否自动保存图片
        #    entry.content = auto_save_img(entry.content, app.config['SITE_DOMAIN'], PHOTOS_RELATIVE_PATH)

        # 只有管理员可以设置是否推首页、置顶
        #if not g.user.is_supervisor:
        #    entry.on_top = 0

        # todo 先默认是推到首页的，以后考虑可以配置
        entry.on_portal = 1

        if is_draft:
            entry.entry_status = EntryStatus.draft
        else:
            # 低权限的文章要审核
            #if category.need_review and (not g.user.is_supervisor):
            #print '低权限的文章要审核:', app.config['SAFE_POST_START_TIME'], app.config['SAFE_POST_END_TIME'], check_in_rank(app.config['SAFE_POST_START_TIME'], app.config['SAFE_POST_END_TIME'])

            #if (not g.user.is_editor) and (
            #    not check_in_rank(app.config['SAFE_POST_START_TIME'], app.config['SAFE_POST_END_TIME'])):
            #    # 需要审核
            #    entry.entry_status = EntryStatus.pending
            #else:
            #    entry.entry_status = EntryStatus.published
            #    entry.published_id = g.user.id
            #
            #    if not entry.published_time:
            #        entry.published_time = sys_now()
            #
            #if gfw.check(entry.content) or gfw.check(entry.title):
            #    # 需要审核
            #    entry.entry_status = EntryStatus.pending
            entry.entry_status = EntryStatus.pending

        # 处理摘要
        if not entry.summary:
           # 自动产生摘要
           entry.summary = extract_summary(entry.content)

        # 开始处理tags
        old_tags_list = []

        if not is_new:
            # old_tags_list = json_decode(entry.tags)
            entry.updated_time = sys_now()

        new_tags_list = request.form.getlist('m_tags')

        #entry.tags = json_encode(new_tags_list)

        if is_new:
            db.session.add(entry)
        db.session.flush()

        if entry.id is None:
            print '出错了'
            db.session.rollback()
            return False

        # # 要删除的标签
        # del_tags_list = [val for val in old_tags_list if val not in new_tags_list]
        #
        # # 要添加的标签
        # add_tags_list = [val for val in new_tags_list if val not in old_tags_list]
        #
        # if del_tags_list:
        #     # 删除 tag_entry_relation （标签的文章关联）
        #     TagEntryRelationService.del_relation(entry.id, del_tags_list)
        #
        #     # 更新 tag_category_relation （标签的分类计数）
        #     TagCategoryRelationService.del_relation(category, del_tags_list)
        #
        # if add_tags_list:
        #     # 添加 tag_entry_relation （标签的文章关联）
        #     TagEntryRelationService.add_relation(entry.id, add_tags_list)
        #
        #     # 标签内容数 + 1
        #     TagService.inc_entry_count(add_tags_list)
        #
        #     # 更新 tag_category_relation （标签的分类关联、计数）
        #     TagCategoryRelationService.add_relation(category, add_tags_list)

        if not entry.slug:
            # 文章URL自动生成规则
            # 文章标题: {title_name}
            # 文章ID: {title_id}
            # 栏目名: {category_name}
            # 栏目固定地址: {category_slug}
            # 时间戳: {timestamp}
            # 时间: {time}
            # 日期: {date}

            entry.slug = category.entry_url_rule.replace('{title_name}', '%s' % entry.title) \
                .replace('{title_id}', '%d' % entry.id) \
                .replace('{category_name}', '%s' % category.category_name) \
                .replace('{category_slug}', category.slug) \
                .replace('{timestamp}', '%s' % str(int(time()))) \
                .replace('{time}', format_time_with_path(int(time()))) \
                .replace('{date}', format_date_with_path(int(time()))).replace('//', '/')

            if entry.slug[0] == '/':
                entry.slug = entry.slug[1:]

        db.session.commit()

        #print '保存成功了'
        return True

    @staticmethod
    def inc_num_comments(entry_id, num):
        entry = Entry.get_by_id(entry_id)
        entry.num_comments = Entry.__table__.c.num_comments + num
        entry.ranking = entry.num_views + (10 * entry.num_useful) + (10 * entry.num_favorites) + (
            10 * entry.num_retweet) \
                        + (5 * entry.num_oppositions) + (7 * entry.num_comments) + (5 * entry.num_useless) + (
                            7 * entry.num_supports)

        db.session.commit()
        app.config['content_updated_time'] = sys_now()

    @staticmethod
    def calc_ranking(entry, ext_num=0):
        entry.ranking = entry.num_views + (10 * entry.num_useful) + (10 * entry.num_favorites) \
                        + (10 * entry.num_retweet) + (5 * entry.num_oppositions) + (7 * entry.num_comments) \
                        + (-5 * entry.num_useless) + (7 * entry.num_thanks) + (-7 * entry.num_uninterested) + ext_num

    @staticmethod
    def inc_num_views(entry_id, num):
        entry = Entry.get_by_id(entry_id)
        entry.num_views = Entry.__table__.c.num_views + num
        Entry.calc_ranking(entry)

        db.session.commit()

    @staticmethod
    def favorites(user_id, entry_id, title, tags, description):
        # 收藏
        # 取出,还是客户端传人？
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_favorites:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_favorites = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)

        if not entry:
            return False

        favorites_id = FavoritesService.add_favorites(user_id, entry_id, entry.author_id, title, tags, description,
                                                      entry.entry_type)

        if not favorites_id:
            return False

        entry.num_favorites = Entry.__table__.c.num_favorites + 1

        Entry.calc_ranking(entry, 8)
        db.session.commit()

        return True

    @staticmethod
    def useful(entry_id, user_id):
        # 有用数
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_useful:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_useful = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_useful = Entry.__table__.c.num_useful + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True

    @staticmethod
    def useless(entry_id, user_id):
        # 无用数
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_useless:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_useless = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_useless = Entry.__table__.c.num_useless + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True

    @staticmethod
    def supports(entry_id, user_id):
        # 支持
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_supports:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_supports = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_supports = Entry.__table__.c.num_supports + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True

    @staticmethod
    def oppositions(entry_id, user_id):
        # 反对
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_oppositions:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_oppositions = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_oppositions = Entry.__table__.c.num_oppositions + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True

    @staticmethod
    def scores(entry_id, user_id, scores):
        # 评分
        entry = Entry.get_by_id(entry_id)
        entry.scores = (Entry.__table__.c.scores + scores) / 2
        Entry.calc_ranking(entry + 8)
        db.session.commit()
        return True

    @staticmethod
    def difficulty(entry_id, user_id, difficulty):
        # 难易度
        entry = Entry.get_by_id(entry_id)
        entry.difficulty = (Entry.__table__.c.difficulty + difficulty) / 2
        Entry.calc_ranking(entry + 8)
        db.session.commit()
        return True

    @staticmethod
    def on_portal(entry_id, user_id, enable):
        # 推首页
        entry = Entry.get_by_id(entry_id)
        entry.on_portal = enable
        db.session.commit()
        return True

    @staticmethod
    def on_top(entry_id, user_id, enable):
        # 置顶
        entry = Entry.get_by_id(entry_id)
        entry.on_top = enable
        db.session.commit()
        return True

    @staticmethod
    def publish(entry_id, user_id):
        # 审核后发布
        entry = Entry.get_by_id(entry_id)
        entry.entry_status = EntryStatus.published
        db.session.commit()
        return True

    @staticmethod
    def hide(entry_id, user_id):
        # 隐藏
        entry = Entry.get_by_id(entry_id)
        entry.view_status = EntryViewStatus.hide
        db.session.commit()
        return True

    @staticmethod
    def open(entry_id, user_id):
        # 打开文章
        entry = Entry.get_by_id(entry_id)
        entry.view_status = EntryViewStatus.open
        db.session.commit()
        return True

    @staticmethod
    def close_comment(entry_id, user_id):
        # 关闭评论
        entry = Entry.get_by_id(entry_id)
        entry.comment_status = EntryCommentStatusType.close
        db.session.commit()
        return True

    @staticmethod
    def open_comment(entry_id, user_id):
        # 打开评论
        entry = Entry.get_by_id(entry_id)
        entry.comment_status = EntryCommentStatusType.open
        db.session.commit()
        return True

    @staticmethod
    def retweet(entry_id, user_id):
        # 转发次数
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_retweet:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_retweet = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_retweet = Entry.__table__.c.num_retweet + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True

    @staticmethod
    def complain(entry_id, user_id):
        """
        投诉
        :param entry_id:
        :param user_id:
        :return:
        """
        #todo
        return True

    @staticmethod
    def get_weekly_entries(category):
        # 获取7天内的内容

        q = None

        if category.current_level == 1:
            q = Entry.query.filter(
                and_(Entry.category1_id == category.id, Entry.published_time >= day_before_str(sys_now(), 7)))

        if category.current_level == 2:
            q = Entry.query.filter(
                and_(Entry.category2_id == category.id, Entry.published_time >= day_before_str(sys_now(), 7)))

        if category.current_level == 3:
            q = Entry.query.filter(
                and_(Entry.category3_id == category.id, Entry.published_time >= day_before_str(sys_now(), 7)))

        if q is None:
            return []

        _list = q.order_by('-entry.ranking').limit(PER_PAGE)

        return _list

    @staticmethod
    def get_monthly_entries(category):
        # 获取30天内的内容

        q = None

        if category.current_level == 1:
            q = Entry.query.filter(
                and_(Entry.category1_id == category.id, Entry.published_time >= day_before_str(sys_now(), 30)))

        if category.current_level == 2:
            q = Entry.query.filter(
                and_(Entry.category2_id == category.id, Entry.published_time >= day_before_str(sys_now(), 30)))

        if category.current_level == 3:
            q = Entry.query.filter(
                and_(Entry.category3_id == category.id, Entry.published_time >= day_before_str(sys_now(), 30)))

        if q is None:
            return []

        _list = q.order_by('-entry.ranking').limit(PER_PAGE)

        return _list

    @staticmethod
    def get_related_entries(entry_type):
        # todo 获取相关的内容
        #query = {'entry_type': entry_type}
        #return self.get_page(condition=query, sort='_id', order=Order.DESC)
        return []

    @staticmethod
    def get_statistic_by_author_id(author_id):
        statistic = range(len(entry_type_str))
        for i in range(len(entry_type_str)):
            statistic[i] = Entry.query.filter(and_(Entry.author_id == author_id, Entry.entry_type == i)).count()

        return statistic

    @staticmethod
    def delete(entry):
        # todo 超过一定时间的也不让删除？

        count_entry = Comment.count_by_entry_id(entry.id)
        if count_entry > 0:
            # 软删除
            pass
        else:
            db.session.delete(entry)

        # 删除相关评论等相关数据
        Comment.del_by_entry_id(entry.id)

        # 分类的文章数减少
        # 只支持3级分类
        if entry.category.current_level == 1:
            Category.dec_entry_count(entry.category1_id)

        if entry.category.current_level == 2:
            Category.dec_entry_count(entry.category1_id)
            Category.dec_entry_count(entry.category2_id)

        if entry.category.current_level == 3:
            Category.dec_entry_count(entry.category1_id)
            Category.dec_entry_count(entry.category2_id)
            Category.dec_entry_count(entry.category3_id)

        # 要删除的标签
        del_tags_list = json_decode(entry.tags)

        if del_tags_list:
            # 删除 tag_entry_relation （标签的文章关联）
            TagEntryRelationService.del_relation(entry.id, del_tags_list)
            TagService.dec_entry_count(del_tags_list)

            # 更新 tag_category_relation （标签的分类计数）
            TagCategoryRelationService.del_relation(entry.category, del_tags_list)

        db.session.delete(entry)
        db.session.commit()

        return True

    @staticmethod
    def modify_last_comment(entry_id, comment_id):
        entry = Entry.get_by_id(entry_id)
        entry.last_comment_id = comment_id
        entry.upward_time = sys_now()

        db.session.commit()

    @staticmethod
    def thanks(entry_id, user_id):
        # 感谢
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_thanks:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_thanks = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_thanks = Entry.__table__.c.num_thanks + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True

    @staticmethod
    def uninterested(entry_id, user_id):
        # 不感兴趣
        interact = EntryUserInteractService.get_by_entry_and_user_id(entry_id, user_id)
        if interact and interact.has_uninterested:
            return True

        if not interact:
            interact = EntryUserInteract()
            interact.user_id = user_id
            interact.entry_id = entry_id

        interact.has_uninterested = 1

        EntryUserInteractService.add_or_update(interact)

        entry = Entry.get_by_id(entry_id)
        entry.num_uninterested = Entry.__table__.c.num_uninterested + 1
        Entry.calc_ranking(entry)
        db.session.commit()
        return True


# 数据管理类
class EntryAdmin(ModelAdmin):
    # 列表视图可见列
    column_list = (
        'category_name', 'title', 'author_name', 'slug', 'on_top', 'on_portal', 'entry_type', 'comment_status',
        'view_status', 'entry_status')

    # 列表视图不可见列
    # excluded_list_columns = ['content']

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    # sortable_columns = ('title', ('user', User.username), 'date')

    # 列表视图 列名别名
    # rename_columns = dict(title=u'Post Title')

    # 定义搜索列
    column_searchable_list = ('title', 'content')

    # 定义过滤列
    column_filters = ('title',
                      'on_top',
                      'on_portal',
                      'comment_status',
                      'view_status',
                      'entry_status')

    #filters.FilterLike(Post.title, 'Fixed Title', options=(('test1', 'Test 1'), ('test2', 'Test 2'))))

    # 设置表单的属性和验证信息
    # form_args = dict(
    #    text=dict(label='Big Text', validators=[wtf.required(), Length(min=1, max=2000, message="Length range: 1 - 2000")])
    # )

    # def get_create_form(self):
    #     return EntryNewForm
    #
    # def get_edit_form(self):
    #     return EntryEditForm
    #
    # def create_model(self, form):
    #     """
    #         Create model from form.
    #
    #         `form`
    #             Form instance
    #     """
    #     try:
    #         model = self.model()
    #         form.populate_obj(model)
    #
    #         print 'TAGS:', request.form.getlist('m_tags')
    #         model.tags = json_encode(request.form.getlist('m_tags'))
    #
    #         model.author_id = g.user.id
    #         model.created_ip = get_remote_ip()
    #
    #         self.session.add(model)
    #
    #         self.session.commit()
    #
    #         if not model.slug:
    #             model.slug = '/%d' % model.id
    #
    #         self.session.commit()
    #
    #         return True
    #     except Exception as ex:
    #         flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
    #         return False
    #
    # def update_model(self, form, model):
    #     try:
    #         form.populate_obj(model)
    #
    #         if model.entry_status == EntryStatus.published:
    #             model.published_time = sys_now()
    #
    #         #print 'TAGS:', request.form.getlist('m_tags')
    #         #model.tags = request.form.getlist('m_tags')
    #
    #         self.session.commit()
    #         return True
    #     except Exception as ex:
    #         flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
    #         return False
    #
    # create_template = 'admin/entry/create.html'
    # edit_template = 'admin/entry/edit.html'

    # can_create = False
    # can_edit = True
    # can_delete = False

    # def __init__(self, session, name=None, category=None, endpoint=None, url=None):
    #     # 初始化
    #     super(EntryAdmin, self).__init__(Entry, session, name, category, endpoint, url)
    #     # self.list_template = 'admin/post/list.html'


# from sqlalchemy.ext.serializer import loads, dumps
#
# simple_cache = {}
