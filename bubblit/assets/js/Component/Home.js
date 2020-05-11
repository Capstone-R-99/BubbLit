import React, { Component } from 'react'
import { Button, Grid, Divider } from 'semantic-ui-react'
import store from '../store'
import Lobby from '../Container/Lobby'
import Room from '../Container/Room'
import { Route, Switch, withRouter } from 'react-router-dom'


class Home extends Component {

    render() {
        // Login :  /login
        // Lobby : /임.
        return (
            <Switch>
                <Route exact path="/" component={Lobby} />
                <Route path="/room" component={Room} />
            </Switch>
        );
    }
}

export default withRouter(Home)