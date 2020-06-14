import React, { Component } from 'react'
import { Button, Table, Header, Grid, Popup, Menu, Image, Label, Pagination } from 'semantic-ui-react'
import axios from 'axios'
import CreateRoom from './CreateRoom'
import { Link } from 'react-router-dom'
import '../../css/lobby.css'
import JoinRoom from './JoinRoom'
import { withAlert } from "react-alert";

class Lobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowOnlyEntered: false,
            // 페이지네이션 구현을 위한 파라미터들, totalPages는 현재 안쓰고있는데 나중에 쓸수도 있음
            pageItem: 5,
            activePage: 1,
            boundaryRange: 2,
            siblingRange: 2,
            showEllipsis: true,
            showFirstAndLastNav: false,
            showPreviousAndNextNav: false,
            //totalPages: 1,
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
        this.setState({ totalPages: this.tableContentRender().length })
        console.log('렝스는', this.tableContentRender())
    }

    userLogout() {
        document.getElementById('logout-link').getElementsByTagName('a')[0].click()
    }

    toggleShowRooms() {
        this.setState({
            isShowOnlyEntered: !this.state.isShowOnlyEntered
        })
    }

    setRoomIDWithRoomCode(room_code) {
        var splited = room_code.split(":")
        if (splited.length < 2) {
            this.props.alert.show("유효하지 않은 Room Code입니다.", { type: 'error' })
            return false;
        }

        console.log("setRoomIDWithRoomCode")
        this.props.setRoomIDWithRoomCode(splited[0], splited[1]);

        return true;
    }

    tableContentRender() {
        console.log(this.state)
        var content = [];
        var _roomList = this.props.roomList;
        var i = 0;
        while (i < _roomList.length) {
            var active = null;
            var room = _roomList[i];
            var host = this.props.host;
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
                { key: "host_name", value: room.current },
                { key: "is_private", value: room.is_private.toString() },
                { key: "users", value: room.users.length },
                { key: "active", value: active },
            ]


            /*
            내가 들어간 방은 room-entered
            내가 들어가있지 않은 방은 room-not-entered임.
            table의 body 클래스명이 소속 여부에 따라 달라지니까 커스터마이징 하려면 css를 고치면 됨. 
            */

            // 로직을 간단히 하기 위해 렌더링 여부에 상관없이 i를 올려준다.
            i += 1;

            let entered = room.users.indexOf(Number(this.props.userId)) != -1
            let rowClassname = entered ? "room-entered" : "room-not-entered";

            let showOnlyEntered = entered == false && this.state.isShowOnlyEntered
            if (showOnlyEntered) {
                continue
            }

            let hideNotEnteredPrivateRoom = entered == false && room.is_private
            if (hideNotEnteredPrivateRoom) {
                continue
            }

            content.push(
                <Table.Body key={i.toString() + "table"} className={rowClassname}>
                    <Table.Row key={i.toString() + "row"}>
                        {row.map((value) => <Table.Cell key={value.key + i}> <p className="table-cell-text">{value.value} </p> </Table.Cell>)}
                    </Table.Row>
                </Table.Body>
            )
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
                <div style={{ marginTop: 5, marginBottom: 5 }}>
                    <p>내가 속한 방만 표시하기
                <input type='checkbox' checked={this.state.isShowOnlyEntered}
                            onChange={this.toggleShowRooms.bind(this)} /></p>
                </div>
            </div>
            <Button className='logout-button' size='tiny' primary onClick={this.userLogout.bind(this)}>로그아웃</Button>
            <Popup position='bottom left' trigger={<Button color='green' size='tiny'>새 방 만들기</Button>} pinned on='click'>
                <CreateRoom />
            </Popup>
            <div style={{ marginTop: 2, marginLeft: 5 }}>
                <JoinRoom setRoomIDWithRoomCode={this.setRoomIDWithRoomCode.bind(this)} />
            </div>
        </Header>
    }

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

    render() {
        const {
            pageItem,
            activePage,
            boundaryRange,
            siblingRange,
            showEllipsis,
            showFirstAndLastNav,
            showPreviousAndNextNav,
        } = this.state
        let startItem = pageItem * (activePage - 1)
        let endItem = startItem + pageItem
        console.log(activePage, startItem, endItem)
        let totalItem = this.tableContentRender()
        let currentContents = totalItem.slice(startItem, endItem)
        let totalPages = totalItem.length / pageItem

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
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>방제목</Table.HeaderCell>
                                <Table.HeaderCell>호스트 이름</Table.HeaderCell>
                                <Table.HeaderCell>접속코드 여부</Table.HeaderCell>
                                <Table.HeaderCell>현재 인원</Table.HeaderCell>
                                <Table.HeaderCell>접속</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {currentContents}
                    </Table>
                    <Pagination
                        activePage={activePage}
                        boundaryRange={boundaryRange}
                        onPageChange={this.handlePaginationChange}
                        size='small'
                        siblingRange={siblingRange}
                        //totalPages={totalPages}
                        totalPages={totalPages}
                        // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                        ellipsisItem={showEllipsis ? undefined : null}
                        firstItem={showFirstAndLastNav ? undefined : null}
                        lastItem={showFirstAndLastNav ? undefined : null}
                        prevItem={showPreviousAndNextNav ? undefined : null}
                        nextItem={showPreviousAndNextNav ? undefined : null}
                        pointing
                        secondary
                    />
                </div>
            </div >
        )

    }
}

export default withAlert()(Lobby)