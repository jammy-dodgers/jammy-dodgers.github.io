var app = new Vue({
    el: '.mainbody',
    data: {
        sourcecode: '',
        output: '',
        state: 'Ready'
    },
    methods: {
        run: function () {
            this.state = 'Lexing';
            let scanner = Scanner();
            scanner.code = this.sourcecode;
            let lexed = scanner.ScanTokens();
            if (lexed == null) {
                this.output = scanner.error;
            } else {
                this.output = lexed;
            }
            this.state = 'Ready';
        }
    }
});
//below code not mine
var textareas = document.getElementsByTagName('textarea');
var count = textareas.length;
for(var i=0;i<count;i++){
    textareas[i].onkeydown = function(e){
        if(e.keyCode==9 || e.which==9){
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "    " + this.value.substring(this.selectionEnd);
            this.selectionEnd = s + 4; 
        }
    }
}