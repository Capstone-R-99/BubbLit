import React, { Component } from 'react'
import { Button, Grid, Divider } from 'semantic-ui-react'
import store from '../store'
import Lobby from '../Container/Lobby'
import Room from '../Container/Room'
import { Route, Switch, BrowserRouter } from 'react-router-dom'


class Home extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     mode: store.getState().mode,
        //     lobby: store.getState().lobby,
        //     chatRoom: store.getState().chatRoom,
        //     userName: ""
        // };
        // store.subscribe(function () {
        //     this.setState({ mode: store.getState().mode });
        //     this.setState({ lobby: store.getState().lobby });
        //     this.setState({ chatRoom: store.getState().chatRoom });
        // }.bind(this));
    }

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