module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: "ir.teapo.tpo",
                productName: "TEAPO",
                copyright: "Copyright © 2020 Mehdi Yazdani",
                publish: [{
                    "provider": "generic",
                    "url": "https://download.teapo.ir/",
                }],
                protocols: {
                    name: "teapo-protocol",
                    schemes: [
                        "teapo"
                    ]
                },
                mac: {
                    category: "public.app-category.education"
                },
            },
            externals: ['knex','sqlite3'],
        }
    },

    transpileDependencies: [
      'vuetify'
    ]
}
