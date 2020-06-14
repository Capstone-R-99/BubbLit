import React, { Component } from 'react'
import { Tab, Button } from 'semantic-ui-react'
import MediaPanel from './ShareSpaceComponent/MediaPanel'
import CustomPanel from './ShareSpaceComponent/CustomPanel'
import ImagePanel from './ShareSpaceComponent/shareimage'
import LogPanel from './ShareSpaceComponent/LogPanel'
import ActionLogPanel from './ShareSpaceComponent/ActionLogPanel'
import './../../css/shareSpace.css'
import { Redirect } from 'react-router';
import { withAlert } from "react-alert";

class ShareSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action_history: [],
            restrict_control: "false",
            imageurl: '',
            customUrl: '',
            mediaurl: '',
            mediaPlayTimeShare: '',
            mediaCurrentPlayTime: '',
            mediaIsPlay: true,
            tabIndex: 0,
            redirect: false
        }

    }

    componentDidMount() {
        if (this.props.channel != null) {
            this.props.channel.on('room_after_join', payload => {
                // 시간대형식을 js 식으로 해줌 (ISO 포맷)
                var new_tab_action_history = payload.tab_action_history.map((value) => {
                    return { ...value, inserted_at: value.inserted_at + ".000Z" };
                });

                var change = { action_history: [...new_tab_action_history] }
                var actions = []

                console.log(new_tab_action_history)
                new_tab_action_history.reduce((unique, tab_action) => {
                    if (unique.includes(tab_action.type)) {
                        return unique;
                    }

                    actions.push(tab_action)
                    return [...unique, tab_action.type];
                }, []);

                actions.reverse()

                actions.forEach(tab_action => {
                    let user_id = tab_action.user_id;
                    let body = tab_action.param;
                    Object.assign(change, this.handleTabAction(tab_action.type, body, user_id));
                })

                this.setState(change)
            })
            this.props.channel.on("tab_action", payload => {
                var new_action = { user_id: payload['user_id'], type: payload['type'], param: payload['body'], inserted_at: new Date().toISOString() }

                if (new_action.type != 'media_current_time') {
                    console.log("tab action recieved", new_action)
                }
                var change = this.handleTabAction(new_action.type, new_action.param, new_action.user_id)
                // 액션 히스토리에 추가할 필요 없는 action들은 null을 반환함.
                if (change != null) {
                    change.action_history = [new_action].concat(this.state.action_history);
                    this.setState(change)
                }
            })
            this.props.channel.on('get_room_code', payload => {
                this.props.alert.show(payload.body, { type: 'info', timeout: 0 })
                // alert(payload.body)
            })
            this.props.channel.on('delete_room', payload => {
                this.props.alert.show("방이 삭제되었습니다!", { type: 'info' })
                // alert("방이 터졌어요")
                this.setState({
                    redirect: true
                })
            })
        }
    }

    handleTabAction(type, body, user_id) {
        /*
        액션 히스토리에 등록해야 하는 액션은 state를 반환하고, 
        그렇지 않은 액션은 case 안에서 setState를 마친 후 null을 반환하도록 함.
         */
        // 탭 이름과 index를 매칭함.
        let tabs = {
            'media': 0,
            'custom': 1,
            'chatlog': 2,
            'actionlog': 3,
            'image': 4,
        }


        switch (type) {
            case "img_refreshed":
                this.setState({
                    tabIndex: tabs['image']
                })
                return { imageurl: "api/room/get_image/" + body }
            case "media_link":
                this.setState({
                    tabIndex: tabs['media']
                })
                return { mediaurl: body }
            case "media_share_time":
                this.setState({
                    tabIndex: tabs['media']
                })
                return {
                    mediaPlayTimeShare: parseFloat(body),
                }
            case "media_is_play":
                this.setState({
                    tabIndex: tabs['media']
                })
                return { mediaIsPlay: (body === 'true') }
            case "restrict_control":
                return {
                    restrict_control: body
                }
            case "custom_link":
                this.setState({
                    tabIndex: tabs['custom']
                })
                return {
                    customUrl: body
                }
            case "media_current_time":
                this.setState({
                    mediaCurrentPlayTime: parseFloat(body)
                })
                return null
        }
    }

    sendTabAction(type, body) {
        if (this.state.restrict_control == "true" && this.props.isHost == false) {
            this.props.alert.show("방장이 조작을 제한하고 있습니다.")
        }
        this.props.channel.push("tab_action", { type: type, body: body })
    }

    handleImageUploadSuccess(file_name) {
        console.log("handleImageUploadSuccess", file_name)
        this.sendTabAction("img_refreshed", file_name)
    }

    handleTabChange(e, data) {
        this.setState({
            tabIndex: data.activeIndex
        })
    }

    controlPanelRender() {
        if (this.props.isHost == true) {
            return (<div>
                <Button primary key={"underMyControl"} onClick={function (e, data) {
                    this.sendTabAction("restrict_control", "true")
                }.bind(this)}>방장만 조작 가능</Button>
                <Button primary key={"underMyUnsetControl"} onClick={function (e, data) {
                    this.sendTabAction("restrict_control", "false")
                }.bind(this)}>모두가 조작 가능</Button>
                <Button color='red' key={"delete_room"} onClick={function (e, data) {
                    this.props.channel.push("delete_room");
                }.bind(this)}>방 삭제</Button>
            </div>
            )
        }
        else {
            return <div>
                <Button key={"quit_room"} onClick={function (e, data) {
                    this.props.channel.push("quit_room");
                }.bind(this)}>방나가기</Button>
            </div>
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to="/" />;
        }

        let mediaContent =
            <Tab.Pane className="outerfit">
                <MediaPanel
                    mediaurl={this.state.mediaurl}
                    channel={this.props.channel}
                    mediaPlayTimeShare={this.state.mediaPlayTimeShare}
                    isPlay={this.state.mediaIsPlay}
                    mediaCurrentPlayTime={this.state.mediaCurrentPlayTime}
                    sendTabAction={this.sendTabAction.bind(this)}
                    presences={this.props.roomInfo.presences} />
            </Tab.Pane>;

        let customContent =
            <Tab.Pane className="outerfit"><CustomPanel
                customUrl={this.state.customUrl}
                sendTabAction={this.sendTabAction.bind(this)} /></Tab.Pane>;

        let logContent =
            <Tab.Pane className="outerfit">
                <LogPanel roomInfo={this.props.roomInfo} users={this.props.users} />
            </Tab.Pane>

        let actionLogContent =
            <Tab.Pane className="outerfit">
                <ActionLogPanel roomInfo={this.props.roomInfo} history={this.state.action_history} />
            </Tab.Pane>

        let imgContent =
            <Tab.Pane className="outerfit">
                <ImagePanel
                    broadcastAction={this.handleImageUploadSuccess.bind(this)}
                    imgurl={this.state.imageurl}
                    channel={this.props.channel}
                    room_id={this.props.current_room_id} />
                <div width='100%' display='block'>Ctrl+v로 이미지 파일을 붙여넣어서, 다른 사람들에게 공유해보세요!</div>
            </Tab.Pane>

        let extendContent =
            <Tab.Pane className="outerfit">
                {this.controlPanelRender()}
                <Button style={{ marginTop: 10 }} color={'black'} key={"showRoomCode"} onClick={function (e, data) {
                    this.props.channel.push("get_room_code");
                }.bind(this)}>Room Code 조회</Button>
            </Tab.Pane>

        const panes = [
            {
                menuItem: '미디어',
                pane: { key: 'tab1', content: mediaContent, className: 'sharespace-tab' }
            },
            {
                menuItem: '커스텀',
                pane: { key: 'tab2', content: customContent, className: 'sharespace-tab' }

            },
            {
                menuItem: '채팅기록',
                pane: { key: 'tab3', content: logContent, className: 'sharespace-tab' }
            },
            {
                menuItem: '실행기록',
                pane: { key: 'tab4', content: actionLogContent, className: 'sharespace-tab' }
            },
            {
                menuItem: '이미지',
                pane: { key: 'tab5', content: imgContent, className: 'sharespace-tab' }
            },
            {
                menuItem: '설정',
                pane: { key: 'tab6', content: extendContent, className: 'sharespace-tab' }
            },
        ]

        let rootClassName = "sharespace-div " + (this.state.restrict_control == "true" ? "div-restricted" : "")

        return (
            <div className={rootClassName}>
                <Tab className="outerfit"
                    menu={{ size: 'huge', color: 'blue', inverted: true, attatched: "false", tabular: false }}
                    panes={panes}
                    activeIndex={this.state.tabIndex}
                    onTabChange={this.handleTabChange.bind(this)}
                    renderActiveOnly={false}
                />
            </div>

        )
    }
}

export default withAlert()(ShareSpace)