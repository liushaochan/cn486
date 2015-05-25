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

__doc__ = 'entries 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-19 02:25:40.094000'

from math import ceil
import re

from flask import request, flash, jsonify, redirect, url_for
from flask import Blueprint
from flask.templating import render_template
from flask.ext.babelex import gettext as _
from werkzeug.exceptions import abort
from infopub.forms.comment import CommentNewForm
from infopub.forms.post import PostNewForm, PostEditForm
from infopub.bases.validators import int_value_verify
from infopub.configs.permissions import supervisor, member
from infopub.bases.model_base import Order, PER_PAGE
from infopub.models.user import UserService
from infopub.bases.image_utility import auto_save_img
from infopub.bases.localtime import int_now, check_in_rank
from flask.globals import g
from infopub.bases.flask_ext import get_remote_ip
from infopub.helpers.extensions import app, gfw
from infopub.models.category import CategoryService
from infopub.models.comment import CommentBodyType, Comment, CommentService
from infopub.models.content.entry import EntryType, Entry, EntryStatus, EntryService
from infopub.configs.globals import PHOTOS_RELATIVE_PATH


entry = Blueprint('entry', __name__)

@entry.route('/create/', methods=("POST","GET"))
@entry.route('/create', methods=("POST","GET"))
@member.require(401)
def create():
    """
    创建新的文章
    @param category_id:
    @return:
    """
    # int_value_verify(category_id)
    #
    # category = CategoryService.get_by_id(category_id)
    #
    # if not category:
    #     abort(404)
    #
    # if category.show_role:
    #     if not g.user or category.show_role > g.user.role:
    #         abort(404)
    #
    # new_templates = category.create_template
    new_templates = '/create.html'

    form = PostNewForm(next=request.args.get('next', None), entry_type=1)

    if form.validate_on_submit():
        # 获取指定的表单数据
        entry = Entry()
        form.populate_obj(entry)
        category = CategoryService.get_by_id(int(entry.category_id))

        is_draft = False

        if form.draft.data:
            is_draft = True

        if not EntryService.add_or_update(category, entry, is_draft, True):
            flash(_("Internal error"), "failed")
            return render_template(new_templates, form=form, category=category, current_category=category)

        flash(_("Create success"), "success")

        next_url = form.next.data

        # todo wqq: 这里能否不做跳转，送回json数据返回ID号，由前端去做处理
        if not next_url or next_url == request.path:
            next_url = url_for('portal.entry', slug=entry.slug)

        return jsonify(success="true", next_url=next_url)
    elif form.errors:
        for error_name, error_value in form.errors.iteritems():
            print "error: %s %s" % (error_name, error_value)
        flash(_("Cause an error"), "failed")

    return render_template(new_templates, form=form)

@entry.route('/<int:id>/edit', methods=("POST", "GET"))
@member.require(401)
def edit(id):
    int_value_verify(id)

    entry = EntryService.get_by_id(id)
    if not entry:
        abort(404)

    if entry.author.id != g.user.id and not g.user.is_supervisor:
        abort(404)

    if entry.entry_status != EntryStatus.published and not g.user.is_supervisor:
        abort(404)

    if entry.category.show_role:
        if not g.user or entry.category.show_role > g.user.role:
            abort(404)

    category = entry.category

    edit_template = category.edit_template

    if request.method == 'GET':
        form = PostEditForm(next=request.args.get('next', None), id=id, obj=entry)
    else:
        form = PostEditForm(next=request.args.get('next', None), id=id)
        if form.validate_on_submit():
            form.populate_obj(entry)

            is_draft = False

            if form.draft.data:
                is_draft = True

            if not EntryService.add_or_update(category, entry, is_draft, True):
                flash(_("Internal error"), "failed")
                return render_template(edit_template, form=form, form_id=id, category=category, entry_type=entry.entry_type, current_category=category)

            next_url = url_for('portal.entry', slug=entry.slug)

            return redirect(next_url)
        elif form.errors:
            for error_name, error_value in form.errors.iteritems():
                print "error: %s %s" % (error_name, error_value)
            flash(_("Cause an error"), "failed")

    print "====================================================================", category.id
    return render_template(edit_template, form=form, form_id=id, category=category, entry_type=entry.entry_type, current_category=category)

@entry.route('/useful/<int:id>/')
@member.require(401)
def useful(id):
    """
    无用
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.useful(id, user_id),
                   data_id=id)


@entry.route('/useless/<int:id>/')
@member.require(401)
def useless(id):
    """
    有用
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.useless(id, user_id),
                   data_id=id)


@entry.route('/supports/<int:id>/')
@member.require(401)
def supports(id):
    """
    支持
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.supports(id, user_id),
                   data_id=id)


@entry.route('/oppositions/<int:id>/')
@member.require(401)
def oppositions(id):
    """
    反对
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.oppositions(id, user_id),
                   data_id=id)


