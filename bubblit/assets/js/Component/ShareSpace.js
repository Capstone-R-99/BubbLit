import React, { Component } from 'react'
import { Tab, Button } from 'semantic-ui-react'
import MediaPanel from './ShareSpaceComponent/MediaPanel'
import DocsPanel from './ShareSpaceComponent/googledocs'
import ImagePanel from './ShareSpaceComponent/shareimage'
import LogPanel from './ShareSpaceComponent/LogPanel'
import ActionLogPanel from './ShareSpaceComponent/ActionLogPanel'
import './../../css/shareSpace.css'

export default class ShareSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action_history: [],
            restrict_control: "true",
            imageurl: '',
            docurl: '',
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
                var change = { action_history: [...payload.tab_action_history] }
                var actions = []

                console.log(payload.tab_action_history)
                payload.tab_action_history.reduce((unique, tab_action) => {
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
                console.dir("tab action", payload)
                var new_action = { user_id: payload['user_id'], type: payload['type'], param: payload['body'] }
                var change = this.handleTabAction(new_action.type, new_action.param, new_action.user_id)
                change.action_history = [new_action].concat(this.state.action_history);
                this.setState(change)
            })
        }
    }

    handleTabAction(type, body, user_id) {
        // 탭 이름과 index를 매칭함.
        // 전역변수처럼 빼내는건 좀 아닌거같아서 일단 여기다가 두겠음.
        let tabs = {
            'media': 0,
            'docs': 1,
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
        }
    }

    sendTabAction(type, body) {
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
            return <div></div>
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

        let docsContent =
            <Tab.Pane className="outerfit"><DocsPanel /></Tab.Pane>;

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

        const panes = [
            {
                menuItem: 'Media',
                pane: { key: 'tab1', content: mediaContent, className: 'sharespace-tab' }
            },
            {
                menuItem: 'Docs',
                pane: { key: 'tab2', content: docsContent, className: 'sharespace-tab' }

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
        ]

        return (
            <div className="sharespace-div">
                {this.controlPanelRender()}
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