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

__doc__ = 'entry 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.709000'

from flask.ext.wtf import Form
from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, TextAreaField, SelectField, RadioField, IntegerField, DateTimeField, HiddenField
from wtforms.validators import required, ValidationError
from infopub.bases.validators import length, url

class EntryNewForm(Form):
    """
    新建 Entry 的表单
    """
    entry_type = SelectField(_("entry.entry_type"),
        default=0,
                description=u'类型：0-文章、1-快讯、2-代码、3-软件、4-讨论、5-问答、6-小贴士、7-图集、8-视频、9-音频、10-链接、11-引语、12-状态、13-文档、14-聊天、15-随笔',
                choices=[('0', _("Article")), ('1', _("News")), ('2', _("Code")), ('3', _("Software")), ('4', _("Forum")),
                    ('5', _("Question")), ('6', _("Tips")), ('7', _("Gallery")), ('8', _("Video")), ('9', _("Audio")), ('10', _("Link")), ('11', _("Quote"))
                    , ('12', _("Status")), ('13', _("Document")), ('14', _("Chat")), ('15', _("Aside")), ('16', _("Special"))],
                validators=[
                    required(message=_("entry_type is required")),
            ])
    
    title = TextField(_("entry.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    slug = TextField(_("entry.slug"),
                description=u'固定地址',
                validators=[
                    length(min=1, max=50, message=_("Length range: 1 - 50"))
            ])

    source_type = SelectField(_("entry.source_type"),
        default=0,
                description=u'来源类型：0-原创、1-翻译、2-转帖',
                choices=[('0', _("Original content")), ('1', _("Translate content")), ('2', _("Reprint content"))],
                validators=[
                    required(message=_("source_type is required")),
            ])
    
    source_title = TextField(_("entry.source_title"),
                description=u'来源标题',
                validators=[
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    source_url = TextField(_("entry.source_url"),
                description=u'来源地址',
                validators=[
                    url(message=_("source_url is not a valid URL")),
                    length(min=11, max=200, message=_("Length range: 11 - 200"))
            ])
    
    category_id = HiddenField(_("entry.category_id"),
                description=u'分类ID：0-未分类',
                validators=[
                    required(message=_("category_id is required")),
            ])
    
    logo = TextField(_("entry.logo"),
                description=u'图标',
                validators=[
                    url(message=_("logo is not a valid URL")),
                    length(min=11, max=100, message=_("Length range: 11 - 100"))
            ])
			
    feature_image = TextField(_("entry.feature_image"),
                description=u'特色图地址',
                validators=[
                    url(message=_("feature_image is not a valid URL")),
                    length(min=11, max=200, message=_("Length range: 11 - 200"))
            ])
    
    tags = HiddenField(_("entry.tags"),
                description=u'标签',
                validators=[
                    length(min=1, max=512, message=_("Length range: 1 - 512"))
            ])

    
    content = TextAreaField(_("entry.content"),
                description=u'内容',
                validators=[
                    required(message=_("content is required")),
            ])
    
    summary = TextAreaField(_("entry.summary"),
                description=u'摘要',
                validators=[
                    length(min=1, max=200, message=_("Length range: 1 - 200"))
            ])
    
    on_portal = SelectField(_("entry.on_portal"),
        default=0,
                    choices=[('0', u'否'), ('1', u'是')],
                    description=u'是否首页显示',
                    validators=[
                    required(message=_("on_portal is required")),
            ])
    
    on_top = SelectField(_("entry.on_top"),
        default=0,
                choices=[('0', u'否'), ('1', u'是')],
                description=u'是否置顶',
                validators=[
                    required(message=_("on_top is required")),
            ])
    
    comment_status = SelectField(_("entry.comment_status"),
        default=0,
                description=u'评论状态：0-允许、1-关闭',
                choices=[('0', u'允许'), ('1', u'关闭')],
                validators=[
                    required(message=_("comment_status is required")),
            ])
    
    entry_status = SelectField(_("entry.entry_status"),
        default=0,
                description=u'内容状态：0-草稿、1-待审、2-发布',
                choices=[('0', u'草稿'), ('1', u'待审'), ('2', u'发布')],
                validators=[
                    required(message=_("entry_status is required")),
            ])
    
    view_status = SelectField(_("entry.view_status"),
        default=0,
                description=u'显示状态：0-公开、1-私有、2-隐藏',
                choices=[('0', u'公开'), ('1', u'私有'), ('2', u'隐藏')],
                validators=[
                    required(message=_("view_status is required")),
            ])

    scores = SelectField(_("entry.scores"),
        default=0,
        description=u'分数',
        choices=[('0', u'未知'), ('1', u'1'), ('2', u'2'), ('3', u'2'), ('4', u'2'), ('5', u'2')],
        validators=[
            required(message=_("scores is required")),
            ])

    difficulty = SelectField(_("entry.difficulty"),
        default=0,
        description=u'深浅度',
        choices=[('0', u'容易'), ('1', u'一般'), ('2', u'难'), ('3', u'高深')],
        validators=[
            required(message=_("difficulty is required")),
            ])

    recommend = SelectField(_("entry.recommend"),
        default=0,
        description=u'推荐级别：0-默认（未推荐）、1-不错、2-良好、3-精华',
        choices=[('0', u'未推荐'), ('1', u'不错'), ('2', u'良好'), ('3', u'精华')],
        validators=[
            required(message=_("recommend is required")),
            ])

    principal_language = SelectField(_("entry.principal_language"),
        default=0,
        description=u'主体语言：1-Java 、    2-C/C++    3-Objective-C    4-PHP    5-Perl    6-Python    7-Ruby    8-C#    9-.NET    10-ASP    11-D语言    12-Groovy    13-Scala    14-JavaScript    15-HTML/CSS    16-ActionScript    17-VBScript    18-Delphi/Pascal    19-Basic    20-ErLang    21-COBOL    22-Fortran    23-Lua    24-SHELL    25-Smalltalk    26-汇编    27-Sliverlight    28-Lisp    29-Google Go',
        choices=[('0', u'其他'), ('1', u'Java'), ('2', u'C/C++'),('3', u'Objective-C'),    ('4', u'PHP'),    ('5', u'Perl'),    ('6', u'Python'),    ('7', u'Ruby'),    ('8', u'C#'),    ('9', u'.NET'),    ('10', u'ASP'),    ('11', u'D语言'),    ('12', u'Groovy'),   ('13', u'Scala'),    ('14', u'JavaScript'),    ('15', u'HTML/CSS'),    ('16', u'ActionScript'),    ('17', u'VBScript'),    ('18', u'Delphi/Pascal'),    ('19', u'Basic'),    ('20', u'ErLang'),    ('21', u'COBOL'),    ('22', u'Fortran'),    ('23', u'Lua'),    ('24', u'SHELL'),    ('25', u'Smalltalk'),    ('26', u'汇编'),    ('27', u'Sliverlight'),    ('28', u'Lisp'),    ('29', u'Google Go')],
        validators=[
            required(message=_("recommend is required")),
            ])

    license_agreement = SelectField(_("entry.license_agreement"),
        default=0,
        description=u'授权协议：1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,0-其他',
        choices=[('0', u'其他'),('1', u'GPL'),('2', u'LGPL'),('3', u'AGPL'),('4', u'Apache'),('5', u'MIT'),('6', u'BSD'),('7', u'EPL'),('8', u'MPL') ],
        validators=[
            required(message=_("recommend is required")),
            ])

    runtime_platform = SelectField(_("entry.runtime_platform"),
        default=1,
        description=u'运行平台: 1-Windows,2-Linux,3-BSD,4-UNIX,5-OS X,6-Symbian,7-J2ME,8-嵌入式,9-Android,10-iPhone/iPad/iPod,11-Windows Phone/Mobile,12-Meego,13-Moblin',
        choices=[('1', u'Windows'),('2', u'Linux'),('3', u'BSD'),('4', u'UNIX'),('5', u'OS X'),('6', u'Symbian'),('7', u'J2ME'),('8', u'嵌入式'),('9', u'Android'),('10', u'iPhone/iPad/iPod'),('11', u'Windows Phone/Mobile'),('12', u'Meego'),('13', u'Moblin')],
        validators=[
            required(message=_("recommend is required")),
            ])



    #文章排序：（置顶周期）		标题样式：
    scores = SelectField(_("entry.scores"),
        default=0,
        description=u'是否置顶',
        choices=[('0', u'否'), ('1', u'是')],
        validators=[
            required(message=_("view_status is required")),
            ])

    on_top_period = SelectField(_("entry.on_top_period"),
        default=7,
        description=u'置顶周期',
        choices=[('7', u'一周'), ('15', u'15天'), ('30', u'30天'), ('60', u'60天'), ('90', u'90天')],
        validators=[
            required(message=_("on_top_period is required")),
            ])

    on_portal = SelectField(_("entry.on_portal"),
        default=0,
        description=u'是否首页显示',
        choices=[('0', u'否'), ('1', u'是')],
        validators=[
            required(message=_("view_status is required")),
            ])

    on_portal_period = SelectField(_("entry.on_portal_period"),
        default=7,
        description=u'首页显示周期',
        choices=[('7', u'一周'), ('15', u'15天'), ('30', u'30天'), ('60', u'60天'), ('90', u'90天')],
        validators=[
            required(message=_("on_top_period is required")),
            ])

    #阅读权限：
    #     是否隐藏栏目（显示、隐藏）
    show_role = RadioField(_("entry.show_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能查看的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

    #消费金币/银币
    consume_gold_cost = IntegerField(_("entry.consume_gold_cost"),
        default=0,
        description=u'消费金牌数',
        validators=[
            ])

    consume_silver_cost = IntegerField(_("entry.consume_silver_cost"),
        default=0,
        description=u'消费银牌数',
        validators=[
            ])

    #赏金金币/银币
    reward_gold_cost = IntegerField(_("entry.reward_gold_cost"),
        default=0,
        description=u'赏金（金牌）',
        validators=[
            ])

    reward_silver_cost = IntegerField(_("entry.reward_silver_cost"),
        default=0,
        description=u'赏金（银牌）',
        validators=[
            ])

    published_time = DateTimeField(_("entry.published_time"),
        default=sys_now(),
        description=u'发布时间',
        validators=[
            required(message=_("published_time is required")),
            ])

    def validate_slug(self, field):
        # unique
        if len(field.data) > 50:
            raise ValidationError, _("Slug must be less than 50 characters")

#        slug = slugify(field.data) if field.data else slugify(self.title.data)[:50]
#        posts = Posts.query.filter_by(slug=slug)
#        if self.posts:
#            posts = posts.filter(db.not_(Posts.id==self.posts.id))
#        if posts.count():
#            error = gettext("This slug is taken") if field.data else gettext("Slug is required")
#            raise ValidationError, error
        pass

    def validate_tags(self, field):
        # 最多8个tag
        # 每个tag最长20个字符
        pass



class EntryEditFormOld(Form):
    """
    编辑 Entry 的表单
    """

    entry_type = SelectField(_("entry.entry_type"),
        default=0,
        description=u'类型：0-文章、1-快讯、2-代码、3-软件、4-讨论、5-问答、6-小贴士、7-图集、8-视频、9-音频、10-链接、11-引语、12-状态、13-文档、14-聊天、15-随笔',
        choices=[('0', _("Article")), ('1', _("News")), ('2', _("Code")), ('3', _("Software")), ('4', _("Forum")),
            ('5', _("Question")), ('6', _("Tips")), ('7', _("Gallery")), ('8', _("Video")), ('9', _("Audio")), ('10', _("Link")), ('11', _("Quote"))
            , ('12', _("Status")), ('13', _("Document")), ('14', _("Chat")), ('15', _("Aside")), ('16', _("Special"))],
        validators=[
            required(message=_("entry_type is required")),
            ])

    title = TextField(_("entry.title"),
        description=u'标题',
        validators=[
            required(message=_("title is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    slug = TextField(_("entry.slug"),
        description=u'固定地址',
        validators=[
            length(min=1, max=50, message=_("Length range: 1 - 50"))
        ])

    source_type = SelectField(_("entry.source_type"),
        default=0,
        description=u'来源类型：0-原创、1-翻译、2-转帖',
        choices=[('0', _("Original content")), ('1', _("Translate content")), ('2', _("Reprint content"))],
        validators=[
            required(message=_("source_type is required")),
            ])

    source_title = TextField(_("entry.source_title"),
        description=u'来源标题',
        validators=[
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    source_url = TextField(_("entry.source_url"),
        description=u'来源地址',
        validators=[
            url(message=_("source_url is not a valid URL")),
            length(min=11, max=200, message=_("Length range: 11 - 200"))
        ])

    category_id = HiddenField(_("entry.category_id"),
        description=u'分类ID：0-未分类',
        validators=[
            required(message=_("category_id is required")),
            ])

    logo = TextField(_("entry.logo"),
        description=u'图标',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=11, max=100, message=_("Length range: 11 - 100"))
        ])

    feature_image = TextField(_("entry.feature_image"),
        description=u'特色图地址',
        validators=[
            url(message=_("feature_image is not a valid URL")),
            length(min=11, max=200, message=_("Length range: 11 - 200"))
        ])

    tags = TextField(_("entry.tags"),
        description=u'标签',
        validators=[
            length(min=1, max=512, message=_("Length range: 1 - 512"))
        ])

    content = TextAreaField(_("entry.content"),
        description=u'内容',
        validators=[
            required(message=_("content is required")),
            ])

    summary = TextAreaField(_("entry.summary"),
        description=u'摘要',
        validators=[
            length(min=1, max=200, message=_("Length range: 1 - 200"))
        ])

    on_portal = SelectField(_("entry.on_portal"),
        default=0,
        choices=[('0', u'否'), ('1', u'是')],
        description=u'是否首页显示',
        validators=[
            required(message=_("on_portal is required")),
            ])

    on_top = SelectField(_("entry.on_top"),
        default=0,
        choices=[('0', u'否'), ('1', u'是')],
        description=u'是否置顶',
        validators=[
            required(message=_("on_top is required")),
            ])

    comment_status = SelectField(_("entry.comment_status"),
        default=0,
        description=u'评论状态：0-允许、1-关闭',
        choices=[('0', u'允许'), ('1', u'关闭')],
        validators=[
            required(message=_("comment_status is required")),
            ])

    entry_status = SelectField(_("entry.entry_status"),
        default=0,
        description=u'内容状态：0-草稿、1-待审、2-发布',
        choices=[('0', u'草稿'), ('1', u'待审'), ('2', u'发布')],
        validators=[
            required(message=_("entry_status is required")),
            ])

    view_status = SelectField(_("entry.view_status"),
        default=0,
        description=u'显示状态：0-公开、1-私有、2-隐藏',
        choices=[('0', u'公开'), ('1', u'私有'), ('2', u'隐藏')],
        validators=[
            required(message=_("view_status is required")),
            ])

    scores = SelectField(_("entry.scores"),
        default=0,
        description=u'分数',
        choices=[('0', u'未知'), ('1', u'1'), ('2', u'2'), ('3', u'2'), ('4', u'2'), ('5', u'2')],
        validators=[
            required(message=_("scores is required")),
            ])

    difficulty = SelectField(_("entry.difficulty"),
        default=0,
        description=u'深浅度',
        choices=[('0', u'容易'), ('1', u'一般'), ('2', u'难'), ('3', u'高深')],
        validators=[
            required(message=_("difficulty is required")),
            ])

    recommend = SelectField(_("entry.recommend"),
        default=0,
        description=u'推荐级别：0-默认（未推荐）、1-不错、2-良好、3-精华',
        choices=[('0', u'未推荐'), ('1', u'不错'), ('2', u'良好'), ('3', u'精华')],
        validators=[
            required(message=_("recommend is required")),
            ])
    principal_language = SelectField(_("entry.principal_language"),
        default=0,
        description=u'主体语言：1-Java 、    2-C/C++    3-Objective-C    4-PHP    5-Perl    6-Python    7-Ruby    8-C#    9-.NET    10-ASP    11-D语言    12-Groovy    13-Scala    14-JavaScript    15-HTML/CSS    16-ActionScript    17-VBScript    18-Delphi/Pascal    19-Basic    20-ErLang    21-COBOL    22-Fortran    23-Lua    24-SHELL    25-Smalltalk    26-汇编    27-Sliverlight    28-Lisp    29-Google Go',
        choices=[('0', u'其他'), ('1', u'Java'), ('2', u'C/C++'),('3', u'Objective-C'),    ('4', u'PHP'),    ('5', u'Perl'),    ('6', u'Python'),    ('7', u'Ruby'),    ('8', u'C#'),    ('9', u'.NET'),    ('10', u'ASP'),    ('11', u'D语言'),    ('12', u'Groovy'),   ('13', u'Scala'),    ('14', u'JavaScript'),    ('15', u'HTML/CSS'),    ('16', u'ActionScript'),    ('17', u'VBScript'),    ('18', u'Delphi/Pascal'),    ('19', u'Basic'),    ('20', u'ErLang'),    ('21', u'COBOL'),    ('22', u'Fortran'),    ('23', u'Lua'),    ('24', u'SHELL'),    ('25', u'Smalltalk'),    ('26', u'汇编'),    ('27', u'Sliverlight'),    ('28', u'Lisp'),    ('29', u'Google Go')],
        validators=[
            required(message=_("recommend is required")),
            ])

    license_agreement = SelectField(_("entry.license_agreement"),
        default=0,
        description=u'授权协议：1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,0-其他',
        choices=[('0', u'其他'),('1', u'GPL'),('2', u'LGPL'),('3', u'AGPL'),('4', u'Apache'),('5', u'MIT'),('6', u'BSD'),('7', u'EPL'),('8', u'MPL') ],
        validators=[
            required(message=_("recommend is required")),
            ])

    runtime_platform = SelectField(_("entry.runtime_platform"),
        default=0,
        description=u'运行平台: 1-Windows,2-Linux,3-BSD,4-UNIX,5-OS X,6-Symbian,7-J2ME,8-嵌入式,9-Android,10-iPhone/iPad/iPod,11-Windows Phone/Mobile,12-Meego,13-Moblin',
        choices=[('1', u'Windows'),('2', u'Linux'),('3', u'BSD'),('4', u'UNIX'),('5', u'OS X'),('6', u'Symbian'),('7', u'J2ME'),('8', u'嵌入式'),('9', u'Android'),('10', u'iPhone/iPad/iPod'),('11', u'Windows Phone/Mobile'),('12', u'Meego'),('13', u'Moblin')],
        validators=[
            required(message=_("recommend is required")),
            ])



#文章排序：（置顶周期）		标题样式：
    scores = SelectField(_("entry.scores"),
        default=0,
        description=u'是否置顶',
        choices=[('0', u'否'), ('1', u'是')],
        validators=[
            required(message=_("view_status is required")),
            ])

    on_top_period = SelectField(_("entry.on_top_period"),
        default=7,
        description=u'置顶周期',
        choices=[('7', u'一周'), ('15', u'15天'), ('30', u'30天'), ('60', u'60天'), ('90', u'90天')],
        validators=[
            required(message=_("on_top_period is required")),
            ])

    on_portal = SelectField(_("entry.on_portal"),
        default=0,
        description=u'是否首页显示',
        choices=[('0', u'否'), ('1', u'是')],
        validators=[
            required(message=_("view_status is required")),
            ])

    on_portal_period = SelectField(_("entry.on_portal_period"),
        default=7,
        description=u'首页显示周期',
        choices=[('7', u'一周'), ('15', u'15天'), ('30', u'30天'), ('60', u'60天'), ('90', u'90天')],
        validators=[
            required(message=_("on_top_period is required")),
            ])

    #阅读权限：
    #     是否隐藏栏目（显示、隐藏）
    show_role = RadioField(_("entry.show_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能查看的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

    #消费金币/银币
    consume_gold_cost = IntegerField(_("entry.consume_gold_cost"),
        default=0,
        description=u'消费金牌数',
        validators=[
        ])

    consume_silver_cost = IntegerField(_("entry.consume_silver_cost"),
        default=0,
        description=u'消费银牌数',
        validators=[
        ])

    #赏金金币/银币
    reward_gold_cost = IntegerField(_("entry.reward_gold_cost"),
        default=0,
        description=u'赏金（金牌）',
        validators=[
        ])

    reward_silver_cost = IntegerField(_("entry.reward_silver_cost"),
        default=0,
        description=u'赏金（银牌）',
        validators=[
        ])

    published_time = DateTimeField(_("entry.published_time"),
        default=sys_now(),
        description=u'发布时间',
        validators=[
            required(message=_("published_time is required")),
            ])

    def validate_slug(self, field):
        # unique
        if len(field.data) > 50:
            raise ValidationError, _("Slug must be less than 50 characters")

        #        slug = slugify(field.data) if field.data else slugify(self.title.data)[:50]
        #        posts = Posts.query.filter_by(slug=slug)
        #        if self.posts:
        #            posts = posts.filter(db.not_(Posts.id==self.posts.id))
        #        if posts.count():
        #            error = gettext("This slug is taken") if field.data else gettext("Slug is required")
        #            raise ValidationError, error
        pass

    def validate_tags(self, field):
        # 最多8个tag
        # 每个tag最长20个字符
        pass

class EntryEditForm(Form):
    """
    编辑 Entry 的表单
    """

    title = TextField(_("entry.title"),
        description=u'标题',
        validators=[
            required(message=_("title is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    source_type = SelectField(_("entry.source_type"),
        default=0,
        description=u'来源类型：0-原创、1-翻译、2-转帖',
        choices=[('0', _("Original content")), ('1', _("Translate content")), ('2', _("Reprint content"))],
        validators=[
            required(message=_("source_type is required")),
            ])

    source_title = TextField(_("entry.source_title"),
        description=u'来源标题',
        validators=[
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    source_url = TextField(_("entry.source_url"),
        description=u'来源地址',
        validators=[
            url(message=_("source_url is not a valid URL")),
            length(min=11, max=200, message=_("Length range: 11 - 200"))
        ])

    logo = TextField(_("entry.logo"),
        description=u'图标',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=11, max=100, message=_("Length range: 11 - 100"))
        ])

    feature_image = TextField(_("entry.feature_image"),
        description=u'特色图地址',
        validators=[
            url(message=_("feature_image is not a valid URL")),
            length(min=11, max=200, message=_("Length range: 11 - 200"))
        ])

    content = TextAreaField(_("entry.content"),
        description=u'内容',
        validators=[
            required(message=_("content is required")),
            ])

    summary = TextAreaField(_("entry.summary"),
        description=u'摘要',
        validators=[
            length(min=1, max=200, message=_("Length range: 1 - 200"))
        ])

    on_portal = SelectField(_("entry.on_portal"),
        default=0,
        choices=[('0', u'否'), ('1', u'是')],
        description=u'是否首页显示',
        validators=[
            required(message=_("on_portal is required")),
            ])

    on_top = SelectField(_("entry.on_top"),
        default=0,
        choices=[('0', u'否'), ('1', u'是')],
        description=u'是否置顶',
        validators=[
            required(message=_("on_top is required")),
            ])

    comment_status = SelectField(_("entry.comment_status"),
        default=0,
        description=u'评论状态：0-允许、1-关闭',
        choices=[('0', u'允许'), ('1', u'关闭')],
        validators=[
            required(message=_("comment_status is required")),
            ])

    entry_status = SelectField(_("entry.entry_status"),
        default=0,
        description=u'内容状态：0-草稿、1-待审、2-已删除、3-发布、4-已接受',
        choices=[('0', u'草稿'), ('1', u'待审'), ('2', u'已删除'), ('3', u'发布')],
        validators=[
            required(message=_("entry_status is required")),
            ])

    view_status = SelectField(_("entry.view_status"),
        default=0,
        description=u'显示状态：0-公开、1-私有、2-仅作者可见、3-隐藏',
        choices=[('0', u'公开'), ('1', u'私有'), ('2', u'仅作者可见'), ('3', u'隐藏')],
        validators=[
            required(message=_("view_status is required")),
            ])

    scores = SelectField(_("entry.scores"),
        default=0,
        description=u'分数',
        choices=[('0', u'未知'), ('1', u'1'), ('2', u'2'), ('3', u'2'), ('4', u'2'), ('5', u'2')],
        validators=[
            required(message=_("scores is required")),
            ])

    difficulty = SelectField(_("entry.difficulty"),
        default=0,
        description=u'深浅度',
        choices=[('0', u'容易'), ('1', u'一般'), ('2', u'难'), ('3', u'高深')],
        validators=[
            required(message=_("difficulty is required")),
            ])

    recommend = SelectField(_("entry.recommend"),
        default=0,
        description=u'推荐级别：0-默认（未推荐）、1-不错、2-良好、3-精华',
        choices=[('0', u'未推荐'), ('1', u'不错'), ('2', u'良好'), ('3', u'精华')],
        validators=[
            required(message=_("recommend is required")),
            ])

    on_portal = SelectField(_("entry.on_portal"),
        default=0,
        description=u'是否首页显示',
        choices=[('0', u'否'), ('1', u'是')],
        validators=[
            required(message=_("view_status is required")),
            ])

    #阅读权限：
    #     是否隐藏栏目（显示、隐藏）
    show_role = RadioField(_("entry.show_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能查看的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

