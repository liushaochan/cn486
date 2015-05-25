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

__doc__ = 'word_reserved 表单'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-18 13:16:54.507000'

from flask.ext.babelex import  lazy_gettext as _
from wtforms.fields import TextField, RadioField
from wtforms.validators import required
from flask.ext.wtf import Form
from infopub.bases.validators import length

class WordReservedNewForm(Form):
    """
    新建 WordsReserved 的表单
    """

    word = TextField(_("words_reserved.word"),
                description=u'关键词',
                validators=[
                    required(message=_("word is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])
    
    word_type = RadioField(_("words_reserved.word_type"),
                default='0',
                choices=[('0', _("contain")), ('1', _("equal"))],
                description=u'类型：0-包含、1-相同',
                validators=[
                    required(message=_("word_type is required")),
            ])
    
    def validate_word(self, field):
        # unique
        pass


class WordReservedEditForm(Form):
    """
    编辑 WordsReserved 的表单
    """

    word = TextField(_("words_reserved.word"),
                description=u'关键词',
                validators=[
                    required(message=_("word is required")),
                    length(min=1, max=100, message=_("Length range: 1 - 100"))
            ])

    word_type = RadioField(_("words_reserved.word_type"),
        choices=[('0', _("contain")), ('1', _("equal"))],
        description=u'类型：0-包含、1-相同',
        validators=[
            required(message=_("word_type is required")),
            ])
    
    def validate_word(self, field):
        # unique
        pass
