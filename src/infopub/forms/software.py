# !/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
# Copyright (c) 2011 - 2035 HangZhou JingChuang Information Technology CO.,Ltd.
# 杭州精创信息技术有限公司
#
# http://www.jcing.com
#
# All rights reserved.
#

from infopub.models.content.software import Software
from runkit.web.flask_ext.sql import db
from wtforms import SubmitField, HiddenField
from wtforms_alchemy import ModelForm
from flask.ext.babelex import lazy_gettext as _


__doc__ = '用户表单'
__author__ = 'wuxqing'
__version__ = 1.0
__time__ = '2013-06-02 7:46 PM'


class SoftwareForm(ModelForm):
    class Meta:
        model = Software

        exclude = ['created_ip', 'upward_time', 'category_id',
                   'published_id', 'entry_type', 'slug', 'recommend', 'comment_status', 'view_status',
                   'entry_status', 'be_modified', 'num_favorites', 'num_retweet', 'num_views', 'num_comments',
                   'published_time', 'ranking', 'data_version',

                   'creater_id', 'modifier_id',
                   'source_type', 'num_uninterested', 'logo']
        #
        # field_args = {
        #     'category_name': {'label': _('category name'), 'description': '栏目的名称，必填的哦'}
        # }

    @classmethod
    def get_session(cls):
        return db.session

    publish = SubmitField(_("Publish"))
    draft = SubmitField(_("Draft"))
    preview = SubmitField(_("Preview"))

    next = HiddenField()