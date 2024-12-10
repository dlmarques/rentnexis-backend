const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { swaggerUi, swaggerSpec } = require("./swagger");
const { clerkMiddleware } = require("@clerk/express");
require("dotenv/config.js");

const app = express();
const port = process.env.PORT || 3000;

//Import routes
const authRoute = require("./routes/auth");
const propertiesRoute = require("./routes/properties");
const leasesRoute = require("./routes/leases");
const paymentsRoute = require("./routes/payments");
const successResponse = require("./utils/responses/success");
const { SUCCESS } = require("./utils/constants/responses");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

if (process.env.MODE === "development")
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Middleware
app.use(express.json());
app.use(clerkMiddleware());

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use("/auth", authRoute);
app.use("/properties", propertiesRoute);
app.use("/leases", leasesRoute);
app.use("/payments", paymentsRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
