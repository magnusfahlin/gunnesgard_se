async function jestPromiseWrapper(callback) {
    return new Promise(async (resolve, reject) => {
        try {
            await callback();
            resolve()
        } catch (e) {
            reject(e)
        }
    });
}

module.exports = { jestPromiseWrapper };