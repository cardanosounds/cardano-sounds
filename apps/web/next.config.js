const withPWA = require('next-pwa')
const runtimeCaching = require("next-pwa/cache")
 
module.exports = withPWA({
    webpack: (config) => {
        config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    
        // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
        config.experiments = { topLevelAwait: true, asyncWebAssembly: true, layers: true }
    
        return config
    },
    env: {
    },
    pwa: {
        dest: "public",
		register: true,
		skipWaiting: true,
		runtimeCaching,
		buildExcludes: [/middleware-manifest.json$/]
    }
})