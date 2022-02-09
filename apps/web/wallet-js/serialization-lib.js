class Cardano {
    async load() {
      if (this._wasm) return;
  
      try {
        this._wasm = this._wasm = await import(
            "../custom_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib"
        );
      } catch (error) {
        throw error;
      }
    }
  
    get Instance() {
      return this._wasm;
    }
  }
  
export default new Cardano();