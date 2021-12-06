const withPWA = require('next-pwa')
 
module.exports = withPWA({
    webpack: (config) => {
        config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    
        // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
        config.experiments = { asyncWebAssembly: true, layers: true }
    
        return config
    },
    pwa: {
        dest: 'public'
    }
})