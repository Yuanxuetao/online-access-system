const path = require("path");

module.exports = {
    "mode" : "development" ,
    "entry" : "./www/app/main.js",
    "output" : {
        "path" : path.resolve(__dirname , "./www/dist"),
        "filename" : "bundle.js"
    },
	"watch" : true,
    "module" : {
        "rules" : [
            {
                "test" : /\.js$/,
                "loader" : "babel-loader",
                "include": [
                    path.resolve(__dirname, "./www/app")
                ],
                "exclude": [
                    path.resolve(__dirname, "node_modules")
                ],
                "options": {
                    presets: ["env" , "react"],
                    plugins: [
                        [
                            "import", {
                                "libraryName": "antd",
                                "libraryDirectory": "lib", 
                                "camel2DashComponentName": true  
                            }
                        ] 
                        , 
                        "transform-object-rest-spread",
                        "transform-runtime"
                    ]
                }
            },
            {
                test: /\.less$/,
                "include": [
                    path.resolve(__dirname, "./www/app")
                ],
                "exclude": [
                    path.resolve(__dirname, "node_modules")
                ],
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, 
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, 
                    {
                        loader: "less-loader" // compiles Less to CSS
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    'css-loader'
                ]
            }
        ]
    }
}