import { createTypedHooks } from 'easy-peasy';
import { Action, action } from 'easy-peasy';
import { createStore } from 'easy-peasy';

interface WalletStore {connected: boolean, name: string}

interface StoreModel {
    wallet: WalletStore
    setWallet: Action<StoreModel, WalletStore>

}

const model: StoreModel = {
  wallet : {connected: false, name: ''},
  setWallet: action((state, newWallet) => { state.wallet = newWallet }),
}

const store = createStore(model)
export default store


const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<StoreModel>()

export {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
}