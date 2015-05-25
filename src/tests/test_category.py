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
from time import sleep

from infopub.models.category import Category
from infopub.webapp import create_app
from runkit.web.flask_ext.sql import db

import unittest

import sqlalchemy
from flask.ext.webtest import TestApp

try:
    from flask.signals import message_flashed
except ImportError:
    flask_gte_0_10 = False
else:
    flask_gte_0_10 = True

__doc__ = '放测试代码'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-07-31 8:30 PM'


class TestSQLAlchemyFeatures(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.w_without_scoping = TestApp(self.app)
        self.w = TestApp(self.app, db=db, use_session_scopes=True)

        self.app_context = self.app.app_context()
        self.app_context.push()

        db.drop_all()
        db.create_all()

    def tearDown(self):
        self.app_context.pop()

    def test_1(self):
        # user = User(username='Anton', email='anton@mail.com')
        category = Category()

        category.category_name = u'分类名'
        category.slug = '/cat1'

        category.logo = '/logo/1.png'
        category.feature_image = '/img/1.png'
        # 2012-11-14 加
        category.thumbs_width = 1280
        category.thumbs_height = 800

        category.display_order = 0

        # description = Column(Text, doc=u'描述')

        # 能浏览的角色
        # read_role = set()
        # read_role.add(1)
        # read_role.add(2)
        # category.read_role = read_role
        category.read_permission = 0

        # 支持投稿的角色
        # post_role = set()
        # post_role.add(1)
        # post_role.add(2)
        # category.post_role = post_role
        category.post_permission = 0

        # 栏目管理员
        # managers = set()
        # managers.add(1)
        # managers.add(2)
        # category.managers = managers

        # 栏目类型：0-普通栏目、1-链接栏目（链接至某个页面）
        #   普通栏目使用list_template
        category.category_type = 0
        category.category_url = ''

        category.list_template = 'list.html'
        category.create_template = 'create.html'
        category.edit_template = 'edit.html'
        category.show_template = 'show.html'
        category.search_template = 'search.html'
        category.download_template = 'download.html'

        # 文章URL自动生成规则
        # 文章标题: {title_name}
        # 文章ID: {title_id}
        # 栏目名: {category_name}
        # 栏目固定地址: {category_slug}
        # 时间戳: {timestamp}
        # 时间: {time}
        # 日期: {date}
        category.entry_url_rule = '/archives/1'

        #META Title（栏目标题）
        category.meta_title = ''

        #META Keywords（栏目关键词）
        category.meta_keywords = ''

        #META Description（栏目描述）
        category.meta_description = ''

        # 移到redis中
        # num_entries = Column(Integer, nullable=False, default=0, doc=u'内容数')
        # num_discuss = Column(Integer, nullable=False, default=0, doc=u'讨论数')
        # num_attention = Column(Integer, nullable=False, default=0, doc=u'关注数')

        # 内容的类型
        category.entry_type = 0

        category.need_audit = 0
        category.category_status = 0

        category.save()
        # db.session.add(category)
        # db.session.commit()

        print 'category_id: ', category.id
        print 'category_managers: ', category.managers, 1 in category.managers, len(category.managers)
        sleep(4)

        category.category_status = 1
        category.save()

        obj = Category.get_by_id(1)
        print dict(obj)
        print obj.to_dict()



def suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestSQLAlchemyFeatures))
    return suite

if __name__ == '__main__':
    unittest.main(defaultTest='suite')
