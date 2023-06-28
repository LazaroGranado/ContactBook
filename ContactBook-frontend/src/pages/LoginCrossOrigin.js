import React from "react";
import { Helmet } from "react-helmet";
import auth0 from "auth0-js";

const addressBookClientId = process.env.REACT_APP_ADDRESSBOOKCLIENTID;
const addressBookDomain = process.env.REACT_APP_ADDRESSBOOKDOMAIN;

function LoginCrossOrigin() {
  let auth0Client;

  return (
    <div className="application">
      <Helmet>
        <script src="https://cdn.auth0.com/js/auth0/9.11/auth0.min.js"></script>
        <script type="text/javascript">
          {
            (auth0Client = new auth0.WebAuth({
              clientID: addressBookClientId,
              domain: addressBookDomain,
            }))
          }
          {auth0Client.crossOriginVerification()}
        </script>
      </Helmet>
    </div>
  );
}

export default LoginCrossOrigin;
