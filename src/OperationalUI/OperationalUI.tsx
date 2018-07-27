import { injectGlobal } from "emotion"
import { ThemeProvider } from "emotion-theming"
import * as React from "react"

import Message from "../Message/Message"
import Messages from "../Messages/Messages"
import { darken } from "../utils"
import constants, { OperationalStyleConstants } from "../utils/constants"

export interface Props {
  /** Children */
  children?: React.ReactNode
  /** Omit setting a set of base styles */
  noBaseStyles?: boolean
  /** Custom push state method expecting a single string */
  pushState?: (path: string) => void
  /** Custom replace state method expecting a single string */
  replaceState?: (path: string) => void
  /**
   * A time interval after which a non-error message is automatically cleared, measured in milliseconds. If the value set is `0`, no message will disappear.
   *
   * @default 10000 (10s)
   */
  hideMessageAfter?: number
}

export type MessageType = "info" | "success" | "error"

export interface IMessage {
  body: string
  type: MessageType
}

export interface State {
  windowSize: {
    width: number
    height: number
  }
  messages: Array<{
    message: IMessage
    addedAt: number
  }>
}

export interface WindowSize {
  width: number
  height: number
}

export interface Context {
  pushState?: (url: string) => void
  replaceState?: (url: string) => void
  pushMessage: (message: IMessage) => void
  windowSize: WindowSize
}

const colorByMessageType = (type: MessageType): string => {
  switch (type) {
    case "info":
      return "primary"
    case "success":
      return "success"
    case "error":
      return "error"
  }
}

// Defining a default context value here, used below when instantiating
// the context consumer and provider below in order for context to be
// correctly detected throughout the application.
const defaultContext: Context = {
  pushState: undefined,
  replaceState: undefined,
  pushMessage: (_: IMessage) => void 0,
  windowSize: {
    width: 1080,
    height: 640,
  },
}

const { Provider, Consumer } = React.createContext(defaultContext)

const baseStylesheet = (theme: OperationalStyleConstants): string => `
* {
  box-sizing: border-box;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: ${theme.deprecated.fontFamily};
  font-size: 13px;
  height: 100%;
}

body {
  background-color: ${theme.deprecated.colors.background};
}

a:link,
a:visited {
  color: ${theme.deprecated.colors.info};
  text-decoration: none;
}

a:hover: {
  color: ${darken(theme.deprecated.colors.info, 5)};
}
`

class OperationalUI extends React.Component<Props, State> {
  public state: State = {
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    messages: [],
  }

  /**
   *  The interval responsible for periodically checking
   *  whether any messages need to be removed from state
   */

  public messageTimerInterval: number | null = null

  public removeOutdatedMessages() {
    if (this.props.hideMessageAfter === 0) {
      return
    }
    const now = new Date().getTime()
    const filteredMessages = this.state.messages.filter(
      ({ message, addedAt }) => message.type === "error" || now - addedAt < (this.props.hideMessageAfter || 10000),
    )

    // If we're out of messages, clear the interval.
    if (!filteredMessages.length && this.messageTimerInterval) {
      window.clearInterval(this.messageTimerInterval)
      this.messageTimerInterval = null
    }
    // Only run a setState if any message(s) were removed.
    if (this.state.messages.length > filteredMessages.length) {
      this.setState(() => ({ messages: filteredMessages }))
    }
  }

  public handleResize = () => {
    this.setState(_ => ({
      windowSize: {
        width: window.innerWidth,
        height: window.innerWidth,
      },
    }))
  }

  public componentDidMount() {
    if (!this.props.noBaseStyles) {
      injectGlobal(baseStylesheet(constants))
    }
    window.addEventListener("resize", this.handleResize)
  }

  public componentWillUnmount() {
    if (this.messageTimerInterval) {
      window.clearInterval(this.messageTimerInterval)
    }
    window.removeEventListener("resize", this.handleResize)
  }

  public render() {
    const { pushState, replaceState, children } = this.props
    return (
      <ThemeProvider theme={constants}>
        <Provider
          value={{
            pushState,
            replaceState,
            pushMessage: (message: IMessage) => {
              this.setState(prevState => ({
                messages: [{ message, addedAt: new Date().getTime() }, ...prevState.messages],
              }))

              // If we don't yet have an interval, start one.
              if (!this.messageTimerInterval) {
                this.messageTimerInterval = window.setInterval(() => this.removeOutdatedMessages(), 2000)
              }
            },
            windowSize: this.state.windowSize,
          }}
        >
          <>
            <Messages>
              {this.state.messages.map(({ message }, index) => (
                <Message
                  key={index}
                  color={colorByMessageType(message.type)}
                  onClose={() =>
                    this.setState(prevState => ({
                      messages: prevState.messages.filter((_, filteredMessageIndex) => filteredMessageIndex !== index),
                    }))
                  }
                >
                  {message.body}
                </Message>
              ))}
            </Messages>
            {children}
          </>
        </Provider>
      </ThemeProvider>
    )
  }
}

export default OperationalUI

export { Consumer }
