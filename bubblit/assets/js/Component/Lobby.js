import React, { Component } from 'react'
import { Button, Table, Header, Grid, Popup } from 'semantic-ui-react'
import axios from 'axios'
import CreateRoom from './CreateRoom'
import { Link } from 'react-router-dom'
import '../../css/lobby.css'

export default class Lobby extends Component {

    componentDidMount() {

        var _userName = document.getElementById('current-username').innerHTML
        this.props.setUserName(_userName)
        // then 안에서 this를 쓰기위함...
        var self = this;
        axios.get('/api/room/get/')
            .then(function (response) {
                console.dir(response);
                let room_list = response.data.data;
                self.props.refreshRoomList(room_list);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    userLogout() {
        document.getElementById('logout-link').getElementsByTagName('a')[0].click()
    }

    render() {
        var content = [];
        var _props = this.props;
        var _roomList = this.props.roomList;
        var i = 0;
        while (i < _roomList.length) {
            var active = null;
            var room = _roomList[i];
            if (room.current >= room.limit) {
                active = (<Button key={"inactive" + i} color='grey' active="false">full</Button>)
            }
            else {
                active = (
                    <Link to="/room"><Button secondary key={"active" + i} action={{ index: i }} onClick={function (e, data) {
                        var room_id = _roomList[data.action.index].id;
                        // [TODO] enterRoom 대신 room_id만 set해주는 redux 함수를 만들어야 할듯.
                        this.props.enterRoom(room_id);
                    }.bind(this)}>join</Button>
                    </Link>
                )
            }
            var row = [
                { key: "id", value: _roomList[i].id },
                { key: "title", value: _roomList[i].title },
                { key: "limit", value: _roomList[i].limit },
                { key: "current", value: _roomList[i].current },
                { key: "users", value: _roomList[i].users },
                { key: "active", value: active },
            ]

            content.push(
                <Table.Body key={i.toString() + "table"}>
                    <Table.Row key={i.toString() + "row"}>
                        {row.map((value) => <Table.Cell key={value.key + i}> {value.value} </Table.Cell>)}
                    </Table.Row>
                </Table.Body>
            )
            i += 1;
        }

        return (
            <div>
                <div className='lobby' >
                    <Header className='lobby-header' as='h1'>
                        BubbLIT
                    </Header>
                    <Header className='username-heder' as='h3'>
                        user: {this.props.userName}
                        <Button className='logout-button' size='tiny' primary onClick={this.userLogout.bind(this)}>Logout</Button>
                        <Popup position='bottom left' trigger={<Button secondary size='tiny'>CreateRoom</Button>} pinned on='click'>
                            <CreateRoom />
                        </Popup>
                    </Header>
                    <Table color='grey'>
                        <Table.Header>
                            <Table.Row key="header">
                                <Table.HeaderCell>id</Table.HeaderCell>
                                <Table.HeaderCell>title</Table.HeaderCell>
                                <Table.HeaderCell>host</Table.HeaderCell>
                                <Table.HeaderCell>current</Table.HeaderCell>
                                <Table.HeaderCell>users</Table.HeaderCell>
                                <Table.HeaderCell>JOIN</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {content}
                    </Table>

                </div>
            </div >
        )

    }
}