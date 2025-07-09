// jest.global-setup.js
module.exports = async () => {
    // Global setup if needed
};

module.exports.teardown = async () => {
    // Global teardown
    if (global.gc) {
        global.gc();
    }
};