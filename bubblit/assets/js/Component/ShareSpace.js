import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import MediaPanel from './ShareSpaceComponent/MediaPanel'
import DocsPanel from './ShareSpaceComponent/googledocs'
import ImagePanel from './ShareSpaceComponent/shareimage'
import LogPanel from './ShareSpaceComponent/LogPanel'
import './../../css/shareSpace.css'

export default class ShareSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageurl: '',
            docurl: '',
            mediaurl: '',
            mediaPlayTime: '',
            mediaIsPlay: true,
            channel: this.props.channel,
            tabIndex: 0
        }
    }

    componentDidMount() {
        console.log(this.props.channel)
        if (this.props.channel != null) {
            this.props.channel.on('room_after_join', payload => {
                var change = {}

                for (var tab_action_type in payload.tab_action_history) {
                    let val = payload.tab_action_history[tab_action_type]

                    let user_id = val['user_id'];
                    let body = val['body'];
                    Object.assign(change, this.handleTabAction(tab_action_type, body, user_id));
                }

                this.setState(change)
            })
            this.props.channel.on("tab_action", payload => {
                console.dir("tab action", payload)
                console.dir(payload)
                var change = this.handleTabAction(payload['type'], payload['body'], payload['user_id'])
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
            'image': 3,
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
                    mediaPlayTime: body,
                }
            case "media_is_play":
                this.setState({
                    tabIndex: tabs['media']
                })
                return { mediaIsPlay: body }
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
                <LogPanel history={this.props.history} users={this.props.users} />
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
                menuItem: 'IMG',
                pane: { key: 'tab4', content: imgContent, className: 'sharespace-tab' }
            },
        ]

        return (
            <div className="sharespace-div">
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