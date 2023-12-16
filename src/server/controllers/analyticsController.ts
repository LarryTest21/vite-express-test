import { Request, Response } from "express";
import { visitorsAnalytics } from "../models/analyticsVisitor";
import { pagesAnalytics } from "../models/analyticsPages";
import { pagesByDay } from "../models/analyticsPagesDate";
import { logOut } from "./authController";
let mongoose = require("mongoose");

export async function getAnalytics(req: Request, res: Response) {
  const userID = req.body.userID;

  const pageID = req.body.pageID;

  const countVisitor = req.body.countVisitor._value;

  const dateNow = new Date();

  var countUpdated;
  var visitorUpdated;
  var pagesUpdated;

  const pagesByDayPromise = new Promise(function (resolve, reject) {
    pagesByDay
      .findOne({ pagesDaily: { $exists: true } })
      .then((result: any) => {
        const data = result;

        if (data.pagesDaily[dateNow.getFullYear()] != undefined) {
          if (
            data.pagesDaily[dateNow.getFullYear()][dateNow.getMonth()] !=
            undefined
          ) {
            if (
              data.pagesDaily[dateNow.getFullYear()][dateNow.getMonth()][
                dateNow.getDate()
              ] != undefined
            ) {
              if (
                data.pagesDaily[dateNow.getFullYear()][dateNow.getMonth()][
                  dateNow.getDate()
                ][pageID] != undefined
              ) {
                // COUNT EXISTS

                const pageVisitors = Number(
                  data.pagesDaily[dateNow.getFullYear()][dateNow.getMonth()][
                    dateNow.getDate()
                  ][pageID]
                );

                const newCount = pageVisitors + 1;

                pagesByDay
                  .updateOne(
                    { pagesDaily: { $exists: true } },
                    {
                      $set: {
                        [`pagesDaily.${dateNow.getFullYear()}.${dateNow.getMonth()}.${dateNow.getDate()}.${pageID}`]:
                          newCount,
                      },
                    }
                  )
                  .then(() => {
                    resolve({ pagesByDay: { resolve: true } });
                  });
              } else {
                // COUNT DOES NOT EXISTS

                const newPage = pageID;
                const newPageData = 1;
                pagesByDay
                  .updateOne(
                    { pagesDaily: { $exists: true } },
                    {
                      $set: {
                        [`pagesDaily.${dateNow.getFullYear()}.${dateNow.getMonth()}.${dateNow.getDate()}.${newPage}`]:
                          newPageData,
                      },
                    }
                  )
                  .then(() => {
                    resolve({ pagesByDay: { resolve: true } });
                  });
              }
            } else {
              // PAGE DOES NOT EXISTS

              const newPage = { [pageID]: 1 } as Object;

              pagesByDay
                .updateOne(
                  { pagesDaily: { $exists: true } },
                  {
                    $set: {
                      [`pagesDaily.${dateNow.getFullYear()}.${dateNow.getMonth()}.${dateNow.getDate()}`]:
                        newPage,
                    },
                  },
                  { returnOriginal: false }
                )
                .then(() => {
                  resolve({ pagesByDay: { resolve: true } });
                });
            }
          } else {
            // DAY DOES NOT EXISTS

            const newPage = { [pageID]: 1 } as Object;

            pagesByDay
              .updateOne(
                { pagesDaily: { $exists: true } },
                {
                  $set: {
                    [`pagesDaily.${dateNow.getFullYear()}.${dateNow.getMonth()}.${dateNow.getDate()}`]:
                      newPage,
                  },
                },
                { returnOriginal: false }
              )
              .then(() => {
                resolve({ pagesByDay: { resolve: true } });
              });
          }
        } else {
          // YEAR DOES NOT EXISTS

          const newPage = { [pageID]: 1 } as Object;
          console.log(newPage);

          pagesByDay
            .updateOne(
              { pagesDaily: { $exists: true } },
              {
                $set: {
                  [`pagesDaily.${dateNow.getFullYear()}.${dateNow.getMonth()}.${dateNow.getDate()}`]: newPage,
                },
              },
              { returnOriginal: false }
            )
            .then(() => {
              resolve({ pagesByDay: { resolve: true } });
            });
        }
      });
  });

  const pagesAnalyticsPromise = new Promise(function (resolve, reject) {
    pagesAnalytics
      .findOne({ pagesAllViews: { $exists: true } })
      .then(async (pageExists) => {
        var data = pageExists as any;

        if (data.pagesAllViews[pageID] != undefined) {
          var newCount = Number(data.pagesAllViews[pageID] + 1);
          data.pagesAllViews[pageID] = newCount;

          pagesAnalytics
            .findOneAndUpdate(
              { pagesAllViews: { $exists: true } },
              {
                $set: {
                  pagesAllViews: data.pagesAllViews,
                },
              },
              { returnOriginal: false }
            )
            .then(() => {
              resolve({ pagesAnalytics: { resolve: true } });
            });
        } else {
          data.pagesAllViews[pageID] = 1;

          pagesAnalytics
            .findOneAndUpdate(
              { pagesAllViews: { $exists: true } },
              {
                $set: {
                  pagesAllViews: data.pagesAllViews,
                },
              },
              { returnOriginal: false }
            )
            .then(() => {
              resolve({ pagesAnalytics: { resolve: true } });
            });
        }
      });
  });

  const countVisitorPromise = new Promise(function (resolve, reject) {
    if (countVisitor) {
      if (userID === "randomUser") {
        visitorsAnalytics
          .findOne({ allVisitors: { $exists: true } })
          .then(async (visitors) => {
            const visitorNumber = Number(visitors!.allVisitors);
            await visitorsAnalytics
              .findOneAndUpdate(
                { allVisitors: { $exists: true } },
                { $set: { allVisitors: visitorNumber + 1 } },
                { returnOriginal: false, returnDocument: "after" }
              )
              .then(() => {
                resolve({ countVisitorPromise: { resolve: true } });
              });
          });
      } else {
        resolve({ countVisitorPromise: { resolve: true } });
      }
    } else {
      resolve({ countVisitorPromise: { resolve: true } });
    }
  });

  await Promise.allSettled([
    pagesByDayPromise,
    pagesAnalyticsPromise,
    countVisitorPromise,
  ]).then((results) => {
    var fulfilled = 0;
    var errored = 0;
    var erroredNames = [] as Array<String>;

    results.map((r: any) => {
      if (r.status == 'fulfilled') {
        fulfilled++;
        if (fulfilled === 3) {
          res.status(200).json({ Success: true });
        }
      }
      if (r.status == 'rejected') {
        const errorName = Object.keys(r.reason).toString();

        errored++;
      }
    });
    if (errored > 0) {
      res.status(500).json({ Error: erroredNames });
    }
  });
}
