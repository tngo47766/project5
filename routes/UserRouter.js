const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const Photo = require("../db/photoModel");
const mongoose = require('mongoose');
router.post("/", async (request, response) => {
  
});

router.get('/list', async (req, res) => {
    try {
        const users = await User.find({}, '_id first_name last_name');
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: "Không thể truy xuất người dùng" });
    }
});


// Endpoint GET /user/:id: Trả về thông tin chi tiết người dùng
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '_id first_name last_name location description occupation');
        if (!user) {
            return res.status(400).send({ error: "Không tìm thấy người dùng" });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: "ID người dùng không hợp lệ" });
    }
});
// router.get('/photosOfUser/:id', async (req, res) => {
//     try {
//       const userId = req.params.id;
  
//       // Kiểm tra xem người dùng có tồn tại không
//       const userExists = await User.exists({ _id: userId });
//       if (!userExists) {
//         return res.status(400).send({ error: "Người dùng không tồn tại" });
//       }
//       const photos = await Photo.find({ user_id: userId })
//                                 .select('_id user_id comments file_name date_time');
  
//     //   Kiểm tra xem người dùng có ảnh nào không
//       if (photos.length === 0) {
//         return res.status(404).send({ error: "Không có ảnh nào cho người dùng này" });
//       }
  
//       res.send(photos);
//     } catch (error) {
//       res.status(500).send({ error: "Đã xảy ra lỗi" });
//     }
//   });


  

module.exports = router;