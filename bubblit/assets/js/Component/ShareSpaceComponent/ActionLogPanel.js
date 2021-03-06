import React, { Component } from 'react';
import { Button, Comment, Form, Header, Dropdown, Grid, List } from 'semantic-ui-react'
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';

export default class ActionLogPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showByUser: 'all',
            showByType: 'all',
            typeOption: [
                { text: 'ALL', value: 'all' },
                { text: '설정', value: 'control' },
                { text: '미디어', value: 'media' },
                { text: '이미지', value: 'img' },
            ]
        }

        this.scrollbarRef = React.createRef();
    }

    handleUpdate() {
        if (this.scrollbarRef.current === null)
            return
        else {
            this.scrollbarRef.current.scrollToBottom();
        }
    }

    componentDidMount() {
        this.handleUpdate();
    }

    componentDidUpdate(precProps, prevState) {
        this.handleUpdate();
    }

    MakeActionDescription(name, type, param) {
        //JS는 갓언어라 String format이 없다.
        switch (type) {
            case "img_refreshed":
                return <div>{"이미지를 공유하였습니다"} <a href={"api/room/get_image/" + param} target="_blank">보기</a> </div>;
            case "media_link":
                return "" + param + " 미디어를 공유하였습니다.";
            case "media_share_time":
                return "미디어 재생시간을" + parseFloat(param).toFixed(2) + "로 변경하였습니다.";
            case "media_is_play":
                if (param == "false") {
                    return "미디어를 멈췄습니다.";
                }
                else {
                    return "미디어를 재생했습니다.";
                }
            case "restrict_control":
                if (param == "false") {
                    return "방의 기능 제한을 해제했습니다.";
                }
                else {
                    return "방의 기능을 제한했습니다.";
                }
            case "custom_link":
                return <div>{"커스텀 링크를 공유하였습니다."} <a href={param} target="_blank">보기</a></div>;

        }

        return name + type + param
    }

    historyRenderer() {
        let contents = [];
        let roomInfo = this.props.roomInfo

        let showtype = this.state.showByType
        if (this.props.history == undefined ||
            roomInfo.users === undefined
        ) {
            return [];
        }

        //foreach에서 쓰기 위해서임. JS는 짱이야.
        let self = this;

        this.props.history.forEach(function (item, index, array) {
            if (roomInfo.users[item.user_id] == undefined)
                return true;

            if ((item.type.indexOf(showtype) == -1) && (showtype != 'all'))
                return true;

            if (item.type === 'media_current_time')
                return true;

            let name = roomInfo.users[item.user_id].name
            let time = new Date(item.inserted_at)
            let timeStr = time.toLocaleTimeString(navigator.language, { hour12: false, hour: '2-digit', minute: '2-digit' });
            // // console.log(item.inserted_at, "->", timeStr)

            contents.push(
                <Comment key={index}>
                    <Comment.Content>
                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Author title={time.toString()}>{name} {timeStr}</Comment.Author>
                        <Comment.Text>{self.MakeActionDescription(name, item.type, item.param)}</Comment.Text>
                    </Comment.Content>
                </Comment>
            );
        })
        return contents.reverse();
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
        // console.log(this.state);
    }


    render() {
        return (
            < div >
                <Form style={{ marginBottom: 3 }}>
                    <Form.Field>
                        <Dropdown
                            selection
                            name='showByType'
                            placeholder='확인할 액션타입을 선택하세요'
                            options={this.state.typeOption}
                            onChange={this.handleChange}
                        >
                        </Dropdown>
                    </Form.Field>
                </Form>
                <Scrollbars
                    autoHide={true}
                    ref={this.scrollbarRef}
                    style={{ height: window.innerHeight * 0.7 }}
                >
                    <Comment.Group>
                        {this.historyRenderer()}
                    </Comment.Group>
                </Scrollbars>
            </div >
        );
    }
}