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
  updateUserSettings
} from "../controllers/authController";
import { getAllBlog, getBlog, getAllNews, getNews } from "../controllers/contentController"
import { authenticateLogin, authenticateRoutes, refreshToken } from "../jwt/jwt";
import { setCookie, readCookie } from "../controllers/cookieController";

const router = Router();

router.post("/user/signUp", signUpUser);
router.post("/user/login", loginPost);
router.post("/user/autoLogin", autoLogin);
router.post("/user/refresh", refreshToken);
router.post("/user/logout", logOut)

router.get("/user/regUserActivation/:id", activateUser);

router.get("/user/getAllUsers", authenticateRoutes, getAllUsers);
router.get("/user/getUser/:id", authenticateRoutes, getUser);
router.delete("/user/delete/:id", authenticateRoutes, deleteUser);
router.post("/user/updateUser/:id", authenticateRoutes, updateUser);

router.post("/user/updateRead", updateReadBlog)
router.post("/user/updateSettings", updateUserSettings)

router.get("/user/set-cookies", setCookie);
router.get("/user/read-cookies", readCookie);


router.get("/content/blogposts", getAllBlog)
router.get("/content/blogpost/:id", getBlog)
router.get("/content/newsposts/", getAllNews)
router.get("/content/newspost/:id", getNews)

export default router;
