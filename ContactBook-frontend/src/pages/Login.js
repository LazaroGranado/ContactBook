/* eslint-disable */

import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import Header from "../components/Header.js";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { webAuth, webAuthLogin } from "../index.js";

import { useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";

const addressBookRealm = process.env.REACT_APP_ADDRESSBOOKLOGINREALM;

const demoP = process.env.REACT_APP_DEMOP;
const demoPmAccount = process.env.REACT_APP_DEMOLOGIN;

function Login() {
  const navigate = useNavigate();

  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  const [isInvalid4WrongEmailOrPassword, setIsInvalid4WrongEmailOrPassword] =
    useState();
  const [isInvalidForNoEmail, setIsInvalidForNoEmail] = useState();
  const [isInvalidForNoEmailFeedback, setIsInvalidForNoEmailFeedback] =
    useState();
  const [isInvalidForNoPasswordFeedback, setIsInvalidForNoPasswordFeedback] =
    useState();
  const [isInvalidForNoPassword, setIsInvalidForNoPassword] = useState();
  const [
    wrongEmailOrPasswordInvalidFeedback,
    setWrongEmailOrPasswordInvalidFeedback,
  ] = useState();

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
            setIsLoading(false);
          }
        };

        if (r) {
          decodeIdToken();
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (e.toString() === "Error: Login required") {
          setIsLoading(false);
        }
      });
  }, []);

  const handleDemoLogin = () => {
    let email = demoPmAccount;
    let password = demoP;

    webAuthLogin.login(
      {
        realm: addressBookRealm,
        username: email,
        password: password,
      },
      (err, result) => {
        if (result) {
        }
        if (err) {
          if (err.description === "Wrong email or password.") {
            setIsInvalid4WrongEmailOrPassword("is-invalid");
            setWrongEmailOrPasswordInvalidFeedback(
              "Email or password is incorrect"
            );
          }
        }
      }
    );
  };

  function handleLoginEmail(e) {
    setEmail(e.target.value);
  }

  function handleLoginPassword(e) {
    setPassword(e.target.value);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickLogin = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLogin = () => {
    setAnchorEl(null);
  };

  function LoginPopover() {
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <Popover
        className="loginPopover"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseLogin}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: "1rem 1rem 1rem", color: "#c15353" }}>
          Please use Demo Login below.
        </Typography>
      </Popover>
    );
  }

  const [anchorElForgotPassword, setAnchorElForgotPassword] =
    React.useState(null);

  const handleClickForgotPassword = (event) => {
    setAnchorElForgotPassword(event.currentTarget);
  };

  const handleCloseForgotPassword = () => {
    setAnchorElForgotPassword(null);
  };

  function ForgotPasswordPopover() {
    const open = Boolean(anchorElForgotPassword);
    const id = open ? "simple-popover" : undefined;

    return (
      <Popover
        className="loginPopover"
        id={id}
        open={open}
        anchorEl={anchorElForgotPassword}
        onClose={handleCloseForgotPassword}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: "1rem 1rem 1rem", color: "#c15353" }}>
          Please use Demo Login.
        </Typography>
      </Popover>
    );
  }

  const [anchorElRegisterUser, setAnchorElRegisterUser] = React.useState(null);

  const handleClickRegisterUser = (event) => {
    setAnchorElRegisterUser(event.currentTarget);
  };

  const handleCloseRegisterUser = () => {
    setAnchorElRegisterUser(null);
  };

  function RegisterUserPopover() {
    const open = Boolean(anchorElRegisterUser);
    const id = open ? "simple-popover" : undefined;

    return (
      <Popover
        id={id}
        className="loginPopover"
        open={open}
        anchorEl={anchorElRegisterUser}
        onClose={handleCloseRegisterUser}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: "1rem 1rem 1rem", color: "#c15353" }}>
          Please use Demo Login below.
        </Typography>
      </Popover>
    );
  }

  if (isLoading) {
    return <div></div>;
  } else {
    return (
      <div>
        <Header
          marginClass={"loginMarginClass"}
          class={"d-none"}
          link1={"Register"}
          href1="/Signup"
        />

        <div className="mt-5 container">
          <div className="row">
            <div className="col-lg-7 col-md-8 col-xl-5 mx-auto">
              <div className="loginContainerDiv">
                <div class="mb-3 mt-5">
                  <h1>Log in</h1>
                  <label for="exampleInputEmail1" class="form-label mt-4">
                    Email
                  </label>

                  <input
                    type="text"
                    onChange={(e) => {}}
                    className={
                      "form-control " +
                      isInvalidForNoEmail +
                      " " +
                      isInvalid4WrongEmailOrPassword
                    }
                    required="required"
                  />
                  <div className="invalid-feedback">
                    {wrongEmailOrPasswordInvalidFeedback}
                    {isInvalidForNoEmailFeedback}
                  </div>
                </div>

                <label for="exampleInputPassword1" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  onChange={(e) => {}}
                  className={
                    "form-control " +
                    isInvalidForNoPassword +
                    " " +
                    isInvalid4WrongEmailOrPassword
                  }
                  required
                  onin
                />
                <div className="invalid-feedback">
                  {isInvalidForNoPasswordFeedback}
                </div>

                <div>
                  <p className="pt-1 linkInLogin">
                    <a onClick={handleClickForgotPassword}>
                      Forgot your password?
                    </a>
                  </p>

                  <ForgotPasswordPopover />
                </div>

                <div className="row pt-5">
                  <div className="col-8">
                    <p className="pt-1 linkInLogin">
                      <a onClick={handleClickRegisterUser}>
                        Register as a new user
                      </a>
                    </p>

                    <RegisterUserPopover />
                  </div>

                  <div className="col-4 text-end">
                    <button
                      onClick={handleClickLogin}
                      class="btn btn-primary mb-4"
                    >
                      LOG IN
                    </button>

                    <LoginPopover />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-7 col-md-8 col-xl-5 mx-auto">
              <div className="loginContainerDiv" style={{}}>
                <h4
                  className=""
                  style={{ fontWeight: 300, marginBottom: "2rem" }}
                >
                  Demo Account Login
                </h4>

                <div className="row">
                  <div class="text-center">
                    <button onClick={handleDemoLogin} class="btn btn-primary">
                      DEMO LOG IN
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

export default Login;
