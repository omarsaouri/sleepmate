use std::process::Command;

#[tauri::command]

pub fn get_browser_tabs(browser: String) -> Result<Vec<String>, String> {
    let script = format!(
        "tell application \"{browser}\"
            set output to \"\"
            repeat with w in windows
                repeat with t in tabs of w
                    set output to output & (URL of t) & linefeed
                end repeat
            end repeat
        end tell
        return output"
    );

    let output = Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output()
        .map_err(|e| format!("Failed to run osascript: {e}"))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).into_owned());
    }

    let result = String::from_utf8_lossy(&output.stdout);
    let urls: Vec<String> =
        result.lines().filter(|line| !line.trim().is_empty()).map(|s| s.to_string()).collect();

    Ok(urls)
}
