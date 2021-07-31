from dataclasses import dataclass
from datetime import datetime
from typing import List
from app.models.metadata import Metadata
from app.models.tokenvalue import TokenValue
import json


@dataclass
class Transaction:
    id: str
    Tx_Hash: str
    Output_Index: int
    Amount: List[TokenValue]
    SenderAddress: str
    status: str
    Created: datetime
    metadata: Metadata = None 

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)