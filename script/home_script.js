const unmuteButton = document.getElementById("unmute-button");
const video = document.getElementById("bgvid");

unmuteButton.addEventListener("click", () => {
  video.muted = !video.muted;
  if (video.muted) {
    unmuteButton.innerHTML = "🔊";
  } else {
    unmuteButton.innerHTML = "🔇";
  }
});
