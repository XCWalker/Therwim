const designTemplate = document.querySelector("[data-design-all-template]");
const designContainer = document.querySelector("[data-design-all-container]");

let designs = []

fetch("https://raw.githubusercontent.com/XCWalker/Therwim/main/graphics.json")
    .then(res => res.json())
    .then(data => {
        sortedDesigns = data.sort(function (a, b) {
            if (a.title < b.title) { return -1; }
            if (a.title > b.title) { return 1; }
            return 0;
        });
        designs = sortedDesigns.map(design => {
            const card = designTemplate.content.cloneNode(true).children[0];
            const title = card.querySelector("[data-design-all-title]");
            const date = card.querySelector("[data-design-all-date]");
            const shortDescription = card.querySelector("[data-design-all-short-description]");
            const thumbnail = card.querySelector("[data-design-all-thumbnail]");
            const button = card.querySelector("[data-design-all-open]");
            title.textContent = design.title;
            date.textContent = new Date(design.date).toLocaleTimeString() + " | " + new Date(design.date).toLocaleDateString();
            shortDescription.textContent = design.shortDesc;
            thumbnail.src = design.thumbnailURL;
            button.href = "#" + design.uuid;

            designContainer.append(card);

            return { design }
        });
    })

var filteredDesigns = [];

window.addEventListener('popstate', function (e) {
    e.preventDefault;
    var hash = this.location.hash.replace("#", "");
    if (hash == "") {
        return
    }

    filteredDesigns = designs.find(design => design.design.uuid == hash);

    this.location.hash = "";

    singleDesign();
});

const designSingleTemplate = document.querySelector("[data-design-single-template]");
const designSingleContainer = document.querySelector("[data-design-single-container]");

function singleDesign() {
    if (designSingleContainer.children.length == 2) {
        designSingleContainer.children[1].remove();
    }

    var design = filteredDesigns.design;

    if (design == undefined) {
        return "No Design"
    }

    const card = designSingleTemplate.content.cloneNode(true).children[0];
    const title = card.querySelector("[data-design-single-title]");
    const date = card.querySelector("[data-design-single-date]");
    const description = card.querySelector("[data-design-single-description]");
    const thumbnail = card.querySelector("[data-design-single-thumbnail]");

    title.textContent = design.title;
    date.textContent = new Date(design.date).toLocaleTimeString() + " | " + new Date(design.date).toLocaleDateString();
    description.textContent = design.description;
    thumbnail.src = design.thumbnailURL;

    const designSingleDownloadsTemplate = card.querySelector("[data-design-single-downloads-template]");
    const designSingleDownloadsContainer = card.querySelector("[data-design-single-downloads-container]");

    const designSingleImagesTemplate = card.querySelector("[data-design-single-images-template]");
    const designSingleImagesContainer = card.querySelector("[data-design-single-images-container]");

    if (design.downloads.length == 0) {
        designSingleDownloadsContainer.style.display = "none";
    } else if (design.downloads.length != 0) {
        design.downloads.map(downloadItem => {
            const download = designSingleDownloadsTemplate.content.cloneNode(true).children[0];
            download.textContent = "[" + downloadItem.type + "] Download";

            designSingleDownloadsContainer.append(download)
        })
    }

    if (design.images.length == 0) {
        designSingleImagesContainer.style.display = "none";
        console.log("hidden")
    } else if (design.images.length != 0) {
        design.images.map(imageItem => {
            const download = designSingleImagesTemplate.content.cloneNode(true).children[0];
            download.src = imageItem.URL;

            designSingleImagesContainer.append(download)
        })
    }

    designSingleContainer.append(card);

}
