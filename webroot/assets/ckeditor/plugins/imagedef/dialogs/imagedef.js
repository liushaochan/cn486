/**
 * Created by kart on 14-9-3.
 */

CKEDITOR.dialog.add(
    "imagedef",
    function (b) {
        return {
            title: "图片",
            minWidth: 590,
            minHeight: 300,
            contents: [
                {
                    id: "tab1",
                    label: "",
                    title: "",
                    expand: true,
                    padding: 0,
                    elements: [
                        {
                            type: "html",
                            html: "<div style='float:left;width:100%'>上传到服务器上</div><div style='float:left;width:100%;' class='setUpload'> <div style='float:left;height:24px;width:82px' class='su_img'><span id='ck_btn_id'>dssdf</span></div> <div style='float:left' id='ck_fs_upload_progress'>未选择文件</div> </div> <div style='float:left;width:100%'><input id='stop_id' type='button' vlaue='终止'/><input id='ck_btn_start' class='cke_dialog_start_button_z' type='button' value='开始上传' style='float:left' onclick='ckUploadImageStart();'/></div> <div id='ck_pic_div' style='float:left;width:100%'></div>"
                        }
                    ]
                }
            ],
            onOk: function () { //对话框点击确定的时候调用该函数
//                var D = this;
//                var imes = $("#ck_pic_div").find("img");//获取上传的图片，用于取路径，将图片显示在富文本编辑框中
//                $(imes).each(function () {
//                    D.imageElement = b.document.createElement('img');
//                    D.imageElement.setAttribute('alt', '');
//                    D.imageElement.setAttribute('_cke_saved_src', $(this).attr("src"));
//                    D.imageElement.setAttribute('src', $(this).attr("src"));
//                    D.commitContent(1, D.imageElement);
//                    if (!D.imageElement.getAttribute('style')) {
//                        D.imageElement.removeAttribute('style');
//                    }
//                    b.insertElement(D.imageElement);
//                });
            },
            onLoad: function () { //对话框初始化时调用
               // initEventImageUpload(); //用于注册上传swfupload组件
            },
            onShow: function () {
                //clearCkImageUpload(); //在对话框显示时作一些特殊处理
            }
        };
    }
);