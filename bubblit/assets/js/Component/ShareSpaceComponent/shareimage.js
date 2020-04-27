import React, { Component } from 'react'
import gitmerge from './../../../static/images/gitmerge.gif'

export default class ImagePanel extends Component {
    // 웹에서 이미지 링크 업로드 or/and 서버에 직접 업로드??
    // 'X-Frame-Options' to 'deny' 문제 (CORS랑 유사한 문제인듯?)
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className="sharespace-tab">
                <img src={this.props.imgurl} />
            </div>
        )
    }
}