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
import json
from flask_admin.contrib.sqlamodel import filters
from infopub.bases.localtime import sys_now
from infopub.configs.admin import PermissionView
from infopub.configs.globals import PROJECT_DIRECTORY

__doc__ = '保留的关键词，比如：admin、管理员等系统内定 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from infopub.helpers.extensions import db
from flask.ext.babelex import lazy_gettext as _
from infopub.forms.word_reserved import WordReservedNewForm, WordReservedEditForm
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash

# 数据类
class WordReserved(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    word = Column(String(100), nullable=False, unique=True, index=True, doc=u'关键词')
    word_type = Column(Integer, nullable=False, doc=u'类型：0-包含、1-相同')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    @property
    def word_type_name(self):
        return [_("contain"), _("equal")][self.word_type]

    def __unicode__(self):
        return self.word

    def __repr__(self):
        return self.id

# 数据管理类
class WordReservedAdmin(PermissionView):
    # 列表视图可见列
    list_columns = ('id', 'word', 'word_type_name')

    # 列表视图不可见列
    # excluded_list_columns = ['content']

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    # sortable_columns = ('title', ('user', User.username), 'date')

    # 列表视图 列名别名
    # rename_columns = dict(title=u'Post Title')

    # 定义搜索列
    column_searchable_list = ('word', WordReserved.word)

    # 定义过滤列
    column_filters = (filters.FilterLike(WordReserved.word, u'单词'),
                      filters.FilterEqual(WordReserved.word_type, 'Word Type',
                                          options=(('0', 'contain'), ('1', 'equal'))),
    )

    # 设置表单的属性和验证信息
    #form_args = dict(
    #    word_type=dict(choices=[('0', _("Article")), ('1', _("News"))])
    #)

    def get_create_form(self):
        return WordReservedNewForm

    def get_edit_form(self):
        return WordReservedEditForm

    def __init__(self, session, name=None, category=None, endpoint=None, url=None):
        # 初始化
        super(WordReservedAdmin, self).__init__(WordReserved, session, name, category, endpoint, url)

    def create_model(self, form):
        try:
            model = WordReserved()
            form.populate_obj(model)

            WordReservedService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            WordReservedService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False


class WordReservedService(object):
    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        return model.id

    @staticmethod
    def get_by_id(id):
        return WordReserved.query.filter(WordReserved.id == id).first()

    @staticmethod
    def get_by_word(word):
        return WordReserved.query.filter(WordReserved.word == word).first()

    @staticmethod
    def word_allowed(word):
        return True

    @staticmethod
    def check_word(word):
        # 检查给定的单词是否保留词
        list = [] #self.get_list()

        for w in list:
            if w['word_type'] == 1:     # 完全相同
                if w['word'] == word:
                    return True
            else:
                if word.find(w['word']) > -1:
                    return True

        return False

    @staticmethod
    def get_list():
        return WordReserved.query.all()

    @staticmethod
    def init_word():
        file = open(PROJECT_DIRECTORY + 'db/word_reserved.json')
        word_reserved_dict = json.load(file)
        file.close()

        for word_reserved in word_reserved_dict:
            word = WordReservedService.get_by_word(word_reserved['word'])

            if word:
                continue

            word = WordReserved()
            word.word = word_reserved['word']
            word.word_type = word_reserved['word_type']
            word.created_time = sys_now()
            word.updated_time = word.created_time
            db.session.add(word)

        db.session.commit()
