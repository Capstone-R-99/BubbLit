import React, { Component } from 'react'
import { Tab, Button } from 'semantic-ui-react'
import MediaPanel from './ShareSpaceComponent/MediaPanel'
import CustomPanel from './ShareSpaceComponent/CustomPanel'
import ImagePanel from './ShareSpaceComponent/shareimage'
import LogPanel from './ShareSpaceComponent/LogPanel'
import ActionLogPanel from './ShareSpaceComponent/ActionLogPanel'
import './../../css/shareSpace.css'

export default class ShareSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action_history: [],
            restrict_control: "false",
            imageurl: '',
            customUrl: '',
            mediaurl: '',
            mediaPlayTime: '',
            mediaIsPlay: true,
            tabIndex: 0
        }
    }

    componentDidMount() {
        console.log(this.props.channel)
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
                console.log("tab action recieved", new_action)
                var change = this.handleTabAction(new_action.type, new_action.param, new_action.user_id)
                change.action_history = [new_action].concat(this.state.action_history);
                this.setState(change)
            })
            this.props.channel.on('get_room_code', payload => {
                alert(payload.body)
            })
        }
    }

    handleTabAction(type, body, user_id) {
        // 탭 이름과 index를 매칭함.
        // 전역변수처럼 빼내는건 좀 아닌거같아서 일단 여기다가 두겠음.
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
                return { imageurl: "api/room/get_image/" + this.props.current_room_id + "?" + new Date().getTime() }
            case "media_link":
                this.setState({
                    tabIndex: tabs['media']
                })
                return { mediaurl: body }
            case "media_current_play":
                this.setState({
                    tabIndex: tabs['media']
                })
                return {
                    mediaPlayTime: parseFloat(body),
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
        }
    }

    sendTabAction(type, body) {
        if (this.state.restrict_control == "true" && this.props.isHost == false) {
            alert("방장이 조작을 제한하고 있습니다.")
        }
        this.props.channel.push("tab_action", { type: type, body: body })
    }

    handleImageUploadSuccess() {
        // Glurjar 적용중이라 실제 작동은 안하는듯
        console.log("handleImageUploadSuccess")
        this.sendTabAction("img_refreshed", "")
    }

    handleTabChange(e, data) {
        this.setState({
            tabIndex: data.activeIndex
        })
    }

    controlPanelRender() {
        if (this.props.isHost == true) {
            return (<div>{this.state.restrict_control}
                <Button key={"underMyControl"} onClick={function (e, data) {
                    this.sendTabAction("restrict_control", "true")
                }.bind(this)}>방장만 조작 가능</Button>
                <Button key={"underMyUnsetControl"} onClick={function (e, data) {
                    this.sendTabAction("restrict_control", "false")
                }.bind(this)}>모두가 조작 가능</Button></div>
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
        let mediaContent =
            <Tab.Pane className="outerfit">
                <MediaPanel
                    mediaurl={this.state.mediaurl}
                    channel={this.props.channel}
                    mediaPlayTime={this.state.mediaPlayTime}
                    isPlay={this.state.mediaIsPlay}
                    sendTabAction={this.sendTabAction.bind(this)} />
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
                <Button key={"showRoomCode"} onClick={function (e, data) {
                    this.props.channel.push("get_room_code");
                }.bind(this)}>Room Code 조회</Button>
            </Tab.Pane>

        const panes = [
            {
                menuItem: 'Media',
                pane: { key: 'tab1', content: mediaContent, className: 'sharespace-tab' }
            },
            {
                menuItem: 'Custom',
                pane: { key: 'tab2', content: customContent, className: 'sharespace-tab' }

            },
            {
                menuItem: 'Log',
                pane: { key: 'tab3', content: logContent, className: 'sharespace-tab' }
            },
            {
                menuItem: '실행기록',
                pane: { key: 'tab4', content: actionLogContent, className: 'sharespace-tab' }
            },
            {
                menuItem: 'IMG',
                pane: { key: 'tab5', content: imgContent, className: 'sharespace-tab' }
            },
            {
                menuItem: '확장기능',
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