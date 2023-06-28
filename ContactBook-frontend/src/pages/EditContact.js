/* eslint-disable */
import React, { useState } from "react";
import Header from "../components/Header.js";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import jwt from "jsonwebtoken";

import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileRename from "filepond-plugin-file-rename";
import FilePondPluginGetFile from "filepond-plugin-get-file";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename,
  FilePondPluginGetFile
);

function EditContact() {
  const [isLoading, setIsLoading] = useState(true);

  const { state } = useLocation();

  const [contactId, setContactId] = useState(state.contactId);

  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  // const auth0Id = isAuthenticated && user.sub

  const [contact, setContact] = useState();
  const [contacts, setContacts] = useState();

  const [categories, setCategories] = useState([]);
  const [chosenCategory, setChosenCategory] = useState();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [chosenCategories, setChosenCategories] = useState([]);
  const [auth0Id, setAuth0Id] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [contactState, setContactState] = useState("AK");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [contactImage, setContactImage] = useState();
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");
  const [contactImageBase64, setContactImageBase64] = useState();
  const [files, setFiles] = useState();
  const [loadedImageIsNew, setLoadedImageIsNew] = useState(true);

  const [isInvalidForNoFirstName, setIsInvalidForNoFirstName] = useState("");
  const [isInvalidForNoFirstNameFeedback, setIsInvalidForNoFirstNameFeedback] =
    useState("");
  const [isInvalidForNoLastName, setIsInvalidForNoLastName] = useState("");
  const [isInvalidForNoLastNameFeedback, setIsInvalidForNoLastNameFeedback] =
    useState("");

  const [isInvalidForNoCity, setIsInvalidForNoCity] = useState("");
  const [isInvalidForNoCityFeedback, setIsInvalidForNoCityFeedback] =
    useState("");

  const [isInvalidForNoZip, setIsInvalidForNoZip] = useState("");
  const [isInvalidForNoZipFeedback, setIsInvalidForNoZipFeedback] =
    useState("");

  const [isInvalidForNoEmail, setIsInvalidForNoEmail] = useState("");
  const [isInvalidForNoEmailFeedback, setIsInvalidForNoEmailFeedback] =
    useState("");

  const [isInvalidForNoAddress, setIsInvalidForNoAddress] = useState("");
  const [isInvalidForNoAddressFeedback, setIsInvalidForNoAddressFeedback] =
    useState("");

  let newCategories = [];

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
                .post(process.env.REACT_APP_SERVER + "/Categories/GetAll", {
                  auth0Id: userId,
                })
                .then((r) => {
                  let categories = r.data;

                  r.data && setCategories(r.data);
                  resolve(categories);
                });
            });

            const contactsEditPromise = new Promise((resolve, reject) => {
              axios
                .post(
                  process.env.REACT_APP_SERVER +
                    "/Contacts/Edit/ContactDetails",
                  {
                    contactId: contactId,
                    auth0Id: userId,
                  }
                )
                .then((r) => {
                  let contact = r.data.contact;
                  setContact(contact);

                  resolve(contact);
                });
            });

            const contactsPromise = new Promise((resolve, reject) => {
              axios
                .post(process.env.REACT_APP_SERVER + "/Contacts", {
                  auth0Id: userId,
                })
                .then((response) => {
                  setContacts([response.data.contacts]);

                  resolve();
                });
            });

            Promise.all([
              categoriesPromise,
              contactsEditPromise,
              contactsPromise,
            ]).then((values) => {
              let selectedCategoriesArray = [];

              let categories = values[0];

              let contact = values[1];

              Array.isArray(categories) &&
                categories.map((category) => {
                  let chosen = false;

                  Array.isArray(contact.categories) &&
                    contact.categories.map((contactCategory) => {
                      if (
                        contactCategory.categoryName === category.categoryName
                      )
                        chosen = true;
                    });

                  let categoryInfo = {
                    ...category,
                    isChosen: chosen,
                  };

                  selectedCategoriesArray.push(categoryInfo);
                });

              setFirstName(contact.firstName);
              setLastName(contact.lastName);
              setAddress(contact.address);
              setAddress2(contact.address2);
              setContactState(contact.contactState);
              setPhoneNumber(contact.phoneNumber);
              setBirthDate(contact.date);
              setCity(contact.city);
              setZip(contact.zip);
              setEmail(contact.email);

              if (contact.imageData) {
                let base64 = contact.imageData;
                let file = "data:image/png;base64," + base64;

                setLoadedImageIsNew(false);

                setFiles([file]);
              }

              setSelectedCategories(selectedCategoriesArray);
              Array.isArray(contact.categories) &&
                setChosenCategories(contact.categories);

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

  function CategoriesList() {
    function handleSetSelectedCategories(e) {
      let name = e.target.value;

      let newChosenCategories = [];

      let newSelectedCategories = selectedCategories;

      newSelectedCategories = newSelectedCategories.map((category) => {
        if (category.categoryName === name) {
          category.isChosen = !category.isChosen;
          return category;
        } else {
          return category;
        }
      });
      newSelectedCategories.map((category) => {
        category.isChosen && newChosenCategories.push(category);
      });
      setChosenCategories(newChosenCategories);
    }

    return (
      selectedCategories &&
      selectedCategories.map((category, index) => {
        return (
          <ListItem disablePadding>
            <ListItemIcon>
              <Checkbox
                onClick={handleSetSelectedCategories}
                // edge="start"
                value={category.categoryName}
                checked={category.isChosen}
              />
            </ListItemIcon>
            <ListItemText primary={category.categoryName} />
          </ListItem>
        );
      })
    );
  }

  function editContact() {
    if (
      firstName === "" ||
      lastName === "" ||
      city === "" ||
      zip === "" ||
      email === "" ||
      address === ""
    ) {
      if (firstName === "") {
        setIsInvalidForNoFirstName("is-invalid");
        setIsInvalidForNoFirstNameFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoFirstName("");
        setIsInvalidForNoFirstNameFeedback("");
      }
      if (lastName === "") {
        setIsInvalidForNoLastName("is-invalid");
        setIsInvalidForNoLastNameFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoLastName("");
        setIsInvalidForNoLastNameFeedback("");
      }

      if (city === "") {
        setIsInvalidForNoCity("is-invalid");
        setIsInvalidForNoCityFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoCity("");
        setIsInvalidForNoCityFeedback("");
      }

      if (zip === "") {
        setIsInvalidForNoZip("is-invalid");
        setIsInvalidForNoZipFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoZip("");
        setIsInvalidForNoZipFeedback("");
      }

      if (email === "") {
        setIsInvalidForNoEmail("is-invalid");
        setIsInvalidForNoEmailFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoEmail("");
        setIsInvalidForNoEmailFeedback("");
      }

      if (address === "") {
        setIsInvalidForNoAddress("is-invalid");
        setIsInvalidForNoAddressFeedback("Please fill out this field");
      } else {
        setIsInvalidForNoAddress("");
        setIsInvalidForNoAddressFeedback("");
      }
    } else {
      setIsInvalidForNoAddress("");
      setIsInvalidForNoEmail("");
      setIsInvalidForNoZip("");
      setIsInvalidForNoCity("");
      setIsInvalidForNoLastName("");
      setIsInvalidForNoFirstName("");

      setIsInvalidForNoAddressFeedback("");
      setIsInvalidForNoEmailFeedback("");
      setIsInvalidForNoZipFeedback("");
      setIsInvalidForNoCityFeedback("");
      setIsInvalidForNoLastNameFeedback("");
      setIsInvalidForNoLastNameFeedback("");
      setIsInvalidForNoFirstNameFeedback("");

      axios
        .post(process.env.REACT_APP_SERVER + "/Contacts/Edit", {
          firstName: firstName,
          lastName: lastName,
          address: address,
          address2: address2,
          city: city,
          state: contactState,
          zip: zip,
          email: email,
          phoneNumber: phoneNumber,
          birthDate: birthDate && birthDate,
          categories: chosenCategories,
          contactImageBase64: contactImageBase64 && contactImageBase64,
          auth0Id: auth0Id && auth0Id,
          contactId: contact && contact.id,
        })
        .then((r) => {
          navigate("/Contacts");
        });
    }
  }

  function handleSetFirstName(e) {
    setFirstName(e.target.value);
  }
  function handleSetLastName(e) {
    setLastName(e.target.value);
  }
  function handleSetAddress(e) {
    setAddress(e.target.value);
  }
  function handleSetAddress2(e) {
    setAddress2(e.target.value);
  }
  function handleSetState(e) {
    setContactState(e.target.value);
  }
  function handleSetPhoneNumber(e) {
    setPhoneNumber(e.target.value);
  }
  function handleSetBirthDate(e) {
    setBirthDate(e.target.value);
  }
  function handleSetContactImage(e) {
    // setContactImage()
  }
  function handleSetCity(e) {
    setCity(e.target.value);
  }
  function handleSetZip(e) {
    setZip(e.target.value);
  }
  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  if (isLoading) {
    return <div></div>;
  } else {
    return (
      <div>
        <Header
          contactsArray={contacts && contacts}
          href1="/Settings"
          link1={"Settings"}
          link2={"Logout"}
          categories={"Categories"}
          contacts={"Contacts"}
          contactsHref="/Contacts"
          categoriesHref="/Categories"
        />
        <div className="container mt-4">
          <div className="row">
            <div className="col-xl-9 mx-auto">
              <div className="contactCreateContainerDiv">
                <h2 className="pb-4 pt-1">Edit contact</h2>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      value={firstName}
                      required
                      name="firstName"
                      onChange={handleSetFirstName}
                      type="text"
                      className={"form-control " + isInvalidForNoFirstName}
                    />
                    <div class="invalid-feedback">
                      {isInvalidForNoFirstNameFeedback}
                    </div>
                  </div>

                  <div className="col-md-6 has-validation">
                    <label className="form-label">Last Name</label>
                    <input
                      value={lastName}
                      required
                      type="text"
                      className={"form-control " + isInvalidForNoLastName}
                      name="lastName"
                      onChange={handleSetLastName}
                    />
                    <div class="invalid-feedback">
                      {isInvalidForNoLastNameFeedback}
                    </div>
                  </div>

                  <div className="col-6 has-validation">
                    <label className="form-label">Address</label>
                    <input
                      required
                      type="text"
                      className={"form-control " + isInvalidForNoAddress}
                      id="inputAddress"
                      placeholder="1234 Main St"
                      name="address"
                      value={address}
                      onChange={handleSetAddress}
                    />
                    <div class="invalid-feedback">
                      {isInvalidForNoAddressFeedback}
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Address 2</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress2"
                      placeholder="Apartment, studio, or floor"
                      name="address2"
                      value={address2}
                      onChange={handleSetAddress2}
                    />
                  </div>
                  <div className="col-md-4 has-validation">
                    <label>City</label>
                    <input
                      required
                      type="text"
                      className={"form-control " + isInvalidForNoCity}
                      id="inputCity"
                      name="city"
                      value={city}
                      onChange={handleSetCity}
                    />
                    <div class="invalid-feedback">
                      {isInvalidForNoCityFeedback}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label>State</label>
                    <select
                      id="inputState"
                      defaultValue="AZ"
                      value={state}
                      onChange={handleSetState}
                      className="form-select"
                      name="state"
                    >
                      <option>AK</option>
                      <option>AL</option>
                      <option>AR</option>
                      <option>AS</option>
                      <option>AZ</option>
                      <option>CA</option>
                      <option>CO</option>
                      <option>CT</option>
                      <option>DC</option>
                      <option>DE</option>
                      <option>FL</option>
                      <option>GA</option>
                      <option>GU</option>
                      <option>HI</option>
                      <option>IA</option>
                      <option>ID</option>
                      <option>IL</option>
                      <option>IN</option>
                      <option>KS</option>
                      <option>KY</option>
                      <option>LA</option>
                      <option>MA</option>
                      <option>MD</option>
                      <option>ME</option>
                      <option>MI</option>
                      <option>MN</option>
                      <option>MO</option>
                      <option>MP</option>
                      <option>MS</option>
                      <option>MT</option>
                      <option>NC</option>
                      <option>ND</option>
                      <option>NE</option>
                      <option>NH</option>
                      <option>NJ</option>
                      <option>NM</option>
                      <option>NV</option>
                      <option>NY</option>
                      <option>OH</option>
                      <option>OK</option>
                      <option>OR</option>
                      <option>PA</option>
                      <option>PR</option>
                      <option>RI</option>
                      <option>SC</option>
                      <option>SD</option>
                      <option>TN</option>
                      <option>TX</option>
                      <option>UM</option>
                      <option>UT</option>
                      <option>VA</option>
                      <option>VI</option>
                      <option>VT</option>
                      <option>WA</option>
                      <option>WI</option>
                      <option>WV</option>
                      <option>WY</option>
                    </select>
                  </div>

                  <div className="col-md-4 has-validation">
                    <label>Zip</label>
                    <input
                      required
                      type="text"
                      className={"form-control " + isInvalidForNoZip}
                      id="inputZip"
                      name="zip"
                      value={zip}
                      onChange={handleSetZip}
                    />
                    <div class="invalid-feedback">
                      {isInvalidForNoZipFeedback}
                    </div>
                  </div>
                  <div className="col-md-4 has-validation">
                    <label>Email</label>
                    <input
                      required
                      type="text"
                      className={"form-control " + isInvalidForNoEmail}
                      name="email"
                      value={email}
                      onChange={handleSetEmail}
                    />
                    <div class="invalid-feedback">
                      {isInvalidForNoEmailFeedback}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label>Phone Number</label>
                    <input
                      noValidate
                      type="text"
                      value={phoneNumber}
                      onChange={handleSetPhoneNumber}
                      className="form-control"
                      name="phoneNumber"
                    />
                  </div>
                  <div className=" col-md-4">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={birthDate}
                      onChange={handleSetBirthDate}
                    />
                  </div>

                  <div className="col-lg-4 col-md-8">
                    <label className="form-label">Categories</label>

                    <List
                      className="scrollableCategories"
                      sx={{
                        width: "100%",
                        bgcolor: "#2b2b2b",
                        borderRadius: "4px",
                        minHeight: "4.75rem",
                      }}
                    >
                      <CategoriesList />
                    </List>
                  </div>

                  <div
                    className="col-md-4 filepondHeight"
                    style={{ height: "10rem" }}
                  >
                    <label className="form-label">Contact image</label>

                    <FilePond
                      style={{
                        marginBottom: 0,
                        backgroundColor: "rgb(196, 0, 0)",
                      }}
                      className="createAndEditPage"
                      instantUpload={false}
                      files={files}
                      onupdatefiles={(files) => {
                        setFiles(files);

                        if (files.length > 0) {
                          files.map((file) => {
                            const base64String =
                              file.getFileEncodeBase64String();

                            setContactImageBase64(base64String);
                          });
                        } else {
                          setContactImageBase64(null);
                        }
                      }}
                      allowMultiple={false}
                      labelIdle={
                        '<p className="">Drag & Drop your files or <span class="btn browseButton ">Browse</span> </p>'
                      }
                      credits={false}
                      acceptedFileTypes={["image/png", "image/jpeg"]}
                      fileRenameFunction={(file) => {
                        setLoadedImageIsNew(true);

                        return loadedImageIsNew ? file.name : " ";
                      }}
                      imagePreviewMaxHeight={97}
                    ></FilePond>
                  </div>

                  <div className="row px-0 pt-5">
                    <div className="col-8">
                      <p>
                        <a
                          style={{ paddingLeft: "4.88px" }}
                          onClick={() => {
                            navigate("/Contacts");
                          }}
                          className=" btn"
                        >
                          Back to Contacts
                        </a>
                      </p>
                    </div>

                    <div className="col-4 text-end pe-0">
                      <button onClick={editContact} className="btn btn-primary">
                        SAVE
                      </button>
                    </div>
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

export default EditContact;
