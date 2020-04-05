import React from 'react'
import socket from './socket'

// 모듈 테스트용 입력 창


class ChatTestModule extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chooseChannel: "",
            channel: "",
            inputMessage: ""
        }
    }

    // componentDidMount() {
    //     let channel = socket.channel("room:myroom", {})
    //     channel.join()
    //         .receive("ok", resp => { console.log("Joined successfully", resp) })
    //         .receive("error", resp => { console.log("Unable to join", resp) })
    // }

    handleInputMessageSubmit(event) {
        event.preventDefault();
        this.state.channel.push("new_msg", { body: this.state.inputMessage })
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
        let channelName = "room:" + this.state.chooseChannel
        console.log(channelName)
        this.setState({
            channel: socket.channel(channelName)
        }, () => {
            this.state.channel.join()
                .receive("ok", response => { console.log("Joined successfully at " + channelName, response) })
            this.state.channel.on("new_msg", payload => {
                console.log(payload);
            })
        })
    }

    render() {
        return (
            <div id='roomarea'>
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
                <form onSubmit={this.handleSubmit.bind(this)}>
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
                <font>{this.state.received}</font>
            </div>
        )
    }
}

export default ChatTestModule