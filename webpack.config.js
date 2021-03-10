const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "public/wasm",
                    to: "./public/wasm"
                },
                {
                    from: "public/index.html",
                    to: "."
                },
                {
                    from: "public/compatibility.js",
                    to: "."
                }
            ]
        })
    ],

    output: {
        publicPath: '/',
    },

    mode: "development",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ],
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 5000,
        historyApiFallback: {
            rewrites: [
                { from: '/*', to: 'index.html'}
            ]
        }
    },

    resolve: {
        extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"]
    }
}