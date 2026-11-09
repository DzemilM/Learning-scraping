import { JSDOM } from "jsdom";
import { link } from "node:fs";

const url = "https://www.davpack.co.uk/";

const response = await fetch(url);

const html = await response.text();

const doc = new JSDOM(html).window.document;
//          build a page     → the tab → the page

const menu = doc.querySelector("#hd_hn");
const ul = menu.querySelector("ul");

const hrefs = [...ul.querySelectorAll("li a")].map((link) => {
    return link.getAttribute("href");
})

const categoryUrls = hrefs.map((href) => {
    return new URL(href, url).href;
})

console.log(categoryUrls);