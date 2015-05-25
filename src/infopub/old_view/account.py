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
from flask.globals import g
from infopub.bases.localtime import timestamp
from infopub.configs.permissions import moderator
from infopub.models.user_fake_account import UserFakeAccountService

__doc__ = "账户的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

# parse_qsl moved to urlparse module in v2.6
#try:
#    from urlparse import parse_qsl
#except:
#    from cgi import parse_qsl

from flask import   request, flash, current_app, redirect, url_for, session
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from flask.ext.principal import identity_changed, Identity, AnonymousIdentity
from flask import Blueprint
from flask_mail import Message
from werkzeug.exceptions import abort
from infopub.bases.html_utility import html2text
from infopub.forms.account import LoginForm, SignupForm, RecoverPasswordForm, BatchFakeAcountForm, BatchFakeAcountAttachedForm
from infopub.helpers.extensions import mail, app
from infopub.models.user import UserStatus, User, UserService, UserRole
from infopub.bases.flask_ext import get_remote_ip
from infopub.models.system_config import SystemConfigService

account = Blueprint('account', __name__)


@account.route("/login/", methods=("GET", "POST"))
def login():
    """
    用户登录
    """
    # print request.user_agent

    form = LoginForm(login=request.args.get('login', None),
        next=request.args.get('next', None))

    if 'need_verify' not in session:
        session['need_verify'] = 0

    if form.validate_on_submit():
        account_name = form.login.data.strip()
        password = form.password.data.strip()
        id, username, nickname, email, authenticated, user_status = UserService.authenticate(account_name,
            password)

        if authenticated:
            if user_status == UserStatus.normal:
                session.permanent = form.remember.data

                identity_changed.send(current_app._get_current_object(), identity=Identity(id))

                flash(_("Welcome back, %(name)s", name=nickname), "success")

                # 判断有些错误，暂时先转用户页
                #                next_url = form.next.data
                #                if not next_url or next_url == request.path \
                #                   or next_url == url_for('account.active_prompt', username=username, email=email)\
                #                   or next_url == url_for('account.banned_prompt', username=username):
                next_url = url_for('people.index', username=username)

                session['need_verify'] = 0

                return redirect(next_url)

            elif user_status == UserStatus.inactive:
                # 跳转到激活提示页面
                config_value = int(SystemConfigService.get_by_key('register_validation'))
                next_url = url_for('account.active_prompt', username=username, email=email, active_type=config_value)
                return redirect(next_url)

            elif user_status == UserStatus.banned:
                # 跳转到禁止页面
                next_url = url_for('account.banned_prompt', username=username)
                return redirect(next_url)

        else:
            session['need_verify'] = 1
            flash(_("Sorry, invalid login"), "error")

    return render_template("account/login.html", form=form)


def send_activation_key(username, email, activation_key):
    mail_text = render_template("account/send_active_mail.html", username=username, email=email,
        activation_key=activation_key)

    msg = Message(
        subject=_(u"%(name)s account activated", name=app.config['SITE_NAME']),
        body=html2text(mail_text),
        html=mail_text,
        sender=app.config['DEFAULT_MAIL_SENDER'],
        recipients=[email])

    # 需要记录错误日志
    mail.send(msg)


def send_new_pwd(username, email, new_pwd):
    mail_text = render_template("account/send_new_pwd.html", username=username, email=email,
        new_pwd=new_pwd)

    msg = Message(
        subject=_(u"%(name)s account activated", name=app.config['SITE_NAME']),
        body=html2text(mail_text),
        html=mail_text,
        sender=app.config['DEFAULT_MAIL_SENDER'],
        recipients=[email])

    # 需要记录错误日志
    mail.send(msg)


@account.route("/signup/", methods=("GET", "POST"))
def signup():
    form = SignupForm(next=request.args.get('next', None))

    if form.validate_on_submit():
        # 获取指定的表单数据
        user = User()
        form.populate_obj(user)

        user.joined_ip = get_remote_ip()
        user.homepage = ''#url_for('people.index', username=user.username)

        # 保存数据
        id = UserService.signup(user)

        if not id:
            flash(_("Internal error"), "failed")
            return render_template("account/signup.html", form=form)

        #        identity_changed.send(current_app._get_current_object(),
        #            identity=Identity(id))
        #
        #        flash(_("Welcome, %(name)s", name=user['nickname']), "success")
        #
        #        next_url = form.next.data
        #
        #        if not next_url or next_url == request.path:
        #            next_url = url_for('people.index', username=user['username'])

        config_value = int(SystemConfigService.get_by_key('register_validation'))

        if user.user_status == UserStatus.inactive:
            if config_value==1:
                # 发送激活邮件
                send_activation_key(user.username, user.email, user.activation_key)
            else:
                # 转人工审核提示页面
                pass

            # 跳转到激活页面
            next_url = url_for('account.active_prompt', username=user.username, email=user.email, active_type=config_value)
        else:
            identity_changed.send(current_app._get_current_object(), identity=Identity(id))
            next_url = url_for('people.index', username=user.username)

        return redirect(next_url)
        # form.code.errors.append(_("Code is not allowed"))
    elif form.errors:
        for error_name, error_value in form.errors.iteritems():
            print "error: %s %s" % (error_name, error_value)
        flash(_("Cause an error"), "failed")

    return render_template("account/signup.html", form=form)


