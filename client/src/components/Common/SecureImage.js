import React, {Component} from 'react';
import axios from 'axios';
import {getApiRoot} from "../../environmentConfig";

class SecureImage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {source: null};
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.props?.src) {
            this.UpdateImage();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.props?.src) {
    //         this.UpdateImage();
    //     }
    // }

    UpdateImage() {
        axios
            .get(
                this.props.src,
                {
                    responseType: 'arraybuffer',
                    headers: {"x-Auth": this.props.token}
                },
            )
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                this.setState({source: "data:;base64," + base64});
            })
            .catch(error => {
                this.setState({source: "images/missingimage.jpg"});
            });
    }

    render() {
        return <img src={this.state.source}/>;
    }
}

export default SecureImage;

export function CreateSecureArrayOfSrc(srcArray, token) {

    return axios.all(
        srcArray.map(srcArrayItem =>
            axios.get(
                srcArrayItem.src,
                {
                    responseType: 'arraybuffer',
                    headers: {"x-Auth": token}
                })
                .then(response => {
                    return btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    )
                })
                .then((result) => {
                    srcArrayItem.src = "data:;base64," + result
                })
                .catch((error) => {
                    let returnValue = [];
                    srcArray.forEach(r => {
                        srcArrayItem.src = "images/missingimage.jpg"
                    });
                    return returnValue;
                }))
    ).then(() => {
        return srcArray;
    });
}
