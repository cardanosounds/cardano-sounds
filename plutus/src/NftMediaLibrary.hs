{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE DeriveAnyClass      #-}
{-# LANGUAGE DeriveGeneric       #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}
{-# LANGUAGE LambdaCase          #-}

module NftMediaLibrary
  ( nftMediaLibrary
  , nftMediaLibraryBs
  , LibraryDatum(..)
  , LibraryRedeemer(..)
  ) where

import           Codec.Serialise
import qualified Prelude              as Haskell
import           Prelude                ( String, show, Show)
import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
-- import           Data.Maybe         (PlutusTx.Prelude.fromMaybe)
import           Cardano.Api.Shelley (PlutusScript (..), PlutusScriptV1) 
import           Data.Void              (Void)
import           Plutus.Contract        as Contract
import qualified PlutusTx
import           PlutusTx.IsData
import           PlutusTx.Maybe
import           PlutusTx.Builtins.Class (stringToBuiltinByteString)
import           PlutusTx.Prelude       hiding (Semigroup(..), unless)
import           Ledger                 hiding (singleton)
import           Ledger.Constraints     as Constraints
import qualified Ledger.Typed.Scripts   as Scripts
import qualified Ledger.Contexts                   as Validation
import           Ledger.Value           as Value
import           Ledger.Ada           (adaSymbol, adaToken, lovelaceValueOf)
import           Prelude                (Semigroup (..))
import           GHC.Generics         (Generic)
import           Data.Aeson           (ToJSON, FromJSON)

data LibraryDatum = LibraryDatum {
      tokensClass     :: AssetClass,
      lovelacePrice        :: Integer
    } 

data LibraryRedeemer = Unlock | Use

{-# INLINABLE libraryValidator #-}
libraryValidator :: LibraryDatum -> LibraryRedeemer -> ScriptContext -> Bool
libraryValidator libraryDatum libraryRedeemer ctx =
  case libraryRedeemer of
    Use ->
      traceIfFalse "Tx doesn't have just one script input" (PlutusTx.Prelude.isJust oneScIn) &&
      traceIfFalse "Tx doesn't have just one output to script" (PlutusTx.Prelude.isJust oneOutToSc) &&
      traceIfFalse "Tx doesn't have just one AssetClass in script input" (PlutusTx.Prelude.isJust scInAsset) &&
      traceIfFalse "Tx doesn't have just one AssetClass in output to script" (PlutusTx.Prelude.isJust scOutAsset) &&
      traceIfFalse "Script input and output AssetClass doesn't match" ((PlutusTx.Prelude.fromMaybe (assetClass adaSymbol adaToken) scInAsset) == (PlutusTx.Prelude.fromMaybe (assetClass adaSymbol adaToken) scOutAsset)) &&
      traceIfFalse "Tx didn't pay correct ADA amount to the script." paidRoyalty

    Unlock ->
      traceIfFalse "Tx doesn't have just one script input" (PlutusTx.Prelude.isJust oneScIn) &&
      traceIfFalse "There should be just one Asset in sc inputs " (PlutusTx.Prelude.isJust scInAsset) &&
      traceIfFalse "Asset shouldn't go back to a script" (PlutusTx.Prelude.isNothing scOutAsset) &&
      traceIfFalse "Lock token isn't burn" tokensBurnt

  where
    scriptAdress :: Address 
    scriptAdress = scriptHashAddress (ownHash ctx)
    {-# INLINABLE isScInput #-}
    isScInput :: TxInInfo -> Bool
    isScInput input = (txOutAddress (txInInfoResolved input)) == scriptAdress

    {-# INLINABLE isOutputToSc #-}
    isOutputToSc :: TxOut -> Bool
    isOutputToSc output = (txOutAddress output) == scriptAdress

    {-# INLINABLE oneLovelaceValueFromInput #-}
    oneLovelaceValueFromInput :: TxInInfo -> Maybe Integer
    oneLovelaceValueFromInput txInInfo = getSingleLovelaceValue (getTxInFlatValue txInInfo)

    {-# INLINABLE oneLovelaceValueFromOutput #-}
    oneLovelaceValueFromOutput :: TxOut -> Maybe Integer
    oneLovelaceValueFromOutput txOut = getSingleLovelaceValue (getTxOutFlatValue txOut)

    {-# INLINABLE oneAssetFromInput #-}
    oneAssetFromInput :: TxInInfo -> Maybe AssetClass
    oneAssetFromInput txInInfo = getSingleAsset (getTxInFlatValue txInInfo)

    {-# INLINABLE oneAssetFromOutput #-}
    oneAssetFromOutput :: TxOut -> Maybe AssetClass
    oneAssetFromOutput txOut = getSingleAsset (getTxOutFlatValue txOut)

    {-# INLINABLE getTxOutFlatValue #-}
    getTxOutFlatValue :: TxOut -> [(CurrencySymbol, TokenName, Integer)]
    getTxOutFlatValue txOut = flattenValue (txOutValue txOut) 

    {-# INLINABLE getTxInFlatValue #-}
    getTxInFlatValue :: TxInInfo -> [(CurrencySymbol, TokenName, Integer)]
    getTxInFlatValue txIn = getTxOutFlatValue (txInInfoResolved txIn) 

    {-# INLINABLE isAsset #-}
    isAsset :: (CurrencySymbol, TokenName, Integer) -> Bool
    isAsset (currency, tknName, _) = currency /= adaSymbol && tknName /= adaToken 

    {-# INLINABLE makeAsset #-}
    makeAsset :: (CurrencySymbol, TokenName, Integer) -> AssetClass
    makeAsset (currency, tknName, _) = assetClass currency tknName

    {-# INLINABLE getSingleAsset #-}
    getSingleAsset :: [(CurrencySymbol, TokenName, Integer)] -> Maybe AssetClass
    getSingleAsset flatList = 
      let
        assetClasses = [ makeAsset x | x <- flatList, isAsset x ]
      in
        if length assetClasses /= 1 then Nothing else Just (head assetClasses) 

    {-# INLINABLE getInteger #-}
    getInteger :: (CurrencySymbol, TokenName, Integer) -> Integer
    getInteger (_, _, integer) = integer

    {-# INLINABLE getSingleLovelaceValue #-}
    getSingleLovelaceValue :: [(CurrencySymbol, TokenName, Integer)] -> Maybe Integer
    getSingleLovelaceValue flatList = 
      let
        allCounts = [getInteger x | x <- flatList, not (isAsset x)]
      in
        if length allCounts /= 1 then Nothing else Just (head allCounts)

    {-# INLINABLE txOutListSingleDatumHash #-}
    txOutListSingleDatumHash :: [TxOut] -> Maybe DatumHash
    txOutListSingleDatumHash txOutList = 
      let 
        allDatums = [txOutDatumHash x | x <- txOutList, PlutusTx.Prelude.isJust (txOutDatumHash x)]
      in
        if length allDatums /= 1 then Nothing else head allDatums
      
    {-# INLINABLE txInListSingleDatumHash #-}
    txInListSingleDatumHash :: [TxInInfo] -> Maybe DatumHash
    txInListSingleDatumHash txInInfoList = txOutListSingleDatumHash (map txInInfoResolved txInInfoList)
    
    txInfo = scriptContextTxInfo ctx
    
    scInputs :: [TxInInfo]
    scInputs = filter isScInput (txInfoInputs txInfo)

    outputsToSc :: [TxOut]
    outputsToSc = filter isOutputToSc (txInfoOutputs txInfo)

    oneScIn :: Maybe TxInInfo
    oneScIn = if length scInputs /= 1 then Nothing else Just (head scInputs)

    -- oneOutToSc :: Either Integer TxOut
    -- oneOutToSc = if length outputsToSc /= 1 then Left length outputsToSc else Right (head outputsToSc)
    oneOutToSc :: Maybe TxOut
    oneOutToSc = if length outputsToSc /= 1 then Nothing else Just (head outputsToSc)

    defaultTxOut :: TxOut
    defaultTxOut = head (txInfoOutputs txInfo)
    -- defaultTxOut :: TxOut
    -- defaultTxOut = TxOut 
    --     { 
    --       txOutAddress =        Ledger.scriptAddress validator
    --     , txOutValue =          lovelaceValueOf 1000000
    --     , txOutDatumHash =      Nothing
    --     } 

    defaultTxIn :: TxInInfo
    defaultTxIn = head (txInfoInputs txInfo)

    scOutAsset :: Maybe AssetClass
    scOutAsset = if PlutusTx.Prelude.isJust oneOutToSc then oneAssetFromOutput (PlutusTx.Prelude.fromMaybe defaultTxOut oneOutToSc) else Nothing

    scInAsset :: Maybe AssetClass
    scInAsset = if PlutusTx.Prelude.isJust oneScIn then oneAssetFromInput (PlutusTx.Prelude.fromMaybe defaultTxIn oneScIn) else Nothing

    inDatumHash :: Maybe DatumHash
    inDatumHash = txInListSingleDatumHash (txInfoInputs txInfo)

    forgedTokens = assetClassValueOf (txInfoMint txInfo) (tokensClass libraryDatum)
    tokensBurnt = (forgedTokens == negate 1)  && forgedTokens /= 0

    oneLovelaceValFromSc = if PlutusTx.Prelude.isJust oneScIn then oneLovelaceValueFromInput (PlutusTx.Prelude.fromMaybe defaultTxIn oneScIn) else Nothing
    oneLovelaceValToSc = if PlutusTx.Prelude.isJust oneOutToSc then oneLovelaceValueFromOutput (PlutusTx.Prelude.fromMaybe defaultTxOut oneOutToSc) else Nothing

    paidRoyalty = 
      if 
        PlutusTx.Prelude.isJust oneLovelaceValFromSc && PlutusTx.Prelude.isJust oneLovelaceValToSc 
      then PlutusTx.Prelude.fromMaybe 0 oneLovelaceValToSc == ((PlutusTx.Prelude.fromMaybe 1 oneLovelaceValFromSc) + (lovelacePrice libraryDatum))
      else False


data NftMediaLibrary
instance Scripts.ValidatorTypes NftMediaLibrary where
    type instance RedeemerType NftMediaLibrary = LibraryRedeemer
    type instance DatumType NftMediaLibrary = LibraryDatum

typedValidator :: Scripts.TypedValidator NftMediaLibrary
typedValidator = Scripts.mkTypedValidator @NftMediaLibrary
    $$(PlutusTx.compile [||  libraryValidator ||])
    $$(PlutusTx.compile [|| wrap ||]) 
  where 
    wrap = Scripts.wrapValidator @LibraryDatum @LibraryRedeemer

validator :: Validator
validator = Scripts.validatorScript typedValidator

PlutusTx.makeIsDataIndexed ''LibraryDatum [('LibraryDatum, 0)]
PlutusTx.makeIsDataIndexed ''LibraryRedeemer [ ('Unlock,       0)
                                         , ('Use,    1)
                                        ]
script :: Script
script = Ledger.unValidatorScript validator

nftMediaLibraryBs :: SBS.ShortByteString
nftMediaLibraryBs = SBS.toShort . LBS.toStrict $ serialise script

nftMediaLibrary :: PlutusScript PlutusScriptV1
nftMediaLibrary = PlutusScriptSerialised nftMediaLibraryBs
