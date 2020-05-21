import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';

const [source, setSource] = useState("images/missingimage.jpg");

function SecureImage(props) {
    useEffect(() => {
        if (props?.src) {
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
                    setSource("data:;base64," + base64)
                })
                .catch(error => {
                    setSource("images/missingimage.jpg");
                });
        }
    }, [])

    return <img src={source}/>;
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
