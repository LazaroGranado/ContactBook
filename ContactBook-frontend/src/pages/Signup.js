/* eslint-disable */

import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import Header from "../components/Header.js";
import { createAuth0Client } from "@auth0/auth0-spa-js";
import { useNavigate } from "react-router-dom";

import { webAuth, webAuthLogin } from "../index.js";

import jwt from "jsonwebtoken";

const addressBookRealm = process.env.REACT_APP_ADDRESSBOOKLOGINREALM;

function Signup() {
  const navigate = useNavigate();

  const { user, getAccessTokenSilently } = useAuth0();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid4PasswordNoMatch, setIsInvalid4PasswordNoMatch] = useState();
  const [isInvalid4EmailFormat, setIsInvalid4EmailFormat] = useState();
  const [isInvalidForWeakPassword, setIsInvalidForWeakPassword] = useState();
  const [isInvalidForNoEmail, setIsInvalidForNoEmail] = useState();
  const [isInvalidForNoEmailFeedback, setIsInvalidForNoEmailFeedback] =
    useState();
  const [isInvalidForNoPasswordFeedback, setIsInvalidForNoPasswordFeedback] =
    useState();
  const [
    isInvalidForNoPasswordConfirmFeedback,
    setIsInvalidForNoPasswordConfirmFeedback,
  ] = useState();
  const [isInvalidForNoPassword, setIsInvalidForNoPassword] = useState();
  const [isInvalidForNoPasswordConfirm, setIsInvalidForNoPasswordConfirm] =
    useState();
  const [passwordInvalidFeedbackNoMatch, setPasswordInvalidFeedbackNoMatch] =
    useState();
  const [passwordStrengthInvalidFeedback, setPasswordStrengthInvalidFeedback] =
    useState();
  const [emailFormatInvalidFeedback, setEmailFormatInvalidFeedback] =
    useState();
  const [isInvalid4UserExists, setIsInvalid4UserExists] = useState();
  const [isInvalid4UserExistsFeedback, setIsInvalid4UserExistsFeedback] =
    useState();
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [passwordStrengthDisplay, setPasswordStrengthDisplay] =
    useState("none");

  const [isValid4SignUp, setIsValid4SignUp] = useState();
  const [isValid4SignUpFeedback, setIsValid4SignUpFeedback] = useState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userId;

    getAccessTokenSilently({ detailedResponse: true })
      .then((r) => {
        const decodeIdToken = async () => {
          const decodedIdToken = jwt.decode(r.id_token);

          userId = decodedIdToken.sub;

          if (userId) {
            navigate("/Contacts");
          } else {
            // setIsLoading(false)
          }
        };

        if (r) {
          decodeIdToken();
        } else {
          // setIsLoading(false)
        }
      })
      .catch((e) => {
        if (e.toString() === "Error: Login required") {
          // setIsLoading(false)
        }
      });
  }, []);

  const webAuthSignUp = () => {
    if (email === "" || password === "" || passwordConfirm === "") {
      setIsInvalid4EmailFormat("");
      setIsInvalid4UserExists("");
      setIsInvalidForWeakPassword("");
      setIsInvalid4PasswordNoMatch("");

      setEmailFormatInvalidFeedback("");
      setIsInvalid4UserExistsFeedback("");
      setPasswordStrengthInvalidFeedback("");
      setPasswordInvalidFeedbackNoMatch("");

      if (email === "") {
        setIsInvalidForNoEmail("is-invalid");
        setIsInvalidForNoEmailFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoEmail("");
        setIsInvalidForNoEmailFeedback("");
      }
      if (password === "") {
        setIsInvalidForNoPassword("is-invalid");
        setIsInvalidForNoPasswordFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoPassword("");
        setIsInvalidForNoPasswordFeedback("");
      }
      if (passwordConfirm === "") {
        setIsInvalidForNoPasswordConfirm("is-invalid");
        setIsInvalidForNoPasswordConfirmFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoPasswordConfirm("");
        setIsInvalidForNoPasswordConfirmFeedback("");
      }
    } else {
      setIsInvalidForNoEmail("");
      setIsInvalidForNoPassword("");
      setIsInvalidForNoPasswordConfirm("");

      setIsInvalidForNoEmailFeedback("");
      setIsInvalidForNoPasswordFeedback("");
      setIsInvalidForNoPasswordConfirmFeedback("");

      if (password !== passwordConfirm) {
        setEmailFormatInvalidFeedback("");
        setIsInvalid4UserExistsFeedback("");
        setPasswordStrengthInvalidFeedback("");

        setIsInvalid4EmailFormat("");
        setIsInvalid4UserExists("");
        setIsInvalidForWeakPassword("");

        setIsInvalid4PasswordNoMatch("is-invalid ");
        setPasswordInvalidFeedbackNoMatch("passwords do not match.");
      } else {
        webAuthLogin.signup(
          {
            connection: addressBookRealm,
            email: email,
            password: password,
          },
          (err, result) => {
            if (err) {
              if (err.code.includes("email format validation failed")) {
                setIsInvalid4UserExists("");
                setIsInvalidForWeakPassword("");
                setIsInvalid4PasswordNoMatch("");

                setIsInvalid4UserExistsFeedback("");
                setPasswordStrengthInvalidFeedback("");
                setPasswordInvalidFeedbackNoMatch("");

                setIsInvalid4EmailFormat("is-invalid");
                setEmailFormatInvalidFeedback("Email format is invalid");
              } else if (err.code === "invalid_signup") {
                setIsInvalid4UserExists("is-invalid");
                setIsInvalid4UserExistsFeedback(
                  "That email is taken. Try another."
                );
              } else if (err.name === "PasswordStrengthError") {
                setIsInvalidForWeakPassword("is-invalid");
                setPasswordStrengthInvalidFeedback("password is too weak");
              }
            } else if (result) {
              setIsValid4SignUp("is-valid");
              setIsValid4SignUpFeedback(
                "Success! you will be redirected to login page momentarily."
              );
              setTimeout(() => {
                navigate("/");
              }, 4500);
            }
          }
        );
      }
    }
  };

  if (isLoading) {
    return <div></div>;
  } else {
    return (
      <div>
        <Header
          marginClass={"loginMarginClass"}
          class={"d-none"}
          link1={"Register"}
        />

        <div className="align-items-center enable-grid-classes justify-content-center">
          <div class="mb-3 mt-5 col-md-6 m-auto">
            <h1>Sign up</h1>
            <hr />
            <label for="exampleInputEmail1" class="form-label mt-4">
              Email
            </label>

            <input
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={
                "form-control " +
                isInvalidForNoEmail +
                " " +
                isInvalid4EmailFormat +
                " " +
                isInvalid4UserExists +
                " " +
                isValid4SignUp
              }
              value={email}
              required="required"
            />
            <div className="invalid-feedback">
              {emailFormatInvalidFeedback}
              {isInvalidForNoEmailFeedback}
            </div>
            <div className="valid-feedback">{isValid4SignUpFeedback}</div>
          </div>

          <div class="mb-3 col-md-6 m-auto">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrengthDisplay("block");
              }}
              className={
                "form-control " +
                isInvalid4PasswordNoMatch +
                " " +
                isInvalidForWeakPassword +
                " " +
                isInvalidForNoPassword
              }
              value={password}
              required
              onin
            />
            <div className="invalid-feedback">
              {passwordStrengthInvalidFeedback}
              {isInvalidForNoPasswordFeedback}
            </div>
          </div>

          <div className="mb-3 col-md-6 m-auto">
            <label class="form-label">confirm password</label>

            <input
              key={setIsInvalidForWeakPassword}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
              type="password"
              className={
                "form-control " +
                isInvalid4PasswordNoMatch +
                " " +
                isInvalidForNoPasswordConfirm
              }
              required
              id="password_confirm"
              onin
              value={passwordConfirm}
            />

            <div className="invalid-feedback">
              {passwordInvalidFeedbackNoMatch}
              {isInvalidForNoPasswordConfirmFeedback}
            </div>

            <div
              style={{ display: passwordStrengthDisplay }}
              className="form-floating border rounded mt-4"
            >
              <ul className="mt-3  ap-ul ul-no-bullet-point">
                <li className="mb-1">Your password must contain: </li>
                <ul className="ps-3 ">
                  {" "}
                  <li> At least 8 characters </li>
                  <li className="mb-1"> At least 3 of the following: </li>
                </ul>

                <ul className="ps-5 ">
                  {" "}
                  <li>Lower case letters (a-z)</li>
                  <li className="mb-1">Upper case letters (A-Z)</li>
                  <li className="mb-1">Numbers (0-9)</li>
                  <li className="mb-1">Special characters (e.g. !@#$%^&*)</li>
                </ul>
              </ul>
            </div>

            <button
              type="submit"
              onClick={webAuthSignUp}
              class="btn mt-5 btn-primary mb-4"
            >
              SIGN UP
            </button>

            <div>
              <p>
                <a href="/">Sign in instead</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
