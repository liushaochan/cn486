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


__doc__ = 'TODO'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-09-07 16:54'

@module.route('/demo')
def demo():
    # redirect("/static/log/index.html")
    # print request
    # print request.host_url
    #
    # print request.full_path
    #
    # print
    # print dir(request)

    # current_app.logger.error(u'请注意：出现内部错误')
    # raise Exception('ERROR123')
    # raise Exception(u'出现内部错误123456qqq')
    return render_json({'data': [{'id': 1, 'name': 'name123'}, {'id': 2, 'name': 'name456'}]})
