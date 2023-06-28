/* eslint-disable */

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

const addressBookClientId = process.env.REACT_APP_ADDRESSBOOKCLIENTID;
const addressBookLogoutReturnTo =
  process.env.REACT_APP_ADDRESSBOOKLOGOUTRETURNTO;

export default function Header(props) {
  const { logout, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const location = useLocation();

  let currentRoute = location.pathname.toLowerCase();

  let routesToHideNav = ["/login", "/signup", "/passwordreset", "/"];

  let filteredNamesArray = [];

  useEffect(() => {
    props.contactsArray && setContacts(props.contactsArray);
  }, [props.contactsArray]);

  /////////////////////////////
  function signOut() {
    return logout({
      returnTo: addressBookLogoutReturnTo,
      clientID: addressBookClientId,
    });
  }
  //////////////////////////////

  let contactsForSearch = contacts && contacts[0];

  function handleSearch(event) {
    let newSearchQuery = event.target.value;
    let fullName;

    contactsForSearch &&
      contactsForSearch.map((contact) => {
        fullName = contact.firstName + " " + contact.lastName;

        let contactInfo = {
          contact: contact,
          fullName: fullName,
        };

        if (fullName.toLowerCase().includes(newSearchQuery.toLowerCase())) {
          if (newSearchQuery !== "") {
            filteredNamesArray.push(contactInfo);
          }
        }
      });
    setFilteredContacts(filteredNamesArray);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickSettings = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  function SettingsPopover() {
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <Popover
        className="loginPopover"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseSettings}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: "1rem 1rem 1rem", color: "#c15353" }}>
          Access restricted for demo accounts.
        </Typography>
      </Popover>
    );
  }

  if (!routesToHideNav.includes(currentRoute)) {
    return (
      <Navbar bg="light" expand="md">
        <Container className="mx-0 moveHamburgerToRight ">
          <Nav>
            <Link to="/Contacts">
              <Navbar.Brand className="">AddressBook</Navbar.Brand>
            </Link>
          </Nav>

          <Navbar.Toggle />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="marginLeft me-auto">
              <Link style={{ paddingTop: ".484rem" }} to={props.contactsHref}>
                {props.contacts}
              </Link>

              <Link
                className="categoriesButton"
                style={{
                  paddingTop: ".484rem",
                  paddingBottom: props.paddingBottom,
                }}
                to={props.categoriesHref}
              >
                {props.categories}
              </Link>

              {currentRoute !== "/contacts/details" && (
                <Form
                //  className={"d-flex" + props.class}
                >
                  <div className="container1 searchBar">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-5 nav-drop "
                      onChange={handleSearch}
                    />

                    <ul
                      class="list-group searchList scrollableSearchItems"
                      id="nav"
                    >
                      {filteredContacts.map((contactInfo) => {
                        return (
                          <a
                            className="pointer-link"
                            onClick={() => {
                              navigate("/contacts/details", {
                                state: { contactId: contactInfo.contact.id },
                              });
                            }}
                          >
                            <li className="list-group-item searchItem pointer-link">
                              {contactInfo.fullName}
                            </li>
                          </a>
                        );
                      })}
                    </ul>
                  </div>
                </Form>
              )}
            </Nav>
            <Nav className="container1" style={{}}>
              <Link
                style={{
                  paddingTop: "3.7px",
                  paddingRight: ".8rem",
                  display: props.settingsDisplay,
                }}
                className={
                  "marginLeft margin settingsButton " + props.marginClass
                }
                onClick={handleClickSettings}
              >
                Settings
              </Link>
              <SettingsPopover />

              <a
                style={{ color: "rgba(151, 149, 147, 0.7)", cursor: "pointer" }}
                onClick={signOut}
                className="logoutButton"
              >
                {props.link2}
              </a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
