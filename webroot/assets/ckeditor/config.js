/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    config.toolbar = [
        ['Source', 'Preview', '-', 'Templates'],
        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellChecker', 'Scayt'],
        ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        '/',
        ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Link', 'Unlink', 'Anchor'],
        ['Imagedef', 'Image', 'CodeSnippet', 'lightbox', 'Smiley', 'SpecialChar', 'PageBreak'],
        '/',
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor']
    ];
    config.resize_maxWidth = 775;
    config.removePlugins = 'elementspath';//去掉文本框下面出现body p 等
    config.removeDialogTabs = 'image:advanced';
    config.extraPlugins = "imagedef,codesnippet,imagepaste,lightbox"; //注册自定义按钮
    //http://docs.ckeditor.com/#!/guide/dev_codesnippet

    // 换行方式
    config.enterMode = CKEDITOR.ENTER_BR;

    // 当输入：shift+Enter是插入的标签
    config.shiftEnterMode = CKEDITOR.ENTER_BR;//
    //图片处理
    config.pasteFromWordRemoveStyles = true;
    config.filebrowserImageUploadUrl = "/misc/upload_img/";
};
