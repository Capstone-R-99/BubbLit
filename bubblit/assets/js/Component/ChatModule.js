import React, { Component } from 'react'
import { Divider, Input, Button, Icon, Form } from 'semantic-ui-react'
import { Rnd } from "react-rnd"
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';
import ChatBox from './ChatBox'
import '../../css/chatModule.css'
import { Link } from 'react-router-dom';
import { Presence } from "phoenix"

export default class ChatModule extends Component {
    constructor(props) {
        super(props);
        console.log("chatmodule width, height", window.innerWidth, window.innerHeight)
        this.state = {
            // 방에 나갓다 들어와도 커스텀값이 유지되도록 state로 빼봣음, store로 옮기거나, 수정예정
            width: [400, 400, 400, 400, 400, 400],
            height: [250, 250, 250, 250, 250, 250],
            x: [0, 450, 0, 450, 0, 450],
            y: [0, 0, 300, 300, 600, 600],
            inputMessage: '',
            chatInputboxX: window.innerWidth * 0.4,
            chatInputboxY: window.innerHeight * 0.8,
            presences: {}
        }
        console.log('channelInitializer called');
        this.channelInitializer();
        this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this)
        this.chatInput = React.createRef()
    }

    channelInitializer() {
        let joined = this.props.channel.join();
        // join 할때 처리
        joined
            .receive('ok', response => {
                console.log(response);
                console.log('joined successfully at ' + response)
                // bubble_history 받을때 처리
                this.props.channel.on('room_after_join', payload => {
                    var changes = { 'participants': payload.room_users, 'contents': { ...this.props.contents } };
                    console.log('room_after_join', payload);
                    payload.bubble_history.reverse().forEach(history => {
                        let user_id = history['user_id'];
                        let msg = history['content'];
                        this.addMessageInChanges(changes, user_id, msg);
                    })

                    changes['users'] = payload.users;
                    this.props.sendChanges(changes);

                    //Users도 같이 들어가있는 room_after_join의 Payload를 그대로 넣고 있음.
                    //History를 구별해서 넣어야 한다.
                    //Tab History도 추후에 같이 저장해얌으로 더더욱...
                    this.props.setHistory(payload);
                })
                this.props.channel.on('user_join', payload => {
                    console.log('user_join', payload);
                    var changes = { 'participants': this.props.participants, 'contents': { ...this.props.contents }, 'users': { ...this.props.users } };
                    changes['users'][payload.user_id] = { id: payload.user_id, name: payload.user_name };
                    this.addMessageInChanges(changes, payload.user_id, null);
                    this.props.sendChanges(changes);
                })
                this.props.channel.on("new_msg", payload => {
                    var changes = { 'participants': this.props.participants, 'contents': { ...this.props.contents }, 'users': this.props.users };
                    let user_id = payload['user_id'];
                    let msg = payload['body'];
                    this.addMessageInChanges(changes, user_id, msg);
                    this.props.sendChanges(changes);

                    //새 메세지를 받을때마다 history state update
                    let history_payload = { id: this.props.history.bubble_history.length + 1, content: payload.body, user_id: payload.user_id, inserted_at: payload.inserted_at };
                    let new_history = { ...this.props.history };
                    new_history.bubble_history = new_history.bubble_history.concat(history_payload);
                    this.props.appendHistory(new_history);
                })

                this.props.channel.on("presence_state", state => {
                    this.state.presences = Presence.syncState(this.state.presences, state)
                    console.log("presence_state", this.state.presences)
                })

                this.props.channel.on("presence_diff", diff => {
                    this.state.presences = Presence.syncDiff(this.state.presences, diff)
                    console.log("presence_diff", this.state.presences)
                })
            })
            .receive('error', response => { console.log('Unable to join', response) })
        // new_msg 받을때 처리
        //this.props.channel.push('new_msg', { body: '테스트 메세지임니담', nickname: 'tester' });
    }

    // chatTestModule 함수 가져와서 사용
    addMessageInChanges(changes, user_id, msg) {
        let notInChanges = (changes.hasOwnProperty('participants') && (changes['participants'].includes(user_id)) == false);
        if (notInChanges) {
            changes.participants = changes.participants.concat(user_id)
        }

        let find_user_id = (element) => {
            return element == user_id
        }

        if (msg == null) {
            return;
        }
        // if (modified_contents[user_idx].length >= 5) {
        //     //스크롤바 테스트를 위해 잠시 지워둠
        //     //modified_contents[user_idx].shift();
        // }

        let user_idx = changes.participants.findIndex(find_user_id)
        let modified_contents = changes.contents;
        changes.contents[user_idx] = modified_contents[user_idx].concat(msg)
    }


    chatboxRenderer() {
        var message = [];
        var participant = this.props.participants;
        for (var i = 0; i < participant.length; i++) {
            let temp = i;
            let user_id = participant[i];
            let user = this.props.users[user_id];
            message.push(
                <ChatBox key={i} temp={temp} name={user.name} contents={this.props.contents}></ChatBox>
            )
        }
        return message
    }

    sendChat() {
        if (this.state.inputMessage == '')
            return
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
        this.props.exitRoom(this.props.channel)
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
                        position={{ x: this.state.chatInputboxX, y: this.state.chatInputboxY }}
                        onDragStop={(e, d) => {
                            this.setState({ chatInputboxX: d.x, chatInputboxY: d.y });
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
                                    <Button type='submit'>Chat</Button>
                                    <Link to="/"><Button>Exit Room</Button></Link>
                                </Form.Field>
                            </Form.Group>

                        </Form>

                    </Rnd>
                </div>
            </div>
        )
    }
}