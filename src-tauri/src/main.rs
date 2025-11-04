#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Builder; 
use std::process::Command;
use std::collections::HashMap;
use std::fs;
use serde::{Serialize, Deserialize};

#[tauri::command]
fn sleep_mac() -> Result<String, String> {
    let status = Command::new("osascript")
        .arg("-e")
        .arg("tell application \"System Events\" to sleep")
        .status()
        .map_err(|e| format!("Failed to run command: {}", e))?;

    if status.success() {
        Ok("Mac is going to sleep!".into())
    } else {
        Err(format!("Command failed with status: {}", status))
    }
}

#[tauri::command]
fn get_current_youtube_url() -> Option<String> {
    // Try Safari first
    let safari_output = Command::new("osascript")
        .arg("-e")
        .arg(r#"tell application "Safari" to return URL of front document"#)
        .output()
        .ok()?;
    let url = String::from_utf8_lossy(&safari_output.stdout).trim().to_string();

    // If Safari is empty, try Chrome
    if url.is_empty() {
        let chrome_output = Command::new("osascript")
            .arg("-e")
            .arg(r#"tell application "Google Chrome" to return URL of active tab of front window"#)
            .output()
            .ok()?;
        let chrome_url = String::from_utf8_lossy(&chrome_output.stdout).trim().to_string();
        if chrome_url.contains("youtube.com/watch") || chrome_url.contains("youtu.be") {
            return Some(chrome_url);
        }
        return None;
    }

    if url.contains("youtube.com/watch") || url.contains("youtu.be") {
        Some(url)
    } else {
        None
    }
}



#[derive(Serialize, Deserialize, Debug)]
struct WatchData {
    map: HashMap<String, f64>, // URL -> last time in seconds
}

impl WatchData {
    fn load() -> Self {
        if let Ok(data) = fs::read_to_string("watch_data.json") {
            serde_json::from_str(&data).unwrap_or(Self { map: HashMap::new() })
        } else {
            Self { map: HashMap::new() }
        }
    }

    fn save(&self) {
        let _ = fs::write("watch_data.json", serde_json::to_string_pretty(&self).unwrap());
    }

    fn update_position(&mut self, url: String, position: f64) {
        self.map.insert(url, position);
        self.save();
    }

    fn get_position(&self, url: &str) -> Option<f64> {
        self.map.get(url).copied()
    }
}

#[tauri::command]
fn get_watch_position(url: String) -> Option<f64> {
    let data = WatchData::load();
    data.get_position(&url)
}

#[tauri::command]
fn update_watch_position(url: String, position: f64) {
    let mut data = WatchData::load();
    data.update_position(url, position);
}

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![sleep_mac])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
