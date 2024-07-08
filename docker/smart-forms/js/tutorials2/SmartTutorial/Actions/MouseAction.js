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
var MouseAction = /** @class */ (function (_super) {
    __extends(MouseAction, _super);
    function MouseAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseAction.prototype.MoveMouseToElement = function ($target, position, offsetTop, offsetLeft) {
        var _this = this;
        if (position === void 0) { position = "center"; }
        if (offsetTop === void 0) { offsetTop = 0; }
        if (offsetLeft === void 0) { offsetLeft = 0; }
        return new Promise((function (resolve) {
            var mouse = _this.GetMouse();
            var moveAction = function () {
                var result = _this.CalculatePositionAndDistanceToElement($target, position, offsetTop, offsetLeft);
                _this.$mouse.velocity({ top: result.Top, left: result.Left }, result.Distance, function () { return resolve(); });
            };
            if (_this.$mouse.css('opacity') == "0")
                _this.GetMouse().velocity({ opacity: 1 }, 100, "easeInExp", moveAction);
            else
                moveAction();
        }));
    };
    MouseAction.prototype.CalculatePositionAndDistanceToElement = function ($target, position, offsetTop, offsetLeft) {
        if (position === void 0) { position = "center"; }
        if (offsetTop === void 0) { offsetTop = 0; }
        if (offsetLeft === void 0) { offsetLeft = 0; }
        var offset = this.$mouse.offset();
        var currentTop = offset.top;
        var currentLeft = offset.left;
        offset = $target.offset();
        var newTop = offset.top + $target.height() / 2 - 10;
        var newLeft = offset.left + $target.width() / 2 - 10;
        if (position == "top") {
            newTop = offset.top;
        }
        newTop += offsetTop;
        newLeft += offsetLeft;
        var distance = Math.sqrt(Math.pow(newTop - currentTop, 2) + Math.pow(newLeft - currentLeft, 2));
        return {
            Distance: distance,
            Top: newTop,
            Left: newLeft
        };
    };
    MouseAction.prototype.SetMouseCoordinates = function (coordinates) {
        this.GetMouse().css('left', coordinates.left);
        this.GetMouse().css('top', coordinates.top);
    };
    MouseAction.prototype.GetMouse = function () {
        if (this.$mouse == null) {
            this.$mouse = rnJQuery("<img style=\"left:0;top:0;position:absolute;z-index:" + this.GetZIndex(2000) + ";\" src=\"" + (smartFormsRootPath + 'images/handPointer.png') + "\"/>");
            rnJQuery('body').append(this.$mouse);
        }
        return this.$mouse;
    };
    MouseAction.prototype.HideMouse = function () {
        this.GetMouse().velocity({ opacity: 0 }, 200, "easeOutExp");
    };
    return MouseAction;
}(ActionBase_1.ActionBase));
exports.MouseAction = MouseAction;
//# sourceMappingURL=MouseAction.js.map