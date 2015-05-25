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
from infopub.models.content.entry import Entry
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


class Gallery(db.Model, Entry):
    __tablename__ = 'psd'

    # 授权协议： BSD
    # todo 转数据库
    license_agreement = Column(Integer, doc=u'授权协议: 1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,0-其他')

    license_agreement_url = Column(String(255), doc=u'授权协议说明连接')

    # 是否开源等
    license_type = Column(Integer, doc=u'版权类型：0-免费、1-开源、2-共享、3-商业、4-多重许可')
    integral = Column(Integer, doc=u'下载积分')

    DPI = Column(Integer, doc=u'分辨率')
    material_grade = Column(Integer, doc=u'素材等级：1-5')
    material_format = Column(String(20), doc=u'素材格式：.CDR,.psd')
    version = Column(String(20), doc=u'工具版本：CDRX4')
    color_model = Column(String(20), doc=u'颜色模式：RGB\ CMYK')
    dimension = Column(String(20), doc=u'尺 寸: 0×0 像素')
    size = Column(String(20), doc=u'大 小：5.661M')
    colors = Column(String(100), doc=u'颜 色：#ffffff#efefef')
    download_url = Column(String(200), doc=u'下载地址：')
    download_num = Column(Integer, doc=u'下载地址：')

    # 摄影作品附加信息：用于摄影图片
    camera = Column(String(200), doc=u'相机：Sony Nex 6')
    lens = Column(String(200), doc=u'镜头：SEL30M35')
    focal_length = Column(String(200), doc=u'焦距：30mm')
    shutter_speed = Column(String(200), doc=u'快门：1/20 secs')
    ISO = Column(String(200), doc=u'光圈：f/22')





# 缩略图：
# 小缩略图（100*100）
# 中缩略图 （280*180）
# 大缩略图（最大宽度828）
# 缩略图组（）#用于一个素材资源多张展示图片

