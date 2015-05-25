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

from flask.ext.sqlalchemy import BaseQuery
from flask.globals import g
from runkit.dao.dao_base import PER_PAGE
from runkit.humanize.localtime import sys_now
from runkit.model.bases import BaseMixin, Order
from runkit.model.utils import JsonSerializer
from runkit.web.flask_ext.admin_manager import ModelAdmin
from runkit.web.flask_ext.sql import db
from sqlalchemy.sql.expression import and_
from infopub.models.user import UserService


__doc__ = '回复、评论 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Text, Integer, String, DateTime
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash


class CommentBodyType(object):
    # '类型：0-回复、1-问题补充、2-点评、3-赏析
    comment = 0
    annex = 1
    reply = 2
    appreciation = 3


class CommentStatusType(object):
    # 评论状态：0-显示、1-待审、2-禁止、3-被删除
    view = 0
    pending = 1
    baned = 2
    deleted = 3

# 数据类
class CommentJsonSerializer(JsonSerializer):
    __json_hidden__ = []


class CommentQuery(BaseQuery):

    def jsonify(self):
        for entry in self.all():
            yield entry.json

    def getall(self):
        return self.order_by(Comment.id.desc())


# 数据类
class Comment(CommentJsonSerializer, db.Model, BaseMixin, TimestampMixin):
    __tablename__ = 'comment'
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    query_class = CommentQuery

    body_type = Column(Integer, nullable=False, index=True, doc=u'类型：0-回复、1-问题补充、2-点评、3-赏析')
    body = db.Column(db.Text, doc=u'回复的内容')
    body_html = db.Column(db.Text, doc=u'回复的内容')
    # comment = Column(Text, nullable=False, doc=u'回复内容')

    chunk_id = Column(Integer, nullable=False, index=True, default=0, doc=u'文章块序号')

    entry_id = Column(Integer, nullable=False, index=True, doc=u'主体ID')
    parent_id = Column(Integer, nullable=False, index=True, doc=u'父ID')
    accepted = Column(Integer, nullable=False, index=True, default=False, doc=u'是否接受')
    comment_status = Column(Integer, nullable=False, default=0, doc=u'评论状态：0-显示、1-待审、2-禁止')

    # num_favorites = Column(Integer, nullable=False, default=0, doc=u'收藏数')
    # num_supports = Column(Integer, nullable=False, default=0, doc=u'支持数')
    # num_oppositions = Column(Integer, nullable=False, default=0, doc=u'反对数')
    num_useful = Column(Integer, nullable=False, default=0, doc=u'有用数')
    num_useless = Column(Integer, nullable=False, default=0, doc=u'无用数')
    num_thanks = Column(Integer, nullable=False, default=0, doc=u'感谢数')
    # num_uninterested = Column(Integer, nullable=False, default=0, doc=u'不感兴趣数')
  # `up_vote` int(11) DEFAULT NULL,
  # `down_vote` int(11) DEFAULT NULL,
  # `last_touched` datetime DEFAULT NULL,

    num_retweet = Column(Integer, nullable=False, default=0, doc=u'转发数')

    author_id = Column(Integer, index=True, doc=u'作者ID')
    email = Column(String(50), doc=u'邮箱')
    homepage = Column(String(50), doc=u'个人主页')
    nickname = Column(String(20), doc=u'昵称')
    slug = Column(String(50), unique=True, doc=u'固定地址')

    be_modified = Column(Integer, nullable=False, default=False, doc=u'被别人修改了')

    # created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    # updated_time = Column(DateTime, nullable=False, doc=u'更新时间')
    created_ip = Column(Integer, nullable=False, doc=u'创建时的IP')
    version = Column(Integer, nullable=False, default=1, doc=u'内容的版本')

    # author_id = db.Column(db.Integer,
    #                       db.ForeignKey(User.id, ondelete='CASCADE'),
    #                       nullable=False)
    #
    # post_id = db.Column(db.Integer,
    #                     db.ForeignKey(Post.id, ondelete='CASCADE'),
    #                     nullable=False)
    #
    # parent_id = db.Column(db.Integer,
    #                       db.ForeignKey("comments.id", ondelete='CASCADE'))
    #
    # score = db.Column(db.Integer, default=1)
    # votes = db.Column(DenormalizedText)
    #
    # author = db.relation(User, innerjoin=True, lazy="joined")
    #
    # post = db.relation(Post, innerjoin=True, lazy="joined")

    # parent = db.relation('Comment', remote_side=[id])

    def __init__(self):
        super(Comment, self).__init__()
        self.votes = self.votes or set()

    @property
    def entry(self):
        from infopub.models.content.entry import Entry

        return Entry.get_by_id(self.entry_id)

    @property
    def entry_title(self):
        from infopub.models.content.entry import Entry

        return Entry.get_by_id(self.entry_id).title

    @property
    def author(self):
        return UserService.get_brief_by_id(self.author_id)

    @property
    def sub_comments(self):
        sub_comments = Comment.get_sublist_by_entry_id(self.id)
        return sub_comments

    @property
    def sub_comments_count(self):
        return Comment.count_sublist_by_entry_id(self.id)

    @property
    def permissions(self):
        if g.user:
            return {
                'can_edit': self.author.id == g.user.id or g.user.is_supervisor,
                'can_del': self.author.id == g.user.id or g.user.is_supervisor,
                'reply': self.parent_id == 0
            }
        else:
            return {
                'can_edit': 0,
                'can_del': 0,
                'reply': self.parent_id == 0
            }

    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        return model.id

    @staticmethod
    def get_hot_support_comment(entry_id):
        return Comment.query.filter(
            and_(Comment.entry_id == entry_id, Comment.comment_status == CommentStatusType.view)).order_by(
            '(num_supports-num_oppositions) desc').first()

    @staticmethod
    def get_by_id(id):
        #key = 'comment_%d' % id
        #print 'CACHE:', key
        #if key in simple_cache:
        #    query = loads(simple_cache[key], scoped_session=db.session)
        #else:
        query = Comment.query.filter(Comment.id == id).first()
        #serialized = dumps(query)
        #simple_cache[key] =  serialized
        return query

    @staticmethod
    def update_time(parent_id):
        comment = Comment.get_by_id(parent_id)
        comment.updated_time = sys_now()

        db.session.commit()

    @staticmethod
    def add(comment):
        comment.created_time = sys_now()
        comment.updated_time = comment.created_time
        db.session.add(comment)
        db.session.commit()

        return comment.id is not None

    @staticmethod
    def delete(comment):
        db.session.delete(comment)
        db.session.commit()

    @staticmethod
    def count_by_entry_id(entry_id):
        return Comment.query.filter(
            and_(Comment.entry_id == entry_id, Comment.comment_status == CommentStatusType.view)).count()

    @staticmethod
    def count_by_parent_id(parent_id):
        return Comment.query.filter(Comment.parent_id == parent_id).count()

    @staticmethod
    def count_by_author_id(author_id):
        return Comment.query.filter(Comment.author_id == author_id).count()

    @staticmethod
    def softdel_by_id(comment):
        comment.comment = ''
        comment.comment_status = CommentStatusType.deleted

        db.session.commit()
        return True

    @staticmethod
    def getlist_by_author_id(author_id, page, sort='id', order=Order.DESC):
        q = Comment.query.filter(Comment.author_id == author_id)
        _total = q.count()
        _list = q.order_by('%s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE * (page - 1))

        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages, _list

    @staticmethod
    def get_toplist_by_entry_id(entry_id, sort='updated_time', order=Order.DESC, page=1):
        #return Comment.query.filter(and_(Comment.entry_id == entry_id, Comment.parent_id == 0, Comment.comment_status==CommentStatusType.view)).order_by('%s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE*(page-1))
        return Comment.query.filter(and_(Comment.entry_id == entry_id, Comment.parent_id == 0,
                                         Comment.body_type == CommentBodyType.comment)).order_by(
            '%s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE * (page - 1))

    @staticmethod
    def get_appreciation_by_entry_id(entry_id, chunk_id, sort='updated_time', order=Order.DESC, page=1):
        return Comment.query.filter(
            and_(Comment.entry_id == entry_id, Comment.body_type == CommentBodyType.appreciation,
                 Comment.chunk_id == chunk_id)).order_by('%s %s' % (sort, order)).limit(PER_PAGE).offset(
            PER_PAGE * (page - 1))

    @staticmethod
    def get_sublist_by_entry_id(parent_id):
        #return Comment.query.filter("comment.parent_id in (%s)" % list_to_str(parent_id_list))
        #return Comment.query.filter(Comment.parent_id == parent_id, Comment.comment_status==CommentStatusType.view).all()
        return Comment.query.filter(Comment.parent_id == parent_id).all()

    @staticmethod
    def count_sublist_by_entry_id(parent_id):
        return Comment.query.filter(Comment.parent_id == parent_id,
                                    Comment.comment_status == CommentStatusType.view).count()

    @staticmethod
    def del_by_entry_id(entry_id):
        for instance in db.session.query(Comment).filter_by(entry_id=entry_id):
            db.session.delete(instance)
        db.session.commit()

        return True

    @staticmethod
    def get_latest_comments():
        return Comment.query.filter(
            and_(Comment.parent_id == 0, Comment.comment_status == CommentStatusType.view)).order_by(
            '%s %s' % ('id', Order.DESC)).limit(PER_PAGE).offset(0)

    @staticmethod
    def get_latest_comment_by_entry(entry_id):
        return Comment.query.filter(and_(Comment.parent_id == 0, Comment.entry_id == entry_id)).order_by(
            '%s %s' % ('id', Order.DESC)).first()

    @staticmethod
    def favorite(user_id, entry_id, title, tags, description):
        # 收藏
        #

        comment = get_comments_service().get_by_id(entry_id, ['author_id'])
        if not comment:
            return False

        get_favorites_service().add_favorites(user_id, entry_id, comment['author_id'], title, tags, description,
                                              EntryType.comment)
        # 收藏数 +1

        return True

    @staticmethod
    def accepted(id, user_id):
        # 接受
        comment = Comment.get_by_id(id)
        comment.accepted = 1
        db.session.commit()
        return True

    #    has_favorites = Column(Integer, nullable=False, default=0, doc=u'已经收藏')
    #    has_retweet = Column(Integer, nullable=False, default=0, doc=u'已经转发')
    #    has_thanks = Column(Integer, nullable=False, default=0, doc=u'已经感谢')
    #    has_uninterested = Column(Integer, nullable=False, default=0, doc=u'已经不感兴趣')

    @staticmethod
    def useful(id, user_id):
        interact = CommentUserInteractService.get_by_comment_user_id(id, user_id)
        if interact and interact.has_useful:
            return True

        if not interact:
            interact = CommentUserInteract()
            interact.user_id = user_id
            interact.comment_id = id

        interact.has_useful = 1

        CommentUserInteractService.add_or_update(interact)

        comment = Comment.get_by_id(id)
        comment.num_useful = Comment.__table__.c.num_useful + 1
        db.session.commit()

        return True

    @staticmethod
    def useless(id, user_id):
        interact = CommentUserInteractService.get_by_comment_user_id(id, user_id)
        if interact and interact.has_useless:
            return True

        if not interact:
            interact = CommentUserInteract()
            interact.user_id = user_id
            interact.comment_id = id

        interact.has_useless = 1

        CommentUserInteractService.add_or_update(interact)

        comment = Comment.get_by_id(id)
        comment.num_useless = Comment.__table__.c.num_useless + 1
        db.session.commit()

        return True

    @staticmethod
    def supports(id, user_id):
        interact = CommentUserInteractService.get_by_comment_user_id(id, user_id)
        if interact and interact.has_supports:
            return True

        if not interact:
            interact = CommentUserInteract()
            interact.user_id = user_id
            interact.comment_id = id

        interact.has_supports = 1

        CommentUserInteractService.add_or_update(interact)

        comment = Comment.get_by_id(id)
        comment.num_supports = Comment.__table__.c.num_supports + 1
        db.session.commit()

        return True

    @staticmethod
    def oppositions(id, user_id):
        interact = CommentUserInteractService.get_by_comment_user_id(id, user_id)
        if interact and interact.has_oppositions:
            return True

        if not interact:
            interact = CommentUserInteract()
            interact.user_id = user_id
            interact.comment_id = id

        interact.has_oppositions = 1

        CommentUserInteractService.add_or_update(interact)

        comment = Comment.get_by_id(id)
        comment.num_oppositions = Comment.__table__.c.num_oppositions + 1
        db.session.commit()

        return True

    @staticmethod
    def comment_status(id, status):
        comment = Comment.get_by_id(id)
        comment.comment_status = status

        db.session.commit()
        return True

    @staticmethod
    def get_comments_total():
        _total = Comment.query.filter(Comment.parent_id == 0).count()
        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages

    def __unicode__(self):
        return self.id

    def __repr__(self):
        return self.id

    def vote(self, user):
        self.votes.add(user.id)

    def _url(self, _external=False):
        return '%s#comment-%d' % (self.post._url(_external), self.id)

    # @cached_property
    # def url(self):
    #     return self._url()
    #
    # @cached_property
    # def permalink(self):
    #     return self._url(True)
    #
    # @cached_property
    # def markdown(self):
    #     return Markup(markdown(self.comment or ''))

# ------------- SIGNALS ----------------#

def update_num_comments(sender):
    sender.num_comments = \
        Comment.query.filter(Comment.post_id==sender.id).count()

    db.session.commit()


# signals.comment_added.connect(update_num_comments)
# signals.comment_deleted.connect(update_num_comments)


# 数据管理类
class CommentAdmin(ModelAdmin):
    # 列表视图可见列
    column_list = ('body_type', 'entry_title', 'nickname', 'email', 'comment', 'accepted', 'comment_status')

    # 列表视图不可见列
    # excluded_list_columns = ['content']

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    # sortable_columns = ('title', ('user', User.username), 'date')

    # 列表视图 列名别名
    # rename_columns = dict(title=u'Post Title')

    # 定义搜索列
    #    column_searchable_list = ('comment')

    # 定义过滤列
    column_filters = ('body_type',
                      'nickname',
                      'email',
                      'comment',
                      'accepted',
                      'comment_status')
    #filters.FilterLike(Post.title, 'Fixed Title', options=(('test1', 'Test 1'), ('test2', 'Test 2'))))

    # 设置表单的属性和验证信息
    # form_args = dict(
    #    text=dict(label='Big Text', validators=[wtf.required(), Length(min=1, max=2000, message="Length range: 1 - 2000")])
    # )

    def __init__(self, session, name=None, category=None, endpoint=None, url=None):
        # 初始化
        super(CommentAdmin, self).__init__(Comment, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = Comment()
            form.populate_obj(model)

            Comment.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            Comment.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False

    def get_edit_form(self):
        return CommentEditForm

    can_create = False
    can_edit = True
    can_delete = False


simple_cache = {}


