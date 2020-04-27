import React, { Component } from 'react'
import { Button, Grid, Divider } from 'semantic-ui-react'
import store from '../store'
import Lobby from '../Container/Lobby'
import Room from '../Container/Room'
import CreateRoom from './CreateRoom'


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: store.getState().mode,
            lobby: store.getState().lobby,
            chatRoom: store.getState().chatRoom,
        };
        store.subscribe(function () {
            this.setState({ mode: store.getState().mode });
            this.setState({ lobby: store.getState().lobby });
            this.setState({ chatRoom: store.getState().chatRoom });
        }.bind(this));
    }

    mode() {
        if (this.state.mode === 'lobby') {
            return <div><Lobby></Lobby> <CreateRoom></CreateRoom></div>;
        }
        else {
            return <Room></Room>;
        }
    }

    render() {
        var rendered = this.mode();
        return (
            <div>
                <h1>BubbLIT Prototype😊</h1>
                {rendered}
            </div>
        );
    }
}

export default Home