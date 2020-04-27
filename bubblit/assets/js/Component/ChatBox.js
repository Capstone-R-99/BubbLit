import React, { Component } from 'react'
import { Divider, Input, Button, Icon, Form } from 'semantic-ui-react'
import { Rnd } from "react-rnd"
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';
import '../../css/chatModule.css'

export default class ChatBox extends Component {
    render() {
        return (
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
}
}