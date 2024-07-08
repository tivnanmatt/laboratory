/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ({

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = __webpack_require__(16);
var FormulaCompiler = /** @class */ (function () {
    function FormulaCompiler(stringToProcess) {
        this.stringToProcess = stringToProcess;
        this.parser = new Parser_1.Parser(this.stringToProcess);
    }
    FormulaCompiler.prototype.Compile = function () {
        return this.parser.Parse();
    };
    return FormulaCompiler;
}());
exports.FormulaCompiler = FormulaCompiler;
window.FormulaCompiler = FormulaCompiler;


/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Lexer_1 = __webpack_require__(17);
/*
expr:(Method|String|Whatever)*
method:Remote.Get lparen (expr |,expr) rparent;
String: "|` cadena "|
whatever:todo lo que not tenga espacios
 */
var Parser = /** @class */ (function () {
    function Parser(stringToProcess) {
        this.stringToProcess = stringToProcess;
        this.code = '';
        this.header = '';
        this.footer = '';
        this.variableCount = 0;
        this.lexer = new Lexer_1.Lexer(this.stringToProcess);
        this.currentToken = this.lexer.GetNextToken();
    }
    Parser.prototype.eat = function (tokenType) {
        if (this.currentToken.Type != tokenType)
            throw ("Invalid Formula");
        else
            this.currentToken = this.lexer.GetNextToken();
    };
    Parser.prototype.Parse = function () {
        return this.Expr();
    };
    Parser.prototype.Expr = function () {
        while (this.currentToken != null) {
            if (this.currentToken.Type != Lexer_1.TokenType.Method) {
                this.code += this.currentToken.Value;
            }
            else
                this.code += this.Method();
            this.eat(this.currentToken.Type);
        }
        return this.CreateRootPromise();
    };
    Parser.prototype.Method = function () {
        var methodCode = this.currentToken.Value;
        this.eat(Lexer_1.TokenType.Method);
        var parenthesesCount = -1;
        while (this.currentToken != null && (this.currentToken.Type != Lexer_1.TokenType.RParen || parenthesesCount > 0)) {
            if (this.currentToken.Type == Lexer_1.TokenType.RParen)
                parenthesesCount--;
            if (this.currentToken.Type == Lexer_1.TokenType.LParen)
                parenthesesCount++;
            if (this.currentToken.Type == Lexer_1.TokenType.Method)
                methodCode += this.Method();
            else
                methodCode += this.currentToken.Value;
            this.eat(this.currentToken.Type);
        }
        methodCode += ')';
        var variableName = 'result' + this.variableCount;
        this.header += methodCode + ".then(function(" + variableName + "){";
        this.variableCount++;
        this.footer += '})';
        return variableName;
    };
    /*
        public SubExpr():NodeBase{
            let token = this.currentToken;
            let node = null;
    
            let newNode = null;
            if (token.Type == TokenType.Method) {
                newNode = this.Method();
            }
            else if(token.Type==TokenType.LParen)
            {
                this.eat(TokenType.LParen);
                newNode=new SubExpressionNode();
                newNode.SubExpr=this.SubExpr();
                this.eat(TokenType.RParen);
            }else if(token.Type==TokenType.RParen)
                return null;
            else
                newNode = this.Whatever();
    
            return newNode;
        }
    
        private Method():NodeBase {
            let methodNode=new MethodNode();
            methodNode.MethodToken=this.currentToken;
            this.eat(TokenType.Method);
            this.eat(TokenType.LParen);
            methodNode.SubExpr=this.SubExpr();
            this.eat(TokenType.RParen);
            return methodNode;
    
        }
    
    
    
        private Whatever():NodeBase {
            let whateverNode: WhateverNode = new WhateverNode();
    
            while (true) {
                if (this.currentToken.Type == TokenType.Method || this.currentToken == null||this.currentToken.Type==TokenType.RParen)
                    break;
    
                if(this.currentToken.Type==TokenType.LParen)
                {
                    return new BinaryNode(whateverNode,this.SubExpr());
                }
    
                whateverNode.ChildTokens.push(this.currentToken);
                this.eat(this.currentToken.Type);
            }
    
            return whateverNode;
        }*/
    Parser.prototype.CreateRootPromise = function () {
        return "new Promise(function(sfInternalResolve){\n            " + this.header + "\n                sfInternalResolve(" + this.code + ");\n            " + this.footer + "\n        });";
    };
    return Parser;
}());
exports.Parser = Parser;


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = __webpack_require__(18);
var Lexer = /** @class */ (function () {
    function Lexer(stringToProcess) {
        this.stringToProcess = stringToProcess;
        this.stringBuffer = '';
        this.currentIndex = -1;
    }
    Lexer.prototype.GetNextToken = function () {
        this.currentIndex++;
        if (this.stringToProcess.length <= this.currentIndex)
            return this.AnalizeToken();
        var currentChar = this.stringToProcess[this.currentIndex];
        if (this.IsWhiteSpace(currentChar)) {
            if (this.stringBuffer.length > 0) {
                this.currentIndex--;
                return this.AnalizeToken();
            }
            else {
                this.stringBuffer += ' ';
                return this.AnalizeToken();
            }
        }
        else if (this.IsQuote(currentChar)) {
            var token = this.CreateQuotedString();
            this.stringBuffer = '';
            return token;
        }
        else if (this.IsParentheses(currentChar)) {
            if (this.stringBuffer.length > 0) {
                this.currentIndex--;
                return this.AnalizeToken();
            }
            else {
                if (currentChar == '(')
                    return new Token_1.Token(TokenType.LParen, '(');
                else
                    return new Token_1.Token(TokenType.RParen, ')');
            }
        }
        else if (this.IsSymbol(currentChar)) {
            if (this.stringBuffer.length > 0) {
                this.currentIndex--;
                return this.AnalizeToken();
            }
            else
                return new Token_1.Token(TokenType.Symbol, currentChar);
        }
        else {
            this.stringBuffer += currentChar;
            return this.GetNextToken();
        }
    };
    Lexer.prototype.AnalizeToken = function () {
        if (this.stringBuffer.length == 0)
            return null;
        var token = { Type: TokenType.Whatever, Value: this.stringBuffer };
        if (this.stringBuffer == 'Remote.Get' || this.stringBuffer == 'Remote.Post')
            token.Type = TokenType.Method;
        this.stringBuffer = "";
        return token;
    };
    Lexer.prototype.IsWhiteSpace = function (currentChar) {
        return currentChar == ' ' || currentChar == '\r' || currentChar == '\t' || currentChar == '\n';
    };
    Lexer.prototype.IsQuote = function (currentChar) {
        return currentChar == "'" || currentChar == "\"";
    };
    Lexer.prototype.CreateQuotedString = function () {
        var quote = this.stringToProcess[this.currentIndex];
        this.stringBuffer += quote;
        this.currentIndex++;
        while (this.currentIndex < this.stringToProcess.length && (this.stringToProcess[this.currentIndex] != quote || this.stringToProcess[this.currentIndex - 1] == '\\')) {
            this.stringBuffer += this.stringToProcess[this.currentIndex];
            this.currentIndex++;
        }
        if (this.stringToProcess[this.currentIndex] == quote) {
            this.stringBuffer += quote;
        }
        return new Token_1.Token(TokenType.String, this.stringBuffer);
    };
    Lexer.prototype.IsParentheses = function (currentChar) {
        return currentChar == '(' || currentChar == ")";
    };
    Lexer.prototype.IsSymbol = function (currentChar) {
        var symbolList = [',', '&', '|', ';', '+', '-', '/', '*'];
        return symbolList.indexOf(currentChar) >= 0;
    };
    return Lexer;
}());
exports.Lexer = Lexer;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Method"] = 1] = "Method";
    TokenType[TokenType["Whatever"] = 2] = "Whatever";
    TokenType[TokenType["Comma"] = 3] = "Comma";
    TokenType[TokenType["LParen"] = 4] = "LParen";
    TokenType[TokenType["RParen"] = 5] = "RParen";
    TokenType[TokenType["String"] = 6] = "String";
    TokenType[TokenType["Symbol"] = 7] = "Symbol";
})(TokenType = exports.TokenType || (exports.TokenType = {}));


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Token = /** @class */ (function () {
    function Token(Type, Value) {
        this.Type = Type;
        this.Value = Value;
    }
    return Token;
}());
exports.Token = Token;


/***/ })

/******/ });
//# sourceMappingURL=formulacompiler_bundle.js.map