@account.route('/rest_passwd/', methods=("GET", "POST"))
def rest_passwd():
    """
    通过email取回密码
    """

    if request.method == 'GET':
        form = RecoverPasswordForm(next=request.args.get('next', None))
    else:
        form = RecoverPasswordForm(next=request.args.get('next', None))

        if form.validate_on_submit():
            # 获取指定的表单数据
            email = request.form.get('email', None)

            username, new_pwd = UserService.rest_pwd_by_email(email)
            if username and new_pwd:
                send_new_pwd(username, email, new_pwd)
                return render_template("account/rest_passwd_success.html", email=email, username=username, form=form)
            else:
                print "error: %s %s" % (username, new_pwd)
                flash(_("Cause an error"), "failed")

        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    return render_template("account/rest_passwd.html", form=form)


@account.route("/logout/")
#@member.require(401)
def logout():
    flash(_("You are now logged out"), "success")
    # Remove session keys set by Flask-Principal
    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)

    identity_changed.send(current_app._get_current_object(),
        identity=AnonymousIdentity())

    #next_url = request.args.get('next', '')

    #if not next_url or next_url == request.path:
    next_url = url_for("portal.index")

    return redirect(next_url)


@account.route('/<username>/<email>/<activation_key>/actived/')
def actived(username, email, activation_key):
    print username, email, activation_key
    # todo 防止重复激活
    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    if user.user_status != UserStatus.inactive:
        abort(404)

    if user.email == email and user.activation_key == activation_key:
        UserService.active(user.id)

    # 跳转到登录页面
    flash(_("Welcome, %(name)s", name=username), "success")

    next_url = url_for('account.login')

    return redirect(next_url)


@account.route('/<username>/active_again/')
def active_again(username):
    # todo 防止重复激活
    user = UserService.get_by_username(username)

    # 发送激活邮件
    send_activation_key(username, user['email'], user['activation_key'])

    # 跳转到激活页面
    flash(_(u"已经再次发送激活邮件"), "success")
    next_url = url_for('account.active_prompt', username=username, email=user.email)

    return redirect(next_url)


@account.route('/<username>/<email>/active/<int:active_type>')
def active_prompt(username, email, active_type=1):
    # todo 防止重复激活
    return render_template("account/active_prompt.html", email=email, username=username, active_type=active_type)


@account.route('/<username>/banned_prompt/')
def banned_prompt(username):
    return render_template("account/banned_prompt.html", username=username)

@account.route("/change_account/<int:id>/", methods=("GET", "POST"))
@moderator.require(401)
def change_account(id):
    user = UserService.get_by_id(id)
    if not user:
        abort(404)

    identity_changed.send(current_app._get_current_object(), identity=Identity(id))

    flash(_("Welcome back, %(name)s", name=user.nickname), "success")

    # 判断有些错误，暂时先转用户页
    next_url = request.args.get('next', '').strip()
    if not next_url:
    # or next_url == request.path \
    #                   or next_url == url_for('account.active_prompt', username=username, email=email)\
    #                   or next_url == url_for('account.banned_prompt', username=username):
        next_url = url_for('people.index', username=user.username)

    session['need_verify'] = 0

    return redirect(next_url)


@account.route("/batch_fake_account/", methods=("GET", "POST"))
@moderator.require(401)
def batch_fake_account():
    """
    批量注册假账号
    邮箱
    @return:
    """
    if request.method == 'GET':
        form = BatchFakeAcountForm(next=request.args.get('next', None))
    else:
        form = BatchFakeAcountForm(next=request.args.get('next', None))

        if form.validate_on_submit():
            # 获取指定的表单数据
            email_list = request.form.get('email_list', None)

            _list = email_list.replace(' ','').split('\r\n')
            for email in _list:
                try:
                    username = email.split('@')[0]

                    user = UserService.get_by_username(username)
                    if user:
                        username = username + '_' + timestamp()

                    user = UserService.get_by_nickname(username)
                    if user:
                        username = username + '_' + timestamp()

                    user = UserService.get_by_email(email)
                    if user:
                        continue

                    user = User()
                    user.email = email
                    user.username = username
                    user.nickname = user.username
                    user.role = UserRole.moderator
                    user.password = 'fc868_%d' % len(user.username)
                    user.joined_ip = get_remote_ip()
                    user.homepage = ''

                    # 保存数据
                    id = UserService.signup(user)
                except Exception, e:
                    raise e

            return render_template("account/batch_fake_account_finsh.html", form=form)

        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    return render_template("account/batch_fake_account.html", form=form)

@account.route("/batch_fake_account_attached/", methods=("GET", "POST"))
@moderator.require(401)
def batch_fake_account_attached():
    """
    批量附加假账号
    邮箱
    @return:
    """
    if request.method == 'GET':
        form = BatchFakeAcountAttachedForm(next=request.args.get('next', None))
    else:
        form = BatchFakeAcountAttachedForm(next=request.args.get('next', None))

        if form.validate_on_submit():
            # 获取指定的表单数据
            email_list = request.form.get('email_list', None)

            _list = email_list.replace(' ','').split('\r\n')

            for email in _list:
                if not len(email):
                    continue

                try:
                    user = UserService.get_by_email(email)
                    if not user:
                        continue

                    if user.id == g.user.id:
                        continue

                    if not UserFakeAccountService.check_exist(g.user.id, user.id):
                        UserFakeAccountService.add(g.user.id, user.id, user.nickname, email)

                except Exception, e:
                    raise e

            return render_template("account/batch_fake_account_attached_finsh.html", form=form)

        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    return render_template("account/batch_fake_account_attached.html", form=form)
