import { JSDOM } from "jsdom";
import { writeFile } from "node:fs/promises";
import { url } from "node:inspector";


const homeUrl = "https://www.davpack.co.uk/";

async function getDoc(pageUrl) {

    const response = await fetch(pageUrl);

    const html = await response.text();

    const doc = new JSDOM(html).window.document;

    return doc;
}

function getLinks(doc, selector, baseUrl) {
    const hrefs = [...doc.querySelectorAll(`${selector} li a`)].map((link) => {
        return link.getAttribute("href")
    })

    const uniqueHrefs = [];

    for (const href of hrefs) {
        if (!uniqueHrefs.includes(href)) {
            uniqueHrefs.push(href);
        }
    }

    const urls = uniqueHrefs.map((href) => {
        return new URL(href, baseUrl).href;
    })

    return urls;
}

const homePage = await getDoc(homeUrl);

const homeCategories = getLinks(homePage, "#hd_hn", homeUrl);

const firstHomeCategory = homeCategories[0];

const cardBoardBoxes = await getDoc(firstHomeCategory);

const cardBBUrls = getLinks(cardBoardBoxes, "#CenColInn", firstHomeCategory);

const allProductPages = [];

for (const cardBBUrl of cardBBUrls) {
    const subCategory = await getDoc(cardBBUrl);
    const subCategoryUrls = getLinks(subCategory, "#Hier2", cardBBUrl)

    if(subCategoryUrls.length === 0) {
        allProductPages.push(cardBBUrl)
    } else {
        allProductPages.push(...subCategoryUrls)
    }
}


console.log(allProductPages)