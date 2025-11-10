use std::process::Command;

#[tauri::command]
pub fn sleep_mac() -> Result<String, String> {
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
