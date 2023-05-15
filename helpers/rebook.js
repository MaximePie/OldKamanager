let item = {};
/**
 * Take a gear name as parameter and send a request to the server to rebook it
 */
async function rebook(item) {
    const {_id} = item;
    item.toBeCrafted += 1;
    item.isInMarket = false;
    item.sold += 1;
    return fetch("http://127.0.0.1:4001/gears/update/" + _id, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "http://localhost:3000/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify({product: item}),
        "method": "POST"
    }).then(res => res.json())
        .then(res => console.log(res))
}

/**
 * Fetch the item info from the server
 */
function itemDetails(namePart) {

    return fetch(`http://127.0.0.1:4001/gears?search=${namePart}&types=&minLevel=0&maxLevel=200&limit=10&isPricelessOnly=false&isInInventory=false&isInShopHidden=false&shouldHideToBeCrafted=false&shouldShowToBeCraftedOnly=false&shouldDisplayOldPrices=false&shouldDisplayWishlist=false&minCurrentPrice=0`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "if-none-match": "W/\"7b5e-cVwB1SsMm3A2SqFFyt63Px4idIo\"",
            "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "http://localhost:3000/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    }).then(response => response.json()).then(data => {
        item = data.gears.find(({name}) => name === namePart)
        if (!item) {
            throw new Error("Item not found");
        }
        return item;
    });
}

async function main() {
    let items = process.argv.slice(2);
    if (!items.length) {
        // Get all items from the file pendingItems.txt
        const fs = require('fs');
        items = fs.readFileSync('pendingItems.txt', 'utf8').split('\n');
        items = items.map(item => item.trim());
    }
    Promise.all(items.map(itemDetails)).then(async items => {
        let item = await itemDetails("Cape Maimpa");
        // await rebook(item);
    });
}

console.log(process.argv);
main().then(() => {
    console.log("done");
});
