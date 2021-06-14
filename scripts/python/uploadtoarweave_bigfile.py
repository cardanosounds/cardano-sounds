from arweave.arweave_lib import Wallet, Transaction
from arweave.transaction_uploader import get_uploader

wallet = Wallet(jwk_file)

with open("my_mahoosive_file.dat", "rb", buffering=0) as file_handler:
    tx = Transaction(wallet, file_handler=file_handler, file_path="/some/path/my_mahoosive_file.dat")
    tx.add_tag('Content-Type', 'application/dat')
    tx.sign()
    
    uploader = get_uploader(tx, file_handler)

    while not uploader.is_complete:
        uploader.upload_chunk()

        logger.info("{}% complete, {}/{}".format(
            uploader.pct_complete, uploader.uploaded_chunks, uploader.total_chunks
        ))
