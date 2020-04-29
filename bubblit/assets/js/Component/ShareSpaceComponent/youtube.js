import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import './../../../css/shareSpace.css'

export default class YoutubePanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            youtubeurlinput: '',
        }
    }


    handleYoutubeUrlInput(event) {
        this.setState({
            youtubeurlinput: event.target.value
        })
    }

    handleYoutubeUrlClick(event) {
        event.preventDefault();
        // 데모는 해야 하니까 단순무식하게 하드코딩 해놨고 하는방법은 고민해보겠음
        // 현재는 https://www.youtube.com/watch?v=eYXlssuDyi8 이런 링크가 있으면 = 뒤가 영상 ID니까 이거 짤라서 붙이는거임.
        // 유튜브 영상 켜고 주소창에 떠있는 주소 복붙해서 가능.
        let ytb_id = this.state.youtubeurlinput.split("=")
        let ytb_embed_link = "https://www.youtube.com/embed/" + ytb_id[1]
        this.props.channel.push("youtube_link", { body: ytb_embed_link })
        this.setState({
            youtubeurlinput: ''
        })
    }


    render() {
        return (
            <div className="sharespace-tab">
                <ReactPlayer url={this.props.youtubeurl}
                    width="100%"
                    height="80%"
                    playing="true"
                    controls="true" />
                <input
                    className="input"
                    type="text"
                    value={this.state.youtubeurlinput}
                    onChange={this.handleYoutubeUrlInput.bind(this)}
                />
                <button onClick={this.handleYoutubeUrlClick.bind(this)}>유튜브 변경</button>
            </div>
        )
    }
}