/* eslint-disable */

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate, useLocation, Link } from "react-router-dom";
import jwt from "jsonwebtoken";

function ContactDetails() {
  const [isLoading, setIsLoading] = useState(true);

  const { state } = useLocation();

  const [contactId, setContactId] = useState(state.contactId);

  const navigate = useNavigate();

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [contact, setContact] = useState();
  const [auth0Id, setAuth0Id] = useState();

  const [contacts, setContacts] = useState([]);
  const [contactCategories, setContactCategories] = useState("");

  useEffect(() => {
    let userId;

    getAccessTokenSilently({ detailedResponse: true })
      .then((r) => {
        const decodeIdToken = async () => {
          const decodedIdToken = jwt.decode(r.id_token);

          userId = decodedIdToken.sub;

          if (userId) {
            setAuth0Id(userId);

            const contactsDetailsPromise = new Promise((resolve, reject) => {
              axios
                .post(process.env.REACT_APP_SERVER + "/Contacts/Details", {
                  contactId: contactId,
                  auth0Id: userId,
                })
                .then((r) => {
                  let contact = r.data.contact;

                  setContact(contact);

                  if (Array.isArray(contact.categories)) {
                    let listOfCategoryNames = [];

                    contact.categories.map((category, index) => {
                      let categoryName = category.categoryName;

                      listOfCategoryNames.push(categoryName);
                    });

                    let contactCategories = listOfCategoryNames.join(", ");

                    setContactCategories(contactCategories);
                  }

                  resolve();
                });
            });

            const contactsPromise = new Promise((resolve, reject) => {
              axios
                .post(process.env.REACT_APP_SERVER + "/Contacts", {
                  auth0Id: userId,
                })
                .then((response) => {
                  setContacts([response.data.contacts]);

                  resolve();
                });
            });

            Promise.all([contactsDetailsPromise, contactsPromise]).then(() => {
              setIsLoading(false);
            });
          }
        };

        if (r) {
          decodeIdToken();
        }
      })
      .catch((e) => {
        if (e.toString() === "Error: Login required") {
          navigate("/");
        }
      });
  }, []);

  if (isLoading) {
    return <div></div>;
  } else {
    return (
      <div>
        <Header
          contactsArray={contacts}
          href1={"/Settings"}
          link1={"Settings"}
          link2={"Logout"}
          categories={"Categories"}
          contacts={"Contacts"}
          contactsHref="/Contacts"
          categoriesHref="/Categories"
        />

        <div className="mt-5 container">
          <div className="row">
            <div className="col d-flex justify-content-center">
              <div className="contactDetailsContainerDiv">
                <main>
                  <h4 className="fw-bolder mt-3">
                    First Name:{" "}
                    <span className="fw-normal">
                      {contact && contact.firstName}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Last Name:{" "}
                    <span className="fw-normal">
                      {contact && contact.lastName}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Address:{" "}
                    <span className="fw-normal">
                      {contact && contact.address}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Address 2:{" "}
                    <span className="fw-normal">
                      {contact && contact.address2}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    City:{" "}
                    <span className="fw-normal">
                      {contact && contact.city}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    State:{" "}
                    <span className="fw-normal">
                      {contact && contact.state}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Zip Code:{" "}
                    <span className="fw-normal">{contact && contact.zip} </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Phone Number:{" "}
                    <span className="fw-normal">
                      {contact && contact.phoneNumber}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Email:{" "}
                    <span className="fw-normal">
                      {contact && contact.email}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3">
                    Birthday:{" "}
                    <span className="fw-normal">
                      {contact && contact.date}{" "}
                    </span>
                  </h4>

                  <h4 className="fw-bolder mt-3 mb-5">
                    Category:{" "}
                    <span className="fw-normal">
                      {contactCategories && contactCategories}{" "}
                    </span>
                  </h4>
                </main>

                <p>
                  <Link to="/Contacts">
                    {" "}
                    <a className="ps-0">Back to Contacts</a>
                  </Link>

                  <vr />

                  <a
                    style={{ cursor: "pointer" }}
                    className=" ms-5  mt-3"
                    onClick={() => {
                      navigate("/Contacts/Edit", {
                        state: {
                          contactId: contactId,
                        },
                      });
                    }}
                  >
                    Edit
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactDetails;
