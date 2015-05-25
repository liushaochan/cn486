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

__doc__ = 'category 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:55.015000'

from flask.ext.wtf import Form
from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, RadioField, HiddenField
from wtforms.validators import required
from infopub.bases.validators import length, url

class CategoryNewForm(Form):
    """
    新建 Category 的表单
    """

    parent_id = HiddenField(_("category.parent_id"),
                description=u'父ID',
                validators=[
            ])
    
    category_name = TextField(_("category.category_name"),
                description=u'分类名',
                validators=[
                    required(message=_("category_name is required")),
                    length(min=1, max=50, message=_("Length range: 1 - 50"))
            ])
    
    slug = TextField(_("category.slug"),
                description=u'固定地址',
                validators=[
                    required(message=_("slug is required")),
                    length(min=1, max=50, message=_("Length range: 1 - 50"))
            ])
    
    logo = TextField(_("category.logo"),
                description=u'图标',
                validators=[
                    url(message=_("logo is not a valid URL")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])

    feature_image = TextField(_("category.feature_image"),
                description=u'特色图地址',
                validators=[
                    url(message=_("logo is not a valid URL")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])

    entry_type = RadioField(_("entry.entry_type"),
        description=u'类型：分类中不再有类型，不想改动数据库，暂留此字段',
        default='-1',
        choices=[('-1', _("Mixed"))],
        validators=[
            required(message=_("entry_type is required")),
            ])

    # 浏览权限 (仅限制栏目里的文档浏览权限)
    #     是否隐藏栏目（显示、隐藏）
    show_role = RadioField(_("category.show_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能查看的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

    # 是否支持投稿（不支持、支持）
    post_role = RadioField(_("category.post_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能投稿的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

    # 栏目列表选项：
    #     链接到默认页
    #     链接到列表第一页
    #     使用动态页
    list_template = TextField(_("category.list_template"),
        default='/public/',
        description=u'列表页模板',
        validators=[
            required(message=_("list_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    create_template = TextField(_("category.create_template"),
        default='/create.html',
        description=u'创建页模板',
        validators=[
            required(message=_("create_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    edit_template = TextField(_("category.edit_template"),
        default='/edit.html',
        description=u'编辑页模板',
        validators=[
            required(message=_("edit_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    show_template = TextField(_("category.show_template"),
        default='/public/',
        description=u'显示页模板',
        validators=[
            required(message=_("show_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    search_template = TextField(_("category.search_template"),
        default='/public/search.html',
        description=u'搜索结果页模板',
        validators=[
            required(message=_("search_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    description = TextField(_("category.description"),
                description=u'描述',
                validators=[
            ])
    
    display_order = TextField(_("category.display_order"),
            default='0',
                description=u'显示次序',
                validators=[
                    required(message=_("display_order is required")),
            ])

    meta_title = TextField(_("category.meta_title"),
                description=u'针对搜索引擎设置的标题',
                validators=[
                    length(max=100, message=_("Length max: 100"))
            ])

    meta_keywords = TextField(_("category.meta_keywords"),
                description=u'针对搜索引擎设置的关键词',
                validators=[
                    length(max=200, message=_("Length max: 200"))
            ])

    meta_description = TextField(_("category.meta_description"),
                description=u'针对搜索引擎设置的描述',
                validators=[
                    length(max=200, message=_("Length max: 200"))
            ])

    entry_url_rule = TextField(_("category.entry_url_rule"),
                default='/archives/{title_id}',
                description=u'文章编码规则',
                validators=[
                    length(max=100, message=_("Length max: 100"))
            ])

    def validate_category_name(self, field):
        # unique
        pass
    
    def validate_slug(self, field):
        # unique
        pass


class CategoryEditForm(Form):
    """
    编辑 Category 的表单
    """

    parent_id = HiddenField(_("category.parent_id"),
        description=u'父ID',
        validators=[
        ])

    category_name = TextField(_("category.category_name"),
        description=u'分类名',
        validators=[
            required(message=_("category_name is required")),
            length(min=1, max=50, message=_("Length range: 1 - 50"))
        ])

    slug = TextField(_("category.slug"),
        description=u'固定地址',
        validators=[
            required(message=_("slug is required")),
            length(min=1, max=50, message=_("Length range: 1 - 50"))
        ])

    logo = TextField(_("category.logo"),
        description=u'图标',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    feature_image = TextField(_("category.feature_image"),
        description=u'特色图地址',
        validators=[
            url(message=_("logo is not a valid URL")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    entry_type = RadioField(_("entry.entry_type"),
        description=u'类型：分类中不再有类型，不想改动数据库，暂留此字段',
        default='-1',
        choices=[('-1', _("Mixed"))],
        validators=[
            required(message=_("entry_type is required")),
            ])

    # 浏览权限 (仅限制栏目里的文档浏览权限)
    #     是否隐藏栏目（显示、隐藏）
    show_role = RadioField(_("category.show_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能查看的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

    # 是否支持投稿（不支持、支持）
    post_role = RadioField(_("category.post_role"),
        default='0',
        choices=[('0', _("all")), ('10', _("member")), ('11', _("enthusiast")), ('12', _("mainstay")), ('13', _("senior")),
            ('100', _("partner")), ('1000', _("editor")), ('2000', _("moderator")), ('10000', _("supervisor")), ('10100', _("administrator"))
        ],
        description=u'能投稿的角色：0-不限',
        validators=[
            required(message=_("word_group is required")),
            ])

    # 栏目列表选项：
    #     链接到默认页
    #     链接到列表第一页
    #     使用动态页
    list_template = TextField(_("category.list_template"),
        default='/public/',
        description=u'列表页模板',
        validators=[
            required(message=_("list_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    create_template = TextField(_("category.create_template"),
        default='/create.html',
        description=u'创建页模板',
        validators=[
            required(message=_("create_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    edit_template = TextField(_("category.edit_template"),
        default='/edit.html',
        description=u'编辑页模板',
        validators=[
            required(message=_("edit_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    show_template = TextField(_("category.show_template"),
        default='/public/',
        description=u'显示页模板',
        validators=[
            required(message=_("show_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    search_template = TextField(_("category.search_template"),
        default='/public/search.html',
        description=u'搜索结果页模板',
        validators=[
            required(message=_("search_template is required")),
            length(min=1, max=100, message=_("Length range: 1 - 100"))
        ])

    description = TextField(_("category.description"),
        description=u'描述',
        validators=[
        ])

    display_order = TextField(_("category.display_order"),
        default='0',
        description=u'显示次序',
        validators=[
            required(message=_("display_order is required")),
            ])

    meta_title = TextField(_("category.meta_title"),
        description=u'针对搜索引擎设置的标题',
        validators=[
            length(max=100, message=_("Length max: 100"))
        ])

    meta_keywords = TextField(_("category.meta_keywords"),
        description=u'针对搜索引擎设置的关键词',
        validators=[
            length(max=200, message=_("Length max: 200"))
        ])

    meta_description = TextField(_("category.meta_description"),
        description=u'针对搜索引擎设置的描述',
        validators=[
            length(max=200, message=_("Length max: 200"))
        ])

    entry_url_rule = TextField(_("category.entry_url_rule"),
        description=u'文章编码规则',
        validators=[
            length(max=100, message=_("Length max: 100"))
        ])

    def validate_category_name(self, field):
        # unique
        pass
    
    def validate_slug(self, field):
        # unique
        pass
