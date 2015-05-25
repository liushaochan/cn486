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

from infopub.forms.user import UserForm

from flask import Blueprint, abort
from jinja2 import TemplateNotFound
from flask import Flask, render_template, current_app
from flask.ext.mail import Mail
from flask.ext.security import login_required, roles_required, roles_accepted
from flask.ext.security.decorators import http_auth_required, \
     auth_token_required, auth_required
from flask.ext.security.utils import encrypt_password
from runkit.web.views.render import render_html
from werkzeug.local import LocalProxy

__doc__ = '网站账户view'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2013-02-14 23:33'


module = Blueprint('account', __name__, url_prefix='/account', template_folder='templates')
ds = LocalProxy(lambda: current_app.extensions['security'].datastore)


@module.route('/')
def index():
    return 'account index.html'


# @module.route('/<page>')
# def show(page):
#     try:
#         return render_html('%s.html' % page)
#     except TemplateNotFound:
#         abort(404)
#
#

@module.route('/admin_login')
def admin_login():
    return render_template('account/admin_login.html', content='Admin Page')


@module.route('/member_login')
def member_login():
    return render_template('account/member_login.html', content='Admin Page')


@module.route('/admin')
@roles_required('admin')
def admin():
    return render_template('account/admin.html', content='Admin Page')


@module.route('/admin_and_editor')
@roles_required('admin', 'editor')
def admin_and_editor():
    return render_template('account/admin_and_editor.html', content='Admin and Editor Page')


@module.route('/admin_or_editor')
@roles_accepted('admin', 'editor')
def admin_or_editor():
    return render_template('account/admin_or_editor.html', content='Admin or Editor Page')


@module.route('/add_role_to_user')
def add_role_to_user():
    create_roles()

    u = ds.find_user(email='wqq@wqq.com')
    r = ds.find_role('admin')
    ds.add_role_to_user(u, r)
    ds.commit()

    return 'success'


@module.route('/remove_role_from_user')
def remove_role_from_user():
    u = ds.find_user(email='matt@lp.com')
    ds.remove_role_from_user(u, 'admin')
    return 'success'


@module.route('/deactivate_user')
def deactivate_user():
    u = ds.find_user(email='matt@lp.com')
    ds.deactivate_user(u)
    return 'success'


@module.route('/activate_user')
def activate_user():
    u = ds.find_user(email='tiya@lp.com')
    ds.activate_user(u)
    return 'success'


@module.route('/invalid_role')
def invalid_role():
    return 'success' if ds.find_role('bogus') is None else 'failure'


def create_roles():
    for role in ('admin', 'editor', 'author'):
        ds.create_role(name=role)
    ds.commit()


def create_users(count=None):
    users = [('matt@lp.com', 'matt', 'password', ['admin'], True),
             ('joe@lp.com', 'joe', 'password', ['editor'], True),
             ('dave@lp.com', 'dave', 'password', ['admin', 'editor'], True),
             ('jill@lp.com', 'jill', 'password', ['author'], True),
             ('tiya@lp.com', 'tiya', 'password', [], False)]
    count = count or len(users)

    for u in users[:count]:
        pw = encrypt_password(u[2])
        roles = [ds.find_or_create_role(rn) for rn in u[3]]
        ds.commit()
        user = ds.create_user(email=u[0], username=u[1], password=pw, active=u[4])
        ds.commit()
        for role in roles:
            ds.add_role_to_user(user, role)
        ds.commit()


def populate_data(user_count=None):
    create_roles()
    create_users(user_count)


