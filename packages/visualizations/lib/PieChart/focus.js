"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var focus_utils_1 = require("../utils/focus_utils");
var focus_1 = require("../utils/focus");
var dataName = function (d) { return d.data.key; }, dataValue = function (d) { return d.data.value; }, dataPercentage = function (d) { return d.data.percentage.toFixed(1) + "%"; };
var Focus = /** @class */ (function (_super) {
    __extends(Focus, _super);
    function Focus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Focus.prototype.onElementHover = function (payload) {
        this.remove();
        var focusPoint = payload.focusPoint, datum = payload.d;
        focus_utils_1.default.drawHidden(this.el, "element");
        var content = this.el.append("xhtml:ul");
        content
            .append("xhtml:li")
            .attr("class", "title")
            .text(dataName(datum));
        content
            .append("xhtml:li")
            .attr("class", "series")
            .html('<span class="value">' +
            dataValue(datum) +
            '</span> \
        <span class="percentage">(' +
            dataPercentage(datum) +
            ")</span>");
        // Get label dimensions
        var labelDimensions = focus_utils_1.default.labelDimensions(this.el), labelPlacement = {
            left: focusPoint.centroid[0] - labelDimensions.width / 2,
            top: focusPoint.centroid[1]
        };
        focus_utils_1.default.drawVisible(this.el, labelPlacement);
    };
    return Focus;
}(focus_1.default));
exports.default = Focus;
//# sourceMappingURL=focus.js.map