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

from flask.globals import current_app, request, g
from flask.helpers import url_for, send_from_directory, flash, make_response
from flask.templating import render_template
from werkzeug.exceptions import abort
from werkzeug.utils import redirect
from flask.ext.babelex import gettext as _
from infopub.bases.flask_ext import query_condition
from infopub.bases.localtime import sys_now
from infopub.bases.model_base import PER_PAGE
from infopub.forms.misc import TemplateForm
from infopub.helpers.extensions import app, cache
from infopub.models.category import Category, CategoryService
from infopub.models.content.entry import Entry, EntryService, EntryStatus
from infopub.models.tag import TagService
from infopub.views.category import rander_category
from infopub.views.entry import render_show


__doc__ = "账户的管理"
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = "2011-07-27 17:00"

#posts 文章
#news 快讯
#forums 论坛

from flask import Blueprint

portal = Blueprint('portal', __name__)

@portal.route("/")
@portal.route("/index.htm")
@portal.route("/index.html")
#@cache.cached(timeout=10)
def index():
    """
    门户首页
    :return: 渲染后的html数据
    """

    # Googlebot
    # Baiduspider
    # Sosospider
    # Sogou web spider
    user_Agent = request.headers['User-Agent']
    ''.find('MSIE')
    print user_Agent
    # 'accept_charsets',
    # 'accept_encodings',
    # 'accept_languages',
    # 'accept_mimetypes',
    # 'access_route',
    # 'application',
    # 'args',
    # 'authorization',
    # 'base_url',
    # 'blueprint',
    # 'cache_control',
    # 'charset',
    # 'content_length',
    # 'content_type',
    # 'cookies',
    # 'data',
    # 'date',
    # 'dict_storage_class',
    # 'encoding_errors',
    # 'endpoint',
    # 'environ',
    # 'files',
    # 'form',
    # 'form_data_parser_class',
    # 'from_values',
    # 'headers',
    # 'host',
    # 'host_url',
    # 'if_match',
    # 'if_modified_since',
    # 'if_none_match',
    # 'if_range',
    # 'if_unmodified_since',
    # 'input_stream',
    # 'is_multiprocess',
    # 'is_multithread',
    # 'is_run_once',
    # 'is_secure', 'is_xhr', 'json', 'list_storage_class', 'make_form_data_parser', 'max_content_length', 'max_form_memory_size', 'max_forwards', 'method', 'mimetype', 'mimetype_params', 'module', 'on_json_loading_failed', 'parameter_storage_class', 'path', 'pragma', 'query_string', 'range', 'referrer', 'remote_addr', 'remote_user', 'routing_exception', 'scheme', 'script_root', 'shallow', 'stream', 'url', 'url_charset', 'url_root', 'url_rule', 'user_agent', 'values', 'view_args', 'want_form_data_parsed']

    query, sort, order, page = query_condition()

    return render_template("portal/home.html",
        current_page=page,
    )


@portal.route('/<path:slug>.html')
#@cache.cached(timeout=10)
def entry(slug):
    """
    文章显示
    @param slug:
    @return:
    """

    slug = '/%s' % slug
    entry = Entry.query.filter_by(slug=slug).first()

    if entry is None:
        abort(404)

    # todo g.user.is_supervisor
    if entry.entry_status != EntryStatus.published:
        if g.user and not g.user.is_supervisor:
            return render_template('common/entry_pending.html')

    if entry.category.show_role:
        if not g.user or entry.category.show_role > g.user.role:
            abort(404)

    query, sort, order, page = query_condition()



    return render_show(entry, sort, order, page)


@portal.route("/search/")
@portal.route("/search/page/<int:page>/")
def search(page=1):
    # todo
    keywords = request.args.get('q', '').strip()

    if not keywords:
        return redirect(url_for("portal.index"))

    page_obj = Posts.query.search(keywords).as_list().paginate(page, per_page=PER_PAGE)

    if page_obj.total == 1:
        posts = page_obj.items[0]
        return redirect(posts.url)

    page_url = lambda page: url_for('portal.search',
        page=page,
        keywords=keywords)

    return render_template("posts/search_result.html",
        page_obj=page_obj,
        page_url=page_url,
        keywords=keywords)


################

