from dataclasses import dataclass
from datetime import datetime
from typing import List
from app.models.metadata import Metadata
from app.models.tokenvalue import TokenValue
import json


@dataclass
class Transaction:
    id: str
    tx_hash: str
    output_index: int
    amount: List[TokenValue]
    sender_address: str
    status: str
    created: str
    nft_count: int
    metadata: List[Metadata] = []

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)