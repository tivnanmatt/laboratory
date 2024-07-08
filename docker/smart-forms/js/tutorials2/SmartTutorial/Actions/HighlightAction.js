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
var HighlightAction = /** @class */ (function (_super) {
    __extends(HighlightAction, _super);
    function HighlightAction($elementToHighlight) {
        var _this = _super.call(this) || this;
        _this.$target = $elementToHighlight;
        return _this;
    }
    HighlightAction.prototype.ExecuteInternal = function () {
        var _this = this;
        if (this.$target.data('tutorial-highlighted') == true)
            return;
        this.$target.velocity({ opacity: .0 }, 100, "easeOutExp", function () {
            _this.$target.data('tutorial-highlighted', true);
            _this.$target.css('z-index', _this.GetZIndex(1));
            _this.$target.css('position', 'relative');
            _this.$target.velocity({ opacity: 1 }, 100, "easeInExp");
        });
    };
    HighlightAction.prototype.ClearInternal = function () {
        var _this = this;
        this.$target.velocity({ opacity: .0 }, 100, "easeOutExp", function () {
            _this.ClearStyles();
            _this.$target.removeData('tutorial-highlighted');
            _this.$target.velocity({ opacity: 1 }, 100, "easeOutExp");
        });
    };
    return HighlightAction;
}(ActionBase_1.ActionBase));
exports.HighlightAction = HighlightAction;
//# sourceMappingURL=HighlightAction.js.map