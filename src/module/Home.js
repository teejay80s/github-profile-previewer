import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";
import Header from "../component/Header";

const GITHUB_API = "https://api.github.com/users/";

function Home() {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [searchHistory, setSearchHistory] = useState([]);
  const [sortBy, setSortBy] = useState("stars");
  const navigate = useNavigate();

  useEffect(() => {
    const cachedTheme = localStorage.getItem("theme");
    const history = JSON.parse(localStorage.getItem("history")) || [];
    if (cachedTheme) setTheme(cachedTheme);
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const sortRepos = (repos) => {
    switch (sortBy) {
      case "stars":
        return [...repos].sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        );
      case "name":
        return [...repos].sort((a, b) => a.name.localeCompare(b.name));
      case "recent":
        return [...repos].sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
      default:
        return repos;
    }
  };

  const handleSearch = async () => {
    if (!username) return;
    setLoading(true);
    setError("");
    const cache = JSON.parse(localStorage.getItem(username));

    if (cache) {
      setUserInfo(cache.userInfo);
      setRepos(sortRepos(cache.repos));
      setLoading(false);
      return;
    }

    try {
      const userRes = await axios.get(`${GITHUB_API}${username}`);
      const repoRes = await axios.get(`${GITHUB_API}${username}/repos`);
      const topRepos = sortRepos(repoRes.data).slice(0, 10);

      setUserInfo(userRes.data);
      setRepos(topRepos);
      localStorage.setItem(
        username,
        JSON.stringify({ userInfo: userRes.data, repos: topRepos })
      );
      const updatedHistory = [
        username,
        ...searchHistory.filter((u) => u !== username),
      ].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    } catch (err) {
      setError("User not found");
      setUserInfo(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header toggleTheme={toggleTheme} theme={theme} />

      <div className="search-box">
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
        />
        <button className="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {searchHistory.length > 0 && (
        <div className="recent-searches">
          <p>Recent searches:</p>
          <div className="history-buttons">
            {searchHistory.map((user) => (
              <button
                key={user}
                className="history-button"
                onClick={() => {
                  setUsername(user);
                  handleSearch();
                }}
              >
                {user}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sort-box">
        <label className="sort-label">Sort by:</label>
        <select
          className="input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="stars">Stars</option>
          <option value="name">Name</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {userInfo && (
        <div className="card">
          <div className="card-content">
            <img src={userInfo.avatar_url} alt="avatar" className="avatar" />
            <div>
              <h2 className="name">{userInfo.name}</h2>
              <p>@{userInfo.login}</p>
              <p>{userInfo.location}</p>
              <p>{userInfo.bio}</p>
              <p>Followers: {userInfo.followers}</p>
              <a
                href={userInfo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                View GitHub Profile
              </a>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repo-grid">
          {repos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => navigate(`/repo/${userInfo.login}/${repo.name}`)}
              className="repo-card"
            >
              <div className="repo-card-content">
                <h3 className="repo-name">{repo.name}</h3>
                <p>{repo.description}</p>
                <p>
                  ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
                </p>
                <p>Language: {repo.language}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
