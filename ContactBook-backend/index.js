const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const PORT = process.env.PORT;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cors = require("cors");
const { post } = require("request");
const { STRING } = require("sequelize");
const axios = require("axios").default;
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "https://lazaro-contactbook.com" }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

const addressBookDomain = process.env.ADDRESSBOOKDOMAIN;

const addressBookManagementClientId = process.env.ADDRESSBOOKMANAGEMENTCLIENTID;
const addressBookManagementClientSecret =
  process.env.ADDRESSBOOKMANAGEMENTCLIENTSECRET;
const addressBookManagementClientScope =
  process.env.ADDRESSBOOKMANAGEMENTCLIENTSCOPE;

const addressBookAuthenticationClientId =
  process.env.ADDRESSBOOKAUTHENTICATIONCLIENTID;
const addressBookAuthenticationClientSecret =
  process.env.ADDRESSBOOKAUTHENTICATIONCLIENTSECRET;

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: process.env.PGUSER,
    logging: false,
    port: process.env.PGPORT,
  }
);

var ManagementClient = require("auth0").ManagementClient;
var auth0 = new ManagementClient({
  domain: addressBookDomain,
  clientId: addressBookManagementClientId,
  clientSecret: addressBookManagementClientSecret,
  scope: addressBookManagementClientScope,
});

var AuthenticationClient = require("auth0").AuthenticationClient;

var auth0authentication = new AuthenticationClient({
  domain: addressBookDomain,
  clientId: addressBookAuthenticationClientId,
  clientSecret: addressBookAuthenticationClientSecret,
});

var accountInfo = {};

const Contact = sequelize.define(
  "Contact",
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    address2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    zip: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING },
    categories: { type: DataTypes.ARRAY(DataTypes.JSON) },
    imageData: { type: DataTypes.TEXT },
    auth0Id: { type: DataTypes.STRING },
  },
  { timestamps: false }
);
Contact.sync({ alter: true });

const Category = sequelize.define(
  "Category",
  {
    categoryName: STRING,
    auth0Id: STRING,
  },
  { timestamps: false }
);

Category.sync({ alter: true });

app.post("/Contacts", (req, res) => {
  const auth0Id = req.body.auth0Id;

  const findContact = async () => {
    Contact.findAll({ where: { auth0Id: auth0Id } }).then((r) => {
      let contacts = r;

      let defaultImage;

      fs.readFile("./images/default.jpg", function (err, data) {
        defaultImage = data.toString("base64");

        const contactInfo = {
          contacts: contacts,
          defaultImage: defaultImage,
        };

        res.send(contactInfo);
      });
    });
  };
  findContact();
});

app.post("/Contacts/Create", (req, res, next) => {
  const base64FromImage = req.body.contactImageBase64;

  const categories = req.body.categories;

  const createContact = () => {
    Contact.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      date: req.body.birthDate && req.body.birthDate,
      categories: categories,
      imageData: base64FromImage && base64FromImage,
      auth0Id: req.body.auth0Id,
    }).then((r) => {
      res.send();
    });
  };
  createContact();
});

app.get("/Contacts/Create", (req, res) => {
  const findContact = async () => {
    const contact = await Contact.findOne({
      where: { firstName: "test" },
    });
    res.send(contact.imageData.toString("base64"));
  };
  findContact();
});

app.post("/Delete", (req, res) => {
  const ContactID = req.body.ID;
  const deleteContact = async () => {
    await Contact.destroy({ where: { id: ContactID } });
    res.send("deleted");
  };
  deleteContact();
});

//////////////////
let data;
let contactForSearch;
let contactForCategories;
let contactForEditFromContacts;
let contactForEditFromCategories;

app.post("/Contacts/contactForEditFromContacts", (req, res) => {
  contactForSearch = "";
  data = "";
  contactForCategories = "";
  contactForEditFromCategories = "";

  contactForEditFromContacts = req.body;
  res.send("completed");
});

app.post("/Contacts/contactForEditFromCategories", (req, res) => {
  contactForSearch = "";
  data = "";
  contactForCategories = "";
  contactForEditFromContacts = "";

  contactForEditFromCategories = req.body;
  res.send("completed");
});

app.post("/Contacts/ContactInfoCategories", (req, res) => {
  contactForSearch = "";
  data = "";
  contactForEditFromCategories = "";
  contactForEditFromContacts = "";

  contactForCategories = req.body;
  res.send("completed");
});

app.post("/Contacts/ContactInfo", (req, res) => {
  contactForCategories = "";
  contactForSearch = "";
  contactForEditFromContacts = "";
  contactForEditFromCategories = "";

  data = req.body;
  res.send("completed");
});

