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

from infopub.models.category import Category, CategoryAdmin
from flask.ext.babelex import lazy_gettext as _
from infopub.models.system_config import SystemConfig, SystemConfigAdmin
from infopub.models.tag import Tag, TagAdmin
from infopub.models.user import User, Role, RoleAdmin, UserAdmin
from runkit.web.flask_ext import sql

__doc__ = '配置admin'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:04'


def configure(manager):
    accounts_name_i18 = _("Accounts")
    entries_name_i18 = _("Entries")
    system_name_i18 = _("System")

    manager.register(User, UserAdmin, sql.db.session, _("User"), category=accounts_name_i18)
    manager.register(Role, RoleAdmin, sql.db.session, _("Role"), category=accounts_name_i18)

    manager.register(Category, CategoryAdmin, sql.db.session, _("Category"), category=entries_name_i18)
    manager.register(Tag, TagAdmin, sql.db.session, _("Tag"), category=entries_name_i18)

    manager.register(SystemConfig, SystemConfigAdmin, sql.db.session, _("SystemConfig"), category=system_name_i18)


    #manager.register(File, FileAdmin, category='Content')
    #manager.register(Image, ImageAdmin, category='Content')
    #manager.register(Channel, ChannelAdmin, category="Content")
    #manager.register(Config, ConfigAdmin, category="Settings")
    #manager.register(Post, PostAdmin, category="Content")
    #manager.add_view(UserAdmin(User, sql.db.session, category="Accounts"))
