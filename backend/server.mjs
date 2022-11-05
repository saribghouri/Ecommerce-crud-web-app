import express, { request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { stringToHash, varifyHash } from "bcrypt-inzi";
import fs from "fs";
import admin from "firebase-admin";
import Stripe from "stripe";
// require("dotenv").config();
var serviceAccount = {
  type: "service_account",
  project_id: "e-commerce-web-app-b529f",
  private_key_id: "ca3d3639342958192a58b3722bd028b689365daa",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSSA2Cp6DsCF2V\nHTzKf0qiQcpVyypDmFL2zj1UYwI7r12oGpz0DSmlAt4gVyMMewSBFr0ITg6FYAH+\nou5i4AsNdkGGzPAr854U93dtVVoj7w1mkU2doHZMmFe7IKWdFIOrpny/G/tTt9gK\n14go6IKZYNMuLnzWZip5Bx2ou9hph1bJhLemb2+U10JhTSBaGMZo0CvOISYiSpre\njiqNYPmUElVKNeKfAiuZb1x+yGW8FRfy4MjwTJDq4b6pUhbzqlwHl9raN3jb6cs3\n/S2rE9J1YvAi1W5KkYdFiBA/GnngX2F8YDP2MPd6ZO1sddDBG1KkPLpXHEoR+95K\nL7Zw+L9lAgMBAAECggEALCm9zKbwASJwpRSS4+SABDvVBte4dKHVKsh90O9KVMar\n4NZWCFuLV4CWriwezEw50fK4mLnsCs7zHEuTzWhIafdgI7N+7XwowzaF+oxmdg2K\nvvPdXTGKJuQH6OEeZzMbxD0fDfQOgLKnyP8jNZQ/eX8AWz6gMVcbrHd2Hy30cZT9\nJ9lhQbpk9DGfigQrNB3Gs1IOulT769NmzMbVhFoq44Wb+SOeBwFbjveErSOF3mbR\nrpqrgZ/IcYD9Km/KYHjH9+ea2ygLYkrbt+COmgDFXAk/McZVMhAdTm+6UOHxy7/X\nYbJ8cqkbuIHq8CTvJ/lOfRZneKjtQPIx6kfF1ibHsQKBgQD9xAOsAS4qvKnuygoH\nBJMPEdfENQTS1Xy3CIhIdd6qo8QtTyuyoHj05Ty/QaI+NlbCQ87lFIjefVDO/ML6\ni89UajPy27YS6a8G9YTdmnFIhp8laSRTNZy5pW3F/27DelVsQfs23WtWGlvgYHgB\nBAFH3GQ6YXRYZoPwmuxMCjzm0wKBgQDUIgZ+O8Q7bBrOgFpv2jpyzLoFnCqRVQAi\nLWi2ztQ7yYkDeZi/YgQk6r90Tu0cQLC375DFpdcAck0JWgj1RJtpgis9IJmHrdEo\n8TktklINma47KEquKEZtriT9PIqOV204Oy2Y7+YsBWOtQnPRbtPXB7xxGPy4ko5E\ny22rwq1N5wKBgC0SO3S5YPHGQIhg6hcFAPmUObZnlEu+D0CTC2GTTdEQ9S72+NPp\nHJKihH+TsLVMAWzPjlexpf2eVFPvINJPMqvTkRZ5X4VMbAHYaZjSbXxsLKgAXKtK\nwmNWtoCMNagSekmYDn5YJVBNrjPT7nx/sZqJ0mNsG7X3v0dkvMNkrhxxAoGAORNC\njfpErPxEJiVwr8GWkka1EkdXSK0HESsIjo8NmVx7Kd0wlOWpWclzY7bMoxpgscya\nNiONuogGZCq+WEdyTSwBuDuqM1A4A30LtlA1FYWw1CfeGAesE1yUhTIh0XSCZWu+\ns/RwCI4WqIpFoSbhhmyFbiSb8ok0EBxv0JPbjycCgYABZxZ5vsjTPNy0et4RY/bS\nJquFW+8KiUWm/XQfTTzQPyNKfzjq9DY5kBxXSXOpK57O+76X8jHATcC3meMC/xgD\nIiN42p9dY8eaTG+Ts3rUViSqMAnIsjL3eeHQM0JECZA/BceMskKugICA96NULJV8\nuIQgeCavvPwXTtFJubYZvw==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-f84xn@e-commerce-web-app-b529f.iam.gserviceaccount.com",
  client_id: "102049338874548601298",
  client_address: "adegheh",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-f84xn%40e-commerce-web-app-b529f.iam.gserviceaccount.com",
};

import multer from "multer";
import pkg from "check-types";

const { string } = pkg;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-commerce-web-app-b529f.firebaseio.com",
});
const bucket = admin
  .storage()
  .bucket("gs://e-commerce-web-app-b529f.appspot.com");

