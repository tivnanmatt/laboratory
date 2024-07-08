"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionBase = /** @class */ (function () {
    function ActionBase() {
        this.TooltipList = [];
        this.afterExecute = null;
        this.afterClear = null;
    }
    ActionBase.prototype.Execute = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.$target != null && _this.previousStyle != null)
                _this.previousStyle = _this.$target.attr('style');
            var result = _this.ExecuteInternal();
            if (_this.afterExecute != null)
                _this.afterExecute();
            if (result instanceof Promise)
                result.then(function () {
                    _this.ShowTooltips();
                    resolve();
                });
            else {
                _this.ShowTooltips();
                resolve();
            }
        });
    };
    ActionBase.prototype.Clear = function () {
        this.ClearInternal();
        if (this.afterClear != null)
            this.afterClear();
    };
    ActionBase.prototype.AfterExecute = function (method) {
        this.afterExecute = method;
        return this;
    };
    ActionBase.prototype.AfterClear = function (method) {
        this.afterClear = method;
        return this;
    };
    ActionBase.prototype.ClearStyles = function () {
        if (this.previousStyle == undefined)
            this.$target.removeAttr('style');
        else
            this.$target.attr('style', this.previousStyle);
    };
    ActionBase.prototype.GetZIndex = function (increment) {
        if (increment === void 0) { increment = 0; }
        return this.tutorial.ZIndex + increment;
    };
    ActionBase.prototype.AddTooltip = function (text, position) {
        this.TooltipList.push({ Text: text, Position: position, $Container: null });
        return this;
    };
    ActionBase.prototype.ShowTooltips = function () {
        for (var _i = 0, _a = this.TooltipList; _i < _a.length; _i++) {
            var tooltip = _a[_i];
            tooltip.$Container = rnJQuery("<div style=\"opacity:0\" class=\"tutorialBox\">" + tooltip.Text + "</div>");
            rnJQuery('body').append(tooltip.$Container);
            tooltip.$Container.css('z-index', this.GetZIndex(1000));
            this.SetPosition(tooltip);
            tooltip.$Container.velocity({ opacity: 1 }, 200, 'easeInExp');
        }
    };
    ActionBase.prototype.SetPosition = function (tooltip) {
        var offset = this.$target.offset();
        var positionClass = '';
        var tooltipTop = 0;
        var tooltipLeft = 0;
        switch (tooltip.Position) {
            case "right":
                positionClass = 'BoxRight';
                tooltipTop = offset.top + this.$target.height() / 2 - tooltip.$Container.outerHeight() / 2;
                tooltipLeft = offset.left + this.$target.outerWidth() + ActionBase.ArrowOffSet;
                break;
            case "left":
                break;
            case "top":
                break;
            case "bottom":
                positionClass = 'BoxBottom';
                tooltipTop = offset.top + this.$target.outerHeight() + ActionBase.ArrowOffSet;
                tooltipLeft = offset.left + this.$target.outerWidth() / 2 - tooltip.$Container.outerWidth() / 2;
                break;
        }
        tooltip.$Container.addClass(positionClass);
        tooltip.$Container.css('left', tooltipLeft);
        tooltip.$Container.css('top', tooltipTop);
    };
    ActionBase.prototype.ClearTooltips = function () {
        var _loop_1 = function (tooltip) {
            tooltip.$Container.velocity({ opacity: 0 }, 200, 'easeOutExp', function () { tooltip.$Container.remove(); });
        };
        for (var _i = 0, _a = this.TooltipList; _i < _a.length; _i++) {
            var tooltip = _a[_i];
            _loop_1(tooltip);
        }
    };
    ActionBase.ArrowOffSet = 15;
    return ActionBase;
}());
exports.ActionBase = ActionBase;
//# sourceMappingURL=ActionBase.js.map