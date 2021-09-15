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
              "@success-color": "#59A6F6",
              "body-background": "#F7F8FC",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
