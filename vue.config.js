module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                icon:"./icon.icns",
                extraResources: ['./db.sqlite3'],
                win: {
                    appId: "com.isto.gpo",
                    icon: "./icon.icns",
                    publisherName: "Mehdi Yazdani",
                }
            }
        }
    }
}