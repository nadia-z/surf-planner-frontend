module.exports = {
  jest: (config) => {
    config.transformIgnorePatterns = [
      "node_modules/(?!(axios|react-dnd|react-dnd-html5-backend|dnd-core|@react-dnd)/)",
    ];
    return config;
  },
};
