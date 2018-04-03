"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactFeather = require("react-feather");
var glamorous_1 = require("glamorous");
var theme_1 = require("@operational/theme");
var BrandIcons = require("./Icon/BrandIcon");
var Icon = function (props) {
    var color_ = theme_1.expandColor(props.theme, props.color) || "currentColor";
    var defaultSize = props.theme.spacing * 1.5;
    if (ReactFeather.hasOwnProperty(props.name)) {
        var Comp = ReactFeather[props.name];
        return React.createElement(Comp, { size: props.size || defaultSize, color: color_ });
    }
    // @todo -> type this better
    if (BrandIcons.hasOwnProperty(props.name)) {
        var Comp = BrandIcons.OperationalUI;
        if (props.name === "Labs") {
            Comp = BrandIcons.Labs;
        }
        if (props.name === "Pantheon") {
            Comp = BrandIcons.Pantheon;
        }
        if (props.name === "Contiamo") {
            Comp = BrandIcons.Contiamo;
        }
        return React.createElement(Comp, { size: props.size || defaultSize, color: color_, rotation: props.rotation, colored: props.colored });
    }
    return null;
};
var WrappedIcon = glamorous_1.withTheme(Icon);
exports.default = WrappedIcon;
//# sourceMappingURL=Icon.js.map