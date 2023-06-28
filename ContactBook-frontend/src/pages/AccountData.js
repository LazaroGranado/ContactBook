/* eslint-disable */

import React, { useState } from "react";
import Header from "../components/Header.js";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import jwt from "jsonwebtoken";

function AccountData() {
  const navigate = useNavigate();

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [auth0Id, setAuth0Id] = useState();

  const [contacts, setContacts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userId;

    getAccessTokenSilently({ detailedResponse: true })
      .then((r) => {
        const decodeIdToken = async () => {
          const decodedIdToken = jwt.decode(r.id_token);

          userId = decodedIdToken.sub;

          if (userId) {
            setAuth0Id(userId);

            axios
              .post(process.env.REACT_APP_SERVER + "/Contacts", {
                auth0Id: userId,
              })
              .then((response) => {
                setContacts([response.data.contacts]);

                // setIsLoading(false)
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
  });

  const handleClick = () => {
    axios(process.env.REACT_APP_SERVER + "/Settings/Data", {
      method: "POST",
      data: { id: auth0Id && auth0Id },
    });
  };

  if (isLoading) {
    return <div></div>;
  } else {
    return (
      <div>
        <Header
          settingsDisplay="none"
          contactsArray={contacts}
          link2={"Logout"}
          categories={"Categories"}
          contacts={"Contacts"}
          contactsHref="/Contacts"
          categoriesHref="/Categories"
        />

        <div className="container mt-3">
          <form action="">
            <h2>account settings</h2>
            <hr />
            <div className="row mt-5">
              <div class="col-md-3 me-5">
                <ul className="ul-no-bullet-point ps-0">
                  <Link to="/Settings">
                    <li className="nav-item">
                      <a class="nav-link fs-5" id="">
                        Profile
                      </a>
                    </li>
                  </Link>
                </ul>
                <hr />

                <ul className="ul-no-bullet-point ps-0">
                  <Link to="/Settings/Password">
                    <li>
                      <a class="nav-link fs-5" id="">
                        Password
                      </a>
                    </li>
                  </Link>
                </ul>
                <hr />

                <ul className="ul-no-bullet-point ps-0">
                  <Link to="/Settings/Data">
                    <li>
                      <a class="nav-link fs-5" id="">
                        Data
                      </a>
                    </li>
                  </Link>
                </ul>
              </div>

              <div class="col-md-4 ms-5">
                <label class="form-label">
                  <h3>Account data</h3>
                </label>

                <div className="form-floating">
                  <p>
                    Choosing to delete data below will remove all your account
                    data and delete your account permanently.
                  </p>

                  <h6 className="fw-bold">
                    {" "}
                    note this action is final and cannot be undone.
                  </h6>
                </div>

                <div className="row mt-5">
                  <div className="col-6 mt-1">
                    <Link to="/Contacts">
                      {" "}
                      <a className="ps-0">Back to contacts</a>
                    </Link>
                  </div>

                  <div className="col-6 mt-1 text-end">
                    <button
                      onClick={handleClick}
                      type="submit"
                      class="btn btn-primary"
                    >
                      Delete Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AccountData;
