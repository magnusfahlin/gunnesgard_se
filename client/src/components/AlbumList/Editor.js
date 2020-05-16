import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
// import "./Editor.scss";


const port = process.env.PORT || 3001;
const endpointRoot = process.env.SAME_ORIGIN
    ? ""
    : "http://localhost:" + port + "/";


class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageUrls: [],
      message: ''
    }
  }
  selectImages = (event) => {
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    let message = `${images.length} valid image(s) selected`
    this.setState({ images, message })
  }
  uploadImages = () => {
    const uploaders = this.state.images.map(image => {
      const data = new FormData();
      data.append("file", image, image.name);
// Make an AJAX upload request using Axios
      return axios.post(endpointRoot + 'albums/5ebf5b0b753835e4687465b7/photos', data)
          .then(response => {
            this.setState({
              imageUrls: [ response.data.imageUrl, ...this.state.imageUrls ]
            });
          })
    });
// Once all the files are uploaded
    axios.all(uploaders).then(() => {
      console.log('done');
    }).catch(err => alert(err.message));
  }
  render() {
    return (
        <div>
          <br/>
          <div className="col-sm-12">
            <h1>Image Uploader</h1><hr/>
            <div className="col-sm-4">
              <input className="form-control " type="file"
                     onChange={this.selectImages} multiple/>
            </div>
            <p className="text-info">{this.state.message}</p>
            <br/><br/><br/>
            <div className="col-sm-4">
              <button className="btn btn-primary" value="Submit"
                      onClick={this.uploadImages}>Submit</button>
            </div>
          </div>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><hr/><br/>
          <div className="row col-lg-12">
            {
              this.state.imageUrls.map((url, i) => (
                  <div className="col-lg-2" key={i}>
                    <img src={endpointRoot + url} className="img-rounded img-responsive"
                         alt="not available"/><br/>
                  </div>
              ))
            }
          </div>
        </div>
    );
  }
}
export default Editor;













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
