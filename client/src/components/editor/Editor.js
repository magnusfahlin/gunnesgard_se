import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Editor extends Component {
      constructor(props) {
          super(props);
      }

render() {
        return(
            <div className="editor">
                <span className="title">Skriv Inlägg</span>
                <div className="editorTopic">
                    <span>Rubrik</span>
                    <input type="text"/>
                </div>
                <div className="editorPost">
                    <textarea type="text"/>
                </div>
                <div className="editorLocation">
                    <span>Plats</span>
                    <input type="text"/>
                </div>
                <button className="editorLocation">Skriv</button>
                </div>);
    }
}

export default Editor;
