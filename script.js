document.getElementById("generateQuotes").addEventListener("click", function() {
    var videoLink = document.getElementById("videoLink").value;
    if (videoLink.trim() === "") {
        alert("Please enter a valid video URL.");
        return;
    }

    fetchVideoContent(videoLink)
        .then(videoContent => {
            return fetch('http://localhost:3000/generate-quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoContent }),
                credentials: 'include'  // Important for CORS and sending cookies
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayQuotes(data.quotes);
        })
        .catch(error => {
            console.error("Error generating quotes:", error);
            alert("Error generating quotes. Please try again later.");
        });
});

function fetchVideoContent(videoLink) {
    const apiKey = ''; // Replace with your actual YouTube API key
    const videoId = getVideoId(videoLink);

    return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch video details');
            }
            return response.json();
        })
        .then(data => {
            if (data.items.length === 0) {
                throw new Error('Video not found');
            }
            const videoTitle = data.items[0].snippet.title;
            const videoDescription = data.items[0].snippet.description;
            const videoContent = `${videoTitle}. ${videoDescription}`;
            return videoContent;
        });
}

function getVideoId(videoLink) {
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoLink.match(youtubeRegex);
    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error('Invalid YouTube URL');
    }
}

function displayQuotes(quotes) {
    const quotesElement = document.getElementById("quotes");
    quotesElement.innerHTML = ""; // Clear previous quotes
    quotes.forEach(quote => {
        const p = document.createElement("p");
        p.textContent = quote;
        quotesElement.appendChild(p);
    });
}
