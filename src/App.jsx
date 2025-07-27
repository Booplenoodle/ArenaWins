import React, { useState, useEffect } from "react";
import "./App.css";

const DATA_DRAGON_VERSION = "15.14.1";

const initialWins = [
  "Amumu",
  "Ashe",
  "Bard",
  "Brand",
  "Caitlyn",
  "Ezreal",
  "Hecarim",
  "Jhin",
  "Kaisa",
  "Kassadin",
  "Kayle",
  "Leona",
  "Shaco",
  "Shen",
  "Sivir",
  "Smolder",
  "Syndra",
  "Teemo",
  "TwistedFate",
  "Twitch",
  "Ahri",
  "Akshan",
  "Ambessa",
  "AurelionSol",
  "Briar",
  "Corki",
  "Darius",
  "Evelynn",
  "Garen",
  "Heimerdinger",
  "Jax",
  "Jinx",
  "Karthus",
  "Katarina",
  "Kayn"
];

const App = () => {
  const [champions, setChampions] = useState([]);
  const [arenaWins, setArenaWins] = useState(initialWins);

  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/data/en_US/champion.json`)
      .then((res) => res.json())
      .then((data) => {
        const champArray = Object.values(data.data).map((champ) => ({
          id: champ.id,
          name: champ.name,
          image: champ.image,
        }));
        setChampions(champArray);
      })
      .catch((err) => console.error("Failed to fetch champions:", err));
  }, []);

  const toggleWin = (champId) => {
    setArenaWins((prevWins) => {
      if (prevWins.some((win) => win.toLowerCase() === champId.toLowerCase())) {
        // Remove win
        return prevWins.filter((win) => win.toLowerCase() !== champId.toLowerCase());
      } else {
        // Add win
        return [...prevWins, champId];
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hello Arena Tracker</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {champions.map((champion) => {
          const hasWin = arenaWins.some(
            (winId) => winId.toLowerCase() === champion.id.toLowerCase()
          );
          return (
            <div
              key={champion.id}
              className="champion-tile"
              style={{ cursor: "pointer" }}
              onClick={() => toggleWin(champion.id)}
              title={hasWin ? "Remove win" : "Add win"}
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/champion/${champion.image.full}`}
                alt={champion.name}
                className={hasWin ? "normal-image" : "grayed-out"}
              />
              <p>{champion.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
