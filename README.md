# Simple-Math-Scraper

A simple web scraper to scrape data from UNSW math course pages. Uses the course codes in the courses.json file which was produced by  [@Shubh141](https://github.com/Shubh141/Simple-Web-Scraper) to then go through each course handbook page and scrape the relevant course data from there.

Properties scraped include:
- Course name
- Course conditions
- Course description
- Teaching periods

The data above was then extracted and used for a React App project to create dynamic webpages found here: [Math-Electives] (https://github.com/Personal-Projex/Math-Electives).

To see the scraped data, open courseInfo.json in the data folder (or [click here](./data/courseInfo.json))

To use the webscraper, simply run ```node courseScraper.js``` in the root directory
