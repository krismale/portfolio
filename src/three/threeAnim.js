export let animQueue = {}

export const addAnim = (key, animFunc) => {
    animQueue = Object.assign({}, animQueue, {[key]: animFunc});
}

export const popAnim = (key) => {
    delete animQueue[key];
}