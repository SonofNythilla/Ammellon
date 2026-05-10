const gallery = document.getElementById("gallery");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");

async function loadAlbums() {

    const response = await fetch("data/albums.json");

    const data = await response.json();

    data.albums.forEach(album => {

        const albumSection = document.createElement("section");
        albumSection.className = "album";

        const title = document.createElement("h2");
        title.className = "album-title";
        title.textContent = album.name;

        const grid = document.createElement("div");
        grid.className = "photo-grid";

        album.photos.forEach(photo => {

            const card = document.createElement("div");
            card.className = "photo-card";

            const img = document.createElement("img");

            img.src = `albums/${album.folder}/${photo}`;

            img.alt = photo;

            img.onclick = () => openLightbox(img.src);

            card.appendChild(img);

            grid.appendChild(card);

        });

        albumSection.appendChild(title);
        albumSection.appendChild(grid);

        gallery.appendChild(albumSection);

    });

}

function openLightbox(src) {

    lightboxImg.src = src;

    lightbox.classList.remove("hidden");

}

function closeLightbox() {

    lightbox.classList.add("hidden");

}

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        closeLightbox();

    }

});

loadAlbums();
