/* eslint-disable */

import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoriesCreate from "./pages/CategoriesCreate";
import "./App.css";
import Layout from "./pages/Layout";
import Contacts from "./pages/Contacts";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import EditContact from "./pages/EditContact";
import Create from "./pages/Create";
import ContactDetails from "./pages/ContactDetails";
import CategoriesDetails from "./pages/CategoriesDetails";
import auth0 from "auth0-js";

const addressBookClientId = process.env.REACT_APP_ADDRESSBOOKCLIENTID;
const addressBookDomain = process.env.REACT_APP_ADDRESSBOOKDOMAIN;
const addressBookWebAuthRedirectUri =
  process.env.REACT_APP_ADDRESSBOOKWEBAUTHREDIRECTURI;

const addressBookAudience = process.env.REACT_APP_ADDRESSBOOKAUDIENCE;
const addressBookWebAuthResponseType =
  process.env.REACT_APP_ADDRESSBOOKWEBAUTHRESPONSETYPE;
const addressBookWebAuthLoginResponseType =
  process.env.REACT_APP_ADDRESSBOOKWEBAUTHLOGINRESPONSETYPE;
const addressBookPrompt = process.env.REACT_APP_ADDRESSBOOKPROMPT;
const addressBookScope = process.env.REACT_APP_ADDRESSBOOKSCOPE;

export const webAuth = new auth0.WebAuth({
  clientID: addressBookClientId,
  domain: addressBookDomain,
  redirectUri: addressBookWebAuthRedirectUri,
  audience: addressBookAudience,
  scope: addressBookScope,
  responseType: addressBookWebAuthResponseType,
  prompt: addressBookPrompt,
});

export const webAuthLogin = new auth0.WebAuth({
  clientID: addressBookClientId,
  domain: addressBookDomain,
  redirectUri: window.location.origin,
  audience: addressBookAudience,
  scope: addressBookScope,
  responseType: addressBookWebAuthLoginResponseType,
  prompt: addressBookPrompt,
});

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="Categories" element={<Categories />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Login" element={<Login />} />
        <Route path="Contacts/Create" element={<Create />} />
        <Route path="Categories/Create" element={<CategoriesCreate />} />
        <Route path="Contacts/Edit" element={<EditContact />} />
        <Route path="Contacts/Details" element={<ContactDetails />} />
        <Route path="/Categories/Details" element={<CategoriesDetails />} />
      </Route>
    </Routes>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Auth0Provider
      domain={addressBookDomain}
      clientId={addressBookClientId}
      authorizationParams={{
        audience: addressBookAudience,
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);
