import { Router } from "express";
import {
  signUpUser,
  autoLogin,
  loginPost,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  activateUser,
  logOut,
  updateReadBlog,
  updateUserSettings,
  disableAutoLogin,
  updateSavedPost,
} from "../controllers/authController";
import { getAnalytics } from "../controllers/analyticsController";
import { getAllBlog, getBlog, getAllNews, getNews, uploadPost } from "../controllers/contentController"
import { authenticateLogin, authenticateRoutes, refreshToken } from "../jwt/jwt";
import { setCookie, readCookie } from "../controllers/cookieController";

const router = Router();

//USER ROUTES


//SignUp
router.post("/user/signUp", signUpUser);
router.get("/user/regUserActivation/:id", activateUser);


//Login
router.post("/user/login", loginPost);
router.post("/user/autoLogin", autoLogin);
router.post("/user/disableAutoLogin", authenticateRoutes, disableAutoLogin);

router.post("/user/logout", logOut)

//Refresh Toen
router.post("/user/refresh", refreshToken);

//Get Users
router.get("/user/getAllUsers", authenticateRoutes, getAllUsers);
router.get("/user/getUser/:id", authenticateRoutes, getUser);

//Delete User
router.delete("/user/delete/:id", authenticateRoutes, deleteUser);

//Update User
router.post("/user/updateUser/:id", authenticateRoutes, updateUser);
router.post("/user/updateSavedPost/:id", authenticateRoutes, updateSavedPost);
router.post("/user/updateRead", updateReadBlog)
router.post("/user/updateSettings", updateUserSettings)


router.get("/user/set-cookies", setCookie);
router.get("/user/read-cookies", readCookie);


//CONTENT ROUTES

//Get posts Blog
router.get("/content/blogposts", getAllBlog)
router.get("/content/blogpost/:id", getBlog)

//Get posts News
router.get("/content/newsposts/", getAllNews)
router.get("/content/newspost/:id", getNews)

//Upload Posts
router.post("/uploadPost", authenticateRoutes, uploadPost);








//ANALYTICS
router.post("/analytics/visitorCounting", getAnalytics);

export default router;
