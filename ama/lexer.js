let keywords = {
    "class": "CLASS",
    "if": "IF",
    "else": "ELSE",
    "for": "FOR",
    "in": "IN",
    "while": "WHILE",
    "return": "RETURN",
    "this": "THIS",
    "base": "BASE",
    "true": "TRUE",
    "false": "FALSE",
    "def": "DEF",
    "and": "AND",
    "or": "OR",
    "var": "VAR",
    "lambda": "LAMBDA",
    "NaN": "NAN",
    "Infinity": "INFINITY"
}
function Scanner() {
    return {
        line: 1,
        code: "",
        position: 0,
        error: "",
        AtEnd: function () { return this.position > this.code.length },
        ScanTokens: function () {
            let array = new Array();
            while (!this.AtEnd()) {
                let token = this.ScanToken();
                if (token != null && token != undefined) {
                    array.push(token)
                }
            }
            if (this.error == "") {
                return array;
            } else {
                return null;
            }
        },
        Match: function (expected) {
            if (this.PeekChar() == expected) {
                this.position++;
                return true;
            }
            return false;
        },
        PeekChar: function () {
            return this.code[this.position];
        },
        ReadChar: function () {
            return this.code[this.position++];
        },
        ParseNum: function (ch) {
            let buffer = "" + ch;
            let c = 0;
            c = this.PeekChar()
            while (isDigit(c) || c == '.') {
                buffer += c;
                this.ReadChar();
                c = this.PeekChar()
            }
            if ((buffer.match(/\./) || []).length > 1) {
                this.error = "more than one . in a number literal at line " + this.line + "\n";
            }
            let tok = Token("NUMBER", this.line)
            tok.literal = parseFloat(buffer);
            return tok;
        },
        ParseIdent: function (c) {
            let buffer = "" + c;
            while (isIdent(this.PeekChar())) {
                buffer += this.ReadChar()
            }
            let ident = buffer;
            let tok = Token(keywords.hasOwnProperty(ident) ? keywords[ident] : "IDENTIFIER", this.line)
            tok.literal = ident;
            return tok;
        },
        ParseString: function () {
            let buffer = "";
            let current = this.ReadChar();
            if (current == '"') {
                let tok = Token("STRING", this.line)
                tok.literal = "";
                return tok;
            }
            while (this.PeekChar() != '"' && !this.AtEnd()) {
                if (current == '\n') this.line++;
                buffer += current;
                current = this.ReadChar();
            }
            if (this.AtEnd()) {
                this.error += "unterminated string at line " + this.line + "\n"
            }
            buffer += current;
            this.ReadChar();
            let tok = Token("STRING", this.line)
            tok.literal = buffer;
            return tok;
        },
        ScanToken: function () {
            let char = this.ReadChar();
            if (char == undefined) return null;
            switch (char) {
                case '(':
                    return Token("LEFT_PAREN", this.line);
                case ')':
                    return Token("RIGHT_PAREN", this.line);
                case '{':
                    return Token("LEFT_BRACE", this.line);
                case '}':
                    return Token("RIGHT_BRACE", this.line);
                case '[':
                    return Token("LEFT_SQ_PAREN", this.line);
                case ']':
                    return Token("RIGHT_SQ_PAREN", this.line);
                case ',':
                    return Token("COMMA", this.line);
                case '.':
                    return Token("DOT", this.line);
                case ':':
                    return Token(this.Match('=') ? "COLON_EQUALS" :
                        this.Match(':') ? "DOUBLE_COLON" : "COLON", this.line);
                case '-':
                    return Token(this.Match('>') ? "THIN_ARROW" : "MINUS", this.line);
                case '+':
                    return Token("PLUS", this.line);
                case ';':
                    return Token("SEMICOLON", this.line);
                case '*':
                    return Token("STAR", this.line);
                case '/':
                    return Token("SLASH", this.line);
                case '!':
                    return Token(this.Match('=') ? "BANG_EQUAL" : "BANG", this.line);
                case '|':
                    return Token(this.Match('>') ? "PIPELINE" : this.Match('|') ? "DOUBLE_PIPE" : "PIPE", this.line);
                case '&':
                    return Token(this.Match('&') ? "DOUBLE_AMPERSAND" : "AMPERSAND", this.line);
                case '^':
                    return Token("CARET", this.line);
                case '=':
                    return Token(this.Match('=') ? "EQUAL_EQUAL" : this.Match('>') ? "THICC_ARROW" : "EQUAL", this.line);
                case '<':
                    return Token(this.Match('=') ? "LESS_EQUAL" : "LESS", this.line);
                case '>':
                    return Token(this.Match('=') ? "GREATER_EQUAL" : "GREATER", this.line);
                case ' ':
                case '\r':
                case '\t':
                    break;
                case '\n':
                    this.line++;
                    break;
                case '#':
                    while (this.PeekChar() != '\n' && !this.AtEnd()) this.ReadChar();
                    break;
                case '"':
                    return this.ParseString();
                default:
                    if (isDigit(char)) {
                        return this.ParseNum(char);
                    } else if (isIdentStarter(char)) {
                        return this.ParseIdent(char);
                    } else {
                        this.error += "unexpected character " + char + " at line " + this.line.toString() + "\n";
                    }
            }
        }
    }
}
function isDigit(c) {
    return (c >= '0' && c <= '9');
}
function isAlphabet(c) {
    return ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'));
}
function isIdentStarter(c) {
    return isAlphabet(c) || c == '_';
}
function isIdent(c) {
    return isAlphabet(c) || isDigit(c) || c == '_';
}
function Token(tokenType, tokenLine, lexeme) {
    return {
        type: tokenType,
        line: tokenLine,
        literal: null
    }
}
