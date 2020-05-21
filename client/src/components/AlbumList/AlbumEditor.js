import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import {v1 as uuidv1} from 'uuid';
// import "./Editor.scss";

import {getApiRoot} from "../../environmentConfig"
import SecureImage from "../Common/SecureImage";

class AlbumEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            imageUrls: [],
            message: ''
        }
    }

    selectImages = (event) => {
        let photoContainers = []
        for (let i = 0; i < event.target.files.length; i++) {
            photoContainers[i] = {
                tempId : uuidv1(),
                photo: event.target.files.item(i),
            };
        }
        photoContainers = photoContainers.filter(container => container.photo.name.match(/\.(jpg|jpeg|png|gif)$/))
        let message = `${photoContainers.length} valid photo(s) selected`

        photoContainers.forEach(container => {
                this.props.actions.newPhotoStaged(container, -1);
            }
        );
        // this.setState({ images, message })
    }
    uploadImages = () => {

        //  () => {
        this.props.newPhotos.map(container => {
            this.props.actions.createPhoto(
                "5ec580035eed75729a8ac1ad",
                container,
                container.photo.name,
                "",// this.state.location,
                this.props.token
            );
        });
//
//     const uploaders = this.state.images.map(image => {
//       const data = new FormData();
//       data.append("file", image, image.name);
// // Make an AJAX upload request using Axios
//       return axios.post(endpointRoot + 'albums/5ebf5b0b753835e4687465b7/photos', data)
//           .then(response => {
//             this.setState({
//               imageUrls: [ response.data.path, ...this.state.imageUrls ]
//             });
        //  })
//     });
// // Once all the files are uploaded
//     axios.all(uploaders).then(() => {
//       console.log('done');
//     }).catch(err => alert(err.message));
    }

    render() {

        return (
            <div>
                <br/>
                <div className="col-sm-12">
                    <h1>Image Uploader</h1>
                    <hr/>
                    <div className="col-sm-4">
                        <input className="form-control " type="file"
                               onChange={this.selectImages} multiple/>
                    </div>
                    <p className="text-info">{this.state.message}</p>
                    <br/><br/><br/>
                    <div className="col-sm-4">
                        <button className="btn btn-primary" value="Submit"
                                onClick={this.uploadImages}>Submit
                        </button>
                    </div>
                </div>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <hr/>
                <br/>
                <div className="row col-lg-12">
                    {
                        this.props.existingPhotos.map((url, i) => (
                            <div className="col-lg-2" key={i}>
                                <SecureImage src={getApiRoot() + url} className="img-rounded img-responsive"
                                     alt="not available"/><br/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

AlbumEditor.propTypes = {
    onCreatePhoto: PropTypes.func
};

export default AlbumEditor;


// class Editor extends Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       title: "",
//       text: "",
//       location: ""
//     };
//   }
//
//   render() {
//     return (
//       <div className="posteditor">
//         <div className="innerComment roundCorners">
//           Nytt inlägg
//           <div className="inputContainer">
//             <input
//               type="text"
//               placeholder="Rubrik"
//               className="text titleEditor"
//               onChange={event => this.setState({ title: event.target.value })}
//             />
//           </div>
//           <div className="inputContainer">
//             <textarea
//               placeholder="Inlägg"
//               className="text"
//               onChange={event => this.setState({ text: event.target.value })}
//             />
//           </div>
//           <div className="inputContainer">
//             <input
//             type="text"
//               placeholder="Plats"
//               className="text location"
//               onChange={event =>
//                 this.setState({ location: event.target.value })
//               }
//             />
//           </div>
//           <span className="bold singature">
//             <button
//               disabled={
//                 !this.state.title || !this.state.text || !this.state.location
//               }
//               onClick={() => {
//                 this.props.onCreatePost(
//                   this.state.title,
//                   this.state.text,
//                   this.state.location
//                 );
//               }}
//             >
//               Skriv
//             </button>
//           </span>
//         </div>
//       </div>
//     );
//   }
// }
//
// Editor.propTypes = {
//   onCreatePost: PropTypes.func
// };

//export default Editor;
