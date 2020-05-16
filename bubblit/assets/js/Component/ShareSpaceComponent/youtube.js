import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import './../../../css/shareSpace.css'
import { Button } from 'semantic-ui-react'

export default class YoutubePanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            youtubeurlinput: '',
            isShareProgress: true,
            isPlay: true
        }
    }

    componentWillUpdate(nextProps, nextState) {

        // youtubeplaytime 변경시 로직
        if (this.props.youtubeplaytime != nextProps.youtubeplaytime) {
            if ((Math.abs(this.player.getCurrentTime() - parseFloat(nextProps.youtubeplaytime)) >= 6) &&
                this.state.isShareProgress) {
                // [TODO] Time 에는 언제 보냈는지하고, 그때 몇초였는지가 필요.
                // 10분 13초에 영상이 1분 2초였다. 
                // 그러면 10분 33초에 들어온사람은 영상을 1분 22초부터 틀어준다
                // 갱신시간으로부터 20초 지났기때문에.
                // 좀 해보니까, 로딩때문에 seek을 2번 해줘야할거같음.
                // 첫번째 seek은 로딩때문에 뿌린사람이랑 어긋남.

                // 위에꺼 걍 5초주기로 렌더링해주면 될듯
                let time = parseFloat(nextProps.youtubeplaytime);
                // console.log("youtube_current_play -> ", time)

                if (this.player != null) {
                    console.log("tried to seek to ", time)
                    this.player.seekTo(time)
                } else {
                    console.error("NO Player but tried to seek playtime")
                }
            }
        }

        // isPlay 변경시 로직
        if (this.state.isPlay != nextProps.isPlay) {
            console.log("이걸로 변경", nextProps.isPlay)
            this.setState({
                isPlay: nextProps.isPlay
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
        this.props.channel.push("tab_action", { type: "youtube_link", body: this.state.youtubeurlinput })
        this.setState({
            youtubeurlinput: ''
        })
    }

    handleProgress(event) {
        // [TODO] 호스트가 정해지면 이걸 한명만 보내도록 해야함.
        // this.handleYoutubeTimeProgress();
    }

    // 영상을 동기화할 한명이 정해지면 그 때 주석풀고 사용하면 됨.
    // handleYoutubeTimeProgress() {
    //     this.props.sendTabAction("youtube_current_play", this.player.getCurrentTime())
    // }

    handlePause() {
        console.log("멈춤")
        if (this.state.isShareProgress) {
            this.props.sendTabAction("youtube_is_play", false)
        }
    }

    handleStart() {
        console.log("재생")
        // Resume 및 첫 Start 때도 작동함. onStart callback시 자동으로 실행됨.
        // youtube_is_pause와 youtube_is_true를 둘 다 두는 것보단 그냥 youtube_is_pause에서 T/F로 가는게 효율적일 듯.
        if (this.state.isShareProgress) {
            this.props.sendTabAction("youtube_current_play", this.player.getCurrentTime())
            this.props.sendTabAction("youtube_is_play", true)
        }
    }


    toggleShareProgressChange() {
        this.setState({
            isShareProgress: !this.state.isShareProgress
        })
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
                    playing={this.state.isPlay}
                    controls={true}
                    onProgress={this.handleProgress.bind(this)}
                    progressInterval={5000}
                    onPause={this.handlePause.bind(this)}
                    onPlay={this.handleStart.bind(this)} />
                <input
                    className="input"
                    type="text"
                    value={this.state.youtubeurlinput}
                    onChange={this.handleYoutubeUrlInput.bind(this)}
                />
                <Button onClick={this.handleYoutubeUrlClick.bind(this)}>미디어 링크 변경</Button>
                <br />
                미디어 재생시간 공유하기
                <input type='checkbox' checked={this.state.isShareProgress}
                    onChange={this.toggleShareProgressChange.bind(this)} />
                <br />
                <font>지원 미디어: 트위치(라이브 스트리밍), 유튜브, 사운드 클라우드, 페이스북 등</font>

                <div>미디어의 링크를 올린 다음, 미디어 링크 변경 버튼을 클릭해 다른사람에게 공유해보세요.</div>
                <div>미디어 재생시간 동기화 버튼을 클릭해, 다른사람들을 자신이 보고 있는 시간으로 이동시키세요.</div>
            </div>
        )
    }
}