app.post("/Contacts/Details", (req, res) => {
  let contactId = req.body.contactId;
  let auth0Id = req.body.auth0Id;

  let defaultImage = fs.readFileSync("./images/default.jpg");

  defaultImage = defaultImage.toString("base64");

  Contact.findOne({ where: { id: contactId, auth0Id: auth0Id } }).then((r) => {
    const contact = r;
    const info = {
      defaultImage: defaultImage,
      contact: contact,
    };
    res.send(info);
  });
});

app.post("/Contacts/Edit/ContactDetails", (req, res) => {
  let contactId = req.body.contactId;
  const auth0Id = req.body.auth0Id;

  let defaultImage = fs.readFileSync("./images/default.jpg");

  defaultImage = defaultImage.toString("base64");

  Contact.findOne({ where: { id: contactId, auth0Id: auth0Id } }).then((r) => {
    const contact = r;
    const info = {
      defaultImage: defaultImage,
      contact: contact,
    };
    res.send(info);
  });
});

app.post("/Contacts/ContactInfoForSearch", (req, res) => {
  contactForCategories = "";
  data = "";
  contactForEditFromCategories = "";
  contactForEditFromContacts = "";

  contactForSearch = req.body;
  res.send("completed");
});

app.get("/Contacts/ContactInfo", (req, res) => {
  res.send(data);
});

app.get("/Contacts/ContactInfoForSearch", (req, res) => {
  res.send(contactForSearch);
});

app.get("/Contacts/ContactInfoCategories", (req, res) => {
  res.send(contactForCategories);
});

app.get("/Contacts/contactForEditFromCategories", (req, res) => {
  res.send(contactForEditFromCategories);
});
app.get("/Contacts/contactForEditFromContacts", (req, res) => {
  res.send(contactForEditFromContacts);
});

/////////////

app.post("/Contacts/Edit", (req, res) => {
  const base64FromImage = req.body.contactImageBase64;

  const categories = req.body.categories;

  Contact.update(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      date: req.body.date,
      categories: categories,
      imageData: base64FromImage && base64FromImage,
      auth0Id: req.body.auth0Id,
    },
    { where: { id: req.body.contactId } }
  ).then(() => {
    res.send();
  });
});

/////////////////////////////////////////////////////////

app.post("/Settings/updatePhoneOrEmail", (req, res) => {
  const userId = req.body.userId;
  const updatedEmail = req.body.updatedEmail;
  const updatedPhoneNumber = req.body.updatedPhoneNumber;

  let isUpdatingOnlyPhoneNumber = false;
  let isUpdatingOnlyEmail = false;
  let updateBoth = false;

  let userInfo = {
    emailResponse: null,
    phoneNumberResponse: null,
    phoneNumberUpdated: false,
  };

  if (updatedEmail && updatedPhoneNumber !== null) {
    updateBoth = true;

    updateUserData();
  } else {
    if (updatedEmail) isUpdatingOnlyEmail = true;
    if (updatedPhoneNumber !== null) isUpdatingOnlyPhoneNumber = true;
    updateUserData();
  }

  function updateUserData() {
    function updateOnlyEmail() {
      auth0.updateUser({ id: userId }, { email: updatedEmail }, (err, user) => {
        if (err) {
          userInfo.emailResponse = err;
          res.send(userInfo);
        } else {
          userInfo.emailResponse = user.email;
          res.send(userInfo);
        }
      });
    }

    function updateOnlyPhoneNumber() {
      auth0.updateUserMetadata(
        { id: userId },
        { phoneNumber: updatedPhoneNumber },
        (err, user) => {
          // res.write(user.user_metadata.phoneNumber)
          if (err) {
            userInfo.phoneNumberResponse = err;
            res.send(userInfo);
          } else {
            userInfo.phoneNumberResponse = user.user_metadata.phoneNumber;

            userInfo.phoneNumberUpdated = true;

            res.send(userInfo);
          }
        }
      );
    }

    function updateEmailAndPhoneNumber() {
      auth0.updateUser({ id: userId }, { email: updatedEmail }, (err, user) => {
        if (err) {
          userInfo.emailResponse = err;
        } else {
          userInfo.emailResponse = user.email;
        }

        auth0.updateUserMetadata(
          { id: userId },
          { phoneNumber: updatedPhoneNumber },
          (err, user) => {
            // res.write(user.user_metadata.phoneNumber)
            if (err) {
              userInfo.phoneNumberResponse = err;
            } else {
              userInfo.phoneNumberResponse = user.user_metadata.phoneNumber;

              userInfo.phoneNumberUpdated = true;
            }

            res.send(userInfo);
          }
        );
      });
    }

    if (isUpdatingOnlyEmail === true) {
      updateOnlyEmail();
    }

    if (isUpdatingOnlyPhoneNumber === true) {
      updateOnlyPhoneNumber();
    }

    if (updateBoth === true) {
      updateEmailAndPhoneNumber();
    }
  }
});