const storageConfig = multer.diskStorage({
  destination: "/uploads/",
  filename: function (res, file, cb) {
    console.log("mul-file:", file);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});
var upload = multer({ storage: storageConfig });

const dbURI =
  process.env.MONGODBURI ||
  "mongodb+srv://sarib-ghouri92:445500@cluster0.nmgizsx.mongodb.net/serverDataBase?retryWrites=true&w=majority";
const SECRET = process.env.SECRET || "topsecret";
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, min: 17, max: 65, default: 18 },
  isMarried: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model("Users", userSchema);
const productSchema = new mongoose.Schema({
  profilePicture: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  condition: { type: String, required: true },
  profilePicture: { type: string, required: true },
  createdOn: { type: Date, default: Date.now },
  userid: { type: String, required: true },
  count: { type: Number },
});

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  id: { type: String },
  user_id: { type: String },
  itemCart: [productSchema],
  amount: { type: String, required: true },
  date_added: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("order", OrderSchema);

const productModel = mongoose.model("Products", productSchema);
const stripe = Stripe(
  "sk_test_51LyD94FhTQ9tKGOUdkRwJkYL0uy1ZwwE7gvkgdVlWfhm373UfGrHaljG4CPeF1Zor3e45d37WqpzJAebTR7M1M9m00QTioXoID"
);

app.put("/profile/:id", async (req, res) => {
  console.log("profile to be edited: ");

  const update = {};
  if (req.body.firstName) update.firstName = req.body.firstName;
  if (req.body.lastName) update.lastName = req.body.lastName;

  if (req.body.address) update.address = req.body.address;

  console.log("🚀 ~ file: server.mjs ~ line 112 ~ app.put ~ update", update);

  try {
    const updated = await userModel
      .findOneAndUpdate({ _id: req.params.id }, update, { new: true })
      .exec();
    console.log("updated profile: ", updated);

    res.send({
      message: "profile updated successfuly",
      data: updated,
    });
  } catch (error) {
    res.status(500).send({
      message: "faild to upadate profile",
    });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const { id, amount } = req.body;
  console.log("user_id", req.body);
  console.log(id, amount);
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: "karachi",
      payment_method: id,

      confirm: true,
    });

    const neworder = new OrderModel({
      id: req.body.id,
      user_id: req.body.user_id,
      itemCart: req.body.itemCart,
      amount: req.body.amount,
      date_added: req.body.date_added,
    });
    neworder.save(function (err, result) {
      console.log(err);
      console.log(result);
    });
    console.log(payment);
    return res.status(200).json({
      confirm: "26529sarib",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
    console.log("session", session);
    res.send({ url: session.url, status: 200 });
  }
});

app.get("/myorders/:userId", async (req, res) => {
  const orders = await OrderModel.findOne({ userid: req.params.userId });

  console.log("orders ====>", orders);
  res.send(orders);
});
app.post("/login", (req, res) => {
  let body = req.body;

  if (!body.email || !body.password) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
    return;
  }

  userModel.findOne(
    { email: body.email },

    "email firstName lastName email adress age password",
    (err, user) => {
      if (!err) {
        console.log("user: ", user);

        if (user) {
          // user found
          varifyHash(body.password, user.password).then((isMatched) => {
            console.log("isMatched: ", isMatched);

            if (isMatched) {
              var token = jwt.sign(
                {
                  _id: user._id,
                  email: user.email,
                  address: user.address,
                  iat: Math.floor(Date.now() / 1000) - 30,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                SECRET
              );

              console.log("token: ", token);

              res.cookie("Token", token, {
                maxAge: 86_400_000,
                httpOnly: true, // https only cookies are the most secure one
              });

              res.send({
                message: "login successful",
                profile: {
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  address: user.address,
                  age: user.age,
                  _id: user._id,
                },
              });
              return;
            } else {
              console.log("user not found");
              res.status(401).send({ message: "Incorrect email or password" });
              return;
            }
          });
        } else {
          // user not already exist
          console.log("user not found");
          res.status(401).send({ message: "Incorrect email or password" });
          return;
        }
      } else {
        console.log("db error: ", err);
        res.status(500).send({ message: "login failed, please try later" });
        return;
      }
    }
  );
});
app.post("/logout", (req, res) => {
  res.cookie("Token", "", {
    maxAge: 0,
    httpOnly: true,
  });

  res.send({ message: "Logout successful" });
});

