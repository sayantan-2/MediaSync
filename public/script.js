var drop = document.getElementById("drop");
var baseUrl;

// Fetch the base URL from the server when the page loads
fetch("/base-url")
    .then((response) => response.text())
    .then((data) => {
        baseUrl = data;
    });

drop.addEventListener("dragover", function (e) {
    e.preventDefault();
    // Add some visual feedback
    drop.style.backgroundColor = "#ececec";
});

drop.addEventListener("dragleave", function (e) {
    // Remove the visual feedback
    drop.style.backgroundColor = "#ffffff";
});

drop.addEventListener("drop", function (e) {
    e.preventDefault();
    // Get the files from the event
    var files = e.dataTransfer.files;
    handleFiles(files);
});

function handleFiles(files) {
    // Create a new FormData instance
    var formData = new FormData();

    // Add each file to the form data
    for (var i = 0; i < files.length; i++) {
        formData.append("files[]", files[i]);
    }

    // Send the files to the server
    fetch("/upload", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
            // The server now responds with the short URL directly
            const shortUrl = data;

            // Generate the QR code with the short URL
            var qrcodeContainer = document.getElementById("qrcode");
            if (!qrcodeContainer) {
                console.error("Could not find QR code container element");
            } else {
                var qrcode = new QRCode(qrcodeContainer, {
                    text: shortUrl,
                    width: 200,
                    height: 200
                });
                qrcodeContainer.style.display = "flex";
                drop.style.display = "none";

                // Add an event listener to the QR code container
                qrcodeContainer.addEventListener("click", function () {
                    navigator.clipboard.writeText(shortUrl);
                    alert("Download link copied!");
                });
            }
        })
        .catch((error) => console.error(error));
}
