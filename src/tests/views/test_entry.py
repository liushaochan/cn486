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

import unittest
from flask.ext.webtest import TestApp
# import flask_security
from infopub.defines.entry import EntryType, EntrySourceType
from infopub.defines.result import ResultCode
from infopub.webapp import create_app

__doc__ = 'test entry'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2014-03-14 3:45 PM'


class TestMainFeatures(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.w = TestApp(self.app)
        self.app.config['TESTING'] = True

    def login(self, username, password):
        return self.w.post('/account/login', {
            'email': username,
            'password': password
        })

    def logout(self):
        return self.w.get('/account/logout')

    def test_home(self):
        r = self.w.get('/entry/')
        self.assertFalse(r.flashes)
        self.assertEqual(r.json, {u'code': ResultCode.SUCCESS})

    def test_curd(self):
        # add

        # 登录
        # r = self.login('admin@cn486.com', 'admin888')
        # print r
        # assert 'You were logged in' in r.data

        r = self.w.post('/entry/v1/create?category_id=1', {
            'creater_id': 1,
            'modifier_id': 1,

            'entry_type': EntryType.software,

            'title': '文章测试123',
            'content': '文章测试内容123',
            'summary': '123',
            'tags': 'tag1,tag2,tag3',

            'logo': '/1.gif',
            'feature_image': '/1.png',

            'source_title': '',
            'source_url': '',

            'source_type': EntrySourceType.original,

            'slug': 'ar/1',

            'recommend': 1

        })

        if r.json['code'] != ResultCode.SUCCESS:
            print r.json['message']

        print r

        self.assertFalse(r.flashes)
        self.assertIn(r.json['code'], [ResultCode.SUCCESS, ResultCode.DATA_EXISTED])

        # update
        r = self.w.post('/entry/v1/edit?category_id=1&entry_id=1', {
            'title': '文章测试123, edit',
        })

        print r
        if r.json['code'] != ResultCode.SUCCESS:
            print r.json['message']

        self.assertFalse(r.flashes)
        self.assertIn(r.json['code'], [ResultCode.SUCCESS, ResultCode.DATA_EXISTED])

        return
        # get
        r = self.w.get('/device/%s' % device_id)

        self.assertFalse(r.flashes)
        self.assertEqual(r.json['code'], ResultCode.SUCCESS)
        self.assertTrue(r.json['metadata'])

        # get_list
        r = self.w.get('/device/list?search=%s' % 'len')

        self.assertFalse(r.flashes)
        self.assertEqual(r.json['code'], ResultCode.SUCCESS)
        self.assertTrue(r.json['device_total'] >= 0)

        # del
        r = self.w.post('/device/delete', {
            'device_id': device_id, })

        self.assertFalse(r.flashes)
        self.assertIn(r.json['code'], [ResultCode.SUCCESS, ResultCode.DATA_EXISTED])


def test_suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestMainFeatures))
    return suite


if __name__ == '__main__':
    unittest.main(defaultTest='test_suite')
