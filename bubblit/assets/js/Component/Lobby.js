import React, { Component } from 'react'
import { Button, Table, Header, Grid, Popup, Menu, Image, Label } from 'semantic-ui-react'
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
            var active = [];
            var room = _roomList[i];
            if (room.current >= room.limit) {
                active.push(<Button key={i} color='grey' active="false">full</Button>)
            }
            else {
                active.push(
                    <Link to="/room"><Button secondary key={i} action={{ index: i }} onClick={function (e, data) {
                        var room_id = _roomList[data.action.index].id;
                        // [TODO] enterRoom 대신 room_id만 set해주는 redux 함수를 만들어야 할듯.
                        this.props.enterRoom(room_id);
                    }.bind(this)}>join</Button>
                    </Link>
                )
            }
            content.push(
                <Table.Body key={i}>
                    <Table.Row>
                        <Table.Cell>
                            {_roomList[i].id}
                        </Table.Cell>
                        <Table.Cell>
                            {_roomList[i].title}
                        </Table.Cell>
                        <Table.Cell>
                            {_roomList[i].limit}
                        </Table.Cell>
                        <Table.Cell>
                            {_roomList[i].current}
                        </Table.Cell>
                        <Table.Cell>
                            {_roomList[i].users}
                        </Table.Cell>
                        <Table.Cell>
                            {active}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            )
            i += 1;
        }

        return (
            <div>
                <div className='lobby' >
                    <Menu>
                        <Menu.Item>
                            <Header className='lobby-header' as='h1'>
                                BubbLIT
                    </Header>
                        </Menu.Item>
                        <Menu.Item position='right'>
                            <Header className='username-heder' as='h3'>
                                <div>
                                    <Label size='big' basic color='blue'>
                                        <Image avatar spaced='right' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                        {this.props.userName}
                                    </Label>

                                </div>
                                <Button className='logout-button' size='tiny' primary onClick={this.userLogout.bind(this)}>Logout</Button>
                                <Popup position='bottom left' trigger={<Button secondary size='tiny'>CreateRoom</Button>} pinned on='click'>
                                    <CreateRoom />
                                </Popup>
                            </Header>
                        </Menu.Item>
                    </Menu>


                    <Table color='grey'>
                        <Table.Header>
                            <Table.Row>
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