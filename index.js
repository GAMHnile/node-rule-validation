require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { myDataHandler } = require("./src/controllers/myData/myData");
const { validateHandler } = require("./src/controllers/validate/validate");

const PORT = process.env.PORT || 3500;
const app = express();



app.use(cors());
app.use(express.json());
//error handling midleware for invalid json payloads
app.use(function (err, req, res, next) {
  if(err.message.includes("Unexpected token")){
    return res.status(400).json({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null
    })
  }
})

//first route base route with get
app.get("/", myDataHandler);

//rule validation route
app.post("/validate-rule", validateHandler);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
