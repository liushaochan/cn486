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
from infopub.models.entry import Entry

__doc__ = '放测试代码'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-07-31 8:30 PM'


from infopub.models.user import User
from infopub.webapp import create_app
from runkit.web.flask_ext.sql import db

import unittest

import

sk.ext.webtest import TestApp

try:
    from flask.signals import message_flashed
except ImportError:
    flask_gte_0_10 = False
else:
    flask_gte_0_10 = True


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
        user = User(username='Anton', email='anton@mail.com')
        db.session.add(user)
        db.session.commit()

        print 'user_id: ', user.id

    def test_2(self):
        user = Entry(username='Anton1', email='anton1@mail.com', content='# 123ddd')
        db.session.add(user)
        db.session.commit()

        print 'user_id: ', user.id


def suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestSQLAlchemyFeatures))
    return suite

# app = None
#
# def setUp():
#     global app
#     app = create_app()
#     # self.w_without_scoping = TestApp(self.app)
#     # self.w = TestApp(self.app, db=db, use_session_scopes=True)
#     #
#     # self.app_context = self.app.app_context()
#     # self.app_context.push()
#     db.drop_all()
#     db.create_all()
#
#
# def tearDown():
#     # db.drop_all()
#     pass

def test_user():
    print '11111'
    # app = create_app()
    db.drop_all()
    db.create_all()
    user = Entry(username='Anton1', email='anton1@mail.com', content='# 123ddd')
    db.session.add(user)
    db.session.commit()

    print 'ID: ', user.id
    print user.to_json()
    print user.content.html
    print '11111222'

if __name__ == '__main__':
    # unittest.main(defaultTest='suite')
    test_user()