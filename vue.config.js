module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "ir.teapo.tpo",
                protocols: {
                    name: "teapo-protocol",
                    schemes: [
                        "teapo"
                    ]
                },
                mac: {
                    category: "public.app-category.education"
                },
                icon:"./icon.icns",
                extraResources: ['./db.sqlite3'],
            }
        }
    }
}