// Ensure functionality of all survey questions, modals, and proposal button behavior
const clientId = '23532a7bdbc74de3923e315c3aa86ed6';
const clientSecret = 'dd2a39230842422380f4b88be35c5cdf';
const API_KEY = 'AIzaSyD88tiSLQyB2X10tkT5Re_ulUtAZnEIloo';

let spotifyToken = null;
let currentAudio = null;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").onclick = startSurvey;
    getSpotifyToken();
});
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        
        // Stop Spotify playback if closing songPopup
        if (modalId === "songPopup" && currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        // Stop YouTube video if closing moviePopup
        if (modalId === "moviePopup") {
            const videoContainer = document.getElementById("videoContainer");
            videoContainer.innerHTML = ""; // Remove the iframe to stop video playback
        }
    }
}

// Spotify token fetch
async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    spotifyToken = data.access_token;
}

function startSurvey() {
    showPage("question1");
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.style.display = "none");
    document.getElementById(pageId).style.display = "flex";
}

function showNamePopup() {
    const userName = document.getElementById("userName").value;
    if (!userName) {
        alert("Please enter your name.");
        return;
    }
    document.getElementById("nameMessage").textContent = `${userName}, you're cute jeans!`;
    document.getElementById("namePopup").style.display = "block";
}

// Spotify song preview
async function playFavoriteSong() {
    const songInput = document.getElementById("favoriteSong").value;
    const [title, artist] = songInput.split('-').map(s => s.trim());
    if (!title || !artist) {
        alert("Please enter in 'title-singer' format.");
        return;
    }
    const query = `${title} artist:${artist}`;
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: { 'Authorization': 'Bearer ' + spotifyToken }
    });
    const data = await response.json();
    if (data.tracks.items.length) {
        const track = data.tracks.items[0];
        const albumCover = document.getElementById("albumCover");
        albumCover.src = track.album.images[0].url;
        albumCover.classList.add('rotating'); // Spin effect
        document.getElementById("musicTasteMessage").textContent = "You have great taste!";
        if (track.preview_url) {
            currentAudio = new Audio(track.preview_url);
            currentAudio.play();
            setTimeout(() => {
                currentAudio.pause();
                albumCover.classList.remove('rotating');
            }, 10000); // Stops after 10 seconds
        } else {
            alert("Preview not available.");
        }
        document.getElementById("songPopup").style.display = "block";
    } else {
        alert("Song not found.");
    }
}

// YouTube movie scene
async function playMovieScene() {
    const movieTitle = document.getElementById("favoriteMovie").value;
    if (!movieTitle) {
        alert("Please enter a movie title.");
        return;
    }
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieTitle + " movie best scene")}&type=video&videoDuration=short&key=${API_KEY}`);
    const data = await response.json();
    if (data.items.length) {
        const videoId = data.items[0].id.videoId;
        document.getElementById("videoContainer").innerHTML = `<iframe width="360" height="202" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        document.getElementById("moviePopup").style.display = "block";
    } else {
        alert("No short videos found.");
    }
}

// Background color change
function changeBackground() {
    const color = document.getElementById("favoriteColor").value;
    if (!/^#[0-9A-F]{6}$/i.test(color) && !/^[a-zA-Z]+$/.test(color)) {
        alert("Please enter a valid color name.");
        return;
    }
    setTimeout(() => {
        document.body.style.backgroundColor = color;
        new Audio("https://drive.google.com/uc?export=view&id=11NRjW6MA-aL0NI3pqcxUPJP0JU9YsLIa").play();
    }, 4390);
    document.getElementById("colorPopup").style.display = "block";
    setTimeout(() => document.getElementById("colorPopup").style.display = "none", 7000);
}

// Show response when clicking "Yes" on the proposal question
function showYesResponse() {
    document.getElementById("yesResponsePopup").style.display = "block";
}

// Show response when clicking "No" on the proposal question
function showNoResponse() {
    showPage("finalProposal");
}
// Modified Audio Link
let escapeAudio = new Audio("https://www.dropbox.com/scl/fi/yrhn5vn566mpt117aazb6/MC-Hammer-U-Can-t-Touch-This-HQ.mp3?rlkey=rl569gx1m7fydzh5xhxb07el6&raw=1");
let audioStarted = false; // Track if the audio has started

function noEscape() {
    const noButton = document.getElementById("noButton");
    const yesButton = document.getElementById("yesButton");
    const proximityThreshold = 100; // Distance in pixels to trigger the movement

    // Listen for mouse movement on the entire document
    document.addEventListener('mousemove', (event) => {
        const rect = noButton.getBoundingClientRect();
        const buttonX = rect.left + rect.width / 2;
        const buttonY = rect.top + rect.height / 2;

        // Calculate distance between cursor and button center
        const distance = Math.sqrt(
            Math.pow(event.clientX - buttonX, 2) +
            Math.pow(event.clientY - buttonY, 2)
        );

        // If within threshold, move button and play audio if not already started
        if (distance < proximityThreshold) {
            noButton.style.top = Math.random() * 80 + "%";
            noButton.style.left = Math.random() * 80 + "%";
            
            if (!audioStarted) {
                escapeAudio.play().catch(error => console.error("Audio playback error:", error));
                audioStarted = true; // Mark audio as started
            }
        }
    });

    // Stop audio when the "Yes" button is clicked
    yesButton.addEventListener('click', () => {
        escapeAudio.pause();
        escapeAudio.currentTime = 0; // Reset audio to the beginning
    });
}

// New audio for the final proposal page
let finalSong = new Audio("https://www.dropbox.com/scl/fi/8832l0kapfer3k9d25zyz/Donald-Trump-Beyonce-iMarkkeyz-Edit.mp3?rlkey=4aqxa2yvpofv9fdgagcwkdrnl&raw=1");

// Function to show the final proposal message with music, GIF, and bold text
function showFinalProposal() {
    // Play the final song
    finalSong.play().catch(error => console.error("Audio playback error:", error));
    confetti.start();
    setTimeout(() => {
        confetti.stop();
        // Additional celebration effects
    }, 5000);
    // Create and display the modal content
    const modalContent = `
        <div class="final-modal">
            <img src="https://media1.tenor.com/m/9mTO4qlAFHQAAAAd/jojosiwa-karma.gif" alt="Proposal GIF" class="proposal-gif" />
            <p class="final-message">
                <strong>mama, a girl<strong>friend</strong> behind you💜</strong>
            </p>
        </div>
    `;

    // Insert modal content into the document
    const finalModal = document.createElement("div");
    finalModal.classList.add("modal");
    finalModal.innerHTML = modalContent;
    document.body.appendChild(finalModal);
}

// Add an event listener to the Yes button to show the final proposal page
const yesButton = document.getElementById("yesButton");
yesButton.addEventListener('click', () => {
    showFinalProposal();
});

// Final celebration when "Yes" is clicked
function celebrate() {
    showPage("celebrationPage");
    const confettiAudio = document.getElementById("celebrationAudio");
    confettiAudio.play(); // Play celebration audio

    const thankMessage = document.getElementById("thankMessage");
    const finalMessage = document.getElementById("finalMessage");
    finalMessage.classList.add("pulse"); // Add pulsating effect to final message
    confetti.start();
    // Hide "thank you" message after 1 second
    setTimeout(() => {
        thankMessage.style.display = "none";
    }, 1000);
}
