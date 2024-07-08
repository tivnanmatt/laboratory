"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ActionBase_1 = require("./ActionBase");
var TitleAction = /** @class */ (function (_super) {
    __extends(TitleAction, _super);
    function TitleAction(title) {
        var _this = _super.call(this) || this;
        _this.title = title;
        return _this;
    }
    TitleAction.prototype.ExecuteInternal = function () {
        this.$title = rnJQuery("<div class=\"tutorialTitle\" style=\"opacity: 0; width:auto;max-width: 70%;min-height: 0;padding:13px;min-width: 500px;\"><span>" + this.title + "</span></div>");
        rnJQuery('body').append(this.$title);
        this.$title.css('position', 'absolute');
        this.$title.css('top', '150px');
        this.$title.css('left', rnJQuery(window).width() / 2 - this.$title.width() / 2);
        this.$title.css('z-index', this.tutorial.ZIndex + 1000);
        this.$title.velocity({ opacity: 1 }, 200, "easeInExp");
        return this;
    };
    TitleAction.prototype.ClearInternal = function () {
        var _this = this;
        this.$title.velocity({ opacity: 0 }, 200, "easeOutExp", function () { _this.$title.remove(); });
    };
    return TitleAction;
}(ActionBase_1.ActionBase));
exports.TitleAction = TitleAction;
//# sourceMappingURL=TitleAction.js.map