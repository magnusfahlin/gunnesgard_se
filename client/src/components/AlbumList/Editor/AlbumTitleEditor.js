import React, {useEffect, useState} from "react";
import delete_icon from "./delete_icon.png"
import "./AlbumTitleEditor.scss"

export const AlbumTitleEditor= (props) => {

    let icons =
        <div>
            <img src={delete_icon} onClick={() => props.deleteAlbum()}/>
        </div>;

    return  <div className={"AlbumTitleEditor"}>
                <div className="fieldsContainer">
                   <input
                       type="text"
                       defaultValue={props.title ?? ""}
                       placeholder="Albumnamn"
                       className="text"
                       onChange={event => props.setTitle(event.target.value)}
                   />
               </div>
               <div className={"iconsContainer" + (props.deleted ? " photo_deleted_icons" : "")}>
                   <div className="icons">
                       {icons}
                   </div>
               </div>
           </div>
}

export default AlbumTitleEditor;

