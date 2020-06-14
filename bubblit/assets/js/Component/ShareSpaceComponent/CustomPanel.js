import React, { Component } from 'react'
import './../../../css/shareSpace.css'
import { Button, Popup } from 'semantic-ui-react'

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
                <Popup
                    on='click'
                    pinned
                    trigger={<Button color='pink' content='사용방법' />}
                >
                    <p>* 협업을 위한 링크를 타 유저들과 공유해 보세요.</p>
                    <p>* 기술적인 문제로 링크를 공유할 수 없는 사이트들이 존재합니다.</p>
                    <p>* 아래의 사이트들에서, 다른 사람들과 작업을 공유하기 위해 공유용 링크를 생성하세요. 그 후, 생성된 링크를 공유해보세요.</p>
                    <p>구글독스 : https://docs.google.com/document/u/0/ </p>
                    <p>온라인 그림판 : https://aggie.io/</p>
                </Popup>
                <iframe width="100%"
                    height="100%"
                    src={this.props.customUrl}
                    frameborder="1"></iframe>
            </div>
        )
    }
}