import React, { Component } from 'react'
import './../../../css/shareSpace.css'
import { Button } from 'semantic-ui-react'

export default class CustomPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            customURLInput: '',
        }
    }

    handleCustomUrlInput(event) {
        this.setState({
            customURLInput: event.target.value
        })
    }


    handleCustomUrlClick(event) {
        event.preventDefault();
        var _customURLInput = this.state.customURLInput
        this.setState({
            customURLInput: ''
        }, () => {
            this.props.sendTabAction("custom_link", _customURLInput)
        })
    }

    render() {
        return (
            <div className="outerfit">
                <input
                    className="input"
                    type="text"
                    value={this.state.customURLInput}
                    onChange={this.handleCustomUrlInput.bind(this)}
                />
                <Button onClick={this.handleCustomUrlClick.bind(this)}>커스텀 링크 변경</Button>
                <iframe width="100%"
                    height="100%"
                    src={this.props.customUrl}
                    frameborder="1"></iframe>

            </div>

        )
    }
}