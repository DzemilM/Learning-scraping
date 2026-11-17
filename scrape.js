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

function getColumnIndex(headings, text) {
    return [...headings].findIndex((heading) => heading.textContent.includes(text));
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

const allBoxes = [];

for (const productPage of allProductPages) {
    const productDocument = await getDoc(productPage);
    const rows = productDocument.querySelectorAll(".Table > div");

    const headings = productDocument.querySelectorAll(".headings > div");
    const typeIndex = getColumnIndex(headings, "Type");    
    const priceIndex = getColumnIndex(headings, "Box From");
    const packetSizeIndex = getColumnIndex(headings, "Pack");

    for(const row of rows) {
        const code = row.querySelector(".Code").textContent.trim();
        const size = row.children[1].textContent.trim();

        const type = typeIndex === -1 ? 
        null : row.children[typeIndex].textContent.trim();

        const price = priceIndex === -1 ?
        null : row.children[priceIndex].textContent.trim();
        
        const packetSize = packetSizeIndex === -1 ?
        null : row.children[packetSizeIndex].textContent.trim();

        const box = {
            code : code,
            size : size,
            type : type,
            price : price,
            packet_size : packetSize,
            page_url : productPage
        }

        console.log(box)
    }
}

