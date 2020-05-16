import React, { Component } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import { Scrollbars, scrollToBottom } from 'react-custom-scrollbars';

export default class LogPanel extends Component {
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
        if (this.props.history.bubble_history == undefined) {
            return [];
        }
        if (this.props.users === undefined) {
            return [];
        }
        this.props.history.bubble_history.forEach(element => {
            contents.push(
                <Comment key={element.id}>
                    <Comment.Content>
                        <Comment.Author as='a'>{this.props.users[element.user_id].name}</Comment.Author>
                        <Comment.Metadata>
                            <div>{element.inserted_at}</div>
                        </Comment.Metadata>
                        <Comment.Text>{element.content}</Comment.Text>
                    </Comment.Content>
                </Comment>
            );
        })
        return contents;
    }

    render() {
        // console.log("logpanel's history: ", this.props.history.bubble_history);
        // console.log('in history users: ', this.props.users);
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