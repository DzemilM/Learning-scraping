import { JSDOM } from "jsdom";

const url = "https://www.davpack.co.uk/";

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

const doc = await getDoc(url);

const categoryUrls = getLinks(doc, "#hd_hn", url);

const firstCategory = categoryUrls[0];

const firstCategoryDoc = await getDoc(firstCategory);

const subCategoryUrls = getLinks(firstCategoryDoc, "#CenColInn", firstCategory);

const firstSubCategory = subCategoryUrls[0];

const firstSubCatDoc = await getDoc(firstSubCategory);

const firstSubUrls = getLinks(firstSubCatDoc, "#Hier2", firstSubCategory)

console.log(firstSubUrls);