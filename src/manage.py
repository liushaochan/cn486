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

import sys
import subprocess
from flask import current_app

from flask.ext.script import Manager, Server, Shell, prompt_bool, prompt, prompt_pass, prompt_choices
from flask.ext.migrate import MigrateCommand
from flask.ext.security.utils import encrypt_password
from infopub.models.user import User
from flask.ext.script.commands import Clean
from infopub.webapp import create_app
from runkit.web.flask_ext.sql import db
from runkit.web.utils.generate_keys import generate_randomkey, generate_keyfile
from werkzeug.local import LocalProxy


__doc__ = 'infopub site manage'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-02-11 16:04'


app = create_app()
ds = LocalProxy(lambda: current_app.extensions['security'].datastore)

manager = Manager(app)
TEST_CMD = "nosetests"


def _make_context():
    """
    返回shell会话环境用到的变量
    :return: dict
    """

    return {'app': app, 'db': db, 'User': User}


@manager.command
def test():
    status = subprocess.call(TEST_CMD, shell=True)
    sys.exit(status)


@manager.command
def check():
    """
    check system information
    """
    from pprint import pprint
    print("Extensions: ")
    pprint(app.extensions)
    print("Modules: ")
    pprint(app.blueprints)
    print("App: ")
    pprint(app)

    # 检查需要的包、第三方库等


@manager.command
def show_config():
    """
    print system config
    """
    from pprint import pprint
    print("Config:")
    pprint(dict(app.config))


@manager.command
def initialize():
    """
    initialize system(data)
    """
    if prompt_bool(u"Warning: the initialization system will drop all data! Are you sure?"):
        db.drop_all()
        db.create_all()

        ds.create_role(name='restricter', description='受限的')
        ds.create_role(name='member', description='普通会员')
        ds.create_role(name='enthusiast', description='热心会员')
        ds.create_role(name='mainstay', description='支柱会员')
        ds.create_role(name='senior', description='资深会员')
        ds.create_role(name='partner', description='合作伙伴')
        ds.create_role(name='editor', description='编辑')
        ds.create_role(name='moderator', description='版主、仲裁者')
        ds.create_role(name='supervisor', description='管理员')
        ds.create_role(name='administrator', description='高级管理员')

        ds.commit()

    # 导入一些网站数据
    # 添加一个系统管理员账户
    print "init system finish"


@manager.command
def dropall():
    """
    drop all table
    """
    if prompt_bool(u"Warning: will drop all data! Are you sure?"):
        db.drop_all()


@manager.command
def createadmin():
    """
    create admin user
    """
    role = ds.find_role('administrator')

    pw = encrypt_password('admin888')
    user = ds.create_user(email='admin@cn486.com', username='admin', password=pw, active=True)
    ds.commit()

    ds.add_role_to_user(user, role)
    ds.commit()



@manager.option('-u', '--username', dest="username", required=False)
@manager.option('-p', '--password', dest="password", required=False)
@manager.option('-e', '--email', dest="email", required=False)
@manager.option('-r', '--role', dest="role", required=False)
def createuser(username=None, password=None, email=None, role=None):
    """
    Create a new user
    """

    if username is None:
        while True:
            username = prompt("Username")
            user = User.query.filter(User.username == username).first()
            if user is not None:
                print "Username %s is already taken" % username
            else:
                break

    if email is None:
        while True:
            email = prompt("Email address")
            user = User.query.filter(User.email == email).first()
            if user is not None:
                print "Email %s is already taken" % email
            else:
                break

    if password is None:
        password = prompt_pass("Password")

        while True:
            password_again = prompt_pass("Password again")
            if password != password_again:
                print "Passwords do not match"
            else:
                break

    roles = (
        (3, "member"),
        (2, "moderator"),
        (1, "admin"),
    )

    if role is None:
        role = prompt_choices("Role", roles, resolve=int, default=User.MEMBER)

    user = User(username=username,
                email=email,
                password=password,
                role=role)

    db.session.add(user)
    db.session.commit()

    print "User created with ID", user.id

@manager.command
def gen_keys():
    r = 24
    csrf_key = generate_randomkey(r)
    session_key = generate_randomkey(r)
    generate_keyfile(csrf_key, session_key, './src/infopub/configs/secret_keys.py')


manager.add_command("server", Server(host='0.0.0.0', port=8080))
manager.add_command("clean", Clean())
manager.add_command("shell", Shell(make_context=_make_context))
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
