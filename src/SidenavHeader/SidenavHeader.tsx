import * as React from "react"
import styled from "react-emotion"
import Icon, { IconName } from "../Icon/Icon"
import { Consumer as OperationalContext } from "../OperationalUI/OperationalUI"
import { Props as SidenavItemProps } from "../SidenavItem/SidenavItem"
import { floatIn, isModifiedEvent } from "../utils"

export interface Props {
  id?: string
  className?: string
  /** Main label for the header */
  label: string | React.ReactNode
  /** Navigation property à la react-router <Link/> */
  to?: string
  /** Specifies an icon to render on the left of the label, displayed only if the `condensed` option is used. */
  icon?: IconName | React.ReactNode
  /** Color used in highlights and the side strip (hex or named color from `theme.colors`) */
  color?: string
  /** Condensed option  */
  condensed?: boolean
  /** Active state - renders colored strip on the left */
  active?: boolean
  /** Callback called when the active state changes */
  onToggle?: (newActiveState: boolean) => void
  /**
   * Expanded state
   *
   * @deprecated this prop is ignored as per design decision (all sidenavs are expanded)
   */
  expanded?: boolean
  /** Click handler */
  onClick?: () => void
  /** Close handler (via chevron button on the top right) */
  onClose?: () => void
  children?: React.ReactNode
}

const Container = styled("div")(({ theme }) => ({
  label: "sidenavheader",
  textDecoration: "none",
  width: "100%",
  position: "relative",
  borderBottom: "1px solid",
  borderBottomColor: theme.color.separators.default,
}))

const ContainerLink = styled("a")(({ theme }) => ({
  label: "sidenavheader",
  textDecoration: "none",
  width: "100%",
  position: "relative",
  borderBottom: "1px solid",
  borderBottomColor: theme.color.separators.default,
}))

const Content = styled("div")<{ isCondensed: boolean }>(({ theme, isCondensed }) => ({
  textDecoration: "none",
  cursor: "pointer",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  height: isCondensed ? 60 : 73,
  overflow: "hidden",
  padding: `0 ${theme.space.content}px`,
  width: "100%",
}))

const LabelText = styled("div")<{ isActive: boolean }>`
  position: relative;
  font-weight: 500;
  letter-spacing: 0.25;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  margin: 0;
  ${({ theme }) => `
    color: ${theme.color.text.dark};
    font-size: ${theme.font.size.body}px;
  `};
`

const ItemsContainer = styled("div")({
  animation: `${floatIn} .15s forwards ease`,
  position: "relative",
  top: -16,
  marginTop: -10,
})

const CloseButton = styled("div")(({ theme }) => ({
  position: "absolute",
  cursor: "pointer",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  top: 16,
  right: theme.space.content,
  color: theme.color.primary,
  ".op_sidenavheader:hover &": {
    display: "flex",
  },
  "& svg": {
    width: 16,
    height: 16,
  },
}))

const Summary = styled("div")<{ isActive: boolean }>`
  display: block;
  font-weight: normal;
  text-transform: none;
  user-select: none;
  margin-top: 4px;
  ${({ theme, isActive }) => `
    font-size: ${theme.font.size.fineprint}px;
    color: ${theme.color.text.lightest};
    left: ${theme.space.content}px;
    visibility: ${isActive ? "hidden" : "visible"};
  `};
`

const truncate = (maxLength: number) => (text: string) => {
  if (text.length < maxLength) {
    return text
  }
  return text.slice(0, maxLength) + "..."
}

const SidenavHeader = (props: Props) => {
  const isActive = Boolean(props.active)

  // The implementation of this component relies on the fact that it only has valid
  // `SidenavItem` components as children. The type casting here expresses that assumption.
  const childSidenavItems = (React.Children.toArray(props.children) || []) as Array<{ props: SidenavItemProps }>

  const hasChildLinks = childSidenavItems.some(child => Boolean(child.props.to))

  // Actual `to` prop should invalidate if the element has sublinks and is active
  const to = isActive && hasChildLinks ? undefined : props.to
  const ContainerComponent = to ? ContainerLink : Container

  return (
    <OperationalContext>
      {ctx => {
        return (
          <ContainerComponent
            id={props.id}
            href={to}
            className={[props.className, "op_sidenavheader"].filter(cls => Boolean(cls)).join(" ")}
            onClick={(ev: React.SyntheticEvent<Node>) => {
              if (props.onClick) {
                props.onClick()
              }
              if (props.onToggle) {
                props.onToggle(!props.active)
              }

              if (!isModifiedEvent(ev) && ctx.pushState && props.to) {
                ev.preventDefault()

                // Even if the `props.to` prop was ignored, redirect should still happen here
                ctx.pushState(props.to)
              }
            }}
          >
            <Content onClick={props.onClick} isCondensed={Boolean(props.condensed)}>
              <LabelText isActive={isActive}>
                {props.label}
                {props.icon && <Icon name={props.icon as IconName} right />}
              </LabelText>
              {!props.condensed && (
                <Summary isActive={isActive}>
                  {truncate(24)(childSidenavItems.map(child => child.props.label).join(", "))}
                </Summary>
              )}
            </Content>
            {childSidenavItems.length > 0 && (
              <CloseButton
                onClick={(ev: React.SyntheticEvent<Node>) => {
                  // Prevent clicks on parent in order to avoid conflicting behavior
                  ev.stopPropagation()
                  if (props.onToggle) {
                    props.onToggle(!props.active)
                  }
                }}
              >
                <Icon name={props.active ? "ChevronUp" : "ChevronDown"} />
              </CloseButton>
            )}
            {isActive && <ItemsContainer>{props.children}</ItemsContainer>}
          </ContainerComponent>
        )
      }}
    </OperationalContext>
  )
}

export default SidenavHeader