app.post("/signup", (req, res) => {
  let body = req.body;

  if (
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.password ||
    !body.address
  ) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "address": "bahbewn",
                    "password": "12345"
                }`
    );
    return;
  }

  // check if user already exist // query email user
  userModel.findOne({ email: body.email }, (err, user) => {
    if (!err) {
      console.log("user: ", user);

      if (user) {
        // user already exist
        console.log("user already exist: ", user);
        res.status(400).send({
          message: "user already exist,, please try a different email",
        });
        return;
      } else {
        // user not already exist

        stringToHash(body.password).then((hashString) => {
          console.log({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email.toLowerCase(),
            address: body.address.toLowerCase(),
            password: hashString,
          });
          userModel.create(
            {
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email.toLowerCase(),
              address: body.address.toLowerCase(),
              password: hashString,
            },
            (err, result) => {
              console.log(err, "err");
              if (!err) {
                console.log("data saved: ", result);
                res.status(201).send({ message: "user is created" });
              } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "internal server error" });
              }
            }
          );
        });
      }
    } else {
      console.log("db error: ", err);
      res.status(500).send({ message: "db error in query" });
      return;
    }
  });
});

// every request will go through this check point
app.use(function (req, res, next) {
  console.log("req.cookies: ", req.cookies);

  if (!req.cookies.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }
  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401).send("token expired");
      } else {
        console.log("token approved");

        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});

app.get("/profile", async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.body.token._id }).exec();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "error getting users" });
  }
});

app.get("/products", async (req, res) => {
  try {
    let products = await productModel.find({}).exec();
    console.log("all product : ", products);

    res.send({
      message: "all products",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      message: "failed to get product",
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    let product = await productModel
      .findOne({ _id: req.params.id, userid: req.body.userid })
      .exec();
    console.log("product : ", product);

    res.send({
      message: "product",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      message: "failed to get product",
    });
  }
});

app.post("/product", upload.any(), async (req, res) => {
  console.log("product received: ", req.body);

  try {
    bucket.upload(
      req.files[0].path,
      {
        destination: `profilePicture/${req.files[0].filename}`,
      },

      function (err, file, apiResponse) {
        if (!err) {
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2491",
            })
            .then(async (urlData, err) => {
              if (!err) {
                console.log("public downloadable url: ", urlData);

                const newProduct = new productModel({
                  profilePicture: urlData[0],
                  name: req.body.name,
                  condition: req.body.condition,
                  description: req.body.description,
                  code: req.body.code,
                  price: req.body.price,
                  userid: req.body.userid,
                });
                await newProduct.save();
                try {
                  fs.unlinkSync(req.files[0].path);
                } catch (err) {
                  console.error(err);
                }
                res.send({
                  message: "product added",
                  data: "Product created successfully",
                });
              }
            });
          console.log("dwegwe", req.body.userid);
        } else {
          console.log("hrwejr", req.body.userid);
          console.log("err: ", err);
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: "faild to added product",
    });
  }
});

app.get("/userpage/:id", async (req, res) => {
  try {
    let user = await userModel
      .findOne({ _id: req.params.id, userid: req.body.userid })
      .exec();
    console.log("user : ", user);

    res.send({
      message: "user",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "failed to get product",
    });
  }
});

app.put("/product/:id", async (req, res) => {
  console.log("data to be edited: ", req.body);

  let update = {};
  if (req.body.profilePicture) update.profilePicture = req.body.profilePicture;
  if (req.body.name) update.name = req.body.name;
  if (req.body.description) update.description = req.body.description;
  if (req.body.price) update.price = req.body.price;
  // if (req.body.code) update.code = req.body.code;
  if (req.body.condition) update.condition = req.body.condition;

  try {
    let updated = await productModel
      .findOneAndUpdate({ _id: req.params.id }, update, { new: true })
      .exec();

    console.log("updated product: ", updated);

    res.send({
      message: "product updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).send({
      message: "failed to update product",
    });
  }
});
app.delete("/product/:id", async (req, res) => {
  console.log("product received: ", req.body);

  try {
    let deleted = await productModel.deleteOne({ _id: req.params.id });
    console.log("product deleted: ", deleted);

    res.send({
      message: "product deleted",
      data: deleted,
    });
  } catch (error) {
    res.status(500).send({
      message: "failed to delete product",
    });
  }
});

app.use((req, res) => {
  res.status(404).send("404 not found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function (err) {
  //connected
  console.log(err, "Mongoose is connected");
});

mongoose.connection.on("disconnected", function (err) {
  //disconnected
  console.log(err, "Mongoose is disconnected");
  // process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  // process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
