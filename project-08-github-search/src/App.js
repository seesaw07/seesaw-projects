import React, { useState } from 'react';

function App() {
    // State
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search GitHub user
    const searchUser = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        setLoading(true);
        setError(null);
        setProfile(null);
        setRepos([]);

        try {
            // Fetch user profile
            const profileResponse = await fetch(
                `https://api.github.com/users/${username.trim()}`
            );

            if (!profileResponse.ok) {
                throw new Error('User not found');
            }

            const profileData = await profileResponse.json();
            setProfile(profileData);

            // Fetch user repositories
            const reposResponse = await fetch(
                `https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=12`
            );

            if (reposResponse.ok) {
                const reposData = await reposResponse.json();
                setRepos(reposData);
            }

        } catch (err) {
            setError(err.message === 'User not found' 
                ? `User "${username}" not found. Please check the username.` 
                : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchUser();
        }
    };

    // Get language color
    const getLangColor = (lang) => {
        const colors = {
            JavaScript: '#f1e05a',
            TypeScript: '#2b7489',
            Python: '#3572A5',
            Java: '#b07219',
            'C++': '#f34b7d',
            C: '#555555',
            'C#': '#178600',
            PHP: '#4F5D95',
            Ruby: '#701516',
            Go: '#00ADD8',
            Rust: '#dea584',
            Swift: '#ffac45',
            Kotlin: '#A97BFF',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Shell: '#89e051',
        };
        return colors[lang] || '#8b949e';
    };

    return (
        <div className="app">
            <div className="container">
                {/* Header */}
                <header className="header">
                    <h1>🔍 GitHub Profile Search</h1>
                    <p>Search any GitHub user and view their profile & repositories</p>
                </header>

                {/* Search */}
                <div className="search-section">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Enter GitHub username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className="search-btn" 
                        onClick={searchUser}
                        disabled={loading}
                    >
                        {loading ? (
                            <>⏳ Searching...</>
                        ) : (
                            <>🔍 Search</>
                        )}
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Searching for user...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="error">
                        <div className="error-icon">😕</div>
                        <h3>Oops!</h3>
                        <p>{error}</p>
                    </div>
                )}

                {/* Profile */}
                {profile && !loading && (
                    <div className="profile-card">
                        <div className="profile-header">
                            <img 
                                src={profile.avatar_url} 
                                alt={profile.name || profile.login}
                                className="profile-avatar"
                            />
                            <div className="profile-info">
                                <h2 className="profile-name">
                                    {profile.name || profile.login}
                                </h2>
                                <p className="profile-username">@{profile.login}</p>
                                {profile.bio && (
                                    <p className="profile-bio">{profile.bio}</p>
                                )}
                                <div className="profile-meta">
                                    {profile.location && (
                                        <span className="meta-item">
                                            <i className="fas fa-map-marker-alt"></i>
                                            {profile.location}
                                        </span>
                                    )}
                                    {profile.company && (
                                        <span className="meta-item">
                                            <i className="fas fa-building"></i>
                                            {profile.company}
                                        </span>
                                    )}
                                    {profile.blog && (
                                        <span className="meta-item">
                                            <i className="fas fa-link"></i>
                                            <a href={profile.blog} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)' }}>
                                                {profile.blog}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="profile-stats">
                            <div className="p-stat">
                                <span className="p-stat-number">{profile.public_repos}</span>
                                <span className="p-stat-label">Repos</span>
                            </div>
                            <div className="p-stat">
                                <span className="p-stat-number">{profile.followers}</span>
                                <span className="p-stat-label">Followers</span>
                            </div>
                            <div className="p-stat">
                                <span className="p-stat-number">{profile.following}</span>
                                <span className="p-stat-label">Following</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Repositories */}
                {repos.length > 0 && !loading && (
                    <div className="repos-section">
                        <div className="repos-header">
                            <h2>📦 Repositories</h2>
                            <span className="repos-count">{repos.length} shown</span>
                        </div>
                        <div className="repos-grid">
                            {repos.map(repo => (
                                <div key={repo.id} className="repo-card">
                                    <h3 className="repo-name">
                                        <i className="fas fa-book"></i>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                            {repo.name}
                                        </a>
                                    </h3>
                                    {repo.description && (
                                        <p className="repo-description">{repo.description}</p>
                                    )}
                                    <div className="repo-meta">
                                        {repo.language && (
                                            <span className="repo-lang">
                                                <span 
                                                    className="lang-dot" 
                                                    style={{ backgroundColor: getLangColor(repo.language) }}
                                                ></span>
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="repo-stat">
                                            ⭐ {repo.stargazers_count}
                                        </span>
                                        <span className="repo-stat">
                                            🍴 {repo.forks_count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!profile && !loading && !error && (
                    <div className="empty-state">
                        <p style={{ fontSize: '3rem' }}>👨‍💻</p>
                        <p>Search for a GitHub user to get started!</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                            Try: <strong>seesaw07</strong>, <strong>facebook</strong>, <strong>google</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;