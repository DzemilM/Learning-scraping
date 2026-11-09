import { JSDOM } from "jsdom";

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

const firstCategory = categoryUrls[0];

const firstCategoryResponse = await fetch(firstCategory);

const firstCategoryHtml = await firstCategoryResponse.text();

const firstCategoryDoc = new JSDOM(firstCategoryHtml).window.document;

const firstCategoryParentDiv = firstCategoryDoc.querySelector("#CenColInn");
const ol = firstCategoryParentDiv.querySelector("ol");

const firstCatHrefs = [...ol.querySelectorAll("li a")].map((link) => {
    return link.getAttribute("href");
})

const properFirstCatHrefs = [];

for (const href of firstCatHrefs) {
    if(!properFirstCatHrefs.includes(href)) {
        properFirstCatHrefs.push(href);
    }
}

const firstCategoryUrls = properFirstCatHrefs.map((href) => {
    return new URL(href, firstCategory).href;
})

const firstSubCategory = firstCategoryUrls[0];

const firstSubRes = await fetch(firstSubCategory);
const firstSubHtml = await firstSubRes.text();

const firstSubCatDoc = new JSDOM(firstSubHtml).window.document;

const subOl = firstSubCatDoc.querySelector("#Hier2");
const firstSubHrefs = [...subOl.querySelectorAll("li a")].map((link) => {
    return link.getAttribute("href");
})

const properSubHrefs = [];

for (const href of firstSubHrefs) {
    if(!properSubHrefs.includes(href)) {
        properSubHrefs.push(href);
    }
}

const firstSubUrls = properSubHrefs.map((href) => {
    return new URL(href, url).href;
})

console.log(firstSubUrls);