@entry.route('/on_portal/<int:id>/<int:enable>')
@supervisor.require(403)
def on_portal(id, enable):
    """
    推首页
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.on_portal(id, user_id, enable),
                   data_id=id)


@entry.route('/on_top/<int:id>/<int:enable>')
@supervisor.require(403)
def on_top(id, enable):
    """
    置顶
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.on_top(id, user_id, enable),
                   data_id=id)


@entry.route('/publish/<int:id>/')
@supervisor.require(403)
def publish(id):
    """
    发布
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.publish(id, user_id),
                   data_id=id)


@entry.route('/hide/<int:id>/')
@supervisor.require(403)
def hide(id):
    """
    隐藏
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.hide(id, user_id),
                   data_id=id)


@entry.route('/open/<int:id>/')
@supervisor.require(403)
def open(id):
    """
    显示
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.open(id, user_id),
                   data_id=id)


@entry.route('/close_comment/<int:id>/')
@supervisor.require(403)
def close_comment(id):
    """
    关闭回复、评论
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.close_comment(id, user_id),
                   data_id=id)


@entry.route('/open_comment/<int:id>/')
@supervisor.require(403)
def open_comment(id):
    """
    打开回复、评论
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.open_comment(id, user_id),
                   data_id=id)


@entry.route('/favorites/', methods=("POST",))
@member.require(401)
def favorites():
    """
    收藏 内容
    """

    entry_id = request.values.get('entry_id', None)
    title = request.values.get('title', None)
    tags = request.values.get('tags', None)
    description = request.values.get('description', None)

    if entry_id:
        entry_id = int(entry_id)

    int_value_verify(entry_id)

    user_id = g.user.id

    return jsonify(success=EntryService.favorites(user_id, entry_id, title, tags, description),
        data_id=entry_id)


@entry.route('/scores/<int:id>/<int:scores>')
@member.require(401)
def scores(id, scores):
    """
    评分
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.scores(id, user_id, scores),
        data_id=id)


@entry.route('/difficulty/<int:id>/<int:difficulty>')
@member.require(401)
def difficulty(id, difficulty):
    """
    难易度
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.difficulty(id, user_id, difficulty),
        data_id=id)


@entry.route('/retweet/<int:id>/')
@member.require(401)
def retweet(id):
    """
    转发
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.retweet(id, user_id),
                   data_id=id)


