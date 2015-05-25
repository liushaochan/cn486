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

__doc__ = '消息 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from math import ceil

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from infopub.helpers.extensions import db
from sqlalchemy.sql.expression import and_
from infopub.bases.localtime import int_now, sys_now
from infopub.bases.model_base import PER_PAGE, Order
from infopub.models.user import UserService
from infopub.configs.admin import PermissionView
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash


# 数据类
class Message(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')
    sender_id = Column(Integer, nullable=False, doc=u'发送人ID')
    receiver_id = Column(Integer, nullable=False, doc=u'接收人ID')
    title = Column(String(50), nullable=False, doc=u'标题')
    content = Column(String(400), nullable=False, doc=u'内容')
    message_status = Column(Integer, doc=u'链接状态：0-未读、1-已读、2-已删除')
    read_time = Column(Integer, nullable=False, doc=u'阅读时间')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    @property
    def sender(self):
        return UserService.get_by_id(self.sender_id)

    def __unicode__(self):
        return '%d' % self.id

    def __repr__(self):
        return self.id

# 数据管理类
class MessageAdmin(PermissionView):
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
        super(MessageAdmin, self).__init__(Message, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = Message()
            form.populate_obj(model)

            MessageService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            MessageService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False


class MessageService(object):
    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        return model.id

    def count_by_receiver_id(self, receiver_id):
        return self.count({'receiver_id': receiver_id})

    def get_by_id(self, id, fields=None):
        msg = self.get_by_id({'_id': id}, fields)
        msg['sender'] = UserService.getnick_by_id(msg['sender_id'])
        return msg

    @staticmethod
    def getlist_by_receiver_id(receiver_id, page=1, sort='id', order=Order.DESC):
        q = Message.query.filter(and_(Message.receiver_id == receiver_id, Message.message_status <= 1))
        _total = q.count()
        _list = q.order_by('%s %s' % (sort, order)).limit(PER_PAGE).offset(PER_PAGE * (page - 1))

        _pages = int(ceil(_total / float(PER_PAGE)))

        return _total, _pages, _list

    def update_read_status_by_id(self, id):
        self.update_by_id(id, {'read_time': int_now(), 'message_status': 1})

    @staticmethod
    def get_count_by_user_id(user_id):
        return Message.query.filter(and_(Message.receiver_id == user_id, Message.message_status == 0)).count()