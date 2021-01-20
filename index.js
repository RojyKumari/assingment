const fs = require("fs");
var path = require('path');

const BASE_PATH = "data";
const CLICKS_FILE_NAME = "clicks.json";
const RESULT_FILE_NAME = "resultset.json";

fs.readFile(path.join(BASE_PATH, CLICKS_FILE_NAME), (err, data) => {
  if (err) throw err;
  const clicks = JSON.parse(data);
  const stringResultSet = getResult(clicks);
  fs.writeFile(path.join(BASE_PATH, RESULT_FILE_NAME), stringResultSet, (err)=>{
    if(err){
      console.log("Error while writing resultset", err);
    }
    console.log("Data is written on resultset json");
  })
});

// To generate a result set
// based on given conditions on clicks
const getResult = function (clicks) {
  // data variable will store clicks in form
  // key = "date:hour" => 2:3 here 2 is date and 3 is hours
  // value is click object
  const data = {};

  const finalResultSet = [];

  const IPStats = {
    // ipCounter will store the total counter of ips
    // ip:count
    ipCounter: {},
    // ipExtendedLimits will store the ip which has extended the limits.
    // ip: islimitReached
    ipExtendedLimits: {},
  };

  clicks.forEach((click) => {
    const ip = click.ip;
    const amount = click.amount;
    const timestamp = click.timestamp;
    const dateTimeStr = getDateTimeUniqueStr(timestamp);
    setIPCounter(ip, IPStats);
    // If data is present.. check for expensive or early click
    if (data[dateTimeStr]) {
      const previousClick = data[dateTimeStr];
      // If ip is same and amount ties, keep early one
      if (previousClick.ip === ip && previousClick.amount === amount) {
        const previousIpTimeMs = getTimeInMs(previousClick.timestamp);
        const currentIpTimeMs = getTimeInMs(timestamp);
        // Current ip time is early replace. else do nothing.
        if (currentIpTimeMs < previousIpTimeMs) {
          if (!IPStats.ipExtendedLimits[ip]) {
            data[dateTimeStr] = click;
          }
        }
      } else {
        const previousClickAmount = previousClick.amount;
        if (previousClickAmount < amount) {
          if (!IPStats.ipExtendedLimits[ip]) {
            data[dateTimeStr] = click;
          }
        }
      }
    } else {
      if (!IPStats.ipExtendedLimits[ip]) {
        data[dateTimeStr] = click;
      }
    }
  });

  // Now set data in final set..
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const click = data[key];
      const ip = click.ip;
      // Check for ip called more than 10 times..
      if (!IPStats.ipExtendedLimits[ip]) {
        finalResultSet.push(click);
      }
    }
  }
  const stringResultSet = JSON.stringify(finalResultSet);
  return stringResultSet;

};

const setIPCounter = (ip, IPStats) => {
  // Increment IP counter by 1
  IPStats.ipCounter[ip] = IPStats.ipCounter[ip] ? IPStats.ipCounter[ip] + 1 : 1;
  const totalCount = IPStats.ipCounter[ip];
  if (totalCount > 10) {
    IPStats.ipExtendedLimits[ip] = true;
  }
};

// Converts timestamp string in unique `date:hours` format.
const getDateTimeUniqueStr = (dateStr) => {
  const dateInObj = new Date(dateStr);
  const hours = dateInObj.getHours();
  const date = dateInObj.getDate();
  const uniqueDateHour = `${date}:${hours}`;
  return uniqueDateHour;
};

const getTimeInMs = (dateStr) => {
  const dateInObj = new Date(dateStr);
  return dateInObj.getTime();
};

module.exports = {
  getResult
}
