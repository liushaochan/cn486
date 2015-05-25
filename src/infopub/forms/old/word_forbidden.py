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

__doc__ = '限制词 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.608000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, RadioField
from wtforms.validators import required
from infopub.bases.validators import length
from flask.ext.wtf import Form

class WordForbiddenNewForm(Form):
    """
    新建 WordsForbidden 的表单
    """

    
    word = TextField(_("words_forbidden.word"),
                description=u'关键词',
                validators=[
                    required(message=_("word is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    word_group = RadioField(_("words_forbidden.word_group"),
                default='0',
                choices=[('0', _("sensitive")), ('1', _("advert")), ('2', _("spam")), ('3', _("sex"))],
                description=u'分组：0-敏感词、1-广告词、2-灌水词、3-色情词',
                validators=[
                    required(message=_("word_group is required")),
            ])
    
    word_type = RadioField(_("words_forbidden.word_type"),
                default='0',
                choices=[('0', _("contain")), ('1', _("equal")), ('2', _("regex"))],
                description=u'类型：0-包含、1-相同、2-正则',
                validators=[
                    required(message=_("word_type is required")),
            ])
    
    process_type = RadioField(_("words_forbidden.process_type"),
                default='0',
                choices=[('0', _("replace")), ('1', _("check pending"))],
                description=u'类型：0-替换、1-待审',
                validators=[
                    required(message=_("process_type is required")),
            ])
    
    def validate_word(self, field):
        # unique
        pass


class WordForbiddenEditForm(Form):
    """
    编辑 WordsForbidden 的表单
    """

    
    word = TextField(_("words_forbidden.word"),
                description=u'关键词',
                validators=[
                    required(message=_("word is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])

    word_group = RadioField(_("words_forbidden.word_group"),
                choices=[('0', _("sensitive")), ('1', _("advert")), ('2', _("spam")), ('3', _("sex"))],
                description=u'分组：0-敏感词、1-广告词、2-灌水词、3-色情词',
                validators=[
                    required(message=_("word_group is required")),
            ])
    
    word_type = RadioField(_("words_forbidden.word_type"),
                choices=[('0', _("contain")), ('1', _("equal")), ('2', _("regex"))],
                description=u'类型：0-包含、1-相同、2-正则',
                validators=[
                    required(message=_("word_type is required")),
            ])
    
    process_type = RadioField(_("words_forbidden.process_type"),
                choices=[('0', _("replace")), ('1', _("check pending"))],
                description=u'类型：0-替换、1-待审',
                validators=[
                    required(message=_("process_type is required")),
            ])
    
    def validate_word(self, field):
        # unique
        pass
