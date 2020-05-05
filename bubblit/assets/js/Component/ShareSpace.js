import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import Cat from '../../static/images/cat.jpg'
import YoutubePanel from './ShareSpaceComponent/youtube'
import DocsPanel from './ShareSpaceComponent/googledocs'
import ImagePanel from './ShareSpaceComponent/shareimage'
import './../../css/shareSpace.css'

export default class ShareSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageurl: '',
            docurl: '',
            youtubeurl: '',
            youtubeplaytime: '',
            channel: this.props.channel,
        }
    }

    componentDidMount() {
        // 이미지/유튜브 브로드캐스팅 테스트용 코드. 추후 redux로 이전해야 함.
        // 실제 store 구독은 각 pane 컴포넌트별로 해야 할 듯. props는 바뀌어선 안 되는 거니까...
        console.log(this.props.channel)
        if (this.props.channel != null) {
            this.props.channel.on('room_history', payload => {
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
                var change = this.handleTabAction(payload['type'], payload['body'], payload['user_id'])

                this.setState(change)
            })
        }
    }

    handleTabAction(type, body, user_id) {
        switch (type) {
            case "img_link":
                return { imageurl: body }
            case "youtube_link":
                return { youtubeurl: body }
            case "youtube_current_play":
                return { youtubeplaytime: body }
        }
    }

    sendTabAction(type, body) {
        this.props.channel.push(type, { body: body })
    }

    handleImageUrlClick(event) {
        // Glurjar 적용중이라 실제 작동은 안하는듯
        console.log("handleImageUrlClick")
        this.sendTabAction("img_link", this.state.imageurlinput)
    }

    render() {
        const panes = [
            {
                menuItem: 'Youtube', render: () => <Tab.Pane className="sharespace-tab"><YoutubePanel
                    youtubeurl={this.state.youtubeurl}
                    channel={this.props.channel}
                    youtubeplaytime={this.state.youtubeplaytime} /></Tab.Pane>
            },
            {
                menuItem: 'Docs', render: () => <Tab.Pane className="sharespace-tab"><DocsPanel /></Tab.Pane>
            },
            {
                menuItem: 'Log', render: () => <Tab.Pane className="sharespace-tab">ChatLog</Tab.Pane>
            },
            {
                menuItem: 'IMG', render: () => <Tab.Pane className="sharespace-tab"><ImagePanel
                    broadcastAction={this.handleImageUrlClick.bind(this)}
                    channel={this.props.channel} /></Tab.Pane>
            },
        ]

        return (
            <div className="sharespace-div">
                <Tab className="sharespace-tab"
                    menu={{ color: 'blue', attatched: "false", tabular: false }}
                    panes={panes}
                />
            </div>

        )
    }
}