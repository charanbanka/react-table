import React from "react";
import cancel from "./cancell.svg"

const Notification = (props) => {
    console.log(props,"nort")
  return (
    <div className="d-flex flex-row justify-content-between shadow-lg p-3 mb-1 bg-body rounded w-25">
      <div className={`${props.class || "text-success"}`}>{props.message}</div>
      <div className="ml-2 " style={{cursor: "pointer"}}>
        <img src={cancel} alt="cancel" onClick={props.setNotify} />
      </div>
    </div>
  );
};

export default Notification;
