/// <reference types="react" />
import * as React from "react";
import { Theme } from "@operational/theme";
import { Css } from "./types";
export interface IStyleProps {
    theme?: Theme;
    color?: string;
    active?: boolean;
    disabled?: boolean;
    condensed?: boolean;
}
export interface Props {
    id?: string;
    css?: Css;
    className?: string;
    onClick?: any;
    type?: string;
    children?: React.ReactNode;
    color?: string;
    active?: boolean;
    disabled?: boolean;
    condensed?: boolean;
}
declare const Button: (props: Props) => JSX.Element;
export default Button;
