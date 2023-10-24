import { Request, Response } from "express";


export function setCookie(req: Request, res: Response) {


res.cookie('newUser', true)
res.send('he')

}
export function readCookie(req: Request, res: Response) {

}