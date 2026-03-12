export default ({ config }) => {
  return {
    ...config,
    plugins: [...(config.plugins || []), "expo-video"],
  };
};
