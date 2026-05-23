/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path");

module.exports = {
	"context": __dirname,
	entry: {
		"Main": "./app/Main",
	},
	output: {
		path: __dirname,
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		sourceMapFilename : "[file].map",
	},
	resolve: {
		modules : [
			"node_modules",
			__dirname,
			path.resolve(__dirname, "style"),
			path.resolve(__dirname, "third_party/Tone.js"),
			path.resolve(__dirname, "app"),
			path.resolve(__dirname, "third_party")
		],
	},
	 module: {
		rules: [
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(png|gif)$/,
				type: "asset/inline"
			}
		]
	},
};
