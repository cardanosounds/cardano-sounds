import           Prelude
import           System.Environment

import           Cardano.Api
import           Cardano.Api.Shelley

import qualified Cardano.Ledger.Alonzo.Data as Alonzo
import qualified Plutus.V1.Ledger.Api as Plutus
import           Ledger                 hiding (singleton)
import           Ledger.Ada           (adaSymbol, adaToken, lovelaceValueOf)
import           Plutus.V1.Ledger.Value (assetClass)
import           Data.Aeson (encode)
import qualified Data.ByteString.Short as SBS

import           NftMediaLibrary (nftMediaLibraryBs, nftMediaLibrary, LibraryDatum(..), LibraryRedeemer(..))

main :: IO ()
main = do
  args <- getArgs
  let nargs = length args
  let scriptnum = if nargs > 0 then read (args!!0) else 0
  let scriptname = if nargs > 1 then args!!1 else  "result.plutus"
  putStrLn $ "Writing output to: " ++ scriptname
  if scriptnum == 0
    then writePlutusScript scriptnum scriptname nftMediaLibrary nftMediaLibraryBs 
    else return ()



libraryDatum :: LibraryDatum
libraryDatum = LibraryDatum {
      tokensClass          = assetClass adaSymbol adaToken,
      lovelacePrice        = 10000000
    } 
libraryRedeemer :: LibraryRedeemer
libraryRedeemer = Use

writePlutusScript :: Integer -> FilePath -> PlutusScript PlutusScriptV1 -> SBS.ShortByteString -> IO ()
writePlutusScript scriptnum filename scriptSerial scriptSBS =
  do
  print $ "Datum value: " <> encode (scriptDataToJson ScriptDataJsonDetailedSchema $ fromPlutusData (Plutus.toData libraryDatum))
  print $ "Redeemer value: " <> encode (scriptDataToJson ScriptDataJsonDetailedSchema $ fromPlutusData (Plutus.toData libraryRedeemer))
  case Plutus.defaultCostModelParams of
        Just m ->
          let Alonzo.Data pData = toAlonzoData (ScriptDataNumber scriptnum)
             
              (logout, e) = Plutus.evaluateScriptCounting Plutus.Verbose m scriptSBS [pData]
          in do print ("Log output" :: String) >> print logout
                case e of
                  Left evalErr -> print ("Eval Error" :: String) >> print evalErr
                  Right exbudget -> print ("Ex Budget" :: String) >> print exbudget
        Nothing -> error "defaultCostModelParams failed"
  result <- writeFileTextEnvelope filename Nothing scriptSerial
  case result of
    Left err -> print $ displayError err
    Right () -> return ()
