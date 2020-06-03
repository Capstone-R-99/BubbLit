import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import axios from 'axios'

class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMessage: '',
            isPrivate: false
        }
    }

    makeRoom() {
        console.log(this.state.inputMessage);
        axios.post('/api/room/make', {
            title: this.state.inputMessage,
            is_private: this.state.isPrivate
        }).then(function (response) {
            console.log(response);
            alert("Success to create room!")
            window.location.reload(false);
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
                        size='big'
                        action={{ icon: 'send' }}
                        placeholder='enter your room name!'
                        value={this.state.inputMessage}
                        onChange={this.handleInputMessage.bind(this)}
                    ></Form.Input>
                </Form>
                <input type='checkbox' checked={this.state.isPrivate}
                    onChange={this.togglePrivate.bind(this)} />
                {/* <Button onClick={function (e, data) {
                    this.makeRoom();
                }.bind(this)} >Make Room</Button> */}
            </div>
        );
    }
}

export default CreateRoom