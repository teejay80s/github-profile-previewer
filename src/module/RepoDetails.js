import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../index.css";

function RepoDetails() {
  const { username, reponame } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      const res = await axios.get(
        `https://api.github.com/repos/${username}/${reponame}`
      );
      setRepo(res.data);
    };
    fetchRepo();
  }, [username, reponame]);

  if (!repo) return <p className="loading-text">Loading...</p>;

  return (
    <div className="container">
      <h1 className="title">{repo.full_name}</h1>
      <p>{repo.description}</p>
      <p className="stars">⭐ Stars: {repo.stargazers_count}</p>
      <p>🍴 Forks: {repo.forks_count}</p>
      <p>Language: {repo.language}</p>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        View on GitHub
      </a>
    </div>
  );
}

export default RepoDetails;
