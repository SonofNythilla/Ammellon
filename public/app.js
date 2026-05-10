async function loadAlbums() {
    const res = await fetch("/albums");
    const albums = await res.json();

    const container = document.getElementById("albums");
    container.innerHTML = "";

    for (const album of albums) {

        const albumDiv = document.createElement("div");
        albumDiv.className = "album";

        albumDiv.innerHTML = `
            <h2>${album.name}</h2>

            <input type="file" id="file-${album.id}">
            <button onclick="uploadPhoto(${album.id})">
                Upload Photo
            </button>

            <div class="photos" id="photos-${album.id}"></div>
        `;

        container.appendChild(albumDiv);

        loadPhotos(album.id);
    }
}

async function createAlbum() {
    const name = document.getElementById("albumName").value;

    if (!name) return;

    await fetch("/albums", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });

    document.getElementById("albumName").value = "";

    loadAlbums();
}

async function uploadPhoto(albumId) {
    const fileInput = document.getElementById(`file-${albumId}`);

    if (!fileInput.files[0]) return;

    const formData = new FormData();
    formData.append("photo", fileInput.files[0]);

    await fetch(`/upload/${albumId}`, {
        method: "POST",
        body: formData
    });

    loadPhotos(albumId);
}

async function loadPhotos(albumId) {
    const res = await fetch(`/photos/${albumId}`);
    const photos = await res.json();

    const container = document.getElementById(`photos-${albumId}`);

    container.innerHTML = "";

    photos.forEach(photo => {

        const img = document.createElement("img");

        img.src = `/uploads/${photo.filename}`;

        container.appendChild(img);
    });
}

loadAlbums();
