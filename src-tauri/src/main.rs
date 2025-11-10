#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
use commands::*;
use std::net::TcpListener;
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{Builder, Emitter, Manager, State};
use tungstenite::accept;

#[derive(Clone)]
pub struct VideoInfo {
    pub data: Arc<Mutex<Option<String>>>,
}

#[tauri::command]
fn get_latest_video(info: State<VideoInfo>) -> Option<String> {
    info.data.lock().unwrap().clone()
}

fn main() {
    // Shared state
    let video_info = VideoInfo { data: Arc::new(Mutex::new(None)) };

    // Clone for WebSocket thread
    let ws_info = video_info.clone();

    // Start WebSocket server in background thread
    thread::spawn(move || {
        let server = TcpListener::bind("127.0.0.1:4000").unwrap();
        println!("WebSocket server running on ws://127.0.0.1:4000");

        for stream in server.incoming() {
            let stream = stream.unwrap();
            let ws_info = ws_info.clone();
            thread::spawn(move || {
                let mut websocket = accept(stream).unwrap();
                loop {
                    let msg = websocket.read_message().unwrap();
                    if msg.is_text() {
                        let msg_text = msg.to_text().unwrap().to_string();

                        // Update shared state
                        {
                            let mut state = ws_info.data.lock().unwrap();
                            *state = Some(msg_text.clone());
                        }

                        // Debug
                        println!("Video info updated: {}", msg_text);
                    }
                }
            });
        }
    });

    Builder::default()
        .manage(video_info.clone()) // register state
        .invoke_handler(tauri::generate_handler![
            sleep_mac,
            get_used_browser,
            get_latest_video,
            get_browser_tabs
        ])
        .setup(move |app| {
            // Clone the app handle for use in the thread
            let app_handle = app.handle().clone();
            // Use the video_info that was moved into this closure
            let info_clone = video_info.clone();

            // Emit live updates to frontend every 500ms
            thread::spawn(move || loop {
                let latest = info_clone.data.lock().unwrap().clone();
                if let Some(ref msg) = latest {
                    // Use Emitter trait for emit
                    app_handle.emit("video-update", msg).ok();
                }
                std::thread::sleep(std::time::Duration::from_millis(500));
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
