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

__doc__ = '前端文章发布 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.709000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, HiddenField, SubmitField, TextAreaField, SelectField, RadioField
from wtforms.validators import required, ValidationError
from flask.ext.wtf import Form
from infopub.bases.validators import length, url

class PostNewForm(Form):
    """
    新建 Entry 的表单
    """

    title = TextField(_("entry.title"),
                description=u'标题',
                validators=[
                    required(message=_("title is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    source_type = RadioField(_("entry.source_type"),
                choices=[('0', _("Original")), ('1', _("Translate")), ('2', _("Reprint"))],
                description=u'来源类型：0-原创、1-翻译、2-转帖',
                default='0',
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
    
    feature_image = TextField(_("entry.feature_image"),
                description=u'特色图地址',
                validators=[
                    url(message=_("feature_image is not a valid URL")),
                    length(min=11, max=200, message=_("Length range: 11 - 200"))
            ])
    
    tags = HiddenField(_("entry.tags"),
                description=u'标签',
                validators=[
                    # length(min=1, max=512, message=_("Length range: 1 - 512"))
            ])
    
    content = TextAreaField(_("entry.content"),
                description=u'内容',
                default="",
                validators=[
                    #required(message=_("content is required")),
            ])
    
    summary = TextAreaField(_("entry.summary"),
                description=u'摘要',
                validators=[
                    length(min=1, max=200, message=_("Length range: 1 - 200"))
            ])
    
    on_portal = SelectField(_("entry.on_portal"),
                choices=[('0', _("No")), ('1', _("Yes"))],
                default='0',
                description=u'是否首页显示',
                validators=[
                    required(message=_("on_portal is required")),
            ])
    
    on_top = SelectField(_("entry.on_top"),
                choices=[('0', _("No")), ('1', _("Yes"))],
                default='0',
                description=u'是否置顶',
                validators=[
                    required(message=_("on_top is required")),
            ])
    
    comment_status = SelectField(_("entry.comment_status"),
                description=u'评论状态：0-允许、1-关闭',
                default='0',
                choices=[('0', _("Allow")), ('1', _("Close"))],
                validators=[
                    required(message=_("comment_status is required")),
            ])

    view_status = RadioField(_("entry.view_status"),
        description=u'显示状态：0-公开、1-私有、2-隐藏',
        choices=[('0', _("Public")), ('1', _("Private")), ('2', _("Hide"))],
        default='0',
        validators=[
            required(message=_("view_status is required")),
            ])
    principal_language = SelectField(_("entry.principal_language"),
        default=0,
        description=u'主体语言：1-Java 、    2-C/C++    3-Objective-C    4-PHP    5-Perl    6-Python    7-Ruby    8-C#    9-.NET    10-ASP    11-D语言    12-Groovy    13-Scala    14-JavaScript    15-HTML/CSS    16-ActionScript    17-VBScript    18-Delphi/Pascal    19-Basic    20-ErLang    21-COBOL    22-Fortran    23-Lua    24-SHELL    25-Smalltalk    26-汇编    27-Sliverlight    28-Lisp    29-Google Go',
        choices=[('0', u'未知'), ('1', u'Java'), ('2', u'C/C++'),('3', u'Objective-C'),    ('4', u'PHP'),    ('5', u'Perl'),    ('6', u'Python'),    ('7', u'Ruby'),    ('8', u'C#'),    ('9', u'.NET'),      ('10', u'D语言'),       ('11', u'Scala'),    ('12', u'JavaScript'),    ('13', u'HTML'),  ('14', u'CSS'),    ('15', u'ActionScript'),        ('16', u'Delphi/Pascal'),        ('17', u'ErLang'),       ('18', u'Fortran'),    ('19', u'Lua'),    ('20', u'Smalltalk'), ('21', u'Lisp')],
        validators=[
            required(message=_("principal language is required")),
            ])

    license_agreement = SelectField(_("entry.license_agreement"),
        default=0,
        description=u'授权协议：0-未知,1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,9-Freeware、10-Shareware、11-Commercial、12-多重协议、13-其它',
        choices=[('0', u'未知'),('1', u'GPL'),('2', u'LGPL'),('3', u'AGPL'),('4', u'Apache'),('5', u'MIT'),('6', u'BSD'),('7', u'EPL'),('8', u'MPL'),('9', u'Freeware'),('10', u'Shareware'),('11', u'Commercial'),('12', u'多重协议') ,('13', u'其它') ],
        validators=[
            required(message=_("license agreement is required")),
            ])

    runtime_platform = SelectField(_("entry.runtime_platform"),
        default=0,
        description=u'运行平台: 1-Linux,2-Windows,3-BSD,4-UNIX,5-OS X,6-Symbian,7-J2ME,8-嵌入式,9-Android,10-iPhone/iPad/iPod,11-Windows Phone/Mobile,12-Meego,13-Moblin',
        choices=[('0', u'未知'),('1', u'Linux'),('2', u'Windows'),('3', u'BSD'),('4', u'UNIX'),('5', u'OS X'),('6', u'Symbian'),('7', u'J2ME'),('8', u'嵌入式'),('9', u'Android'),('10', u'iPhone/iPad/iPod'),('11', u'Windows Phone/Mobile'),('12', u'Meego'),('13', u'Moblin')],
        validators=[
            required(message=_("runtime platform is required")),
            ])

    attachment_id_list = TextField(_("entry.attachment_id_list"),
        description=u'下载地址',
        validators=[
            #required(message=_("title is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    category_id = HiddenField(_("entry.category_id"),
            description=u'分类ID：0-未分类',
            validators=[
                required(message=_("category_id is required")),
        ])

    author_id = HiddenField(_("entry.author_id"),
            description=u'作者ID',
            validators=[
                required(message=_("author_id is required")),
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

    entry_type = HiddenField()

    next = HiddenField()

    publish = SubmitField(_("Publish"))

    draft = SubmitField(_("Draft"))

    preview = SubmitField(_("Preview"))


class PostEditForm(Form):
    """
    编辑 Entry 的表单
    """

    title = TextField(_("entry.title"),
        description=u'标题',
        validators=[
            required(message=_("title is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    source_type = RadioField(_("entry.source_type"),
        choices=[('0', _("Original")), ('1', _("Translate")), ('2', _("Reprint"))],
        default='0',
        description=u'来源类型：0-原创、1-翻译、2-转帖',
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

    feature_image = TextField(_("entry.feature_image"),
        description=u'特色图地址',
        validators=[
            url(message=_("feature_image is not a valid URL")),
            length(min=11, max=200, message=_("Length range: 11 - 200"))
        ])

    tags = HiddenField(_("entry.tags"),
        description=u'标签',
        validators=[
            # length(min=1, max=512, message=_("Length range: 1 - 512"))
        ])

    content = TextAreaField(_("entry.content"),
        description=u'内容',
                default="",
                validators=[
                    #required(message=_("content is required")),
            ])

    summary = TextAreaField(_("entry.summary"),
        description=u'摘要',
        validators=[
            length(min=1, max=200, message=_("Length range: 1 - 200"))
        ])

    on_portal = SelectField(_("entry.on_portal"),
        choices=[('0', _("No")), ('1', _("Yes"))],
        default='0',
        description=u'是否首页显示',
        validators=[
            required(message=_("on_portal is required")),
            ])

    on_top = SelectField(_("entry.on_top"),
        choices=[('0', _("No")), ('1', _("Yes"))],
        default='0',
        description=u'是否置顶',
        validators=[
            required(message=_("on_top is required")),
            ])

    comment_status = SelectField(_("entry.comment_status"),
        description=u'评论状态：0-允许、1-关闭',
        choices=[('0', _("Allow")), ('1', _("Close"))],
        default='0',
        validators=[
            required(message=_("comment_status is required")),
            ])

    view_status = RadioField(_("entry.view_status"),
        description=u'显示状态：0-公开、1-私有、2-隐藏',
        choices=[('0', _("Public")), ('1', _("Private")), ('2', _("Hide"))],
        default='0',
        validators=[
            required(message=_("view_status is required")),
            ])
    principal_language = SelectField(_("entry.principal_language"),
        default=0,
        description=u'主体语言：1-Java 、    2-C/C++    3-Objective-C    4-PHP    5-Perl    6-Python    7-Ruby    8-C#    9-.NET    10-ASP    11-D语言    12-Groovy    13-Scala    14-JavaScript    15-HTML/CSS    16-ActionScript    17-VBScript    18-Delphi/Pascal    19-Basic    20-ErLang    21-COBOL    22-Fortran    23-Lua    24-SHELL    25-Smalltalk    26-汇编    27-Sliverlight    28-Lisp    29-Google Go',
        choices=[('0', u'未知'), ('1', u'Java'), ('2', u'C/C++'),('3', u'Objective-C'),    ('4', u'PHP'),    ('5', u'Perl'),    ('6', u'Python'),    ('7', u'Ruby'),    ('8', u'C#'),    ('9', u'.NET'),      ('10', u'D语言'),       ('11', u'Scala'),    ('12', u'JavaScript'),    ('13', u'HTML'),  ('14', u'CSS'),    ('15', u'ActionScript'),        ('16', u'Delphi/Pascal'),        ('17', u'ErLang'),       ('18', u'Fortran'),    ('19', u'Lua'),    ('20', u'Smalltalk'), ('21', u'Lisp')],
        validators=[
            required(message=_("principal language is required")),
            ])

    license_agreement = SelectField(_("entry.license_agreement"),
        default=0,
        description=u'授权协议：0-未知,1-GPL,2-LGPL,3-AGPL,4-Apache,5-MIT,6-BSD,7-EPL,8-MPL,9-Freeware、10-Shareware、11-Commercial、12-多重协议、13-其它',
        choices=[('0', u'未知'),('1', u'GPL'),('2', u'LGPL'),('3', u'AGPL'),('4', u'Apache'),('5', u'MIT'),('6', u'BSD'),('7', u'EPL'),('8', u'MPL'),('9', u'Freeware'),('10', u'Shareware'),('11', u'Commercial'),('12', u'多重协议') ,('13', u'其它') ],
        validators=[
            required(message=_("license agreement is required")),
            ])

    runtime_platform = SelectField(_("entry.runtime_platform"),
        default=0,
        description=u'运行平台: 1-Linux,2-Windows,3-BSD,4-UNIX,5-OS X,6-Symbian,7-J2ME,8-嵌入式,9-Android,10-iPhone/iPad/iPod,11-Windows Phone/Mobile,12-Meego,13-Moblin',
        choices=[('0', u'未知'),('1', u'Linux'),('2', u'Windows'),('3', u'BSD'),('4', u'UNIX'),('5', u'OS X'),('6', u'Symbian'),('7', u'J2ME'),('8', u'嵌入式'),('9', u'Android'),('10', u'iPhone/iPad/iPod'),('11', u'Windows Phone/Mobile'),('12', u'Meego'),('13', u'Moblin')],
        validators=[
            required(message=_("runtime platform is required")),
            ])

    attachment_id_list = TextField(_("entry.attachment_id_list"),
        description=u'下载地址',
        validators=[
            #required(message=_("title is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    category_id = HiddenField(_("entry.category_id"),
            description=u'分类ID：0-未分类',
            validators=[
                required(message=_("category_id is required")),
        ])

    author_id = HiddenField(_("entry.author_id"),
            description=u'作者ID',
            validators=[
                required(message=_("author_id is required")),
        ])
    
    def validate_slug(self, field):
        # unique
        pass

    def validate_summary(self, field):
        pass
        #print type(field.data), len(field.data)
        #if len(str(field.data).encode(encoding='UTF-8')) > 200:
        #    raise ValidationError, _("Summary must be less than 200 characters")
    

    id = HiddenField()

    entry_type = HiddenField()

    next = HiddenField()

    publish = SubmitField(_("Publish"))

    draft = SubmitField(_("Draft"))

    preview = SubmitField(_("Preview"))
