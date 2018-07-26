import * as React from "react"
import ContextMenu, { Props as ContextMenuProps } from "../ContextMenu/ContextMenu"
import Icon from "../Icon/Icon"
import { darken } from "../utils"
import styled from "../utils/styled"

const width = 144

export interface Props {
  /** Action when item in dropdown is selected - if specified here, it is applied to all dropdown items */
  onClick?: ContextMenuProps["onClick"]
  /** Title */
  title?: string
  /** Actions to display in dropdown */
  items: ContextMenuProps["items"]
}

const Container = styled("div")(({ theme }) => ({
  width,
  height: 35,
  padding: `0 ${theme.space.content}px`,
  backgroundColor: theme.color.white,
  color: theme.color.primary,
  fontWeight: theme.font.weight.medium,
  borderRadius: theme.borderRadius,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  userSelect: "none",
  boxShadow: `0 0 0 1px ${theme.color.separators.light}`,
  "&:hover": {
    backgroundColor: darken(theme.color.white, 5),
  },
}))

const TitleContainer = styled("p")({
  width: 90,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
})

const ActionMenu: React.SFC<Props> = (props: Props) => (
  <ContextMenu {...props} items={props.items} width={width} condensed embedChildrenInMenu>
    {isOpen => (
      <Container>
        <TitleContainer>{props.title}</TitleContainer>
        <Icon name={isOpen ? "ChevronUp" : "Menu"} />
      </Container>
    )}
  </ContextMenu>
)

ActionMenu.defaultProps = {
  title: "Actions",
}

export default ActionMenu
