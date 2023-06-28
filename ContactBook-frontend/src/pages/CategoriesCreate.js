/* eslint-disable */

import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from "../components/Header.js";
import { useNavigate, Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import { useAuth0 } from "@auth0/auth0-react";

function CategoriesCreate() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [isLoading, setIsLoading] = useState(true);

  const [contacts, setContacts] = useState([]);

  const navigate = useNavigate();

  const [userId, setUserId] = useState();
  const [auth0Id, setAuth0Id] = useState();

  useEffect(() => {
    let userId;

    getAccessTokenSilently({ detailedResponse: true })
      .then((r) => {
        const decodeIdToken = async () => {
          const decodedIdToken = jwt.decode(r.id_token);

          userId = decodedIdToken.sub;

          if (userId) {
            axios
              .post(process.env.REACT_APP_SERVER + "/Contacts", {
                auth0Id: userId,
              })
              .then((response) => {
                setContacts([response.data.contacts]);

                setAuth0Id(userId);

                setIsLoading(false);
              })
              .catch((error) => {});
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

  const [categoryName, setCategoryName] = useState();

  function handleClick() {
    axios(process.env.REACT_APP_SERVER + "/Categories/Create", {
      method: "POST",
      data: {
        categoryName: categoryName,
        userId: auth0Id && auth0Id,
      },
    }).then((res) => {
      if (res.data === "category created") {
        navigate("/Categories");
      }
    });
  }

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

        <div className="container mt-3">
          <div className="row pt-5">
            <div className="col-lg-7 col-md-8 col-xl-5 mx-auto">
              <div className="loginContainerDiv">
                <h2>Create category</h2>

                <label class="form-label pt-5">Name</label>

                <input
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                  }}
                  type="text"
                  class="form-control mb-5"
                />

                <div className="row pt-5">
                  <div className="col-8">
                    <Link to="/Contacts">
                      {" "}
                      <a className="ps-0">Back to contacts</a>
                    </Link>
                  </div>

                  <div className="col-4 text-end">
                    <button
                      onClick={handleClick}
                      type="submit"
                      class="btn btn-primary"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoriesCreate;
