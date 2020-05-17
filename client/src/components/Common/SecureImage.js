import React, {Component} from 'react';
import axios from 'axios';

class SecureImage extends Component {
    state = {source: null};

    componentDidMount() {
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