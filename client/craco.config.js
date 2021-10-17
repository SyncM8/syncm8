const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#F6A959",
              "@body-background": "#F7F8FC",
              "@header-background": "#F0F2F5",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
