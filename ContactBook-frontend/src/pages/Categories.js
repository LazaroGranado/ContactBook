/* eslint-disable */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.js";
import jwt from "jsonwebtoken";
import { useAuth0 } from "@auth0/auth0-react";
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

function Categories() {
  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const [auth0Id, setAuth0Id] = useState();

  const [categories, setCategories] = useState();
  const [categoryToEdit, setCategoryToEdit] = useState();
  const [categoryToDelete, setCategoryToDelete] = useState();
  const [contacts, setContacts] = useState();
  const [contactsToEmail, setContactsToEmail] = useState();
  const [categoryToDeleteId, setCategoryToDeleteId] = useState();
  const [deleteModalToggle, setDeleteModalToggle] = useState();
  const [editModalToggle, setEditModalToggle] = useState();

  const [contactsArray, setContactsArray] = useState([]);
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

            const categoriesPromise = new Promise((resolve, reject) => {
              axios
                .post(process.env.REACT_APP_SERVER + "/Categories", {
                  auth0Id: userId,
                })
                .then((r) => {
                  let categories = r.data;

                  setCategories(categories);

                  resolve();
                });
            });

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

            const categoriesContactsPromise = new Promise((resolve, reject) => {
              axios(process.env.REACT_APP_SERVER + "/Categories/Contacts", {
                method: "POST",
                data: {
                  userId: userId,
                },
              }).then((r) => {
                setContacts(r.data);

                resolve();
              });
            });

            Promise.all([
              categoriesPromise,
              contactsPromise,
              categoriesContactsPromise,
            ]).then(() => {
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

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  function EditModal() {
    const [newCategoryName, setNewCategoryName] = useState();

    function editCategory() {
      axios(process.env.REACT_APP_SERVER + "/Categories/Edit", {
        method: "POST",
        data: {
          userId: auth0Id && auth0Id,
          categoryToEdit: categoryToEdit,
          newCategoryName: newCategoryName,
        },
      }).then((res) => {
        if (res.data === "received request") {
          axios
            .post(process.env.REACT_APP_SERVER + "/Categories", {
              auth0Id: auth0Id && auth0Id,
            })
            .then((r) => {
              let categories = r.data;

              setCategories(categories);

              setIsLoading(false);
              handleCloseEditModal();
            });
        }
      });
    }

    return (
      <div>
        <Modal
          open={openEditModal}
          onClose={handleCloseEditModal}
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
                onClick={handleCloseEditModal}
                class="modalClose"
              ></CloseIcon>
            </div>

            <div>
              <h5 class="pb-3">Edit category name</h5>
            </div>

            <div class="">
              <h6>Category name</h6>
              <p class="pb-2">{categoryToEdit}</p>
              <input
                value={newCategoryName}
                style={{
                  backgroundColor: "rgb(47, 48, 47)",
                  color: "#d9d8d3",
                  borderColor: "#3f4243",
                  width: "100%",
                  marginBottom: "1.89rem",
                }}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                }}
                type="text"
              />
            </div>

            <div class="text-end">
              <button onClick={editCategory} class="btn btn-primary">
                Save
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    );
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
              <h5 class="pb-3">Confirm delete</h5>
            </div>

            <div class="">
              <h6>Category name</h6>
              <p class="pb-2">{categoryToDelete}</p>
            </div>

            <div class="text-end">
              <button onClick={deleteCategory} class="btn btn-primary">
                Delete
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    );
  }

  function deleteCategory() {
    axios(process.env.REACT_APP_SERVER + "/Categories/Delete", {
      method: "POST",
      data: {
        userId: auth0Id && auth0Id,
        categoryToDeleteId: categoryToDeleteId,
      },
    }).then((res) => {
      if (res.data === "received request") {
        axios
          .post(process.env.REACT_APP_SERVER + "/Categories", {
            auth0Id: auth0Id && auth0Id,
          })
          .then((r) => {
            let categories = r.data;

            axios(process.env.REACT_APP_SERVER + "/Categories/Contacts", {
              method: "POST",
              data: {
                userId: auth0Id && auth0Id,
              },
            }).then((r) => {
              setCategories(categories);
              setContacts(r.data);
              setIsLoading(false);
              handleCloseDeleteModal();
            });
          });
      }
    });
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

        <div className="container mt-3">
          <EditModal />
          <DeleteModal />

          <div className="row pt-5">
            <div className="col-lg-7 col-md-8 col-xl-5 mx-auto">
              <div className="categoriesContainerDiv">
                <div className="mb-5 mt-4">
                  <p>
                    <h1>
                      Categories
                      <Link to="/Categories/Create">
                        <a className="btn btn-dark mt-2 float-end">
                          Create New
                        </a>
                      </Link>
                    </h1>
                  </p>
                </div>

                <table class="table">
                  <thead>
                    <tr className="fs-3">
                      <th scope="col">Category</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories &&
                      categories.map((category) => {
                        return (
                          <tr>
                            <td>
                              <a style={{}} className="btn">
                                <th
                                  onClick={() => {
                                    navigate("/Categories/Details", {
                                      state: { categoryToViewId: category.id },
                                    });
                                  }}
                                  scope="row"
                                >
                                  {category.categoryName}
                                </th>
                              </a>
                            </td>

                            <td className="text-end">
                              <button
                                data-bs-target="#editModal"
                                //  data-bs-toggle="modal"
                                onClick={(e) => {
                                  setCategoryToEdit(category.categoryName);
                                  handleOpenEditModal();
                                }}
                                title="Edit Category"
                                className="bi bi-pencil-fill btn btn-sm "
                              ></button>

                              <form
                                style={{ display: "inline" }}
                                method="post"
                                action={"mailto:" + contactsToEmail}
                              >
                                <button
                                  onClick={() => {
                                    setContactsToEmail(() => {
                                      return (
                                        contacts &&
                                        contacts.map((contact) => {
                                          return category.categoryName ===
                                            contact.category
                                            ? contact.email + ","
                                            : null;
                                        })
                                      );
                                    });
                                  }}
                                  type="submit"
                                  title="Send Group Email"
                                  className="bi bi-envelope-fill btn btn-sm "
                                ></button>
                              </form>

                              <button
                                onClick={(e) => {
                                  setCategoryToDelete(category.categoryName);
                                  setCategoryToDeleteId(category.id);
                                  handleOpenDeleteModal();
                                }}
                                title="Delete Category"
                                className="bi bi-trash-fill btn btn-sm "
                              ></button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                <Link to="/Contacts">
                  <p className="pt-4">
                    <a>Back to contacts</a>
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Categories;
