import * as React from "react"
import glamorous from "glamorous"

import { hexOrColor } from "contiamo-ui-utils"

type Props = {
  className?: string
  size?: number
  children?: React.ReactNode
  onClick?: () => void
  theme?: Theme
  color?: string
}

const PlusChip: React.SFC<Props> = ({ className, children, onClick }: Props) =>
    <div className={`${className} PlusChip`} onClick={onClick} tabIndex={-1} role="button">
      {children || "+"}
    </div>,
  style: {} = ({ theme, color, size }: Props) => {
    const borderColor = color ? hexOrColor(color)((theme.colors && theme.colors[color]) || "white") : "black"

    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      border: "1px solid",
      cursor: "pointer",
      color: borderColor,

      "&.plus-chip + .plus-chip": {
        marginLeft: theme.spacing >= 0 ? theme.spacing && theme.spacing / 2 : 8,
      },
    }
  }

PlusChip.defaultProps = {
  size: 15,
}

export default glamorous(PlusChip)(style)
export { PlusChip }
