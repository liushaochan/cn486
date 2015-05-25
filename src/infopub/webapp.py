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

import sys

reload(sys)
sys.setdefaultencoding('utf-8')

import os
from infopub.utils import api
from infopub.utils import admin
from runkit.web.views import blueprints
from runkit.web.helpers.app import Flask
from runkit.web.helpers import app
from runkit.web.flask_ext import locale
from runkit.web.flask_ext import admin_manager
from runkit.web.flask_ext import api_manager
from runkit.web.flask_ext import assets
from runkit.web.flask_ext import cache
from runkit.web.flask_ext import sql, log, email, security
from runkit.web.flask_ext import gravatar
from runkit.web.flask_ext import session
from runkit.web.flask_ext import uploads

from runkit.web.views.middleware import HTTPMethodOverrideMiddleware

from infopub.configs.assets import js, css
from infopub.configs.log import LOG_PATH, LOG_FOEMAT_PREFIX, LOG_LEVEL, \
    LOG_DB_LEVEL, LOG_DB_COLLECTION, LOG_DB_HOST, LOG_DB_NAME, LOG_DB_PORT

from infopub.helpers import error_handlers, template_filter, request_handlers, context_processors
from infopub.forms.user import ExtendedRegisterForm

from infopub.configs.paths import WEB_ROOT

from infopub.configs.config import BaseConfig, ProductionConfig, DevelopmentConfig
from infopub.models.user import User, Role
from runkit.system.singleton import SingletonMeta

try:
    from infopub.configs.local_config import SiteConfig
except ImportError:
    if os.environ.get("%s_ENV" % BaseConfig.PROJECT.upper()) == 'Production':
        SiteConfig = ProductionConfig
    else:
        SiteConfig = DevelopmentConfig

from flask_debugtoolbar import DebugToolbarExtension

__all__ = ['create_app']

__doc__ = '网站主程序。注意：WebApp是单例模式，多个Web App，要改类名'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:04'


class WebApp(object):
    __metaclass__ = SingletonMeta

    def __init__(self, config, project_root):
        print 'infopub site Initializing ......'

        self.config = config

        # 配置flask app
        self.config.WEB_ROOT = WEB_ROOT
        self.config.PROJECT_ROOT = project_root

        self.web_app = Flask(self.config.PROJECT, static_folder=self.config.WEB_ROOT, static_path='/static',
                             template_folder=os.path.join(project_root, 'templates'))
        self.web_app.debug = self.config.DEBUG

        app.configure(self.web_app, self.config)

        assets.configure(self.web_app, js, css)

        # for key, value in FLASK_SECURITY_DEFAULT_MESSAGES.items():
        #     self.web_app.config.setdefault('SECURITY_MSG_' + key, value)

        # 配置log
        # log.configure(self.web_app)
        log.configure(self.web_app, LOG_PATH, LOG_FOEMAT_PREFIX, LOG_LEVEL,
                      LOG_DB_HOST, LOG_DB_PORT,
                      LOG_DB_NAME, LOG_DB_COLLECTION,
                      LOG_DB_LEVEL)

        # if self.config.DEBUG:
        #     self.toolbar = DebugToolbarExtension(self.web_app)

        locale.configure(self.web_app)

        # 配置blueprints
        # 自动扫描views目录中的python代码
        blueprints.configure(self.web_app, os.path.join(project_root, 'views'))
        blueprints.configure(self.web_app, os.path.join(project_root, 'apis'))

        cache.configure(self.web_app)

        context_processors.configure(self.web_app)

        sql.configure(self.web_app)

        email.configure(self.web_app)

        error_handlers.configure(self.web_app)

        request_handlers.configure(self.web_app)

        template_filter.configure(self.web_app)

        api_manager.configure(self.web_app, sql.db)
        api.configure(api_manager.api_manager)

        gravatar.configure(self.web_app)

        session.configure(self.web_app)

        security.configure(self.web_app, sql.db, User, Role, register_form=ExtendedRegisterForm)

        admin_manager.configure(self.web_app)
        admin.configure(admin_manager.admin_manager)

        uploads.configure(self.web_app)

        self.web_app.wsgi_app = HTTPMethodOverrideMiddleware(self.web_app.wsgi_app)

        self.web_app.jinja_env.variable_start_string = '{{ '
        self.web_app.jinja_env.variable_end_string = ' }}'

        print 'infopub site Initialized'

    def app_instance(self):
        return self.web_app


def create_app():
    web_app = WebApp(SiteConfig, os.path.dirname(__file__))

    return web_app.app_instance()


def main():
    create_app().run()