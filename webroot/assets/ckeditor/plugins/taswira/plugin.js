/**
 * Created by kart on 14-9-4.
 */
( function() {
  CKEDITOR.plugins
.add(
    'taswira',
    {
      requires : [ 'iframedialog' ],
      init : function(editor) {
        var me = this;
        /* define a dialog*/
        CKEDITOR.dialog
          .add(
          'TaswiraDialog',
          function(editor) {
            var lEditor = editor;
            return {
              title : 'Upload Image Dialog',
              minWidth : 550,
              minHeight : 200,
              contents : [ {
                id : 'iframe',
                label : 'Embed Image',
                expand : true,
                elements : [ {
                  type : 'html',
                  id : 'pageTaswiraEmbed',
                  label : 'Embed Image',
                  style : 'width : 100%;',
                  /* filebrowserImageBrowseLinkUrl is the variable to be set in the config.js, it refer your web image uploader page (servlet or other) that convert your image to Base64 adter submiting form*/
                  /* filebrowserImageBrowseLinkUrl (example : uri/imageuploader.html )*/
                  html : ''
                } ]
              } ],
              /* when user click on Ok button*/
              onOk : function() {
                for ( var i = 0; i < window.frames.length; i++) {
                  if (window.frames[i].name == 'iframeImgEmbed') {
                    var content = window.frames[i].document
                        .getElementById("taswiraId");
                    break;
                  }
                }
                /* get the src bas64 value after upload */
                /* <img id="taswiraId" src="data:image/${imageUploadForm.imageType};base64,${sessionScope.imageUploadForm.base64String}"/>*/
                var tmpLink = content.getAttribute('src');

                /* give a random id to the uploaded image and update src*/
                var strContent = '<img id="img_id'+ Math.floor(1000 * (Math.random() % 1)) + '" src="'+tmpLink+'"/>';
                var final_html ='MediaEmbedInsertData|---' + escape(strContent) + '---|MediaEmbedInsertData';
                var imgHtml = CKEDITOR.dom.element.createFromHtml(strContent);
                lEditor.insertHtml(strContent);
                var updated_editor_data = editor.getData();
                var clean_editor_data = updated_editor_data.replace(final_html,'<div class="media_embed">'+strContent+'</div>');
                editor.setData(clean_editor_data);

              }
            };
              });

      editor.addCommand('taswira',
              new CKEDITOR.dialogCommand(
                  'TaswiraDialog'));

      editor.ui.addButton('taswiraBtn', {
        label : 'Embed Image',
        command : 'taswira',
        icon :  this.path + 'icon.png'
      });
      }
    });
})();