import React, {useState} from "react";
import Dropzone from "react-dropzone";
import "./DropzoneWrapper.scss"
import plus_icon from "./plus_icon.png"

const DropzoneWrapper = (props) => {

    const handleDrop = acceptedFiles => {acceptedFiles.map(file => props.uploadPhoto(file))};

    return (
        <div className="dropzoneWrapper roundCorners">
            <Dropzone onDrop={handleDrop}>
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps({className: "dropzone"})}>
                        <input {...getInputProps()} />

                        <p><img src={plus_icon}/> Dra och släpp bilder, eller klicka för att välja flera</p>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default DropzoneWrapper;