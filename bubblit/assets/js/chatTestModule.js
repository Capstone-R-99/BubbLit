import React from 'react'
import socket from './socket'
import { Presence } from 'phoenix'
// import { List } from 'semantic-ui-react'
import Cat from '../static/images/cat.jpg'
import '../css/chatPrototype.css'

// 모듈 테스트용 입력 창


class ChatTestModule extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chooseChannel: "",
            channel: "",
            inputMessage: "",
            participants: [],
            received: [[], [], [], [], [], []]
        }
    }

    handleInputMessageSubmit(event) {
        event.preventDefault();
        if (this.state.inputMessage == "") {
            return
        }
        this.state.channel.push("new_msg", { body: this.state.inputMessage })
        this.setState({
            inputMessage: ""
        })
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
            channel: socket.channel(channelName)
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
                    this.state.channel.on("bubble_history", resp => {
                        console.log("버블히스토리납시오")
                        console.dir(resp.history)
                    })
                })
                .receive("error", resp => { console.log("Unable to join", resp) })


            this.state.channel.on("new_msg", payload => {
                // console.log(payload)
                // this.setState({
                //     received: payload['body']
                // })

                var changes = { 'participants': this.state.participants, 'received': this.state.received }

                let user_id = payload['user_id']
                let msg = payload['body']

                changes = this.addNewMessageToChangesInplace(this.state, user_id, msg)

                this.setState(changes)
            })

        })

    }
    addNewMessageToChangesInplace(changes, user_id, msg) {
        let notInChanges = (changes.hasOwnProperty('participants') && changes['participants'].includes(user_id)) == false;
        if (notInChanges) {
            changes.participants = changes.participants.concat(user_id)
        }

        let find_user_id = (element) => {
            return element == user_id
        }

        let user_idx = changes.participants.findIndex(find_user_id)
        let modified_received = changes.received
        if (modified_received[user_idx].length >= 5) {
            modified_received[user_idx].shift();
        }

        changes.received[user_idx] = modified_received[user_idx].concat(msg)

        return changes
    }
    render() {
        return (
            <div className='roomarea'>
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
                        <img src={Cat} alt="이미지" />
                    </div>
                    <div className="chat-area">
                        <div className="first-chatter chatting">
                            <h3>{this.state.participants[0]}</h3>
                            {this.state.received[0].map((msg, i) => {
                                return <font key={i}>{msg}<br></br></font>
                            })} </div>
                        <div className="second-chatter chatting">
                            <h3>{this.state.participants[1]}</h3>
                            {this.state.received[1].map((msg, i) => {
                                return <font key={i}>{msg}<br></br></font>
                            })} </div>
                        <div className="third-chatter chatting">
                            <h3>{this.state.participants[2]}</h3>
                            {this.state.received[2].map((msg, i) => {
                                return <font key={i}>{msg}<br></br></font>
                            })} </div>

                        <div className="fourth-chatter chatting">
                            <h3>{this.state.participants[3]}</h3>
                            {this.state.received[3].map((msg, i) => {
                                return <font key={i}>{msg}<br></br></font>
                            })} </div>
                        <div className="fifth-chatter chatting">
                            <h3>{this.state.participants[4]}</h3>
                            {this.state.received[4].map((msg, i) => {
                                return <font key={i}>{msg}<br></br></font>
                            })} </div>
                    </div >

                </div >
            </div >
        )
    }
}

export default ChatTestModule