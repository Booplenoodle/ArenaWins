import requests
import json
import time
import os

API_KEY = "RGAPI-b2321434-bd34-4b96-a8ce-6b6954387144"
PUUID = "dNRyOSnVBR-vlyWFNk6FuTCj8XLUTrwRMa43pNb3cAYHQxi9_TytBRc7iD78DxVfv-6h54BbCx_h5g"
REGION = "americas"  # for match-v5
CHAMPIONS_FILE = "champions.json"
WINS_FILE = "arenaWins.json"

# Load champion key -> id mapping
with open(CHAMPIONS_FILE, "r", encoding="utf-8") as f:
    champions_data = json.load(f)
champion_key_to_id = {champ["key"]: champ["id"] for champ in champions_data}

# Load previous wins (if any)
if os.path.exists(WINS_FILE):
    with open(WINS_FILE, "r", encoding="utf-8") as f:
        previous_wins = set(json.load(f))
else:
    previous_wins = set()

print(f"Loaded {len(previous_wins)} previous wins.")

start = 0
batch_size = 20
new_wins = set()

while True:
    url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/{PUUID}/ids?start={start}&count={batch_size}&api_key={API_KEY}"
    match_ids = requests.get(url).json()

    if not match_ids:
        break

    print(f"Processing matches {start} to {start+batch_size}")

    for match_id in match_ids:
        match_url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={API_KEY}"
        match_data = requests.get(match_url).json()

        if match_data.get("info", {}).get("gameMode") != "CHERRY":
            continue

        participants = match_data["info"]["participants"]
        for p in participants:
            if p["puuid"] == PUUID and p["placement"] == 1:
                champ_key = str(p["championId"])
                champ_id = champion_key_to_id.get(champ_key)
                if champ_id:
                    new_wins.add(champ_id)

    start += batch_size
    time.sleep(1.2)  # Avoid rate limit

# Combine old and new wins
all_wins = sorted(previous_wins.union(new_wins))

# Save to JSON
with open(WINS_FILE, "w", encoding="utf-8") as f:
    json.dump(all_wins, f, indent=2)

print(f"Total champions with 1st place: {len(all_wins)}")
