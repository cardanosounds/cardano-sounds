from db.query import Query
from models.metadata import Metadata
from models.soundprobability import SoundProbability

q = Query()
q.insert_metadata(Metadata("fakeTransactionHash12345678999999999", "CSDEVNFT0", 0.000, 1, [SoundProbability(0.00, "sound1", "category"), SoundProbability(0.00, "sound2", "category"), SoundProbability(0.00, "sound3", "category"), SoundProbability(0.00, "sound4", "category"), SoundProbability(0.00, "sound5", "category")], "https://arweave.net/DalMTib7K9MtBR5GFrdznX-SUR8zh96XNRqp7slEmko", "ipfshash", "https://arweave.net/FUyYV2yr6HSCXHcX7kcrwYVnNJeu_F3BDHLzSGEXX2g" ))