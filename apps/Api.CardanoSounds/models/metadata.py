from dataclasses import dataclass
from typing import List
from models.soundprobability import SoundProbability

@dataclass
class Metadata:
    tx_hash: str
    token_name: str
    probabilty: float
    rarity: int
    sounds: List[SoundProbability]
    arweave_id_sound: str = ""
    ipfs_id_sound: str = ""
    arweave_website_uri: str = ""
    