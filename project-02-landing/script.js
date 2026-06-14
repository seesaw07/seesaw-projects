// Hello from seesaw!
console.log("Hello from seesaw!");

// Counter
let count = 0;

function increaseCount() {
    count = count + 1;
    document.getElementById("count").textContent = count;
}

// Theme Toggle
let isDark = true;

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("theme-btn");
    
    if (isDark) {
        // Switch to Light
        body.style.backgroundColor = "#ffffff";
        body.style.color = "#000000";
        btn.textContent = "☀️";
        isDark = false;
    } else {
        // Switch to Dark
        body.style.backgroundColor = "#0a0a0a";
        body.style.color = "#ffffff";
        btn.textContent = "🌙";
        isDark = true;
    }
}