let ws;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:4000');

  ws.onopen = () => console.log('Connected to Tauri WebSocket');
  ws.onclose = () => {
    console.log('Disconnected. Reconnecting in 3s...');
    setTimeout(connectWebSocket, 3000);
  };
}

// Listen to messages from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'VIDEO_INFO' && ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message.data));
  }
});

connectWebSocket();
