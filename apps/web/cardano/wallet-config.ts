const safelySetApi = (api: any) => {
    return typeof window === 'undefined' ? {} : api
}
export const walletConfig = {
    'nami': safelySetApi((window as any).cardano.nami),
    'eternl': safelySetApi((window as any).cardano.eternl),
    'flint': safelySetApi((window as any).cardano.flint),
    'yoroi': safelySetApi((window as any).cardano.yoroi),
    'cardwallet': safelySetApi((window as any).cardano.cardwallet),
    'gerowallet': safelySetApi((window as any).cardano.gerowallet)
}