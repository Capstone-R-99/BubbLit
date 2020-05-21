import React, { Component } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';

export default class ActionLogPanel extends Component {
    constructor(props) {
        super(props);
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

    historyRenderer() {
        let contents = [];
        if (this.props.history == undefined ||
            this.props.roomInfo.users === undefined
        ) {
            return [];
        }
        this.props.history.forEach(function (item, index, array) {
            contents.push(
                <div key={index}>
                    <p>{item.user_id} {item.type} {item.param}</p>
                </div>
            );
        })
        return contents;
    }

    render() {
        return (
            < div >
                <Scrollbars
                    autoHide={true}
                    ref={this.scrollbarRef}
                    style={{ height: window.innerHeight * 0.8 }}
                >
                    <Comment.Group>
                        {this.historyRenderer()}
                    </Comment.Group>
                </Scrollbars>
            </div >
        );
    }
}