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

    componentWillUpdate(nextProps, nextState) {
        // console.dir(nextProps)
        if (this.props.youtubeplaytime != nextProps.youtubeplaytime) {
            // [TODO] Time 에는 언제 보냈는지하고, 그때 몇초였는지가 필요.
            // 10분 13초에 영상이 1분 2초였다. 
            // 그러면 10분 33초에 들어온사람은 영상을 1분 22초부터 틀어준다
            // 갱신시간으로부터 20초 지났기때문에.
            // 좀 해보니까, 로딩때문에 seek을 2번 해줘야할거같음.
            // 첫번째 seek은 로딩때문에 뿌린사람이랑 어긋남.
            let time = parseFloat(nextProps.youtubeplaytime);
            console.log("youtube_current_play -> ", time)

            if (this.player != null) {
                console.log("tried to seek to ", time)
                this.player.seekTo(time)
            } else {
                console.error("NO Player but tried to seek playtime")
            }
        }
    }

    handleYoutubeUrlInput(event) {
        this.setState({
            youtubeurlinput: event.target.value
        })
    }

    handleYoutubeUrlClick(event) {
        event.preventDefault();
        this.props.channel.push("tab_action", { type: "youtube_link", body: this.state.youtubeurlinput })
        this.setState({
            youtubeurlinput: ''
        })
    }

    handleProgress(event) {
        /* 유튜브 재생에 맞춰 실시간으로 현재 재생 시간이 업데이트 됨. */
        this.setState({
            playedSeconds: event.playedSeconds
        }, () => {
            // [TODO] 한사람만 보내야함.
            // [TODO] 나중에 들어온 사람을 위해서 일정 주기로 보내야함.
            // this.handleYoutubeTimeClick();
        })
    }

    handleYoutubeTimeClick() {
        this.props.channel.push("tab_action", { type: "youtube_current_play", body: this.state.playedSeconds })
    }

    ref = player => {
        // ref로 연결함으로서 인스턴스처럼 아래의 ReactPlayer를 부를 수 있음.
        // ex) this.player.getCurrentTime()
        this.player = player
    }

    render() {
        return (
            <div className="outerfit">
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
                <button onClick={this.handleYoutubeUrlClick.bind(this)}>미디어 링크 변경</button>
                <button onClick={this.handleYoutubeTimeClick.bind(this)}>미디어 재생시간 동기화</button>
                <br />
                <font>지원 미디어: 트위치(라이브 스트리밍), 유튜브, 사운드 클라우드, 페이스북 등</font>
            </div>
        )
    }
}