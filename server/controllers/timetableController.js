import asyncHandler from 'express-async-handler';
import ical from 'ical-generator';
import puppeteer from 'puppeteer';
import Timetable from '../models/timetableModel.js';

// @desc   Creates timetable
// @route   POST /api/timetable/create
// @access  Private

export const createUserTimeTable = asyncHandler(async (req, res) => {
  try {
    const year = await fetchData(req.body.username, req.body.password);
    if (year) {
      const timetable = await Timetable.create({ year });
      const id = timetable._id;
      console.log(timetable);
      res.status(200);
      res.send(id);
    } else {
      console.log(year);
      res.status(400);
      res.send('Something went wrong :/');
    }
  } catch (error) {
    res.status(400);
    throw new Error(`Invalid Credentials or server timeout ${error}`);
  }
});
// @desc   get .ical link timetable
// @route   get /api/timetable/:id
// @access  Private

export const getUserTimeTable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (timetable && timetable.year) {
    const { year } = timetable;
    const cal = ical({ domain: 'brunel.ac.uk', name: 'University Timetable' });

    year.forEach((week) =>
      week.forEach((event) => {
        cal.createEvent({ ...event });
      })
    );
    cal.serve(res, 'UniversityTimetable');
  } else {
    console.log(year);
    res.status(400);
    res.send('Something went wrong :/');
  }
});

const formated_results = (monday_date, result) => {
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days - 1);
    return result;
  }
  const events = [];
  result.map((day) => {
    day.map((event, index) => {
      if (index !== 0) {
        const temp_desc = event[1].replace(/\s/g, '');
        const date = addDays(monday_date, event[8]);
        const e = {
          summary: temp_desc ? event[1] : event[0],
          start: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            event[2].split(':')[0],
            event[2].split(':')[1],
            0
          ),
          end: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            event[3].split(':')[0],
            event[3].split(':')[1],
            0
          ),
          location: event[5],
          date: addDays(monday_date, event[8]),
        };
        console.log(e);

        events.push(e);
      }
    });
  });

  return events;
};

const getWeekData = async (page) => {
  const monday_date = await page.evaluate(() => {
    function getMonthFromString(mon) {
      return new Date(Date.parse(`${mon} 1, 2012`)).getMonth() + 1;
    }
    const monday_date = document
      .getElementsByClassName('header-1-2-3')[0]
      .textContent.split('-')[0]
      .split(' ');
    const day = monday_date[0];
    const month = getMonthFromString(monday_date[1]);
    const year = monday_date[2];
    return `${year}-${month}-${day}`;
  });

  const result = await page.$$eval('.spreadsheet', (tables) => {
    const week = [];
    for (let i = 0; i < tables.length; i++) {
      // let date = monday_date
      const table = tables[i];
      const rows = table.querySelectorAll('tr');
      const day = Array.from(rows, (row) => {
        const columns = row.querySelectorAll('td');
        const arr = Array.from(columns, (column) => column.innerText);
        arr.push(i + 1);
        return arr;
      });
      week.push(day);
    }
    return week;
  });
  return formated_results(monday_date, result);
};

const fetchData = async (id, password) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://teaching.brunel.ac.uk/teaching/SWS-2122/login.aspx');

  await page.type('[name=tUserName]', id);
  await page.type('[name="tPassword"]', password);
  await page.click('[type=submit]');
  await page.waitForTimeout(200);
  console.log('User Logged In');
  await page.click('a[id="LinkBtn_mystudentsettimetable"]');
  await page.waitForTimeout(200);
  await page.select('select[name="lbWeeks"]', '1');
  await page.waitForTimeout(200);
  await page.select(
    'select[name="dlType"]',
    'TextSpreadsheet;swsurl;SWSCUST Object TextSpreadsheet'
  );
  await page.waitForTimeout(200);
  await page.click('[type=submit]');
  await page.waitForTimeout(200);
  const year = [];
  for (let i = 0; i < 35; i++) {
    console.log(`Fetched Week: ${i}`);
    const week = await getWeekData(page);
    if (week.length > 0) {
      year.push(week);
    }
    // const promise = page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.click('a[id="bNextWeek"]');
    await page.waitForTimeout(150);

    // await promise;
  }

  await browser.close();
  return year;
};
