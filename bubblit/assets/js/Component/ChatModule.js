import React, { Component } from 'react'
import { Divider, Input, Button, Icon, Form, Segment } from 'semantic-ui-react'
import { Rnd } from "react-rnd"
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';
import ChatBox from './ChatBox'
import '../../css/chatModule.css'
import { Link } from 'react-router-dom';

//const DEF_CHATBOX_POS = { x: [0, 450, 0, 450, 0, 450], y: [0, 0, 300, 300, 600, 600] }
const INPUTSPACE_RELATIVE_POS = { x: 0, y: 0.8 };

const DEF_CHATBOX_WIDTH = window.innerWidth * 0.2;
const DEF_CHATBOX_HEIGHT = window.innerHeight * 0.25;
const DEF_CHATBOX_INTERVAL = {
    x: DEF_CHATBOX_WIDTH + 50,
    y: DEF_CHATBOX_HEIGHT + 20
};
const CHATBOX_LEFT_PADDING = 10;
const CHATBOX_TOP_PADDING = 10;
const WIDTH = [DEF_CHATBOX_WIDTH, DEF_CHATBOX_WIDTH, DEF_CHATBOX_WIDTH, DEF_CHATBOX_WIDTH, DEF_CHATBOX_WIDTH, DEF_CHATBOX_WIDTH];
const HEIGHT = [DEF_CHATBOX_HEIGHT, DEF_CHATBOX_HEIGHT, DEF_CHATBOX_HEIGHT, DEF_CHATBOX_HEIGHT, DEF_CHATBOX_HEIGHT, DEF_CHATBOX_HEIGHT];
const XPOS = [CHATBOX_LEFT_PADDING, DEF_CHATBOX_INTERVAL.x, CHATBOX_LEFT_PADDING, DEF_CHATBOX_INTERVAL.x, CHATBOX_LEFT_PADDING, DEF_CHATBOX_INTERVAL.x];
const YPOS = [CHATBOX_TOP_PADDING, CHATBOX_TOP_PADDING, DEF_CHATBOX_INTERVAL.y, DEF_CHATBOX_INTERVAL.y, DEF_CHATBOX_INTERVAL.y * 2, DEF_CHATBOX_INTERVAL.y * 2];


export default class ChatModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMessage: '',
            inputspacePosX: window.innerWidth * INPUTSPACE_RELATIVE_POS.x,
            inputspacePosY: window.innerHeight * INPUTSPACE_RELATIVE_POS.y,
            presences: {},

            // 채팅박스 위치, 가로 세로 길이, 보기 잦같은데 이거 어캐해야댈지 생각한뒤에 다시바꿈
            chatboxInfo: {
                0: { width: WIDTH[0], height: HEIGHT[0], xPos: XPOS[0], yPos: YPOS[0] },
                1: { width: WIDTH[1], height: HEIGHT[1], xPos: XPOS[1], yPos: YPOS[1] },
                2: { width: WIDTH[2], height: HEIGHT[2], xPos: XPOS[2], yPos: YPOS[2] },
                3: { width: WIDTH[3], height: HEIGHT[3], xPos: XPOS[3], yPos: YPOS[3] },
                4: { width: WIDTH[4], height: HEIGHT[4], xPos: XPOS[4], yPos: YPOS[4] },
                5: { width: WIDTH[5], height: HEIGHT[5], xPos: XPOS[5], yPos: YPOS[5] },
            }
        }

        this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this)
        this.chatInput = React.createRef()
    }


    chatboxRenderer() {
        var myName = document.getElementById('current-username').innerHTML
        var message = [];
        if (this.props.roomInfo === undefined) {
            return <p>Loading...</p>
        }

        for (var i = 0; i < this.props.roomInfo.room_users.length; i++) {
            let user_id = this.props.roomInfo.room_users[i];
            let user_info = this.props.roomInfo.users[user_id];
            let user_bubble_history = this.props.roomInfo.bubble_history[user_id]
            user_bubble_history = user_bubble_history == undefined ? [] : user_bubble_history

            message.push(
                <ChatBox
                    isOnline={user_id in this.state.presences}
                    is_my_box={myName == user_info.name}
                    key={i} name={user_info.name}
                    chatboxInfo={this.state.chatboxInfo[i]}
                    chatboxNo={i}
                    contents={user_bubble_history} >
                </ChatBox >
            )
        }

        return message
    }

    sendChat() {
        if (this.state.inputMessage == '') {
            return;
        }

        this.props.sendChat(this.props.channel, this.state.inputMessage);
        this.setState({
            ...this.state,
            inputMessage: ''
        })
    }

    handleInputMessage(event) {
        this.setState({
            ...this.state,
            inputMessage: event.target.value
        })
    }
    /*
    엔터키 입력시에 자동으로 채팅창으로 가도록 eventhandler를 추가함.
    다른 페이지 갈 때(채팅창이 화면에서 사라질 때) 엔터키를 입력받는 handler를 제거함.  */

    componentDidMount() {
        document.addEventListener('keydown', this.handleEnterKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleEnterKeyPress);
    }


    handleEnterKeyPress(e) {
        // e.keycode는 deprecated되었음.
        if (e.key === "Enter") {
            this.chatInput.current.focus()
        }
    }

    render() {
        /*
        Enter 키로 상호작용하려면 ref를 추가해야 함. 그런데, Form.Input은 functional한 컴포넌트라 ref를 추가할수 없음.
        따라서, Form.Input을 Form과 input으로 분리함.
        @참고 : https://stackoverflow.com/questions/53420516/react-ref-binding-results-in-typeerror-cannot-read-property-focus-of-null
     
        채팅 입력창 위치의 경우, 해당 div 안에서만 최초 위치 설정이 가능함. 따라서 div 설정을 먼저 해야 제대로 옮길 수 있을 거고, 현재는 구석에 뒀음.
        */
        return (
            <div>
                {this.chatboxRenderer()}
                <div>
                    <Rnd enableResizing="False"
                        size={{ width: '400', height: '30' }}
                        bounds='window'
                        position={{ x: this.state.inputspacePosX, y: this.state.inputspacePosY }}
                        onDragStop={(e, d) => {
                            this.setState({ inputspacePosX: d.x, inputspacePosY: d.y });
                        }}>
                        <Form onSubmit={function (e, data) { this.sendChat() }.bind(this)}>
                            <Form.Group>
                                <Form.Field>
                                    <input
                                        ref={this.chatInput}
                                        placeholder='drag here to move inputspace!!'
                                        value={this.state.inputMessage}
                                        onChange={this.handleInputMessage.bind(this)}
                                    />
                                    <Button color='grey' type='submit'>Chat</Button>
                                    <Link to="/"><Button secondary>Exit Room</Button></Link>
                                </Form.Field>
                            </Form.Group>

                        </Form>
                    </Rnd>
                </div>
            </div >
        )
    }
}
