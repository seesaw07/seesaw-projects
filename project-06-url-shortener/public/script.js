// URL Shortener Frontend

// Shorten URL
async function shortenUrl() {
    const input = document.getElementById('url-input');
    const url = input.value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl: url })
        });
        
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }
        
        // Show result
        document.getElementById('short-url').value = data.shortUrl;
        document.getElementById('result').classList.remove('hidden');
        
        // Clear input
        input.value = '';
        
        // Refresh list
        loadUrls();
        
    } catch (error) {
        alert('Error creating short URL');
    }
}

// Copy URL to clipboard
function copyUrl() {
    const shortUrl = document.getElementById('short-url');
    shortUrl.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
}

// Load all URLs
async function loadUrls() {
    try {
        const response = await fetch('/api/urls');
        const urls = await response.json();
        
        const container = document.getElementById('urls-container');
        
        if (urls.length === 0) {
            container.innerHTML = '<p style="color: #888; text-align: center;">No URLs yet</p>';
            return;
        }
        
        container.innerHTML = urls.map(url => `
            <div class="url-item">
                <div class="url-info">
                    <a href="/${url.shortCode}" target="_blank">/${url.shortCode}</a>
                    <p>${url.originalUrl}</p>
                </div>
                <div class="url-stats">
                    <span>👆 ${url.clicks} clicks</span>
                    <button onclick="deleteUrl('${url._id}')" class="delete-btn">🗑️</button>
                </div>
            </div>
        `).join('');
        
        // Update stats
        document.getElementById('total-urls').textContent = urls.length;
        document.getElementById('total-clicks').textContent = urls.reduce((sum, url) => sum + url.clicks, 0);
        
    } catch (error) {
        console.error('Error loading URLs');
    }
}

// Delete URL
async function deleteUrl(id) {
    if (!confirm('Delete this URL?')) return;
    
    try {
        await fetch(`/api/urls/${id}`, { method: 'DELETE' });
        loadUrls();
    } catch (error) {
        alert('Error deleting URL');
    }
}

// Load URLs on page load
loadUrls();

// Allow Enter key
document.getElementById('url-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        shortenUrl();
    }
});