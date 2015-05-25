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
from infopub.bases.flask_ext import query_condition
from infopub.bases.model_base import PER_PAGE
from infopub.bases.validators import int_value_verify
from infopub.configs.permissions import member
from infopub.forms.account import PeopleEditForm, ChangePasswordForm
from infopub.models.comment import CommentService
from infopub.models.content.entry import EntryService, EntryType, entry_type_str
from infopub.models.favorites import FavoritesService
from infopub.models.message import MessageService
from infopub.models.notice import NoticeService
from infopub.models.user import UserService
from infopub.views.entry import check_entry_type


__doc__ = "账户的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

from flask.globals import  request
from flask.helpers import url_for, flash
from flask.templating import render_template
from werkzeug.exceptions import abort
from werkzeug.utils import redirect
from flask.ext.babelex import gettext as _

from flask import Blueprint

URL_BASE = 'people'
people = Blueprint(URL_BASE, __name__)

def render_entry(username, page, entry_type=None):
    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)

    data = get_people_entries(user.id, page, entry_type)

    if entry_type is not None:
        current_entry_type = entry_type_str[entry_type]
    else:
        current_entry_type = 'latest'

    return render_template("people/%s.html" % 'latest',
        current_entry_type=current_entry_type,
        entries_list=data['entries_list'],
        record_total=data['record_total'],
        page_total=data['page_total'],
        current_page=page,
        page_url = '/%s/%s/%s/index' % (URL_BASE, username, current_entry_type),
        statistic=statistic,
        notices=NoticeService.get_list_for_show(),
        people=user)


@people.route("/<username>/", methods=("GET", "POST"))
def index(username):
    query, sort, order, page = query_condition()

    return render_entry(username, page)


@people.route("/<username>/article/", methods=("GET", "POST"))
def article(username):
    query, sort, order, page = query_condition()

    return render_entry(username, page, EntryType.article)


@people.route("/<username>/news/", methods=("GET", "POST"))
def news(username):
    query, sort, order, page = query_condition()

    return render_entry(username, page, EntryType.news)


@people.route("/<username>/forum/", methods=("GET", "POST"))
def forum(username):
    query, sort, order, page = query_condition()

    return render_entry(username, page, EntryType.forum)


@people.route("/<username>/question/", methods=("GET", "POST"))
def question(username):
    query, sort, order, page = query_condition()

    return render_entry(username, page, EntryType.question)


@people.route("/<username>/message/", methods=("GET", "POST"))
def message(username):
    """
    显示个人消息
    """
    query, sort, order, page = query_condition()

    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)

    record_total, page_total, messages_list = MessageService().getlist_by_receiver_id(user.id, page, sort, order)

    current_entry_type = 'message'

    return render_template("people/%s.html" % current_entry_type,
        current_entry_type=current_entry_type,
        messages_list=messages_list,
        record_total=record_total,
        page_total=page_total,
        current_page=page,
        page_url = '/%s/%s/%s/index' % (URL_BASE, username, current_entry_type),
        statistic=statistic,
        notices=NoticeService.get_list_for_show(),
        people=user)


@people.route("/<username>/comment/", methods=("GET", "POST"))
def comment(username):
    query, sort, order, page = query_condition()

    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)

    record_total, page_total, comments_list = CommentService.getlist_by_author_id(user.id, page, sort, order)

#    for comment in comments_list:
#        entry = EntryService.get_by_id(comment.entry_id)
#        comment.entry_title = entry.title
#        # http://127.0.0.1:5000/article/5.html#comment-90
#        comment.entry_url = url_for('portal.entry', slug=entry.slug)+ "#comment-%d" % comment.id

    current_entry_type = 'comment'

    return render_template("people/%s.html" % current_entry_type,
        current_entry_type=current_entry_type,
        comments_list=comments_list,
        record_total=record_total,
        page_total=page_total,
        current_page=page,
        page_url = '/%s/%s/%s/index' % (URL_BASE, username, current_entry_type),
        statistic=statistic,
        notices=NoticeService.get_list_for_show(),
        people=user)


@people.route('/<username>/edit/', methods=("GET", "POST"))
@member.require(401)
def edit(username):
    """
    编辑 users
    """
    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    if request.method == 'GET':
        form = PeopleEditForm(next=request.args.get('next', None), id=id, obj=user)
    else:
        form = PeopleEditForm(next=request.args.get('next', None), id=id)
        if form.validate_on_submit():
            # 获取指定的表单数据
            form.populate_obj(user)

            # 保存数据
            UserService.update(user)

            flash(_("Modify success"), "success")

            next_url = form.next.data

            if not next_url or next_url == request.path:
                next_url = url_for('people.show', username=username)

            return redirect(next_url)
        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    statistic = EntryService.get_statistic_by_author_id(user.id)
    return render_template("people/edit.html", form=form, people=user, statistic=statistic, form_id=user.id)


