import React, { Component } from 'react'
import { Gluejar } from '@charliewilco/gluejar'
import axios from 'axios'

export default class ImagePanel extends Component {
    // 웹에서 이미지 링크 업로드 or/and 서버에 직접 업로드??
    // 'X-Frame-Options' to 'deny' 문제 (CORS랑 유사한 문제인듯?)
    constructor(props) {
        super(props)
        this.state = {
            imageurlinput: '',
            broadcastAction: this.props.broadcastAction
        }
    }


    handleImageUrlInput(event) {
        this.setState({
            imageurlinput: event.target.value
        })
    }

    handleImageUrlClick(event) {
        this.state.broadcastAction(this.state.imageurlinput)

        this.setState({
            imageurlinput: ''
        })
    }

    OnPaste(file) {
        var self = this
        console.log(file)
        var url = file.images[0]

        axios.get(url, {
            responseType: "blob"
        })
            .then(function (response) {
                console.dir(response);
                let a = response.data;
                console.log(a)
            })
            .catch(function (error) {
                console.log(error);
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
                <Gluejar onPaste={this.OnPaste.bind(this)} onError={err => console.error(err)}>
                    {({ images }) =>
                        images.length > 0 &&
                        images.map(image => <img src={image} key={image} alt={`Pasted: ${image}`} />)
                    }
                </Gluejar>
                <button onClick={this.handleImageUrlClick.bind(this)}>이미지 변경</button>
            </div>
        )
    }
}