import React, { Component } from 'react'
import { Button, Grid, Divider } from 'semantic-ui-react'
import store from '../store'
import Lobby from '../Container/Lobby'
import Room from '../Container/Room'
import { Route, Switch, BrowserRouter } from 'react-router-dom'


class Home extends Component {

    render() {
        // Login :  /login
        // Lobby : /임.
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Lobby} />
                    <Route path="/room" component={Room} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Home