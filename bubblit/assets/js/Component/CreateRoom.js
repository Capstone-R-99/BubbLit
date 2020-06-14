import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import axios from 'axios'
import { withAlert } from "react-alert";

class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMessage: '',
            isPrivate: false
        }
    }

    makeRoom() {
        var self = this
        console.log(this.state.inputMessage);
        axios.post('/api/room/make', {
            title: this.state.inputMessage,
            is_private: this.state.isPrivate
        }).then(function (response) {
            self.props.alert.show("방 생성에 성공했습니다!")
            // window.location.reload(false);
        }).catch(function (error) {
            console.log(error);
        });
    }


    handleInputMessage(event) {
        this.setState({
            inputMessage: event.target.value
        })
    }

    togglePrivate() {
        this.setState({
            isPrivate: !this.state.isPrivate
        })
    }

    render() {
        return (
            <div>
                <Form onSubmit={function (e, data) { this.makeRoom() }.bind(this)}>
                    <Form.Input
                        label='방 이름'
                        size='large'
                        action={{ icon: 'send', color: 'blue' }}
                        placeholder='enter your room name!'
                        value={this.state.inputMessage}
                        onChange={this.handleInputMessage.bind(this)}
                    ></Form.Input>
                    <Form.Group inline>
                        <label>비밀 코드 생성?</label>
                        <Form.Checkbox
                            type='checkBox'
                            label='넹'
                            value='sm'
                            checked={this.state.isPrivate}
                            onChange={this.togglePrivate.bind(this)}
                        />
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default withAlert()(CreateRoom)