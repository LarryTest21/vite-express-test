import { Request, Response } from "express";
import { User, userAuth } from "../models/user";
import { ObjectId } from "bson";
import { request } from "http";
const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.SECRET_JWT_CODE;

//LOGIN USER

export function loginPost(req: any, res: any) {
  if (!req.body.email || !req.body.password) {
    res
      .status(401)
      .json({ success: false, error: "Send needed password or email" });
    return;
  }

  userAuth.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(404).json({ success: false, error: "User does not exist" });
    } else {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(403).json({ success: false, error: "Wrong password" });
      } else {
        const accessToken = jwt.sign({ user }, jwtSecret, { expiresIn: 10 });
        const refreshToken = jwt.sign({ user }, jwtSecret, { expiresIn: "1d" });

        User.findOne({ email: req.body.email }).then((user) => {
          res.cookie("rT", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          });
          res
            .cookie("aT", accessToken, {
              httpOnly: true,
              sameSite: "strict",
            })
            .status(200)
            .json({ success: true, data: user });
        });
      }
    }
  });
}

export function updateUserSettings(req: Request, res: Response) {
  if (req.body.userID == undefined) {
    res.status(400).send({ success: false, message: "Missing User" });
    return;
  }

  User.findOneAndUpdate(
    { _id: req.body.userID },
    {
      $set: {
        userSettings: req.body.userSettings,
      },
    },
    { returnOriginal: false }
  )
    .then(() => {
      res.status(200).send({ update: "success" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export function disableAutoLogin(req: Request, res: Response) {
  if (req.body.email === undefined) {
    res.status(400).send({ success: false, message: "Missing User" });
    return;
  }
  User.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        "userSettings.autoLogin": false,
      },
    },
    { returnOriginal: false }
  )
    .then(() => {
      res.status(200).send({ update: "success" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export function updateReadBlog(req: Request, res: Response) {
  if (req.body.userID == undefined) {
    res.status(400).send({ success: false, message: "Missing User" });
    return;
  } else if (req.body.blogPostID == undefined) {
    res.status(400).send({ success: false, message: "Missing BlogPost" });
    return;
  }

  User.findOne({ _id: req.body.userID })
    .then((user) => {
      var readArray;

      readArray = user!.readBlog;
      if (readArray.includes(req.body.blogPostID)) {
        return;
      } else {
        readArray.push(req.body.blogPostID);

        User.findOneAndUpdate(
          { _id: req.body.userID },
          {
            $set: {
              readBlog: readArray,
            },
          },
          { returnOriginal: false }
        ).then(() => {
          res.status(200).json({ success: "updatedReadBlog" });
        });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export function deleteReadBlog(req: Request, res: Response) {
  if (req.body.userID == undefined) {
    res.status(400).send({ success: false, message: "Missing User" });
    return;
  } else if (req.body.blogPostID == undefined) {
    res.status(400).send({ success: false, message: "Missing BlogPost" });
    return;
  }

  User.findOne({ _id: req.body.userID })
    .then((user) => {
      var readArray;

      readArray = user!.readBlog;
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export function logOut(req: Request, res: Response) {
  res
    .clearCookie("aT")
    .clearCookie("rT")
    .clearCookie("aT")
    .send("cookies cleared");
}

export function autoLogin(req: Request, res: Response) {
  User.findOne({ email: req.body.email }).then(async (user) => {
    if (!user) {
      res.status(401).json({ success: false, error: "User does not exist" });
    } else {
      const userData = user;
      const jwtSign = userData._id;
      if (userData.userSettings?.autoLogin) {
        const accessToken = jwt.sign({ jwtSign }, jwtSecret, { expiresIn: 10 });
        const refreshToken = jwt.sign({ jwtSign }, jwtSecret, {
          expiresIn: "1d",
        });

        res.cookie("rT", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.cookie("aT", accessToken, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.status(200).send(user);
      } else {
        res
          .status(405)
          .json({ success: false, message: "Can't autoLogin, not set" });
      }
    }
  });
}

//SIGNUP USER

export function signUpUser(req: Request, res: Response) {
  User.findOne({ email: req.body.email }).then(async (findOne) => {
    if (findOne === null) {
      const userInfo = {
        email: req.body.email,
        activated: false,
        autoLogin: false,
        clearance: req.body.clearance || "regular",
        createdAt: new Date(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.firstName + " " + req.body.lastName,
        notificationsRead: true,
        profilePic: req.body.profilePic || undefined,
        readBlog: [],
      };

      User.create(userInfo)
        .then((response) => {
          userAuth.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
          });
          return response;
        })
        .then((result) => {
          res.status(200).json({ succes: true, data: result._id });
        });
    } else {
      res.status(400).json({
        error: true,
        message: "E-mail already taken",
      });
    }
  });
}

//ACTIVATE USER
export async function activateUser(req: Request, res: Response) {
  User.findOne({ _id: req.params.id })
    .then((result) => {
      if (result!.activated) {
        res
          .status(400)
          .json({ success: false, message: "User already activated" });
      } else {
        User.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              activated: true,
            },
          },
          { returnOriginal: false }
        ).then((result) => {
          res
            .status(200)
            .json({ success: true, userActivated: result!.activated });
        });
      }
    })

    .catch((err) => {
      res.status(400).json({ success: false, data: "User doesn't exist" });
    });
}

//GET ALL USERS

export async function getAllUsers(req: Request, res: Response) {
  await User.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(404).json({ success: false, message: "No users were found" });
    });
}

//GET A USER

export async function getUser(req: Request, res: Response) {
  try {
    const user = await User.findOne({ email: req.params.id });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: true, message: "User not found" });
  }
}

//DELETE USER

export async function deleteUser(req: Request, res: Response) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user != undefined) {
      const mail = user!.email;
      await userAuth.deleteOne({ email: mail });
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ mail });
    }
  } catch (err: any) {
    // await User.deleteOne({ _id: req.params.id })
    // await userAuth.deleteOne({email:req.params.mail})
    // res.status(200).json({ error: false, message: 'User deleted' })

    res.status(404).json({ error: true, message: err.message });
  }
}

//UPDATE A USER

export async function updateUser(req: Request, res: Response) {
  const user = { _id: req.params.id };

  const userM = await User.findOne({ _id: req.params.id });
  const mailUser = userM!.email;
  const mail = { email: mailUser };

  try {
    const doc = await User.findOneAndUpdate(
      user,
      {
        $set: {
          activated: req.body.activated,
          email: req.body.email,
          clearance: req.body.clearance,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          displayName: req.body.firstName + " " + req.body.lastName,
          profilePic: req.body.profilePic,
          readBlog: req.body.readBlog,
          autoLogin: req.body.autoLogin,
          savedPost: req.body.savedPost,
        },
      },
      { returnOriginal: false }
    );

    const auth = await userAuth.findOneAndUpdate(
      mail,
      {
        $set: {
          email: req.body.email,
        },
      },
      { returnOriginal: false }
    );

    if (req.body.password != undefined) {
      const passHash = await userAuth.findOne(mail).then((res) => {
        return res!.password;
      });
      const pwCheck = await bcrypt.compare(req.body.password, passHash);

      if (pwCheck) {
        const auth = await userAuth.findOneAndUpdate(
          mail,
          {
            $set: {
              password: bcrypt.hashSync(req.body.newPassword, 10),
            },
          },
          { returnOriginal: false }
        );
        res.status(200).json({ doc, auth, pwCheck });
      } else {
        res.status(404).json({ error: true, message: "Bad password" });
      }
    } else {
      res.status(200).json({ message: "nopw" });
    }
  } catch (err: any) {
    res.status(410).json({ success: false, message: err.message });
  }
}

export async function updateSavedPost(req: Request, res: Response) {
  const user = { _id: req.params.id };
  console.log(`output->req.body.savedPost`, req.body.savedPost);
  try {
    const doc = await User.findOneAndUpdate(
      user,
      {
        $set: {
          savedPost: req.body.savedPost,
        },
      },
      { returnOriginal: false }
    );
    res.status(200).json({ doc });
  } catch (err: any) {
    res.status(410).json({ success: false, message: err.message });
  }
}
