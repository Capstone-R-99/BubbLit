import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { Rnd } from 'react-rnd'
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';
import '../../css/chatModule.css'

//해야댈거 -> chatmodule에서 chatbox로 필요한거 다 옮기고 연동하고, ref 이용해서 맨 아래로 땡겨주면 ㅇㅋ
export default class ChatBox extends Component {
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
        this.scrollbarRef = React.createRef();
    }

    componentDidMount() {
        //console.log('new chatbox rendered!');
        this.handleUpdate();
        this.blurAllMessage();
    }

    addAllLength(contents) {
        let sum = 0;
        for (var cont in contents) {
            sum += contents[cont];
        }
        return sum
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.addAllLength(prevProps.contents[this.props.temp])
            === this.addAllLength(this.props.contents[this.props.temp]))
            return;
        console.log('chatbox' + this.props.temp + 'updated!');
        this.handleUpdate();
        this.focusHandler();
        this.blurCurrentSendMessage();
    }

    // blur를 class값을 추가해서 바꿔줫는데 기존 style값을 바꿔줘도 댈듯.. 일단 그냥 놔둠
    blurAllMessage() {
        let timer = setTimeout(function () {
            let messages = document.getElementsByClassName("message");
            for (var message of messages) {
                message.classList.add('blur');
            }
        }.bind(this), 100)
        timer;
    }

    blurCurrentSendMessage() {
        let messages = document.getElementsByClassName("message");
        let lastIdx = this.props.contents[this.props.temp].length - 1;

        console.log(messages);
        console.log(this.props.temp);
        for (let i = 0; i < this.props.temp; i++) {
            lastIdx += this.props.contents[i].length
        }

        let lastMessage = messages[lastIdx];


        let timer = setTimeout(function () {
            lastMessage.classList.add('blur');
        }.bind(this), 13000)
        timer;
        //if (this.state.isTimerRunning == true)
        //    clearTimeout(timer);
        //this.setState({ isTimerRunning: true });


        //let messages = document.getElementsByClassName("message");
        //let lastMessage = messages[messages.length - 1];
        //lastMessage.classList.add('blur');

        //let messages = document.getElementsByClassName("message");
        //for (var message of messages) {
        //    message.classList.add('blur');
        //}
    }

    colorChangerByNum(num, element) {
        // num 0~5 -> 채팅창 색상   6 -> white
        let color = ['#F5A9A9', '#F2F5A9', '#A9F5A9', '#CEE3F6', '#F6CEEC', '#E6E6E6', '#FFFFFF'];
        element.style.backgroundColor = color[num];
    }

    focusHandler() {
        let element = document.getElementsByClassName("chatarea")[this.props.temp];
        //console.log(element);
        this.colorChangerByNum(this.props.temp, element);
        setTimeout(function () {
            this.colorChangerByNum(6, element);
        }.bind(this), 300)
    }

    handleUpdate() {
        if (this.scrollbarRef.current === null)
            return
        else {
            this.scrollbarRef.current.scrollToBottom();
        }
    }

    ShowIsOnline(param) {
        const isOnline = param.props.isOnline;
        console.log("isOnline", isOnline)
        if (isOnline == undefined) {
            return "";
        }
        if (isOnline) {
            return <p>Online</p>;
        }
        return <p>Offline</p>;
    }

    render() {
        return (
            <div>
                <Rnd
                    className='chatarea'
                    bounds='window'
                    style={{ backgroundColor: '#FFFFFF', paddingLeft: '2', paddingRight: '2' }}
                    size={{ width: this.state.width[this.props.temp], height: this.state.height[this.props.temp] }}
                    minWidth='200' minHeight='200'
                    maxWidth='800' maxHeight='500'
                    position={{ x: this.state.x[this.props.temp], y: this.state.y[this.props.temp] }}
                    // 지금 그리드 자체에 문제가 있음
                    // resizeGrid={[10, 10]}
                    // dragGrid={[15, 15]}

                    // 아랫부분 동작 원리를 알기위해 장황한 코딩을 했으나, 추후 수정예정임돠
                    onDragStop={(e, d) => {
                        e.preventDefault();
                        var tempx = this.state.x;
                        var tempy = this.state.y;
                        tempx[this.props.temp] = d.x;
                        tempy[this.props.temp] = d.y;
                        this.setState({ x: tempx, y: tempy });
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        e.preventDefault();
                        var tempw = this.state.width;
                        var temph = this.state.height;
                        var tempx = this.state.x;
                        var tempy = this.state.y;
                        tempw[this.props.temp] = ref.style.width.slice(0, -2);
                        temph[this.props.temp] = ref.style.height.slice(0, -2);
                        tempx[this.props.temp] = position.x;
                        tempy[this.props.temp] = position.y;
                        this.setState({
                            width: tempw,
                            height: temph,
                            x: tempx,
                            y: tempy
                        });
                    }}
                >
                    <div className='general'
                        style={{ marginLeft: 10 }}>
                        <strong>{this.props.name}</strong>
                        <this.ShowIsOnline props={this.props} />
                        <Scrollbars
                            className='scrollbar'
                            ref={this.scrollbarRef}
                            autoHide={true}
                            style={{ height: this.state.height[this.props.temp] - 42 }}>
                            <div style={{ marginTop: 20 }}>
                                {this.props.contents[this.props.temp].map((msg, i) => {
                                    return <div
                                        key={i}
                                        style={{ marginTop: 0, marginLeft: 0, marginRight: 10, marginBottom: 0, padding: 0, backgroundColor: '#FFFFFF' }}
                                        className='message'>
                                        {msg}
                                    </div>
                                })}
                            </div>
                        </Scrollbars>
                    </div>
                </Rnd >
            </div >
        )
    }
}
