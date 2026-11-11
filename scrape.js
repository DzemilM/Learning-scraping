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

const homeDoc = await getDoc(homeUrl);

const categoryUrls = getLinks(homeDoc, "#hd_hn", homeUrl);

const firstCategoryUrl = categoryUrls[0];

const firstCategoryDoc = await getDoc(firstCategoryUrl);

const subCategoryUrls = getLinks(firstCategoryDoc, "#CenColInn", firstCategoryUrl);

const allBoxes = [];
const seenCodes = [];

for (const subCategoryUrl of subCategoryUrls) {

    const subCategoryDoc = await getDoc(subCategoryUrl);

    const rangeUrls = getLinks(subCategoryDoc, "#Hier2", subCategoryUrl);

    for (const rangeUrl of rangeUrls) {
        const rangeDoc = await getDoc(rangeUrl);
        const headings = rangeDoc.querySelectorAll(".headings > div");

        const priceHeading = [...headings].find((heading) => {
            return heading.textContent.includes("Box From");
        });
        const priceClass = priceHeading ? priceHeading.className : "";

        const sizeHeading = [...headings].find((size) => {
            return size.textContent.includes("mm");
        });
        const sizeClass = sizeHeading ? sizeHeading.className : "";

        const packHeading = [...headings].find((pack) => {
            return pack.textContent.includes("Pack");
        });

        const packClass = packHeading ? packHeading.className : "";

        const rows = rangeDoc.querySelectorAll(".Table > div");

        const boxes = [...rows].map((row) => {
            const codeCell = row.querySelector(".Code > span");
            const sizeCell = sizeClass.length > 0
            ? row.querySelector(`.${sizeClass} > span`) : "";
            const priceCell = priceClass.length > 0 
            ? row.querySelector(`.${priceClass} > span`) : "";
            const packCell = packClass.length > 0 
            ? row.querySelector(`.${packClass} > span`) : "";

            const box = {
                code: codeCell.textContent,
                size: sizeCell ? sizeCell.textContent : "",
                price: priceCell ? priceCell.textContent : "",
                packet_size: packCell ? packCell.textContent : ""
            }
            return box;
        });

        for (const box of boxes) {
            if(!seenCodes.includes(box.code)) {
                allBoxes.push(box);
                seenCodes.push(box.code);
            } 
        }
        
    }
}

const boxesJSON = JSON.stringify(allBoxes, null, 2);

await writeFile("boxes.json", boxesJSON); 