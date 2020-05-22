import React, { Component } from 'react'
import { Button, Table, Header, Grid, Popup, Menu, Image, Label } from 'semantic-ui-react'
import axios from 'axios'
import CreateRoom from './CreateRoom'
import { Link } from 'react-router-dom'
import '../../css/lobby.css'

export default class Lobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowOnlyEntered: false
        }
    }


    componentDidMount() {

        var _userName = document.getElementById('current-username').innerHTML
        var _userid = document.getElementById('current-userid').innerHTML
        this.props.setUserData(_userName, _userid)
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

    toggleShowRooms() {
        this.setState({
            isShowOnlyEntered: !this.state.isShowOnlyEntered
        })
    }

    tableContentRender() {
        console.log(this.state)
        var content = [];
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
                        this.props.setRoomID(room_id);
                    }.bind(this)}>join</Button>
                    </Link>
                )
            }
            var row = [
                { key: "id", value: room.id },
                { key: "title", value: room.title },
                { key: "limit", value: room.limit },
                { key: "current", value: room.current },
                { key: "users", value: room.users.length },
                { key: "active", value: active },
            ]


            /*
            내가 들어간 방은 room-entered
            내가 들어가있지 않은 방은 room-not-entered임.
            table의 body 클래스명이 소속 여부에 따라 달라지니까 커스터마이징 하려면 css를 고치면 됨. 
            */
            if (room.users.indexOf(Number(this.props.userId)) != -1) {
                var rowClassname = "room-entered"
            }
            else {
                var rowClassname = "room-not-entered"
                if (this.state.isShowOnlyEntered) {
                    i += 1;
                    continue
                }
            }
            content.push(
                <Table.Body key={i.toString() + "table"} className={rowClassname}>
                    <Table.Row key={i.toString() + "row"}>
                        {row.map((value) => <Table.Cell key={value.key + i}> <p className="table-cell-text">{value.value} </p> </Table.Cell>)}
                    </Table.Row>
                </Table.Body>
            )
            i += 1;
        }

        return content
    }

    userInfoRender() {
        return <Header className='username-heder' as='h3'>
            <div>
                <Label size='big' basic color='blue'>
                    <Image avatar spaced='right' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                    {this.props.userName}
                </Label>
                <p>내가 속한 방만 표시하기
                <input type='checkbox' checked={this.state.isShowOnlyEntered}
                        onChange={this.toggleShowRooms.bind(this)} /></p>
            </div>
            <Button className='logout-button' size='tiny' primary onClick={this.userLogout.bind(this)}>Logout</Button>
            <Popup position='bottom left' trigger={<Button secondary size='tiny'>CreateRoom</Button>} pinned on='click'>
                <CreateRoom />
            </Popup>
        </Header>
    }

    render() {
        return (
            <div>
                <div className='lobby' >
                    <Menu>
                        <Menu.Item>
                            <Header className='lobby-header' as='h1'>
                                BubbLIT
                            </Header>
                        </Menu.Item>
                        <Header textAlign="left">
                            <div>What is BubbLit?</div>
                            <div>소규모의 그룹이 모여서 부담없이 회의를 나눌 수 있는 인터넷 공간을 편리한 기능과 함께 제공하는 서비스 입니다.</div>
                            <div>We are Under Construction.</div>
                        </Header>
                        <Menu.Item position='right'>
                            {this.userInfoRender()}
                        </Menu.Item>
                    </Menu>
                    <Table className='lobby-room-table inverted'>
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
                        {this.tableContentRender()}
                    </Table>
                </div>
            </div >
        )

    }
}