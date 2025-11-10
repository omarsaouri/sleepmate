function getVideoInfo() {
  const video = document.querySelector('video');
  if (!video) return null;

  return {
    currentTime: video.currentTime,
    duration: video.duration,
    paused: video.paused,
    url: window.location.href,
    title: document.title,
  };
}

// Send updates every second
setInterval(() => {
  const info = getVideoInfo();
  if (info) {
    chrome.runtime.sendMessage({ type: 'VIDEO_INFO', data: info });
  }
}, 1000);