@portal.route("/archive/")
def archive():
    # todo
    return render_template("posts/archive.html")


@portal.route("/site_manage/")
# 管理员入口，避免/site_admin/被暴露
def admin():
    return redirect('/site_admin/')


@portal.route("/tagged/<slug>/", methods=("GET", "POST"))
@portal.route("/tagged/<slug>/page/<int:page>/", methods=("GET", "POST"))
@cache.cached(timeout=10)
def tagged(slug, page=1):
    # todo
    tag = TagService.get_by_slug(slug)
    if not tag:
        abort(404)

    query, sort, order, page = query_condition()

    entries_total, page_total, entries_list = EntryService.get_page_by_tag(tag, query, sort, order, page)

    return render_template("common/tag_entries_list.html",
        entries_list=entries_list,

        current_tag = tag,

        record_total=entries_total,
        page_total=page_total,
        current_page=page,
    )

@portal.route("/template/<path:path>.html", methods=("GET", "POST"))
#@supervisor.require(401)
def template_edit(path):
    # http://127.0.0.1:5000/template/layout.html
    print path
    path = os.path.join(current_app.root_path, 'templates', "%s.html" % path)
    print path
    html = ""

    try:
        f = open(path)
        html = f.read()
        f.close()
    except Exception as ex:
        flash(_("Template file does not exists"), "error")

    print html

    form = TemplateForm(html=html.decode('utf8'))

    if form.validate_on_submit():
        f = open(path, 'w')
        f.write(form.html.data.encode('utf8'))
        f.close()

        flash(_("Saving success"), "success")

        return redirect(url_for("portal.index"))

    return render_template("misc/template_edit.html",
        form=form,
        path=path)


@portal.route('/<path:category>/tag/<tag>')
@cache.cached(timeout=10)
def tag(category, tag):
    #tagged/android+activity+-android-asynctask
    slug = '/%s' % category
    category = Category.query.filter_by(slug=slug).first()

    if category is None:
        abort(404)

    tag = TagService.get_by_slug(tag)

    query, sort, order, page = query_condition()

    if sort == 'id':
        sort = 'updated_time'

    return rander_category(category, tag, query, sort, order, page)


@portal.route('/entrytype/<int:type>')
@cache.cached(timeout=10)
def entrytype(type):
    #用于显示所有文章类型的内容
    if type is None:
        abort(404)

    if type >= 17:
        abort(404)

    template_list = ['article_list.html', 'news_list.html', 'code_list.html', 'software_list.html', 'forum_list.html',
                 'question_list.html', 'tips_list.html', 'gallery_list.html', 'video_list.html', 'audio_list.html',
                 'link_list.html', 'quote_list.html', 'status_list.html', 'document_list.html', 'chat_list.html',
                 'aside_list.html', 'special_list.html', 'list.html']

    query, sort, order, page = query_condition()

    if sort == 'id':
        sort = 'updated_time'
    entries_total, page_total, entries_list = EntryService.get_page_by_entryType(sort, order, page, type)


    return render_template("entrytype/%s" % template_list[type],
        type=type,
        record_total=entries_total,
        page_total=page_total,
        current_page=page,
        entries_list=entries_list)


@portal.route('/<path:category>/<path:entry_type>/')
@cache.cached(timeout=10)
def category(category, entry_type):
    """
    分类/栏目入口
    @param category:
    @return:
    """

    slug = '/%s' % category
    category = Category.query.filter_by(slug=slug).first()

    if category is None:
        abort(404)

    query, sort, order, page = query_condition()

    if sort == 'id':
        sort = 'updated_time'

    return rander_category(category, None, query, sort, order, page, entry_type)

############### OK ###############
@portal.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(current_app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon')

@portal.route('/sitemap.xml')
@cache.cached(timeout=600)
def sitemap():
    sitemap = render_template(
        'misc/sitemap.xml',
        root_url=app.config['SITE_URL'],

        # todo
        # 分类
        # 标签
        # 文章
        posts=EntryService.get_all_entries(),
        tags=TagService.get_all_tags(),
        categories=CategoryService.get_all_categories(),
        now=sys_now(),
        min=min,
    )

    response = make_response(sitemap)
    response.headers['Content-Type'] = 'application/xml; charset=UTF-8'
    return response

