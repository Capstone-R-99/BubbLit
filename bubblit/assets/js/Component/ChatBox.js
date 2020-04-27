import React, { Component } from 'react'
import { Divider, Input, Button, Icon, Form } from 'semantic-ui-react'
import { Rnd } from "react-rnd"
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

    handleUpdate() {
        //console.log(this.scrollbarRef.current.scrollToBottom());
        this.scrollbarRef.current.scrollToBottom()
        //this.scrollBar.scrollToBottom()
        //this.scrollbarRef.scrollbar.scrollToBottom()
    }

    render() {
        return (
            <div>
                <Rnd className='chatarea'
                    size={{ width: this.state.width[this.props.temp], height: this.state.height[this.props.temp] }}
                    minWidth='200' minHeight='200'
                    maxWidth='800' maxHeight='500'
                    position={{ x: this.state.x[this.props.temp], y: this.state.y[this.props.temp] }}
                    // 지금 그리드 자체에 문제가 있음
                    // resizeGrid={[10, 10]}
                    // dragGrid={[15, 15]}

                    // 아랫부분 동작 원리를 알기위해 장황한 코딩을 했으나, 추후 수정예정임돠
                    onDragStop={(e, d) => {
                        var tempx = this.state.x;
                        var tempy = this.state.y;
                        tempx[this.props.temp] = d.x;
                        tempy[this.props.temp] = d.y;
                        this.setState({ x: tempx, y: tempy });
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
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
                    <div className='general'>
                        <h2>user_id: {this.props.temp}</h2>
                        <Scrollbars
                            className='scrollbar'
                            ref={this.scrollbarRef}
                            onUpdate={this.handleUpdate.bind(this)}
                            //onUpdate={() => {
                            //this.scrollBar.scrollToBottom();
                            //const scrollbar = document.getElementsByClassName('scrollbar');
                            //console.log(scrollbar[this.props.temp]);
                            //scrollbar[this.props.temp].scrollTop(100);
                            //scrollbar[this.props.temp].scrollbar.scrollToBottom();
                            //}}
                            style={{ height: this.state.height[this.props.temp] - 50 }}>
                            {this.props.contents[this.props.temp].map((msg, i) => {
                                return <div className='message' key={i}>{msg}<br></br></div>
                            })}
                        </Scrollbars>
                    </div>
                </Rnd >
            </div>
        )
    }
}
