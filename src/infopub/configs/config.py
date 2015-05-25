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

import os
from infopub.configs.paths import PROJECT_ROOT, STATIC_ROOT, MEDIA_ROOT, ASSETS_ROOT, UPLOADS_PATH
from infopub.configs.secret_keys import CSRF_SECRET_KEY, SESSION_KEY
from redis import Redis

__doc__ = '定义环境项'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:42'


class BaseConfig(object):
    PROJECT = "test"
    PROJECT_NAME = u"test"
    DEBUG = False
    TESTING = False

    # 网站管理员邮箱
    ADMINS = frozenset(['wuxqing@gmail.com'])

    # 执行 python -c "import os;print os.urandom(24)" 获取key
    SECRET_KEY = CSRF_SECRET_KEY

    SESSION_TYPE = 'redis'
    SESSION_KEY_PREFIX = "ip_sk:"
    SESSION_REDIS = Redis(host='localhost', port=6380)
    PERMANENT_SESSION_LIFETIME = 60*30

    USE_LOCAL_COMMENT = True    # if false, to include external_comment.html

    # WTForms
    CSRF_ENABLED = True

    # 使用python产生
    # python -c "import uuid;print uuid.uuid4()"
    CSRF_SESSION_KEY = SESSION_KEY

    # ===========================================
    # 配置Flask-babel，支持多语种
    #
    ACCEPT_LANGUAGES = ['zh', 'en', 'zh_CN', 'zh_Hans_CN']
    BABEL_DEFAULT_LOCALE = 'zh_Hans_CN'
    BABEL_DEFAULT_TIMEZONE = 'Asia/Shanghai'

    # ===========================================
    # Flask-cache
    #
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 60

    # 最大POST尺寸
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    UPLOADS_DEFAULT_DEST = UPLOADS_PATH
    # UPLOADS_DEFAULT_URL = UPLOADS_URL

    # 配置 Debug toolbar
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    DEBUG_TB_PROFILER_ENABLED = True
    DEBUG_TB_TEMPLATE_EDITOR_ENABLED = True
    DEBUG_TB_PANELS = (
        'flask_debugtoolbar.panels.versions.VersionDebugPanel',
        'flask_debugtoolbar.panels.timer.TimerDebugPanel',
        'flask_debugtoolbar.panels.headers.HeaderDebugPanel',
        'flask_debugtoolbar.panels.request_vars.RequestVarsDebugPanel',
        'flask_debugtoolbar.panels.template.TemplateDebugPanel',
        # 'flask.ext.mongoengine.panels.MongoDebugPanel',
        'flask_debugtoolbar.panels.logger.LoggingPanel',
        'flask_debugtoolbar.panels.profiler.ProfilerDebugPanel',
    )

    # 配置是否启用 Debug toolbar
    DEBUG_TOOLBAR_ENABLED = True

    # 配置 Flask-Security，详细文档见：
    # http://pythonhosted.org/Flask-Security/configuration.html
    SECURITY_PASSWORD_HASH = 'pbkdf2_sha512'
    SECURITY_URL_PREFIX = '/account'
    # PASSWORD_SALT，每个网站应该不同
    SECURITY_PASSWORD_SALT = '6e95b1ed-a8c3-4da0-8bac-6fcb11c39ab4'
    SECURITY_REGISTERABLE = True
    SECURITY_CHANGEABLE = True
    SECURITY_RECOVERABLE = True
    SECURITY_TRACKABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_CONFIRMABLE = False
    SECURITY_EMAIL_SENDER = 'test@jcing.cn' #'cn486(cn486.COM) <no-reply@cn486.com>'

    # 配置mongodb
    MONGODB_SETTINGS = {'DB': "cn486_v1"}

    # 静态文件映射
    # http://dormousehole.readthedocs.org/en/latest/patterns/favicon.html
    MAP_STATIC_ROOT = ('/robots.txt', '/sitemap.xml', '/favicon.ico')

    # 配置是否产生slug
    SMART_SLUG_ENABLED = False

    """
    Default configuration for FLask-Admin instance
    :name: - will be the page title
    :url: - is the ending point
    """
    ADMIN = {'name': 'cn486 site admin', 'url': '/admin'}

    """
    File admin can expose folders, you just need to have them
    mapped in your server or in flask, see quooka.ext.views
    """
    FILE_ADMIN = [
        {
            "name": "Template files",
            "category": "files",
            "path": os.path.join(PROJECT_ROOT, 'templates'),
            "url": "/template_files/",  # create nginx rule
            "endpoint": "template_files"
        },
        {
            "name": "Static files",
            "category": "files",
            "path": STATIC_ROOT,
            "url": "/static/",  # create nginx rule
            "endpoint": "static_files"
        },
        {
            "name": "assets files",
            "category": "files",
            "path": ASSETS_ROOT,
            "url": "/assets/",  # create nginx rule
            "endpoint": "assets_files"
        },
        {
            "name": "Media files",
            "category": "files",
            "path": MEDIA_ROOT,
            "url": "/media/",  # Create nginx rule
            "endpoint": "media_files"
        }
    ]

    URL_MAP = {
    }


