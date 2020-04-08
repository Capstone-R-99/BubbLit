import React from 'react'
import socket from './socket'
import { Presence } from 'phoenix'
// import { List } from 'semantic-ui-react'
import Frog from '../static/images/frog.jpeg'
import '../css/chatPrototype.css'

// 모듈 테스트용 입력 창


class ChatTestModule extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chooseChannel: "",
            channel: "",
            inputMessage: "",
            nickname: "",
            participants: [],
            received: ['', '', '', '', '', '']
        }
    }

    handleNickname(event) {
        this.setState({
            nickname: event.target.value
        })
    }

    handleInputMessageSubmit(event) {
        event.preventDefault();
        this.state.channel.push("new_msg", { body: this.state.inputMessage, nickname: this.state.nickname })
    }

    handleInputMessage(event) {
        this.setState({
            inputMessage: event.target.value
        })
    }

    handleChooseChannelMessage(event) {
        this.setState({
            chooseChannel: event.target.value
        })
    }

    handleChooseChannelSubmit(event) {
        event.preventDefault();
        let presences = {}
        let channelName = "room:" + this.state.chooseChannel
        console.log(channelName)
        if (this.state.channel != "") {
            this.state.channel.leave()
                .receive("ok", () => alert("기존 채널을 떠납니다!"))
        }
        this.setState({
            channel: socket.channel(channelName, { nickname: this.state.nickname })
        }, () => {
            // 이해를 돕기 위한 console.log 분리
            let cur_channel = this.state.channel.join()
            console.log(cur_channel)
            cur_channel
                .receive("ok", response => {
                    console.log("Joined successfully at " + channelName, response)
                    // 채널 입장 성공, Presence에 입장했음을 알림.
                    this.state.channel.on("presence_state", state => {
                        presences = Presence.syncState(presences, state)
                    })
                })
                .receive("error", resp => { console.log("Unable to join", resp) })


            this.state.channel.on("new_msg", payload => {
                // console.log(payload)
                // this.setState({
                //     received: payload['body']
                // })
                let nickname = payload['nickname']
                let msg = payload['body']
                // 오류가 나면 콜백을 넣어야 할 듯?
                if (!this.state.participants.includes(nickname)) {
                    this.setState({
                        participants: this.state.participants.concat(nickname)
                    })
                }

                let find_nickname = (element) => {
                    return element == nickname
                }

                let user_idx = this.state.participants.findIndex(find_nickname)
                console.log(user_idx)
                let modified_received = this.state.received
                modified_received[user_idx] = msg
                this.setState({
                    received: modified_received
                })
            })

        })
    }

    render() {
        return (
            <div id='roomarea'>
                <h2> 닉네임 입력. 반드시 닉네임 먼저 쓰고 아래 두개 할 것.</h2>
                <input
                    className="input"
                    type="text"
                    value={this.state.nickname}
                    onChange={this.handleNickname.bind(this)}
                />
                <form onSubmit={this.handleChooseChannelSubmit.bind(this)}>
                    <h2>채팅방 이름 작성</h2>
                    <input className="input"
                        type="text"
                        value={this.state.chooseChannel}
                        onChange={this.handleChooseChannelMessage.bind(this)}
                    >
                    </input>
                    <button
                        type="submit"
                        value="Submit"
                    >
                        Submit
            </button>
                </form>
                <br />
                <form onSubmit={this.handleInputMessageSubmit.bind(this)}>
                    <h2> 채팅 입력</h2>
                    <input
                        className="input"
                        type="text"
                        value={this.state.inputMessage}
                        onChange={this.handleInputMessage.bind(this)}
                    />
                    <button
                        type="submit"
                        value="Submit"
                    >
                        Submit
                </button>
                </form>
                <br />
                <div className="proto-area">
                    <div className="image-area">
                        <img src={Frog} alt="이미지" />
                    </div>
                    <div className="chat-area">
                        <font className="first-chatter chatting"> 테스트 <br></br> {this.state.received[0]} </font>
                        <font className="second-chatter chatting"> 테스트{this.state.received[1]} </font>
                        <font className="third-chatter chatting"> 테스트{this.state.received[2]} </font>
                        <font className="fourth-chatter chatting"> 테스트{this.state.received[3]} </font>
                        <font className="fifth-chatter chatting"> 테스트{this.state.received[4]} </font>
                    </div>

                </div>
            </div>
        )
    }
}

export default ChatTestModule