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


__doc__ = "账户的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

from werkzeug.contrib.atom import AtomFeed
from flask import  request
from flask import Blueprint
from infopub.helpers.extensions import app
from flask.helpers import url_for
from werkzeug.exceptions import abort
from infopub.models.content.entry import EntryService, EntryType
from infopub.models.tag import TagService

feed = Blueprint('feed', __name__)

class PostsFeed(AtomFeed):
    def add_posts(self, posts):
        self.add(posts.title,
            unicode(posts.content),
            posts_type="html",
            author=posts.author.username,
            url=app.config['SITE_URL']+url_for('portal.entry', slug=posts.slug),
            updated=posts.updated_time,
            published=posts.created_time)


def feed_with_type(entry_type, title):
    feed = PostsFeed(u"%s - %s" % (app.config['SITE_NAME'], title),
        feed_url=request.url,
        url=request.url_root)

    if entry_type:
        entries_list = EntryService.get_latest_entries_by_type(entry_type, 1, 20)
    else:
        entries_list = EntryService.get_latest_entries(1, 20)

    for entry in entries_list:
        feed.add_posts(entry)

    return feed.get_response()


@feed.route("/")
def index():
    return feed_with_type(None, u'最新内容')

@feed.route("/tag/<slug>/")
#@cached()
def tag(slug):
    tag = TagService.get_by_slug(slug)

    if not tag:
        abort(404)

    feed = PostsFeed(u"%s - %s" % (app.config['SITE_NAME'], tag.tag_name),
        feed_url=request.url,
        url=request.url_root)

    _total, _pages, _list = EntryService.get_entry_list_by_tag_id(tag.id)

    for post in _list:
        feed.add_posts(post)

    return feed.get_response()


@feed.route("/news")
def news():
    return feed_with_type(EntryType.news, u'最新新闻')

@feed.route("/article")
def article():
    return feed_with_type(EntryType.article, u'最新文章')

@feed.route("/forum")
def forum():
    return feed_with_type(EntryType.forum, u'最新讨论')

@feed.route("/question")
def question():
    return feed_with_type(EntryType.question, u'最新问答')