// app.post("/Settings/emailUpdate", (req, res) => {

// })

app.post("/Settings", (req, res) => {
  const userID = req.body.userId;
  auth0.getUser({ id: userID }, (err, user) => {
    accountInfo = user;
    res.send(accountInfo);
  });
});

////////////////////////////////////////////////////////

let accountInfoForPassword = {};
let userToken = "";

app.post("/Settings/Password", (req, res) => {
  const userId = req.body.id;
  const newPassword = req.body.newPassword;
  const userEmail = req.body.userEmail;
  const currentPassword = req.body.currentPassword;

  let data = {
    username: userEmail,
    password: currentPassword,
  };

  if (req.body.userEmail) {
    auth0authentication.passwordGrant(data, (err, userData) => {
      userToken = userData && userData.access_token;

      if (userToken) {
        auth0authentication.getProfile(userToken, function (err, userInfo) {
          if (userId === userInfo.sub) {
            auth0.updateUser(
              { id: userId },
              { password: newPassword },
              (err, user) => {
                if (
                  err &&
                  err.originalError.response.res.text ===
                    '{"statusCode":400,"error":"Bad Request","message":"PasswordStrengthError: Password is too weak"}'
                ) {
                  res.write("password is too weak");
                  res.send();

                  /////////////////
                } else if (!err) {
                  res.write("success");
                  res.send();
                }
              }
            );
          }
        });
      } else {
        res.write("password incorrect");
        res.send();
      }
    });
  } else {
    res.write("password incorrect");
  }
});

///////////////////////////////////////////////////////////////////////

app.post("/Settings/Data", (req, res) => {
  const userId = req.body.id;

  Contact.destroy({ where: { auth0Id: userId } });

  auth0.deleteUser({ id: userId });
});

app.post("/Categories/Create", (req, res) => {
  const newCategoryName = req.body.categoryName;
  const auth0Id = req.body.userId;

  const newCategory = Category.create({
    categoryName: newCategoryName,
    auth0Id: auth0Id,
  }).then(() => {
    res.send("category created");
  });
});

app.post("/Categories", (req, res) => {
  const findCategories = async () => {
    const categories = await Category.findAll({
      where: { auth0Id: req.body.auth0Id },
    });

    res.send(categories);
  };
  findCategories();
});

app.post("/Categories/Contacts", (req, res) => {
  const auth0Id = req.body.userId;

  async function getContacts() {
    const contacts = await Contact.findAll(
      { where: { auth0Id: auth0Id } },
      () => {}
    );
    res.send(contacts);
  }
  getContacts();
});

app.post("/Categories/Edit", (req, res) => {
  const auth0Id = req.body.userId;
  const categoryName = req.body.categoryToEdit;
  const newCategoryName = req.body.newCategoryName;
  Category.update(
    {
      categoryName: newCategoryName,
    },
    {
      where: {
        categoryName: categoryName,
        auth0Id: auth0Id,
      },
    }
  ).then(() => {
    res.send("received request");
  });
});

app.post("/Categories/Delete", (req, res) => {
  const auth0Id = req.body.userId;
  const categoryToDeleteId = req.body.categoryToDeleteId;

  Category.destroy({
    where: {
      auth0Id: auth0Id,
      id: categoryToDeleteId,
    },
  }).then(() => {
    res.send("received request");
  });
});

let auth0Id4Categories = "";

app.post("/Categories/Add", (req, res) => {
  auth0Id4Categories = req.body.userId;
});

app.post("/Categories/GetAll", (req, res) => {
  const auth0Id = req.body.auth0Id;

  Category.findAll({ where: { auth0Id: auth0Id } }).then((r) => {
    res.send(r);
  });
});

app.post("/Categories/Details", (req, res) => {
  let auth0Id = req.body.auth0Id;
  let categoryToViewId = req.body.categoryToViewId;

  function getContacts() {
    let defaultImage;

    fs.readFile("./images/default.jpg", function (err, data) {
      defaultImage = data.toString("base64");

      Contact.findAll({
        where: {
          auth0Id: auth0Id,
        },
      }).then((r) => {
        allContacts = r;

        Category.findOne({ where: { id: categoryToViewId } }).then((r) => {
          let categoryToView = r;

          let contactsWithCategory = [];

          allContacts.map((contact) => {
            contact.categories &&
              Array.isArray(contact.categories) &&
              contact.categories.map((category) => {
                if (category.id === categoryToViewId)
                  contactsWithCategory.push(contact);
              });
          });

          let info = {
            categoryToView: categoryToView,
            contactsWithCategoryAdded: contactsWithCategory,
            defaultImage: defaultImage,
          };

          res.send(info);
        });
      });
    });
  }
  getContacts();
});

app.listen(PORT, () => {});
