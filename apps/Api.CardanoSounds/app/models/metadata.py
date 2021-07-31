from dataclasses import dataclass
from typing import List
from app.models.soundprobability import SoundProbability
import json

@dataclass
class Metadata:
    id: str
    token_name: str
    probability: float
    rarity: str
    sounds: List[SoundProbability]
    arweave_id_sound: str = ""
    ipfs_id_sound: str = ""
    arweave_website_uri: str = ""
    player: str = ""
    image: str = ""

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)
    