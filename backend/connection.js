require("dotenv").config();

const mongoose = require("mongoose");

const connectionStr =
  "mongodb+srv://ramyaug37:ramyaug37@cluster0.jxkp387.mongodb.net/";

mongoose
  .connect(connectionStr, { useNewUrlparser: true })
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  console.log(err);
});
