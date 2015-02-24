CKEDITOR.plugins.addExternal('dropdown', '/js/CKEditor_plugins/dropdown/');
CKEDITOR.plugins.addExternal('delbutton', '/js/CKEditor_plugins/delbutton/');
CKEDITOR.on('instanceCreated', function (event) {
    var editor = event.editor;

    editor.on('configLoaded', function () {
        this.config.extraPlugins = 'sourcedialog,dropdown,delbutton';
        this.config.language = 'zh-cn';
        this.config.allowedContent = true;
        this.config.toolbarGroups.push({
            name: 'digpage'
        });
        this.config.dropdowns = {
            'onClick': onDropDownClick,
            'items' : window.digpage.update_dropdown_items
        };
        this.config.delbutton = {
            'onClick' : onDelButtonClick
        };
    });
    
    editor.on('blur', function(event){
        editor = event.editor;
        if (editor.checkDirty()) {
            id = editor.element.$.dataset['sectionid'];
            $data = $('<div>' + editor.getData() + '</div>');
            $header = $data.children('h1,h2,h3,h4,h5,h6');
            header = $header[0].outerHTML;
            $header.remove();
            content = $data.html().trim();
            $.ajax({
                url: 'http://api.dev.com/sections/' + id,
                type: 'PUT',
                data: {
                    title: header,
                    content: content
                }
            });
        }
    });
    var onDropDownClick = function (editor, index, value) {
        editor.element.$.dataset['section'+index] = value;
        id = editor.element.$.dataset['sectionid'];
        tmp = {};
        tmp[index] = value;
        $.ajax({
            url: 'http://api.dev.com/sections/' + id,
            type: 'PUT',
            data: tmp
        });
    };
    var onDelButtonClick = function(editor) {
        console.log(editor);
    };
});