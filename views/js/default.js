$(document).ready(function(){
    //the box for user to write code
    var codeBox = $(".codemirror-textarea")[0];
    var editor = CodeMirror.fromTextArea(codeBox, {
        lineNum: true
        
    });
}); 