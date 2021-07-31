from app.sounds import Sounds
from app.upload import Upload
from app.websites import Websites
from app.arweavedeploy import ArweaveDeploy
from app.db.query import Query

from app.models.transaction import Transaction
from app.models.tokenvalue import TokenValue

def add():
    return 3+6


def start_sound_generation(tx: Transaction):
    sounds = Sounds()
    metadata = sounds.get_random_track(tx)
    upload = Upload()
    metadata.ipfs_id_sound = upload.upload_to_ipfs(tx.Tx_Hash)
    metadata.arweave_id_sound = upload.upload_to_arweave(tx.Tx_Hash)
    websites = Websites()
    metadata = websites.create_nft_website(metadata)
    deploy = ArweaveDeploy()
    #print(
    deploy.deploy_website(tx.Tx_Hash)
    #)
    query = Query()
    tx.metadata = metadata
    query.update_transaction(tx)