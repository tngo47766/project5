
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const AdminRouter = require("./routes/AdminRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentsRouter = require("./routes/CommentRouter");
const path = require('path');
dbConnect();

app.use(cors({
  origin: "*",
}));

app.use(express.json());


app.use("/admin", AdminRouter); 
app.use("/api/user", UserRouter); 
app.use("/api/photo", PhotoRouter); 
app.use("/api/comments", CommentsRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send({ message: "Hello from photo-sharing app API!" });
});


app.listen(8081, () => {
  console.log("Server listening on port 8081");
});