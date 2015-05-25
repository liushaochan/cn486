/**
 * Created by kart on 14-9-3.
 */
CKEDITOR.plugins.add(
    "imagedef",
    {
        requires: ["dialog"], //当按钮触发时弹出对话框
        init: function (editor) {
//            editor.addCommand("imagedef", new CKEDITOR.dialogCommand("imagedef"));
            editor.addCommand("imagedef", function(){
                alert(111);
            });
            editor.ui.addButton(
                "Imagedef",
                {
                    label: "图片",
                    command: "imagedef",
                    icon: this.path + "imagedef.png"
                });
            CKEDITOR.dialog.add("imagedef", this.path + "dialogs/imagedef.js");
        }
    }
);