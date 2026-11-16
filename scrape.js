import { JSDOM } from "jsdom";
import { writeFile } from "node:fs/promises";


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

