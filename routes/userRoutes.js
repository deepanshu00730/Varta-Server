const { register, login, setAvatar, getAllUsers } = require("../controllers/usersController");
const router = require("express").Router();

router.get("/check",(req,res) => {
    res.json({
        message : "Server is working"
    })
})
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get(`/allusers/:id`, getAllUsers);


module.exports = router;