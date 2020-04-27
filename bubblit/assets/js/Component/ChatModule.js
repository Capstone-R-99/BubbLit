import React, { Component } from 'react'
import { Divider, Input, Button, Icon, Form } from 'semantic-ui-react'
import { Rnd } from "react-rnd"
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';
import '../../css/chatModule.css'

export default class ChatModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 방에 나갓다 들어와도 커스텀값이 유지되도록 state로 빼봣음, store로 옮기거나, 수정예정
            width: [400, 400, 400, 400, 400, 400],
            height: [250, 250, 250, 250, 250, 250],
            x: [0, 450, 0, 450, 0, 450],
            y: [0, 0, 300, 300, 600, 600],
            inputMessage: '',
        }
        console.log('channelInitializer called');
        this.channelInitializer();
        this.scrollbarRef = React.createRef();
    }

    channelInitializer() {
        let joined = this.props.channel.join();
        // join 할때 처리
        joined
            .receive('ok', response => {
                alert('channel join!');
                console.log(response);
                console.log('joined successfully at ' + response)
                // bubble_history 받을때 처리
                this.props.channel.on('bubble_history', payload => {
                    var changes = { 'participants': this.props.participants, 'contents': { ...this.props.contents } };
                    console.log(payload);
                    payload.history.reverse().forEach(history => {
                        let user_id = history['user_id'];
                        let msg = history['content'];
                        changes = this.addMessageInChanges(changes, user_id, msg);
                    })
                    //여기에서 보내는 함수 호출함
                    this.props.sendChanges(changes);
                })
            })
            .receive('error', response => { console.log('Unable to join', response) })
        // new_msg 받을때 처리
        this.props.channel.on("new_msg", payload => {
            var changes = { 'participants': this.props.participants, 'contents': { ...this.props.contents } };
            let user_id = payload['user_id'];
            let msg = payload['body'];
            changes = this.addMessageInChanges(changes, user_id, msg);
            this.props.sendChanges(changes);
        })
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

        let user_idx = changes.participants.findIndex(find_user_id)
        let modified_contents = changes.contents;
        if (modified_contents[user_idx].length >= 5) {
            //스크롤바 테스트를 위해 잠시 지워둠
            //modified_contents[user_idx].shift();
        }

        changes.contents[user_idx] = modified_contents[user_idx].concat(msg)

        return changes
    }


    chatboxRenderer() {
        var message = [];
        var classNames = this.props.participants;
        for (var i = 0; i < classNames.length; i++) {
            let temp = i;
            //classNames.forEach(name => {
            message.push(
                <Rnd className='chatarea'
                    size={{ width: this.state.width[temp], height: this.state.height[temp] }}
                    minWidth='200' minHeight='200'
                    maxWidth='800' maxHeight='500'
                    position={{ x: this.state.x[temp], y: this.state.y[temp] }}
                    // 지금 그리드 자체에 문제가 있음
                    // resizeGrid={[10, 10]}
                    // dragGrid={[15, 15]}

                    // 아랫부분 동작 원리를 알기위해 장황한 코딩을 했으나, 추후 수정예정임돠
                    onDragStop={(e, d) => {
                        var tempx = this.state.x;
                        var tempy = this.state.y;
                        tempx[temp] = d.x;
                        tempy[temp] = d.y;
                        this.setState({ x: tempx, y: tempy });
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        var tempw = this.state.width;
                        var temph = this.state.height;
                        var tempx = this.state.x;
                        var tempy = this.state.y;
                        tempw[temp] = ref.style.width.slice(0, -2);
                        temph[temp] = ref.style.height.slice(0, -2);
                        tempx[temp] = position.x;
                        tempy[temp] = position.y;
                        this.setState({
                            width: tempw,
                            height: temph,
                            x: tempx,
                            y: tempy
                        });
                    }}
                >
                    <div className='general'>
                        <h2>user_id: {i}</h2>
                        <Scrollbars
                            className='scrollbar'
                            ref={this.scrollbarRef}
                            onUpdate={this.handleUpdate.bind(this)}
                            //onUpdate={() => {
                            //this.scrollBar.scrollToBottom();
                            //const scrollbar = document.getElementsByClassName('scrollbar');
                            //console.log(scrollbar[temp]);
                            //scrollbar[temp].scrollTop(100);
                            //scrollbar[temp].scrollbar.scrollToBottom();
                            //}}
                            style={{ width: this.state.width[temp] - 10, height: this.state.height[temp] - 50 }}>
                            {this.props.contents[temp].map((msg, i) => {
                                return <div className='message' key={i}>{msg}<br></br></div>
                            })}
                        </Scrollbars>
                    </div>
                </Rnd >
            )
        }
        return message
    }
    handleUpdate() {
        console.log(this.scrollbarRef.current.scrollToBottom());
        //this.scrollbarRef.scrollbar.scrollToBottom()
    }
    sendChat() {
        if (this.state.inputMessage == '')
            return
        this.props.sendChat(this.props.channel, this.state.inputMessage);
        this.setState({
            inputMessage: ''
        })
    }

    handleInputMessage(event) {
        this.setState({
            inputMessage: event.target.value
        })
    }

    render() {

        return (
            <div>
                {this.chatboxRenderer()}
                <div>
                    <Rnd enableResizing='false' size={{ width: '400', height: '30' }}>
                        <Form onSubmit={function (e, data) { this.sendChat() }.bind(this)}>
                            <Form.Input
                                action={{ icon: 'chat' }}
                                placeholder='drag here to move inputspace!!'
                                value={this.state.inputMessage}
                                onChange={this.handleInputMessage.bind(this)}
                            ></Form.Input>
                        </Form>
                        <Button onClick={function (e, data) {
                            this.props.exitRoom(this.props.channel);
                        }.bind(this)}
                        >Exit Room</Button>
                    </Rnd>
                </div>
            </div>
        )
    }
}