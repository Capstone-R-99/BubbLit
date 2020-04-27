import React, { Component } from 'react'
import gitmerge from './../../../static/images/gitmerge.gif'

export default class ImagePanel extends Component {
    // 웹에서 이미지 링크 업로드 or/and 서버에 직접 업로드??
    // 'X-Frame-Options' to 'deny' 문제 (CORS랑 유사한 문제인듯?)
    constructor(props) {
        super(props)
        this.state = {
            imageurlinput: '',
        }
    }


    handleImageUrlInput(event) {
        this.setState({
            imageurlinput: event.target.value
        })
    }

    handleImageUrlClick(event) {
        event.preventDefault();
        this.props.channel.push("img_link", { body: this.state.imageurlinput })
        this.setState({
            imageurlinput: ''
        })
    }


    render() {
        return (
            <div className="sharespace-tab">
                <img src={this.props.imgurl} />
                <input
                    className="input"
                    type="text"
                    value={this.state.imageurlinput}
                    onChange={this.handleImageUrlInput.bind(this)}
                />
                <button onClick={this.handleImageUrlClick.bind(this)}>이미지 변경</button>
            </div>
        )
    }
}