class DevelopmentConfig(BaseConfig):
    MODE = 'dev'
    DEBUG = True

    # ===========================================
    # Flask-Sqlalchemy
    #
    # http://packages.python.org/Flask-SQLAlchemy/config.html
    # 是否显示输出信息
    SQLALCHEMY_ECHO = False

    # 数据库连接 URI
    # sqlite 用于 testing/debug，或者小型站点
    # SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/' + BaseConfig.PROJECT + ".sqlite"
    # mysql db 连接
    # SQLALCHEMY_DATABASE_URI = 'mysql://cn486_user:Cny486IbVA3s8YX8@127.0.0.1:3306/cn486_v1?charset=utf8'
    # postgresql
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://postgres:postgres123@localhost:5432/cn486_v1'

    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
    REDIS_DB = 1

    # ===========================================
    # Flask-mail
    #
    # 使用google的email smtp
    # https://bitbucket.org/danjac/flask-mail/issue/3/problem-with-gmails-smtp-server
    MAIL_DEBUG = DEBUG
    MAIL_SERVER = 'smtp.ym.163.com'
    MAIL_PORT = 25
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'test@jcing.cn'
    MAIL_PASSWORD = '7ShSj26LuN'

    USER_AVATAR_UPLOAD_FOLDER = "/tmp/uploads"
    #USER_AVATAR_UPLOAD_FOLDER = os.path.join(BaseConfig._basedir, 'uploads')


class ProductionConfig(BaseConfig):
    MODE = 'production'
    DEBUG = False

    SQLALCHEMY_ECHO = DEBUG

    # mysql db 连接
    SQLALCHEMY_DATABASE_URI = 'mysql://cn486_user:AnyIbVA3s8YX8@127.0.0.1:3306/cn486_v1?charset=utf8'

    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
    REDIS_DB = 1

    # 使用本机的email smtp
    MAIL_DEBUG = DEBUG
    MAIL_SERVER = 'smtp.ym.163.com'
    MAIL_PORT = 25
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'test@jcing.cn'
    MAIL_PASSWORD = '7ShSj26LuN'
    DEFAULT_MAIL_SENDER = 'admin@cn486.com'

    """
    Never change it here, use local_settings for this.
    """
   # url 映射
    URL_MAP = {
        'static': 'http://res.jcing.org/',
        'assets': 'http://assets.jcing.org/',
        'image': 'http://img.jcing.org/',
        'css': 'http://css.jcing.org/',
        'js': 'http://js.jcing.org/'
    }


class TestingConfig(BaseConfig):
    MONGODB_SETTINGS = {'DB': "cn486_test_v1"}  # use in localhost
    MODE = 'testing'

    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379
    REDIS_DB = 1

    TESTING = True
    CSRF_ENABLED = False

    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


