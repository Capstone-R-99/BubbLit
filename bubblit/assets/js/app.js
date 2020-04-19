// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ChatTestModule from './chatTestModule'
import { Provider } from 'react-redux'
import store from './store'
import Board from './Component/Board'

// This code starts up the React app when it runs in a browser. It sets up the routing
// configuration and injects the app into a DOM element.
//ReactDOM.render(<ChatTestModule />, document.getElementById('react-juno'))

ReactDOM.render(
    <Provider store={store}>
        <Board />
    </Provider>, document.getElementById('react-app'))
