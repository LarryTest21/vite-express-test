import { Request, Response } from "express";
import { ReactiveEffect } from "vue";
const jwt = require("jsonwebtoken");
import { User } from "../models/user";

const jwtSecret = process.env.SECRET_JWT_CODE;

export function authenticateLogin(req: Request, res: Response, next: Function) {
  const accessToken = req.cookies["aT"];
  const refreshToken = req.cookies["rT"];
  if (!accessToken && !refreshToken) {
    res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, jwtSecret);
    // @ts-ignore
    req.user = decoded.user;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken, jwtSecret);
      const accessToken = jwt.sign({ user: decoded.user }, jwtSecret, {
        expiresIn: "40s",
      });
      res.cookie("rT", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      res
        .cookie("aT", accessToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .send(decoded.user);
    } catch (error) {
      return res.status(400).send("Invalid Token");
    }
  }
}

export function authenticateRoutes(req: any, res: Response, next: Function) {
  const accessToken = req.cookies["aT"];
  try {
    const decoded = jwt.verify(accessToken, jwtSecret);
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Wrong accessToken" });
  }
}

export function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies["rT"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  if (req.body.email != undefined || req.body.email != null) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        const clearance = user!.clearance;
        return clearance;
      })
      .then((clearance) => {
        try {
          const decoded = jwt.verify(refreshToken, jwtSecret);
          const accessToken = jwt.sign({ user: decoded.user }, jwtSecret, {
            expiresIn: "20s",
          });
          res
            .cookie("aT", accessToken, {
              httpOnly: true,
              sameSite: "strict",
            })
            .send({ clearance: clearance });
        } catch (error) {
          return res.status(400).send("Invalid refresh token.");
        }
      })
      .catch((err) => {
        res.send(err);
      });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtSecret);
    const accessToken = jwt.sign({ user: decoded.user }, jwtSecret, {
      expiresIn: "20s",
    });
    res
      .cookie("aT", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .send("success");
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
}
