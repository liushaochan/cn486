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

__doc__ = 'category 页面逻辑'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2012-01-19 02:25:40.405000'

from flask import Blueprint
from flask.templating import render_template
from werkzeug.exceptions import abort
from infopub.bases.utility import json_encode
from infopub.models.category import  CategoryService
from infopub.models.content.entry import  EntryService

category = Blueprint('category', __name__)

@category.route('/category_name_<int:level_num>.json')
def category_name_ajax(level_num=1):
    """
    取出指定层数的栏目ID、名称
    @param level_num:
    @return:
    """
    return json_encode(CategoryService.get_category_name_list(level_num))


def rander_category(category, tag=None, query=None, sort=None, order=None, page=1, entryType=17):
    """
    渲染栏目
    @param category:
    @return:
    """
    template_list = ['article_list.html', 'news_list.html', 'code_list.html', 'software_list.html', 'forum_list.html',
                     'question_list.html', 'tips_list.html', 'gallery_list.html', 'video_list.html', 'audio_list.html',
                     'link_list.html', 'quote_list.html', 'status_list.html', 'document_list.html', 'chat_list.html',
                     'aside_list.html', 'special_list.html', 'list.html']
    et = entryType
    if int(entryType) >= 17:
        entryType = 17
        et = 0
    # http://www.oschina.net/code/search?q=mysql&catalog=7
    # http://www.oschina.net/code/list?show=reply
    # http://stackoverflow.com/search?q=[python]+mysql+using+sqlalchemy

    # 内容类型检查
    if not category:
        abort(404)



    entries_total, page_total, entries_list = EntryService.get_page_by_category_and_entryType(category, tag, query, sort, order, page, et)

    # 侧边栏的数据
    #hot_tags = TagService.get_hot_tags(category)
    #weekly_entry = EntryService.get_weekly_entries(category)
    #monthly_entry = EntryService.get_monthly_entry(category)
    #latest_comments = CommentService.get_latest_comments(category)

    if query:
        # 有查询，将使用搜索结果显示模板
        template = category.search_template
    else:
        # 使用列表页显示模板
        template = category.list_template + template_list[int(entryType)]



    return render_template(
        template,
        entries_list=entries_list,

        current_category=category,
        current_tag=tag,

        record_total=entries_total,
        page_total=page_total,
        current_page=page,
        sub_category_list=CategoryService.get_sub_category_by_id(category.id),

        #hot_tags=hot_tags,
        #weekly_entry=weekly_entry,
        #monthly_entry=monthly_entry,)
        #latest_comments=latest_comments)
    )
