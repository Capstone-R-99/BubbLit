import React, { Component } from 'react'
<<<<<<< HEAD
import { Container, Icon } from 'semantic-ui-react'
=======
import { Image } from 'semantic-ui-react'
>>>>>>> #121 방장 표시
import { Rnd } from 'react-rnd'
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';
import { Label } from 'semantic-ui-react'
import '../../css/chatbox.css'
import crown from '../../static/images/crown.png'

function IsOnlineByProps(props) {
    const isOnline = props.isOnline;

    if (isOnline == undefined) {
        return '';
    }

    return isOnline
};

//해야댈거 -> chatmodule에서 chatbox로 필요한거 다 옮기고 연동하고, ref 이용해서 맨 아래로 땡겨주면 ㅇㅋ
export default class ChatBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputMessage: '',
            chatboxInfo: this.props.chatboxInfo,
        }

        this.scrollbarRef = React.createRef();
        console.log('chatboxInfo: ', this.state.chatboxInfo);
    }

    componentDidMount() {
        //console.log('new chatbox rendered!');
        this.handleUpdate();
        this.blurAllMessage();

        this.rnd.updateSize({ width: this.props.chatboxInfo.width, height: this.props.chatboxInfo.height })
        this.rnd.updatePosition({ x: this.props.chatboxInfo.xPos, y: this.props.chatboxInfo.yPos })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.chatboxInfo.width != this.props.chatboxInfo.width ||
            prevProps.chatboxInfo.height != this.props.chatboxInfo.height ||
            prevProps.chatboxInfo.xPos != this.props.chatboxInfo.xPos ||
            prevProps.chatboxInfo.yPos != this.props.chatboxInfo.yPos) {
            console.log("채팅창을 리셋하려 합니다.", this.props.chatboxInfo)
            console.log(this.rnd.size, this.rnd.resize)
            console.log(this.rnd)
            this.rnd.updateSize({ width: this.props.chatboxInfo.width, height: this.props.chatboxInfo.height })
            this.rnd.updatePosition({ x: this.props.chatboxInfo.xPos, y: this.props.chatboxInfo.yPos })
        }

        if (prevProps.contents.length === this.props.contents.length)
            return;
        console.log('chatbox' + this.props.chatboxNo + 'updated!');
        this.handleUpdate();
        this.focusHandler();
        this.blurCurrentSendMessage();
    }

    // blur를 class값을 추가해서 바꿔줫는데 기존 style값을 바꿔줘도 댈듯.. 일단 그냥 놔둠
    blurAllMessage() {
        let timer = setTimeout(function () {
            let messages = document.getElementsByClassName("inner-message");
            for (var message of messages) {
                message.classList.add('blur');
            }
        }.bind(this), 100)
        timer;
    }

    blurCurrentSendMessage() {
        let messages = document.getElementsByClassName(this.getMyBoxClassName(this.props));

        let lastMessage = messages[messages.length - 1];

        let timer = setTimeout(function () {
            lastMessage.classList.add('blur');
        }.bind(this), 13000)

        timer;
    }

    colorChangerByNum(num, element) {
        // num 0~5 -> 채팅창 색상   6 -> white
        let color = ['#B8DEFF', '#B8DEFF', '#B8DEFF', '#B8DEFF', '#B8DEFF', '#B8DEFF', 'rgba(255, 255, 255, 0.8)'];
        element.style.backgroundColor = color[num];
    }

    focusHandler() {
        let element = document.getElementsByClassName("chat-area")[this.props.chatboxNo];
        if (element === undefined) {
            return;
        }
        //console.log(element);
        this.colorChangerByNum(this.props.chatboxNo, element);
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
        if (IsOnlineByProps(param.props)) {
            //return <div>Online</div>;
            return <Label className='is-online' circular color={'green'} empty />
        }
        //return <div>Offline</div>;
        return <Label className='is-online' circular empty />
    }

    getMyBoxClassName(props) {
        return 'chatbox_' + props.chatboxNo;
    }

    render() {
        return (
            <div>
                <Rnd
                    ref={c => { this.rnd = c; }}
                    className={'chatbox ' + (IsOnlineByProps(this.props) ? 'chat-area' : 'chat-area-offline')}
                    bounds='window'
                    //이부분 우선은 이렇게 해둿는데 추후 고민해서 고치자
                    minWidth='100' minHeight='100'
                    maxWidth='800' maxHeight='800'
                    // 지금 그리드 자체에 문제가 있음
                    // resizeGrid={[10, 10]}
                    // dragGrid={[15, 15]}

                    // 아랫부분 동작 원리를 알기위해 장황한 코딩을 했으나, 추후 수정예정임돠
                    onDragStop={(e, d) => {
                        console.log("OnDragStop")
                        e.preventDefault();
                        let tempChatboxInfo = { ...this.state.chatboxInfo };
                        tempChatboxInfo.xPos = d.x;
                        tempChatboxInfo.yPos = d.y;
                        this.setState({ chatboxInfo: tempChatboxInfo });
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        console.log("OnResizeStop")
                        e.preventDefault();
                        let tempChatboxInfo = { ...this.state.chatboxInfo };
                        tempChatboxInfo.width = ref.style.width.slice(0, -2);
                        tempChatboxInfo.height = ref.style.height.slice(0, -2);
                        tempChatboxInfo.xPos = position.x;
                        tempChatboxInfo.yPos = position.y;
                        this.setState({
                            chatboxInfo: tempChatboxInfo
                        });
                    }}
                >
                    <div className='chat-area-contents'>

                        <strong className={this.props.is_my_box ? 'chat-my-name' : 'chat-other-name'}>{this.props.name}</strong>
                        <this.ShowIsOnline props={this.props} />
<<<<<<< HEAD
                        {this.props.is_host && <Icon name='chess king' size='big' color='yellow' />}
=======
                        {this.props.is_host && <Image avatar src={crown} style={{ width: '1em', height: '1em', marginBottom: '3px' }} />}
>>>>>>> #121 방장 표시
                        <Scrollbars
                            renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{ display: "none" }} />}
                            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{ display: "none" }} />}
                            className='scrollbar'
                            ref={this.scrollbarRef}
                            autoHide={true}
                            style={{ height: this.state.chatboxInfo.height - 42 }}>
                            <div>
                                {this.props.contents.map((msg, i) => {
                                    return <div
                                        className={'inner-message ' + this.getMyBoxClassName(this.props)}
                                        key={i}
                                        style={{ backgroundColor: '#FFFFFF', width: this.state.chatboxInfo.width }}
                                    >
                                        {msg.content}
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
