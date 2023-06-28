import { useAuth0 } from "@auth0/auth0-react";
/* eslint-disable */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ContactCard } from "../components/ContactCard";
import Header from "../components/Header";
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

function CategoriesDetails() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const { state } = useLocation();

  const [categoryToViewId, setCategoryToViewId] = useState(
    state.categoryToViewId
  );
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const userId = isAuthenticated && user.sub;
  const [contacts, setContacts] = useState();
  const [auth0Id, setAuth0Id] = useState();

  const [contactsArray, setContactsArray] = useState([]);

  const [name4DeleteModal, setName4DeleteModal] = useState();
  const [deletedContactId, setDeletedContactId] = useState();
  const [category, setCategory] = useState();
  const [defaultImage, setDefaultImage] = useState();

  useEffect(() => {
    let userId;

    getAccessTokenSilently({ detailedResponse: true })
      .then((r) => {
        const decodeIdToken = async () => {
          const decodedIdToken = jwt.decode(r.id_token);

          userId = decodedIdToken.sub;

          if (userId) {
            setAuth0Id(userId);

            const contactsPromise = new Promise((resolve, reject) => {
              axios
                .post(process.env.REACT_APP_SERVER + "/Contacts", {
                  auth0Id: userId,
                })
                .then((response) => {
                  setContactsArray([response.data.contacts]);

                  resolve();
                });
            });

            const categoriesDetailsPromise = new Promise((resolve, reject) => {
              axios
                .post(process.env.REACT_APP_SERVER + "/Categories/Details", {
                  auth0Id: userId,
                  categoryToViewId: categoryToViewId && categoryToViewId,
                })
                .then((r) => {
                  setContacts(r.data.contactsWithCategoryAdded);
                  setCategory(r.data.categoryToView.categoryName);
                  setDefaultImage(r.data.defaultImage);

                  resolve();
                });
            });

            Promise.all([contactsPromise, categoriesDetailsPromise]).then(
              () => {
                setIsLoading(false);
              }
            );
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

  function postDeletedIdToServer() {
    axios(process.env.REACT_APP_SERVER + "/Delete", {
      method: "POST",
      data: { ID: deletedContactId },
    }).then((res) => {
      res.data === "deleted" && navigate(0);
    });
  }

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
          contactsArray={contactsArray}
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
            <h1>{category}</h1>

            <div className="row row-cols-lg-2 row-cols-xl-3 row-cols-md-2 row-cols-sm-1 row-cols-1 ">
              {contacts &&
                contacts.map((contact) => {
                  let image;
                  let base64Img;
                  if (contact.imageData) {
                    image = contact.imageData;
                  } else {
                    image = defaultImage;
                  }

                  return (
                    <ContactCard
                      firstName={contact.firstName}
                      lastName={contact.lastName}
                      address={contact.address}
                      address2={contact.address2}
                      zip={contact.zip}
                      email={contact.email}
                      phoneNumber={contact.phoneNumber}
                      emailForForm={contact.email}
                      city={contact.city}
                      contactImage={image}
                      name={name4DeleteModal}
                      transferContact={() => {
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
                      onClickTrashIcon={(e) => {
                        setName4DeleteModal(
                          contact.firstName + " " + contact.lastName
                        );
                        setDeletedContactId(contact.id);

                        handleOpenDeleteModal();
                      }}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoriesDetails;

{
  /* <div>
    <div className='card-group'>

        <div className='card'>

            <div className='card-body'>



            </div>

        </div>

    </div>




</div> */
}
