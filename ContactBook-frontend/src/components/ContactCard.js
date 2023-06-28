/* eslint-disable */

import React from "react";

export const ContactCard = (props) => {
  return (
    <div className="col mb-3 px-2">
      <div
        className="card mt-5 ms-1 me-1 g-0"
        style={{
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0.625rem 1.25rem",
        }}
      >
        <a onClick={props.transferContact} className="pointer-link css">
          <img
            alt=""
            className="card-img-top image"
            src={"data:image/png;base64," + props.contactImage}
            style={{ borderTopRightRadius: "8px", borderTopLeftRadius: "8px" }}
          />
          <div className="card-body " style={{ paddingBottom: "0px" }}>
            <h5 className="  ">
              {props.firstName} {props.lastName}
            </h5>

            <h4 className="">
              {" "}
              <strong className="">Address</strong>{" "}
            </h4>
            <div className="">
              <h5 className="card-title">{props.address}</h5>
            </div>
            <p
              style={{ height: "19.2px" }}
              className="card-subtitle mb-2 text-muted"
            >
              {props.address2}
            </p>

            <h6 className="card-subtitle text-muted ">
              {props.city}, {props.state} {props.zip}
            </h6>

            <div className=" min-height">
              <div className=" card-subtitle mb-2 text-muted mt-3">
                <span className="card-subtitle text-muted mt-3">
                  Email: {props.email}{" "}
                </span>
              </div>

              <div className="card-subtitle text-muted ">
                <span className="card-subtitle mb-2 text-muted mt-3">
                  Phone:{" "}
                </span>
                {props.phoneNumber}
              </div>
            </div>
          </div>
        </a>

        {/* icon div */}

        <div className=" justify-content-center d-flex">
          <a onClick={props.transferContactForEdit}>
            <button
              title="Edit Contact"
              className="bi bi-pencil-fill btn btn-lg p-2"
            ></button>
          </a>

          <a onClick={props.transferContact}>
            <button
              title="View Contact Details "
              className="bi bi-info-circle-fill btn btn-lg p-2"
            ></button>
          </a>

          <form
            style={{ display: "inline-block" }}
            action={"mailto:" + props.emailForForm}
            method="post"
            enctype="text/plain"
          >
            <button
              type="submit"
              className="btn btn-lg bi bi-envelope-fill card-link p-2"
              title="Send Contact an Email"
            ></button>
          </form>

          <button
            onClick={props.onClickTrashIcon}
            type="button"
            title="Delete Contact"
            className="bi bi-trash-fill  btn btn-lg p-2"
          ></button>
        </div>
      </div>
    </div>
  );
};
