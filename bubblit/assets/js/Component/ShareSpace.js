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
            channel: this.props.channel 
        }
    }

    componentDidMount() {
        // 이미지/유튜브 브로드캐스팅 테스트용 코드. 추후 redux로 이전해야 함.
        // 실제 store 구독은 각 pane 컴포넌트별로 해야 할 듯. props는 바뀌어선 안 되는 거니까...
        if(this.state.channel != null) {
            this.state.channel.join().receive("ok", response => {
                console.log("채널 접속 성공")
                this.state.channel.on("img_link", payload => {
                    this.setState({
                        imageurl: payload['body']
                    })
                })
                this.state.channel.on("youtube_link", payload => {
                    this.setState({
                        youtubeurl: payload['body']
                    })
                })
            }).receive("error", resp => { console.log("Unable to join", resp) })
        }
    }

    handleImageUrlInput(event) {
        this.setState({
            imageurlinput: event.target.value
        })
    }

    handleImageUrlClick(event) {
        event.preventDefault();
        this.state.channel.push("img_link", { body: this.state.imageurlinput })
        this.setState({
            imageurlinput: ''
        })
    }

    render() {
        const panes = [
            {
                menuItem: 'Youtube', render: () => <Tab.Pane className="sharespace-tab"><YoutubePanel
                    youtubeurl={this.state.youtubeurl}
                    channel={this.state.channel} /></Tab.Pane>
            },
            {
                menuItem: 'Docs', render: () => <Tab.Pane className="sharespace-tab"><DocsPanel /></Tab.Pane>
            },
            { menuItem: 'Log', render: () => <Tab.Pane className="sharespace-tab">ChatLog</Tab.Pane> },
            {
                menuItem: 'IMG', render: () => <Tab.Pane className="sharespace-tab"><ImagePanel
                    imgurl={this.state.imageurl}
                    channel={this.state.channel} /></Tab.Pane>
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