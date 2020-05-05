import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import './../../../css/shareSpace.css'

export default class YoutubePanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            youtubeurlinput: '',
            playedSecond: 0
        }
    }
    // props가  constructor나 componentDidMount() 에서 렌더링이 안됨....
    // 테스트 결과 channel 객체가 생성되는 것보다 이 유튜브 패널 렌더링이 더 빠름.
    // 따라서, 초반에 channel을 불러봤자 unidentified임...
    // 그래서 props가 업데이트 될 때 (= Sharespace.state.channel에 채널이 할당될 때)
    // 구독을 시작함.

    componentDidUpdate(prevProps) {
        console.log(this.props.channel, prevProps.channel)
        if (this.props.channel !== prevProps.channel) {
            this.props.channel.on("tab_action", payload => {
                // [TODO] ShareSpace에서 tab_action을 컨트롤해서 주는게 좋을거같다.
                // Click도 마찬가지
                // 귀찮으니 여기서도 받는다.
                if(payload['type'] == "youtube_current_play"){
                    console.log("youtube_current_play -> ", payload['body'])
                    this.player.seekTo(parseFloat(payload['body']))
                }
            })
        }
    }


    handleYoutubeUrlInput(event) {
        this.setState({
            youtubeurlinput: event.target.value
        })
    }

    handleYoutubeUrlClick(event) {
        event.preventDefault();
        this.props.channel.push("tab_action", { type:"youtube_link", body: this.state.youtubeurlinput })
        this.setState({
            youtubeurlinput: ''
        })
    }

    handleProgress(state) {
        /* 유튜브 재생에 맞춰 실시간으로 현재 재생 시간이 업데이트 됨. */
        this.setState({
            playedSecond: state.playedSeconds
        })
    }

    handleYoutubeTimeClick() {
        this.props.channel.push("youtube_current_play", { body: this.state.playedSecond })
    }

    ref = player => {
        // ref로 연결함으로서 인스턴스처럼 아래의 ReactPlayer를 부를 수 있음.
        // ex) this.player.getCurrentTime()
        this.player = player
    }

    render() {
        return (
            <div className="sharespace-tab">
                <ReactPlayer url={this.props.youtubeurl}
                    ref={this.ref}
                    width="100%"
                    height="80%"
                    playing={true}
                    controls={true}
                    onProgress={this.handleProgress.bind(this)} />
                <input
                    className="input"
                    type="text"
                    value={this.state.youtubeurlinput}
                    onChange={this.handleYoutubeUrlInput.bind(this)}
                />
                <button onClick={this.handleYoutubeUrlClick.bind(this)}>유튜브 변경</button>
                <button onClick={this.handleYoutubeTimeClick.bind(this)}>유튜브 재생시간 변경</button>
                <font>현재 재생시간 : {this.state.playedSecond}</font>
            </div>
        )
    }
}