@people.route('/<username>/show/')
@member.require(403)
def show(username):
    """
    显示 users
    """

    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)
    return render_template("people/show.html", people=user, statistic=statistic, user=user)


@people.route('/<username>/change_passwd/', methods=("GET", "POST"))
@member.require(401)
def change_passwd(username):
    """
    改变密码
    """
    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)

    if request.method == 'GET':
        form = ChangePasswordForm(next=request.args.get('next', None), id=user.id, obj=user)
    else:
        form = ChangePasswordForm(next=request.args.get('next', None), id=user.id)
        if form.validate_on_submit():
            # 获取指定的表单数据
            form.populate_obj(user)

            # 保存数据
            result = UserService.update_pwd_by_id(user.id, user.password)

            if result:
                flash(_("Modify success"), "success")
            else:
                flash(_("This old password is error"), "failed")
                return render_template("people/change_passwd.html", people=user, statistic=statistic, form=form,
                    form_id=user.id)

            return render_template("people/change_passwd_success.html", people=user, statistic=statistic, form=form,
                form_id=user.id)

        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    return render_template("people/change_passwd.html", people=user, statistic=statistic, form=form,
        form_id=user.id)


def render_favorites_entry(username, page, entry_type=None):
    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)

    data = get_people_favorites(user.id, entry_type)

    if entry_type is not None:
        current_entry_type = entry_type_str[entry_type]
    else:
        current_entry_type = 'latest'

    return render_template("favorites/latest.html",
        current_entry_type=current_entry_type,
        favorites_list=data['favorites_list'],
        record_total=data['record_total'],
        page_total=data['page_total'],
        current_page=page,
        page_url = '/%s/%s/%s/index' % (URL_BASE, username, current_entry_type),
        statistic=statistic,
        notices=NoticeService.get_list_for_show(),
        people=user)

@people.route("/<username>/favorites/", methods=("GET", "POST"))
def favorites_index(username):
    query, sort, order, page = query_condition()

    return render_favorites_entry(username, page)


@people.route("/<username>/favorites/article/", methods=("GET", "POST"))
def favorites_article(username):
    query, sort, order, page = query_condition()

    return render_favorites_entry(username, page, EntryType.article)


@people.route("/<username>/favorites/news/", methods=("GET", "POST"))
def favorites_news(username):
    query, sort, order, page = query_condition()

    return render_favorites_entry(username, page, EntryType.news)


@people.route("/<username>/favorites/forums/", methods=("GET", "POST"))
def favorites_forum(username):
    query, sort, order, page = query_condition()

    return render_favorites_entry(username, page, EntryType.forum)


@people.route("/<username>/favorites/question/", methods=("GET", "POST"))
def favorites_question(username):
    query, sort, order, page = query_condition()

    return render_favorites_entry(username, page, EntryType.question)


@people.route("/<username>/favorites/comment/", methods=("GET", "POST"))
def favorites_comment(username):
    query, sort, order, page = query_condition()

    user = UserService.get_by_username(username)

    if not user:
        abort(404)

    statistic = EntryService.get_statistic_by_author_id(user.id)

    _total, _pages, _list = CommentService.getlist_by_author_id(user.id, page)

    current_entry_type = 'comment'

    return render_template("favorites/%s.html" % current_entry_type,
        current_entry_type=current_entry_type,
        comments_list=_list,
        record_total=_total,
        page_total=_pages,
        current_page=page,
        page_url = '/%s/%s/%s/index' % (URL_BASE, username, current_entry_type),
        statistic=statistic,
        notices=NoticeService.get_list_for_show(),
        people=user)


def get_people_entries(people_id, page, entry_type):
    """
    渲染内容列表页
    :param people_id:
    :param page:
    :param entry_type:
    :return:
    """

    # 内容类型检查
    if entry_type is not None:
        check_entry_type(entry_type)

    int_value_verify(people_id)

    int_value_verify(page)

    query, sort, order, page = query_condition()

    tag = None
    entries_total, page_total, entries_list = EntryService.get_page_by_user(people_id, tag, entry_type, query, sort, order, page)

    return dict(
        entries_list=entries_list,
        record_total=entries_total,
        page_total=page_total,
    )

def get_people_favorites(people_id, entry_type):
    """
    渲染内容列表页
    :param people_id:
    :param entry_type:
    :return:
    """

    # 内容类型检查
    if entry_type is not None:
        check_entry_type(entry_type)

    int_value_verify(people_id)

    query, sort, order, page = query_condition()

    _total, _pages, _list = FavoritesService.get_favorites(people_id, entry_type, page, PER_PAGE)

    return dict(
        favorites_list=_list,
        record_total=_total,
        page_total=_pages,
    )
