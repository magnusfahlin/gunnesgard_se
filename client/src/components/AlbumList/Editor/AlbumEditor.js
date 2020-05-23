import React, {useState} from "react";
import SecureImage from "../../Common/SecureImage";
import {getApiRoot} from "../../../environmentConfig";
import delete_icon from "./deleted_icon.png"
import deleted_icon from "./deleted_icon.png"
import "./AlbumEditor.scss"
import Spinner from "../../Common/Spinner";


const AlbumEditorExistingItem = (props) => {
    let icons =
        <div>
            <img src={delete_icon} onClick={() => props.deletePhoto(props.photo.id)}/>
        </div>;

    let photo = <SecureImage src={getApiRoot() + props.photo.thumbnailPath} token={props.token}/>;
    if (props.deleted) {
        icons = <div onClick={() => props.unDeletePhoto(props.photo.id)}>ångra</div>;
        photo = <div className="photo_deleted"><img src={deleted_icon} title={"ta bort"}/></div>
    } else if (props.loading) {
        icons = <Spinner/>
    }

    let item =
        <div className="albumEditorExistingItem">
            <div className="photoContainer">
                {photo}
            </div>
            <div className={"fieldsContainer" + (props.deleted ? " photo_deleted_fields" : "")}>
                <div>
                    <input
                        type="text"
                        defaultValue={props.photo.title}
                        placeholder="Bildnamnn"
                        className="text"
                        disabled={"props.deleted"}
                        onChange={event => props.updatePhoto(props.photo.id, {title: event.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        defaultValue={props.photo.text}
                        placeholder="Beskrivande text"
                        className="text"
                        disabled={"props.deleted"}
                        onChange={event => props.updatePhoto(props.photo.id, {text: event.target.value})}
                    />
                </div>
            </div>
            <div className={"iconsContainer" + (props.deleted ? " photo_deleted_icons" : "")}>
                <div className="icons">
                    {icons}
                </div>
            </div>
        </div>;
    return item;
}

const AddPhoto = (props) => {
    return <div>
        LÄGG TILL BILDER
    </div>
}

const AlbumEditor = (props) => {
    const [photosForDeletion, setPhotosForDeletion] = useState([]);
    const [photosForUpdate, setPhotosForUpdate] = useState({});

    let photos = props.album.photos.map((photo, index) =>
        (<div className={"photoEditorPhoto" + index}>
            <AlbumEditorExistingItem
                photo={photo}
                token={props.token}
                deleted={photosForDeletion.includes(photo.id)}
                deletePhoto={(id) => setPhotosForDeletion([...photosForDeletion, id])}
                unDeletePhoto={(id) => {
                    setPhotosForDeletion(photosForDeletion.filter(existingId => existingId !== id))
                }}
                updatePhoto={(id, update) => {
                    photosForUpdate[id] = Object.assign(photosForUpdate[id] ?? {}, update);
                    setPhotosForUpdate(photosForUpdate);
                }}/>
        </div>));

    return <div>
        <div>{photos.length + " bilder"}</div>
        <div>
            <AddPhoto/>
        </div>
        <div>
            {photos}
        </div>
    </div>;
}
export default AlbumEditor;
