import React, { Component } from 'react'

export default class DocsPanel extends Component {
    render() {
        return (
            <div className="outerfit">
                <iframe width="100%"
                    height="100%"
                    src="https://docs.google.com/document/d/16rjuguyOxl88DEFiTX61oISAO5skrQXiJnh_vCHX1Yk/edit"
                    frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
        )
    }
}