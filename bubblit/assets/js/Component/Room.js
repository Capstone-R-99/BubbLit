import React, { Component } from 'react'
import { Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { Rnd } from 'react-rnd'
import ChatModule from '../Container/ChatModule'
import ShareSpace from '../Container/ShareSpace'
import { Presence } from "phoenix"
import '../../css/room.css'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router';


class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: 1,
            shareSpace_width: window.innerWidth * 0.5,
            shareSpace_height: 0.85,
            isEnter: false,
            isHost: false,
            redirect: false
        }

        let channelinit = async () => {
            await this.props.enterRoom(this.props.current_room_id)
            await this.channelInitialize();
        }

        channelinit()
    }

    lobbyRedirect = () => {
        alert("방에 접속할 수 없습니다. 로비로 이동합니다.")
        this.props.history.push('/')
    }

    channelInitialize = () => {
        this.props.channel.join()
            .receive('ok', this.onReceiveOk.bind(this))
            .receive('error', response => {
                console.log('Unable to join', response)
                this.lobbyRedirect()
            });
    }

    onReceiveOk(response) {
        console.log('joined successfully at ', response)
        this.setState({
            isEnter: true
        })
        this.props.channel.on('room_after_join', payload => {
            this.props.setHistory(payload);
            this.props.initializeRoomHistory(payload);
            // Host 유저인지 체크.
            if (this.props.userId == payload.host_user) {
                this.setState({
                    isHost: true
                })
            }
        })
        this.props.channel.on('user_join', payload => {
            console.log('user_join', payload);
            this.props.userJoin(payload.user_id, payload.user_name);
        })
        this.props.channel.on('user_quit', payload => {
            console.log('user_quit', payload);
            this.props.userQuit(payload.body);
            if (this.props.userId == payload.body) {
                alert("탈출!");
                this.setState({
                    redirect: true
                })
            }
        })
        this.props.channel.on("new_msg", payload => {
            let user_id = payload['user_id'];
            let msg = payload['body'];

            this.props.addMessage(payload['user_id'], payload['body']);
        })
        this.props.channel.on("presence_state", state => {
            let presences = Presence.syncState(this.props.roomInfo.presences, state)
            this.props.updatePresences(presences)

        })
        this.props.channel.on("presence_diff", diff => {
            let presences = Presence.syncDiff(this.props.roomInfo.presences, diff)
            this.props.updatePresences(presences)
        })
    }


    headerRender() {
        if (this.props.roomInfo == undefined) {
            return <p>Loading...</p>
        }
        else {
            let host_id = this.props.roomInfo.host_user
            let hostname = this.props.roomInfo.users[host_id] == undefined ? '' : this.props.roomInfo.users[host_id].name

            return <Header className='room-header' as='h1' size='huge'>
                <Icon name='rocketchat' size='huge' />
                Room '{this.props.roomInfo.room_title}' 호스트: {hostname}
            </Header>
        }
    }

    componentWillUnmount() {
        this.props.exitRoom()
    }
    // ResizableBox에 초기 사이즈(width, height)는 숫자만 받음 => %값으로 줄 수 없음.
    // 따라서, window 창 크기를 계산해서 직접 %를 계산해서 줘야 할듯.
    // Grid가 사실상 유명무실해서 실제로 사용하기 쉽도록 사이즈 맞춤. 
    // 오른쪽에 여분의 공간 남는건 나중에 생각해보자...

    // React RND로 모듈 바꿈, minwidth, maxwidth를 현재 창 크기의 비율로 맞추고싶은데 우선 놔둠

    // <p>Loading...</p> 부분은 전부 나중에 로딩아이콘 같은걸로 바꾸면 됨(깔끔한 디자인 원하면)
    render() {
        if (!this.state.isEnter) {
            return <p>Loading...</p>
        }
        if (this.state.redirect) {
            return <Redirect push to="/" />;
        }

        return (
            <div>
                <div className='room' >
                    {this.headerRender()}
                    <Grid columns={2}>
                        <Grid.Column>
                            <Rnd
                                className='tab'
                                disableDragging
                                minWidth={window.innerWidth * 0.3}
                                maxWidth={window.innerWidth * 0.6}
                                default={{
                                    x: 0,
                                    y: 0,
                                    width: window.innerWidth * 0.5,
                                    height: window.innerHeight * 0.85,
                                }}
                                height={this.state.shareSpace_height}
                            >
                                <ShareSpace isHost={this.state.isHost}></ShareSpace>

                            </Rnd>
                        </Grid.Column>
                        <Grid.Column>
                            <ChatModule></ChatModule>
                        </Grid.Column>
                    </Grid>
                </div>
            </div >
        )

    }
}

export default withRouter(Room)