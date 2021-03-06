import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import './../../../css/shareSpace.css'
import { Button, Popup } from 'semantic-ui-react'

export default class MediaPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mediaURLInput: '',
            isShareProgress: true,
            isMediaHost: false,
            isPlay: false,
        }
    }


    componentWillUpdate(nextProps, nextState) {
        // mediaPlayTimeShare 변경시 로직
        if (this.props.mediaPlayTimeShare != nextProps.mediaPlayTimeShare) {
            if (this.state.isShareProgress) {
                let time = nextProps.mediaPlayTimeShare

                if (this.player != undefined) {
                    // console.log("tried to seek to ", time)
                    this.player.seekTo(time)

                } else {
                    console.error("NO Player but tried to seek playtime")
                }
            }
        }

        // isPlay 변경시 로직
        // props.isPlay랑 state.isPlay 따로 두는 이유: 플레이어를 사용자가 정지/재생할시 props를 직접 변경시키는 구조가 되면 안 되기 때문에...
        if ((nextProps.isPlay != this.state.isPlay)) {
            if (this.state.isShareProgress) {
                this.setState({
                    isPlay: nextProps.isPlay
                })
            }
        }

        // 링크 변경시 로직
        if (this.props.mediaHostID != nextProps.mediaHostID) {
            if (nextProps.mediaHostID == this.props.userId) {
                this.setState({
                    isMediaHost: true
                })
            }
            else {
                this.setState({
                    isMediaHost: false
                })
            }
        }

        // presence 관련 로직
        if (this.props.presences != nextProps.presences) {
            if ((Object.keys(this.props.presences).length == 1) && (Object.keys(nextProps.presences).length == 1)) {
                this.setState({
                    isMediaHost: true,
                })
                this.props.sendTabAction("media_is_play", true)
            }
        }
    }

    handleMediaUrlInput(event) {
        this.setState({
            mediaURLInput: event.target.value
        })
    }

    handleMediaUrlClick(event) {
        event.preventDefault();
        var _mediaURLInput = this.state.mediaURLInput
        // 반드시 아래의 tab_action보다 먼저 일어나야 하므로 먼저 할당함.
        this.setState({
            mediaURLInput: ''
        }, () => {
            this.props.sendTabAction("media_link", _mediaURLInput)
        })
    }

    handleProgress(event) {
        // 내가 호스트면 현재 진행상황을 보냄.
        if (this.state.isMediaHost) {
            this.props.sendTabAction("media_current_time", this.player.getCurrentTime())
        }
    }

    handleMediaShareClick() {
        if (this.state.isShareProgress) {
            this.props.sendTabAction("media_share_time", this.player.getCurrentTime())
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

    forceStart = () => {
        // 처음 방 들어오고 강제로 스타트
        this.setState({
            isPlay: true
        })
    }


    mediaPauseButton() {
        let handleMediaPauseClick = () => {
            if (this.state.isShareProgress) {
                this.props.sendTabAction("media_is_play", !this.state.isPlay)
            }
        }
        return <Button color='orange' onClick={handleMediaPauseClick}>{this.state.isPlay ? "미디어 정지하기" : "미디어 재개하기"}</Button>
    }

    mediaTimeShareButton() {
        if (this.state.isShareProgress) {
            return <Button color={'blue'} onClick={this.handleMediaShareClick.bind(this)}>현재 재생시간 공유</Button>
        }
        else {
            return <font></font>
        }
    }

    seekMedia() {
        this.player.seekTo(this.props.mediaCurrentPlayTime)
    }

    mediaSyncButton() {
        if (this.state.isMediaHost) {
            return <p><font>당신이 현재 재생되는 미디어의 호스트입니다.</font></p>
        }

        // player가 로딩이 안 된 상태 or 진행상황을 공유하지 않는 상태
        if ((this.player == undefined) || !this.state.isShareProgress) {
            return <div></div>
        }

        let recvedTime = this.props.mediaCurrentPlayTime
        if (Math.abs(recvedTime - this.player.getCurrentTime()) >= 5) {
            return <div>
                <font>현재 재생시간이 미디어 업로더의 재생시간과 일치하지 않습니다.</font>
                <Button color='green' onClick={this.seekMedia.bind(this)}>동기화</Button>
            </div>
        }
        else {
            return <div></div>
        }
    }

    render() {

        return (
            <div className="outerfit">
                <ReactPlayer url={this.props.mediaurl}
                    ref={this.ref}
                    width="100%"
                    height="80%"
                    playing={this.state.isPlay}
                    controls={true}
                    onProgress={this.handleProgress.bind(this)}
                    progressInterval={2000}
                    onReady={this.forceStart} />
                <input
                    className="input"
                    type="text"
                    style={{ marginTop: 5 }}
                    value={this.state.mediaurlinput}
                    onChange={this.handleMediaUrlInput.bind(this)}
                />
                <p style={{ marginTop: 5 }}>
                    <Popup
                        on='click'
                        pinned
                        trigger={<Button color='pink' content='사용방법' />}
                    >

                        <p>* 지원 미디어: 트위치(라이브 스트리밍), 유튜브, 사운드 클라우드, 페이스북 등</p>
                        <p>* 미디어의 링크를 올린 다음, 미디어 링크 변경 버튼을 클릭해 다른사람에게 공유해보세요.</p>
                        <p>* 모든 사람들의 재생을 정지시키려면 미디어 정지하기 버튼을 눌러주세요.</p>
                    </Popup>
                    <Button color={'teal'} onClick={this.handleMediaUrlClick.bind(this)}>미디어 링크 변경</Button>
                    {this.mediaTimeShareButton()}
                    {this.mediaPauseButton()}
                    {this.mediaSyncButton()}

                    미디어 재생시간 공유하기
                <input type='checkbox' checked={this.state.isShareProgress}
                        onChange={this.toggleShareProgressChange.bind(this)} />
                    {this.props.mediaurl == '' && <p>현재 재생되고 있는 미디어는 없습니다.</p>}

                </p>
            </div>
        )
    }
}