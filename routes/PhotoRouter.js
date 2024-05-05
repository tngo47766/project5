const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const User = require("../db/userModel");

router.post("/", async (request, response) => {
  
});

router.get("/", async (req, res) => {
    try {
        const photos = await Photo.find({});
        res.send(photos);
    } catch (error) {
        res.status(500).send({ error: "Không thể truy xuất người dùng" });
    }
});
router.get('/photosOfUser/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if the user exists
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(400).send({ error: 'Người dùng không tồn tại' });
      }
  
      // Fetch photos related to the user
      const photos = await Photo.find({ user_id: userId })
        .select('_id user_id comments file_name date_time');
  
      // Check if the user has any photos
      if (photos.length === 0) {
        return res.status(404).send({ error: 'Không có ảnh nào cho người dùng này' });
      }
  
      // Format photos and comments according to the specified structure
      const formattedPhotos = await Promise.all(
        photos.map(async (photo) => {
          // Map comments with user information
          const formattedComments = await Promise.all(
            photo.comments.map(async (comment) => {
              // Fetch user information based on user_id in the comment
              const user = await User.findById(comment.user_id)
                .select('_id first_name last_name');
  
              return {
                _id: comment._id,
                comment: comment.comment,
                date_time: comment.date_time,
                user_id: comment.user_id, // Retain the original user_id
                user: user ? { _id: user._id, first_name: user.first_name, last_name: user.last_name } : null
              };
            })
          );
  
          return {
            _id: photo._id,
            user_id: photo.user_id,
            file_name: photo.file_name,
            date_time: photo.date_time,
            comments: formattedComments
          };
        })
      );
  
      // Send the response
      res.send(formattedPhotos);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Đã xảy ra lỗi' });
    }
  });


module.exports = router;