@entry.route('/complain/<int:id>/')
@member.require(401)
def complain(id):
    """
    投诉
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.complain(id, user_id),
                   data_id=id)


def get_comments(entry_id, page=1, sort='updated_time', order=Order.DESC):
    # 取2次：
    #   1、没有子数据的
    #   2、全部的子数据

    comments = CommentService.get_toplist_by_entry_id(entry_id, sort, order, page)
    if not comments:
        return None

    return comments

    entry_id_list = []
    for c in comments:
        entry_id_list.append(c.id)

    sub_comments = CommentService.get_sublist_by_entry_id(entry_id_list)

    def _get_comments(parent, depth, count):

        parent.comments =  []
        parent.depth =  depth
        parent.count =  count

        for comment in sub_comments:
            if comment.parent_id == parent.id:
                parent.comment.append(comment)
                parent.count += 1
                _get_comments(comment, depth + 1, parent.count)

    parents = [c for c in comments if c.parent_id == 0]

    for parent in parents:
        _get_comments(parent, 0, 0)

    return parents


def check_entry_type(entry_type):
    """
    检查内容类型是否有效
    :param entry_type:
    :return:
    """
    if entry_type < EntryType.article or entry_type > EntryType.special:
        abort(404)

def render_show(entry, sort, order, page):
    # 更新阅读次数
    EntryService.inc_num_views(entry.id, 1)

    # entry.num_views += 1
    template_list = ['article_show.html', 'news_show.html', 'code_show.html', 'software_show.html', 'forum_show.html',
                     'question_show.html', 'tips_show.html', 'gallery_show.html', 'video_show.html', 'audio_show.html',
                     'link_show.html', 'quote_show.html', 'status_show.html', 'document_show.html', 'chat_show.html',
                     'aside_show.html', 'special_show.html', 'list.html']
    template = entry.category.show_template + template_list[entry.entry_type]
    print entry.entry_type
    # 评论
    if sort == 'id':
        sort = 'updated_time'

    entry.comments = get_comments(entry.id, page, sort, order)




    # 处理赏析
    regex = r'\[chunk:(\d+)\]'
    chunk_id_list = re.findall(regex, entry.content)

    for chunk_id in chunk_id_list:
        replace_text = ''
        comments_list = CommentService.get_appreciation_by_entry_id(entry.id, chunk_id)

        for comment in comments_list:
            replace_text += u'<span class="name">%s</span> 说: %s' % (comment.nickname, comment.comment)
            if g.user:
                if g.user.is_supervisor:
                    replace_text += '<a class="comment-delete" onclick="$(\'#delete-comment-'+str(comment.id) +'\').toggle(); return false;" href="#"> '+u'删除'+'</a>'
                    replace_text += '<span style="display:none" id="delete-comment-'+str(comment.id) +'"><strong>'+u'确定要删除这个评论吗?'+'</strong>'
                    replace_text +='<a onclick="ajax_post(\'/entry/del_comment/'+str(entry.id)+'/'+str(comment.id)+'/\'); return false;" href="#"> '+u'是'+'</a> / '
                    replace_text +=' <a onclick="$(\'#delete-comment-200\').toggle(); return false;" href="#">'+u'否'+'</a> </span></br>'
            else:
                replace_text += "</br>"
                #print '处理赏析:', chunk_id, replace_text
        replace_text += '<img src="/static/360/img/appreciation.png" class="entry_chunk" id="%s" />' % chunk_id

        entry.content = entry.content.replace('[chunk:%s]' % chunk_id, replace_text)
        print 'OK', '[chunk:%s]' % chunk_id, replace_text

    page_total = int(ceil(entry.num_comments / float(PER_PAGE)))



    # 侧边栏的数据
    #hot_tags      = TagService.get_hot_tags(entry.category)
    #weekly_entry  = EntryService.get_weekly_entries(entry.category)
    #monthly_entry = EntryService.get_monthly_entry(entry.category)
    #related_entry = EntryService.get_related_entry(entry.category)

    return render_template(
        template,
        current_category=entry.category,
        entry=entry,
        comment_form=CommentNewForm(),
        page_url=entry.slug,
        record_total=entry.num_comments,
        sort=sort,
        page_total=page_total,
        current_page=page,
        #hot_tags=hot_tags,
        #weekly_entry=weekly_entry,
        #monthly_entry=monthly_entry,
        #related_entry=related_entry)
    )


@entry.route('/delete/<int:id>/', methods=("GET", "POST"))
@member.require(401)
def delete(id):
    """
    删除 entry
    返回 json
    """
    int_value_verify(id)

    old_entry = EntryService.get_by_id(id)
    if not old_entry:
        return jsonify(success=False,
            redirect_url='/',
            data_id=id)

    # 防止删除别人的帖子
    if old_entry.author_id != g.user.id and not g.user.is_supervisor:
        abort(403)

    next = request.args.get('next', None)

    if next is None:
        next = url_for('portal.category', category=old_entry.category.slug)

    flash(_("The %(name)s has been deleted", name = old_entry.title), "success")

    return jsonify(success=EntryService.delete(old_entry),
        redirect_url=next,
        data_id=id)


@entry.route("/add_quote/<int:entry_id>/<int:parent_id>/", methods=("POST",))
#@member.require(401)
def add_quote(entry_id, parent_id):
    """
    添加 引述
    :param entry_id:
    :param parent_id:
    :return:
    """

    return _add_comment(entry_id, parent_id)


@entry.route("/add_reply/<int:entry_id>/<int:parent_id>/", methods=("POST",))
#@member.require(401)
def add_reply(entry_id, parent_id):
    """
    添加 点评
    :param entry_id:
    :param parent_id:
    :return:
    """
    return _add_comment(entry_id, parent_id, CommentBodyType.reply)


def _add_comment(entry_id, parent_id, comment_type=CommentBodyType.comment, chunk_id=0, is_auto_save_img=True):
    entry = EntryService.get_by_id(entry_id)

    if not entry:
        abort(404)

    form = CommentNewForm()

    url_base = ''

    if form.validate_on_submit():
        # 获取指定的表单数据
        comment = Comment()
        form.populate_obj(comment)

        # 评论没内容
        if not comment.comment:
            abort(404)

        if parent_id:
            parent = CommentService.get_by_id(parent_id)
            if not parent:
                abort(404)

            if comment_type == CommentBodyType.reply:
                if parent.body_type != CommentBodyType.comment:
                    abort(404)
            else:
                comment.comment =  '<blockquote><em>%s</em>%s</blockquote> %s' %\
                               (parent.nickname, parent.comment, comment.comment)

            if comment_type == CommentBodyType.reply:
                comment.parent_id = parent.id

        comment.entry_id = entry_id
        comment.chunk_id = chunk_id

        print "===---------------------------------------------------------------------"
        print comment.author_id,comment.email ,comment.nickname,comment.homepage
        print "===---------------------------------------------------------------------"

        if g.user.is_supervisor:
            user = UserService.get_by_id(comment.author_id)
            comment.email = user.email
            comment.nickname = user.nickname
            comment.homepage = user.homepage
            print "g.user.is_supervisor============================================"
            print comment.author_id,comment.email ,comment.nickname,comment.homepage


        elif g.user:
            print "g.user==========================================================="
            print g.user.role
            print g.user.is_supervisor
            comment.author_id = g.user.id
            comment.email = g.user.email
            comment.nickname = g.user.nickname
            comment.homepage = g.user.homepage
        else:
            comment.email = request.form['email']
            comment.nickname = request.form['nickname']
            comment.homepage = request.form['homepage']
            if comment.homepage == 'http://':
                comment.homepage = app.config['SITE_URL']

                #print 'made:', comment.email, comment.nickname, comment.homepage

            if not comment.email:
                comment.email = 'quest@infopub.org'
            if not comment.nickname:
                comment.nickname = u'游客'
            if not comment.homepage:
                comment.homepage = '#'

        if comment_type != CommentBodyType.reply:
            comment.parent_id = 0

        if g.user and g.user.is_editor:
            comment.comment_status = 0
        else:
            if not check_in_rank(app.config['SAFE_POST_START_TIME'], app.config['SAFE_POST_END_TIME']):
                # 需要审核
                comment.comment_status = 1

        if gfw.check(comment.comment):
            # 需要审核
            comment.comment_status = 1

        comment.body_type = comment_type
        comment.created_ip = get_remote_ip()
        comment.updated_time = comment.created_time

        # slug 有用吗？
        comment.slug = str(int_now())

        if is_auto_save_img:
            comment.content =  auto_save_img(comment.comment, app.config['SITE_DOMAIN'], PHOTOS_RELATIVE_PATH)

        # 保存数据
        if not CommentService.add(comment):
            flash(_("Internal error"), "failed")
            return render_template("%s/add_comment.html" % url_base, form=form, entries=entry)

        # 文章最后回复内容
        EntryService.modify_last_comment(entry_id, comment.id)

        if comment_type == CommentBodyType.reply:
            # 点评，更新主回复时间
            CommentService.update_time(parent_id)
        elif comment_type in [CommentBodyType.comment, CommentBodyType.appreciation]:
            # 更新回复数
            EntryService.inc_num_comments(entry_id, 1)

        flash(_("Thanks for your comment"), "success")

        return redirect(url_for('portal.entry', slug=entry.slug) + '#comment-%d' % comment.id)
    return redirect(url_for('portal.entry', slug=entry.slug))


@entry.route("/add_comment/<int:entry_id>/", methods=("GET", "POST"))
#@member.require(401)
def add_comment(entry_id):
    """
    添加评论
    :param entry_id:
    :return:
    """
    return _add_comment(entry_id, None)

@entry.route("/add_appreciation/<int:entry_id>/<int:chunk_id>/", methods=("GET", "POST"))
#@member.require(401)
def add_appreciation(entry_id, chunk_id):
    """
    添加赏析
    {{ url_for('entry.add_appreciation', entry_id=entry.id, chunk_id=chunk_id) }}
    :param entry_id:
    :param chunk_id:
    :return:
    """
    return _add_comment(entry_id, None, CommentBodyType.appreciation, chunk_id)


@entry.route("/del_comment/<int:entry_id>/<int:comment_id>/", methods=("GET", "POST"))
@member.require(401)
def del_comment(entry_id, comment_id):
    """
    删除 回复
    """
    # 普通用户的删除
    # 管理员的删除
    # 防止删除别人的帖子
    comment = CommentService.get_by_id(comment_id)

    if comment.author_id != g.user.id and not g.user.is_supervisor:
        abort(403)

    # 子回复个数
    sub_count = CommentService.count_by_parent_id(comment_id)

    # 删除回复
    if not sub_count:
        CommentService.delete(comment)
    else:
        # 有子回复的，不能数据删除，只能删除内容
        CommentService.softdel_by_id(comment)

    # 更新回复数
    if comment.body_type in [CommentBodyType.comment, CommentBodyType.appreciation]:
        EntryService.inc_num_comments(entry_id, -1)

    if comment.body_type == CommentBodyType.comment:
        # 文章最后回复内容
        latest_comment = CommentService.get_latest_comment_by_entey(entry_id)
        if latest_comment:
            EntryService.modify_last_comment(entry_id, latest_comment.id)
        else:
            EntryService.modify_last_comment(entry_id, 0)


    next = request.args.get('next', None)

    return jsonify(success=True,
        redirect_url=next,
        comment_id=comment_id)

@entry.route('/thanks/<int:id>/')
@member.require(401)
def thanks(id):
    """
    感谢
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.thanks(id, user_id),
        data_id=id)

@entry.route('/uninterested/<int:id>/')
@member.require(401)
def uninterested(id):
    """
    不感兴趣
    """

    int_value_verify(id)

    user_id = g.user.id

    return jsonify(success=EntryService.uninterested(id, user_id),
        data_id=id)

