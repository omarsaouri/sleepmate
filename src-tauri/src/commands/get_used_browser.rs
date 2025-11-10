use std::process::Command;

#[tauri::command]

pub fn get_used_browser() -> Option<String> {
    let output = Command::new("osascript")
        .arg("-e")
        .arg(
            r#"tell application "System Events"
                set browserApps to {"Google Chrome", "Safari", "Mozilla Firefox", "Microsoft Edge", "Opera", "Brave Browser", "Vivaldi", "Internet Explorer", "Tor Browser", "Chromium"}
                set runningBrowsers to {}
                repeat with b in browserApps
                    if (name of processes) contains b then
                        set end of runningBrowsers to b
                    end if
                end repeat
                set outputText to ""
                repeat with r in runningBrowsers
                    set outputText to outputText & r & linefeed
                end repeat
                return outputText
            end tell"#,
        )
        .output()
        .ok()?; // Return None if command fails

    let browser = String::from_utf8_lossy(&output.stdout).trim().to_string();

    if browser.is_empty() {
        None
    } else {
        Some(browser)
    }
}
