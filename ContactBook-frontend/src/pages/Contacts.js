/* eslint-disable */

import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ContactCard } from "../components/ContactCard.js";
import Header from "../components/Header.js";
import _ from "lodash";
import jwt from "jsonwebtoken";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgb(18, 18, 18)",
  border: "2px solid #000",
  boxShadow: 25,
  p: 5,
  borderRadius: "10px",
  backgroundColor: "#424242",
};

function Contacts() {
  const [isLoading, setIsLoading] = useState(true);

  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [auth0Id, setAuth0Id] = useState();

  const [contacts, setContacts] = useState([]);
  const [name4DeleteModal, setName4DeleteModal] = useState();
  const [deletedContactId, setDeletedContactId] = useState();
  const [contactToEdit, setContactToEdit] = useState();
  const [defaultImage, setDefaultImage] = useState();
  const [deleteModalToggle, setDeleteModalToggle] = useState();

  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();

  if (location.search !== "") {
    window.history.replaceState("", "", "/Contacts");
  }

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
                setDefaultImage(response.data.defaultImage);
                setIsLoading(false);
              });
          }
        };

        decodeIdToken();
      })
      .catch((e) => {
        if (e.toString() === "Error: Login required") {
          navigate("/");
        }
      });
  }, []);

  ///////////////////////

  useEffect(() => {
    if (document.getElementById("exampleModal")) {
      setDeleteModalToggle(
        new bootstrap.Modal(document.getElementById("exampleModal"), {
          keyboard: false,
        })
      );
    }
  }, [contacts]);

  function postDeletedIdToServer() {
    axios(process.env.REACT_APP_SERVER + "/Delete", {
      method: "POST",
      data: { ID: deletedContactId },
    }).then((res) => {
      axios
        .post(process.env.REACT_APP_SERVER + "/Contacts", {
          auth0Id: auth0Id && auth0Id,
        })
        .then((response) => {
          setContacts([response.data.contacts]);
          setDefaultImage(response.data.defaultImage);
          setIsLoading(false);
          res.data === "deleted" && handleCloseDeleteModal();
        })
        .catch((error) => {});
    });
  }

  let contactsForSearch = contacts[0];

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  function DeleteModal() {
    return (
      <div>
        <Modal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableAutoFocus={true}
          slotProps={{
            backdrop: { style: { background: "rgba(0, 0, 0, .8)" } },
          }}
        >
          <Box sx={style} className="mainModal">
            <div class="modalCloseDiv">
              <CloseIcon
                onClick={handleCloseDeleteModal}
                class="modalClose"
              ></CloseIcon>
            </div>

            <div>
              <h5 class="pb-3">Delete Contact</h5>
            </div>

            <div class="">
              <p class="pb-4">
                Delete contact information for {name4DeleteModal}?
              </p>
            </div>

            <div class="text-end">
              <button onClick={postDeletedIdToServer} class="btn btn-primary">
                Delete
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    );
  }

  if (isLoading) {
    return <div></div>;
  } else {
    return (
      <div>
        <Header
          contactsArray={contacts && contacts}
          href1={"/Settings"}
          link1={"Settings"}
          link2={"Logout"}
          categories={"Categories"}
          contacts={"Contacts"}
          contactsHref="/Contacts"
          categoriesHref="/Categories"
        />
        <div className="container mb-5 mt-5">
          <DeleteModal />

          <div className="main contactsMainDiv">
            <div className="row row-cols-lg-2 row-cols-xl-3 row-cols-md-2 row-cols-sm-1 row-cols-1 ">
              <h1 className="width">
                {" "}
                Contacts
                <Link to="/Contacts/Create">
                  <a className="btn btn-dark mt-2 float-end">CREATE NEW</a>
                </Link>
              </h1>
            </div>

            <div className="row row-cols-lg-2 row-cols-xl-3 row-cols-md-2 row-cols-sm-1 row-cols-1 ">
              {contacts.map((contactArray) => {
                return _.sortBy(contactArray, ["firstName"]).map((contact) => {
                  let image;

                  if (contact.imageData) {
                    image = contact.imageData;
                  } else {
                    image = defaultImage;
                  }

                  if (auth0Id === contact.auth0Id) {
                    return (
                      <ContactCard
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        address={contact.address}
                        address2={contact.address2}
                        city={contact.city}
                        state={contact.state}
                        zip={contact.zip}
                        email={contact.email}
                        phoneNumber={contact.phoneNumber}
                        contactImage={image}
                        emailForForm={contact.email}
                        onClickTrashIcon={(e) => {
                          setName4DeleteModal(
                            contact.firstName + " " + contact.lastName
                          );
                          setDeletedContactId(contact.id);
                          handleOpenDeleteModal();
                        }}
                        transferContactButton={() => {
                          setContactToEdit(contact);

                          navigate("/Contacts/Details", {
                            state: {
                              contactId: contact.id,
                            },
                          });
                        }}
                        transferContact={() => {
                          setContactToEdit(contact);

                          navigate("/Contacts/Details", {
                            state: {
                              contactId: contact.id,
                            },
                          });
                        }}
                        transferContactForEdit={() => {
                          navigate("/Contacts/Edit", {
                            state: {
                              contactId: contact.id,
                            },
                          });
                        }}
                      />
                    );
                  } else {
                    return null;
                  }
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Contacts;
