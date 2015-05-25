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
from infopub.models.content.entry import Entry, EntryAdmin
from runkit.web.flask_ext.sql import db

__doc__ = '内容 数据定义'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.049000'

from sqlalchemy.schema import Column
from sqlalchemy.types import Integer, String
# from infopub.helpers.extensions import db, app, gfw


# class LicenseAgreement(Constants):
#     # 授权协议: 1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,0-其他
#     # http://blog.csdn.net/deaboway/article/details/6444452
#     # http://blog.csdn.net/kindazrael/article/details/7055275
#
#     'Apache Licence'
#     # GPL
#     # LGPL
#     # AGPL
#     # BSD
#     # MIT
#     # Mozilla Public License
#     # Eclipse Public License
#     # 商业
      # 自定义
#     # 其他
#     general = 1
#     fairish = 2
#     good = 3
#     excellent = 4
#     boutique = 5
#
# ENTRY_RECOMMEND_CHOICES = [
#     # 推荐级别：1-默认（未推荐）、2-不错、3-良好、4-优秀、5-精品
#     (EntryRecommend.general, u'默认（未推荐）'),
#     (EntryRecommend.fairish, u'不错'),
#     (EntryRecommend.good, u'良好'),
#     (EntryRecommend.excellent, u'优秀'),
#     (EntryRecommend.boutique, u'精品'),
# ]


class SourceCode(db.Model, Entry):
    __tablename__ = 'software'

    # 授权协议： BSD
    # todo 转数据库
    license_agreement = Column(Integer, doc=u'授权协议: 1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,0-其他')

    license_agreement_url = Column(String(255), doc=u'授权协议说明连接')

    # 是否开源等
    license_type = Column(Integer, doc=u'版权类型：0-免费、1-开源、2-共享、3-商业、4-多重许可')

    # 运行平台
    #  操作系统： 跨平台
    runtime_platform = Column(Integer,
                              doc=u'运行平台: 1-Windows,2-Linux,3-BSD,4-UNIX,5-OS X,6-Symbian,7-J2ME,8-嵌入式,9-Android,'
                                  u'10-iPhone/iPad/iPod,11-Windows Phone/Mobile,12-Meego,13-Moblin')

    # 使用的工具
    create_platform = Column(Integer, doc=u'构建平台')

    # 编程语言
    principal_language = Column(Integer, doc=u'主体语言')

    # 注解语种
    annotation_language = Column(Integer, doc=u'注解语种')

    # 数据管理类

    num_discuss = Column(Integer, nullable=False, default=0, doc=u'讨论/回复/回答数')


class SourceCodeAdmin(EntryAdmin):
    from infopub.forms.software import SoftwareForm
    from flask.ext.admin.form import rules

    form_base_class = SoftwareForm
    # //todo 没起作用
    form_create_rules = [
        # Header and four fields. Email field will go above phone field.
        rules.FieldSet(
            ('title',
             'content',
             'tags',
             'feature_image',
             'summary'),
            'Base Info'),

        rules.FieldSet(
            ('source_title',
             'source_url',
             'on_top_period',
             'on_portal_period',
             'license_agreement',
             'license_agreement_url',
             'license_type',
             'runtime_platform',
             'create_platform',
             'principal_language',
             'annotation_language'),
            'Ext Info'),

    ]

    form_edit_rules = form_create_rules
