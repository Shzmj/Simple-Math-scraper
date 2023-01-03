import puppeteer from 'puppeteer';
import data from './data/courses.json' assert { type: "json" };
import courseData from './data/courseInfo.json' assert {type: "json"};
import fs from 'fs';

const courseInfo = courseData;

async function scrapeCourse(course) {
    // starting a new browser session
    const browser = await puppeteer.launch();
    // generating blank page
    const page = await browser.newPage();

    // navigate to specified address
    await page.goto(`https://www.handbook.unsw.edu.au/undergraduate/courses/2023/${course.code}?year=2023`);
    // scrape the course name. If the name doesn't exist then this page is invalid
    let [el] = await page.$x('//*[@id="academic-item-banner"]/div/div/h2');
    if (el === undefined) {
        let courseObj = {
            code: course.code,
            name: course.name,
            overview: null,
            conditions: null,
            term1: course.term1,
            term2: course.term2,
            term3: course.term3,
        }
        courseInfo.push(courseObj);
        console.log(courseObj);
        fs.writeFileSync('data/courseInfo.json', JSON.stringify(courseInfo, null, 2));
        await browser.close();
    }

    const text = await el.getProperty('textContent');
    const name = await text.jsonValue();

    // scrape the course overview. Some course pages store the overview in different xPaths
    let [el2] = await page.$x('//*[@id="Overview"]/div[2]/div[1]/div[2]/p');
    if (el2 === undefined) {
        [el2] = await page.$x('//*[@id="Overview"]/div[2]/div[1]/div[2]');
    }

    if (el2 === undefined) {
        [el2] = await page.$x('//*[@id="Overview"]/div[2]/div/div/p');
    }

    if (el2 == undefined) {
        [el2] = await page.$x('//*[@id="Overview"]/div[2]/div/div');
    }

    const text2 = await el2.getProperty('textContent');
    const overview = await text2.jsonValue();

    // scrape the conditions for enrolment. Some course pages do not contain this field so if undefined 
    // we will define as null
    const [el3] = await page.$x('//*[@id="ConditionsforEnrolment"]/div[2]/div');
    let conditions = null;
    if (el3 !== undefined) {
        const text3 = await el3.getProperty('textContent');
        conditions = await text3.jsonValue();
    }

    let courseObj = {
        code: course.code,
        name: name,
        overview: overview,
        conditions: conditions,
        term1: course.term1,
        term2: course.term2,
        term3: course.term3,
    }

    courseInfo.push(courseObj);
    // error check to see that course object is being outputted correctly
    console.log(courseObj);

    // Writing the extracted data to courseInfo.json file.
    fs.writeFileSync('data/courseInfo.json', JSON.stringify(courseInfo, null, 2));

    // Closing the browser session
    await browser.close();

}

// loops through all course names and gathers course data in data/courseInfo.json
for (const course of data) {
    await scrapeCourse(course);
}

// Use the below for scraping data for a single course
//
// scrapeCourse('{course-code-here}');
// i.e. scrapeCourse('MATH2621');


