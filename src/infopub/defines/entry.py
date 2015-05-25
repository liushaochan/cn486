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
from runkit.system.named_constants import Constants

__doc__ = 'TODO'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-08-17 14:50'


###
## 内容类型
###
class EntryType(Constants):
    # 类型：1-文章、2-源文件、3-剪贴画、4-矢量图、5-图标、6-图片、7-贴图、8-壁纸
    # 9-动画、10-大图、11-软件、12-视频、13-音频、14-画廊（图集）

    article = 1
    source = 2
    clipart = 3
    vector = 4
    icon = 5
    picture = 6
    texture = 7
    wallpaper = 8
    animation = 9
    bigpic = 10
    software = 11
    video = 12
    audio = 13
    gallery = 14

# 插件(plugin)

ENTRY_TYPE_MODEL_CLASSNAME = {
    EntryType.article: 'Article',
    EntryType.source: 'Source',
    EntryType.clipart: 'Clipart',
    EntryType.vector: 'Vector',
    EntryType.icon: 'Icon',
    EntryType.picture: 'Picture',
    EntryType.texture: 'Texture',
    EntryType.wallpaper: 'Wallpaper',
    EntryType.animation: 'Animation',
    EntryType.bigpic: 'Bigpic',
    EntryType.software: 'Software',
    EntryType.video: 'Video',
    EntryType.audio: 'Audio',
    EntryType.gallery: 'Gallery',
}

ENTRY_TYPE_FORM_CLASSNAME = {
    EntryType.article: 'ArticleForm',
    EntryType.source: 'SourceForm',
    EntryType.clipart: 'ClipartForm',
    EntryType.vector: 'VectorForm',
    EntryType.icon: 'IconForm',
    EntryType.picture: 'PictureForm',
    EntryType.texture: 'TextureForm',
    EntryType.wallpaper: 'WallpaperForm',
    EntryType.animation: 'AnimationForm',
    EntryType.bigpic: 'BigpicForm',
    EntryType.software: 'SoftwareForm',
    EntryType.video: 'VideoForm',
    EntryType.audio: 'AudioForm',
    EntryType.gallery: 'GalleryForm',
}

ENTRY_TYPE_CHOICES = [
    (EntryType.article, u'文章'),
    (EntryType.source, u'源文件'),
    (EntryType.clipart, u'剪贴画'),
    (EntryType.vector, u'矢量图'),
    (EntryType.icon, u'图标'),
    (EntryType.picture, u'图片'),
    (EntryType.texture, u'贴图'),
    (EntryType.wallpaper, u'壁纸'),
    (EntryType.animation, u'动画'),
    (EntryType.bigpic, u'大图'),
    (EntryType.software, u'软件'),
    (EntryType.video, u'视频'),
    (EntryType.audio, u'音频'),
    (EntryType.gallery, u'画廊(图集)'),
]

class EntrySourceType(Constants):
    # 来源类型：1-原创、2-翻译、3-转帖、4-特约稿
    original = 1
    translate = 2
    copy = 3
    special = 4

ENTRY_SOURCE_TYPE_CHOICES = [
    # 来源类型：1-原创、2-翻译、3-转帖、4-特约稿
    (EntrySourceType.original, u'原创'),
    (EntrySourceType.translate, u'翻译'),
    (EntrySourceType.copy, u'转帖'),
    (EntrySourceType.special, u'特约稿'),
]


class EntryStatus(Constants):
    # 内容状态：1-草稿、2-待审、3-已删除、4-发布、5-已接受
    draft = 1
    pending = 2
    deleted = 3
    published = 4
    accepted = 5

ENTRY_STATUS_CHOICES = [
    (EntryStatus.draft, u'草稿'),
    (EntryStatus.pending, u'待审'),
    (EntryStatus.deleted, u'已删除'),
    (EntryStatus.published, u'发布'),
    (EntryStatus.accepted, u'已接受'),

]


class EntryViewStatus(Constants):
    # 显示状态：显示状态：1-公开、2-私有、3-加密的、4-隐藏
    open = 1
    private = 2
    encrypted = 3
    hided = 4

ENTRY_VIEW_STATUS_CHOICES = [
    (EntryViewStatus.open, u'公开'),
    (EntryViewStatus.private, u'私有'),
    (EntryViewStatus.encrypted, u'加密的'),
    (EntryViewStatus.hided, u'隐藏'),

]


class EntryCommentStatus(Constants):
    # 评论状态：1-开发评论、2-允许注册用户评论、3-关闭
    open = 1
    registered = 2
    close = 3

ENTRY_COMMENT_STATUS_CHOICES = [
    (EntryCommentStatus.open, u'开放评论'),
    (EntryCommentStatus.registered, u'允许注册用户评论'),
    (EntryCommentStatus.close, u'关闭'),
]


class EntryRecommend(Constants):
    # 推荐级别：1-默认（未推荐）、2-不错、3-良好、4-优秀、5-精品
    general = 1
    fairish = 2
    good = 3
    excellent = 4
    boutique = 5

ENTRY_RECOMMEND_CHOICES = [
    # 推荐级别：1-默认（未推荐）、2-不错、3-良好、4-优秀、5-精品
    (EntryRecommend.general, u'默认（未推荐）'),
    (EntryRecommend.fairish, u'不错'),
    (EntryRecommend.good, u'良好'),
    (EntryRecommend.excellent, u'优秀'),
    (EntryRecommend.boutique, u'精品'),
]

entry_type_str = [
    "article",
    "news",
    "code",
    "software",
    "forum",
    "question",
    "tips",
    "gallery",
    "video",
    "audio",
    "link",
    "quote",
    "status",
    "document",
    "chat",
    "aside",
    "special",
]
