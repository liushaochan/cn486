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

from flask import Blueprint, g
from flask import render_template

__doc__ = '网站账户view'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2013-02-14 23:33'


module = Blueprint('software', __name__, url_prefix='/software', template_folder='templates')

# 获取全部的栏目信息：名称、....


@module.route('/')
def index():
    return 'software home'






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


