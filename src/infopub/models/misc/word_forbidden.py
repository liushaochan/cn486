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
from infopub.bases.localtime import sys_now
from infopub.configs.admin import PermissionView
from infopub.configs.globals import PROJECT_DIRECTORY

__doc__ = '严禁的关键词 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from flask.ext.babelex import lazy_gettext as _
from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String, DateTime
from infopub.helpers.extensions import db
from infopub.forms.word_forbidden import WordForbiddenEditForm, WordForbiddenNewForm
from flask_admin.contrib.sqlamodel import filters
from flask.ext.babelex import lazy_gettext as _
from flask.helpers import flash

# 数据类
class WordForbidden(db.Model):
    __table_args__ = {'mysql_charset': 'utf8', 'mysql_engine': 'InnoDB'}

    id = Column(Integer, primary_key=True, doc=u'编码')

    word = Column(String(100), nullable=False, unique=True, index=True, doc=u'关键词')
    word_type = Column(Integer, nullable=False, doc=u'类型：0-包含、1-相同、2-正则')
    word_group = Column(Integer, nullable=False, doc=u'分组：0-敏感词、1-广告词、2-灌水词、3-色情词')
    process_type = Column(Integer, nullable=False, doc=u'类型：0-替换、1-待审')

    created_time = Column(DateTime, nullable=False, doc=u'创建时间')
    updated_time = Column(DateTime, nullable=False, doc=u'更新时间')

    @property
    def word_type_name(self):
        return [_("contain"), _("equal"), _("regex")][self.word_type]

    @property
    def word_group_name(self):
        return [_("sensitive"), _("advert"), _("spam"), _("sex")][self.word_group]

    @property
    def process_type_name(self):
        return [_("replace"), _("check pending")][self.process_type]

    def __unicode__(self):
        return self.word

    def __repr__(self):
        return self.id

# 数据管理类
class WordForbiddenAdmin(PermissionView):
    # 列表视图可见列
    list_columns = ('id', 'word', 'word_group_name', 'word_type_name', 'process_type_name')

    # 列表视图不可见列
    # excluded_list_columns = ['content']

    # 列表视图可排序列.
    # 例子'user'列, 使用 User.username
    sortable_columns = (
    'word', ('word_group_name', WordForbidden.word_group), ('word_type_name', WordForbidden.word_type),
    ('process_type_name', WordForbidden.process_type))

    # 列表视图 列名别名
    # rename_columns = dict(title=u'Post Title')

    # 定义搜索列
    column_searchable_list = ('word', WordForbidden.word)

    # 定义过滤列
    column_filters = (filters.FilterLike(WordForbidden.word, u'单词'),
                      filters.FilterEqual(WordForbidden.word_group, u'Word Group',
                                          options=(('0', 'sensitive'), ('1', 'advert'), ('2', 'spam'))),
                      filters.FilterEqual(WordForbidden.word_type, 'Word Type',
                                          options=(('0', 'contain'), ('1', 'equal'), ('2', 'regex'))),
                      filters.FilterEqual(WordForbidden.process_type, 'Process Type',
                                          options=(('0', 'replace'), ('1', 'check pending'))),
    )

    # 设置表单的属性和验证信息
    # form_args = dict(
    #    text=dict(label='Big Text', validators=[wtf.required(), Length(min=1, max=2000, message="Length range: 1 - 2000")])
    # )

    def get_create_form(self):
        return WordForbiddenNewForm

    def get_edit_form(self):
        return WordForbiddenEditForm

    def __init__(self, session, name=None, category=None, endpoint=None, url=None):
        # 初始化
        super(WordForbiddenAdmin, self).__init__(WordForbidden, session, name, category, endpoint, url)
        # self.list_template = 'admin/post/list.html'

    def create_model(self, form):
        try:
            model = WordForbidden()
            form.populate_obj(model)

            WordForbiddenService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to create model. %(error)s', error=str(ex)), 'error')
            return False

    def update_model(self, form, model):
        try:
            form.populate_obj(model)

            WordForbiddenService.add_or_update(model)
            return True
        except Exception as ex:
            flash(_('Failed to update model. %(error)s', error=str(ex)), 'error')
            return False


class WordForbiddenService(object):
    @staticmethod
    def add_or_update(model):
        model.updated_time = sys_now()

        if not model.id:
            model.created_time = model.updated_time
            db.session.add(model)

        db.session.commit()

        return model.id

    @staticmethod
    def get_by_word(word):
        return WordForbidden.query.filter(WordForbidden.word == word).first()

    @staticmethod
    def get_by_id(id):
        return WordForbidden.query.filter(WordForbidden.id == id).first()

    @staticmethod
    def get_list():
        return WordForbidden.query.all()

    @staticmethod
    def word_allowed(word):
        return True

    @staticmethod
    def init_word():
        file = open(PROJECT_DIRECTORY + 'db/word_forbidden.txt')
        word_reserved_dict = file.readlines()
        file.close()

        for word_forbidden in word_reserved_dict:
            word_forbidden = word_forbidden.replace('\n', '').replace('\r', '').decode(encoding='utf-8')
            #print word_forbidden
            word = WordForbiddenService.get_by_word(word_forbidden)
            #        file = open(PROJECT_DIRECTORY + 'db/word_forbidden.json')
            #        word_reserved_dict = json.load(file)
            #        file.close()
            #
            #        for word_forbidden in word_reserved_dict:
            #            word = WordForbiddenService.get_by_word(word_forbidden['word'])

            if word:
                continue

            word = WordForbidden()
            word.word = word_forbidden
            word.word_type = 0
            word.word_group = 0
            word.process_type = 1
            word.created_time = sys_now()
            word.updated_time = word.created_time
            db.session.add(word)
            db.session.commit()

