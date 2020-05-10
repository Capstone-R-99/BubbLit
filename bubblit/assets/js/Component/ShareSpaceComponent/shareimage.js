import React, { Component } from 'react'
import { Gluejar } from '@charliewilco/gluejar'
import axios from 'axios'
import { uploadFileRequest } from './upload_file_request'

export default class ImagePanel extends Component {
    // 웹에서 이미지 링크 업로드 or/and 서버에 직접 업로드??
    // 'X-Frame-Options' to 'deny' 문제 (CORS랑 유사한 문제인듯?)
    constructor(props) {
        super(props)
        this.state = {
            imageurlinput: '',
            broadcastAction: this.props.broadcastAction,
            room_id: this.props.room_id
        }
    }


    handleImageUrlClick(event) {
        this.state.broadcastAction(this.state.imageurlinput)

    }

    OnPaste(file) {
        if (file.images.length <= 0) {
            return;
        }

        var self = this
        let room_id = this.props.room_id;

        console.log(file)
        var url = file.images[0];
        file.images = []

        axios.get(url, {
            responseType: "blob"
        })
            .then(function (response) {
                console.dir(response);
                let blob = response.data;
                console.log(blob)

                if (blob == null || blob == undefined) {
                    console.log("blob is null")
                    return;
                }

                uploadFileRequest(room_id, blob)
                    .then(function (response) {
                        self.state.broadcastAction();
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        // 문제 생길시 Gluejar 안에 넣으면 복구됨.
        //     {({ images }) =>
        //     images.length > 0 &&
        //     images.map(image => <img src={image} key={image} alt={`Pasted: ${image}`} />)
        // }
        return (
            <div className="outerfit">
                <img src={this.props.imgurl} />
                <Gluejar onPaste={this.OnPaste.bind(this)} onError={err => console.error(err)}>

                </Gluejar>
            </div>
        )
    }
}