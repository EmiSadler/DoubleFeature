require("dotenv").config();

const app = require("./app.js");
// const { connectToDatabase } = require("./db/db.js");

function listenForRequests() {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log("Now listening on port", port);
  });
}

listenForRequests();

// connectToDatabase().then(() => {
//   listenForRequests();
// });
