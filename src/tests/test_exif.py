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
from PIL.ExifTags import TAGS

__doc__ = 'TODO'
__author__ = 'wuxqing@gmail.com'
__version__ = 1.0
__time__ = '2014-09-07 16:54'

import exifread
# Open image file for reading (binary mode)
f = open('/home/wuxqing/Pictures/IMG_20140906_123619_501.jpg', 'rb')

# Return Exif tags
tags = exifread.process_file(f)

for tag in tags.keys():
    # print tag
    if tag not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename'):
        v = tags[tag]
        print "%s: %s" % (tag, v)
        print v.field_length, v.field_offset, v.field_type, v.printable, v.tag, v.values, type(v.values)
        print ''

print
print '-----------------------------'
print

from PIL import Image
img = Image.open('/home/wuxqing/Pictures/IMG_20140906_123619_501.jpg')
exif_data = img._getexif()

# print exif_data

for k, v in exif_data.iteritems():
        print '%s = %s' % (TAGS.get(k), v)


def parse_gps(titude):
    first_number = titude.split(',')[0]
    second_number = titude.split(',')[1]
    third_number = titude.split(',')[2]
    third_number_parent = third_number.split('/')[0]
    third_number_child = third_number.split('/')[1]
    third_number_result = float(third_number_parent) / float(third_number_child)
    return float(first_number) + float(second_number)/60 + third_number_result/3600

# print parse_gps()