# vhx-js
VHX Javascript SDK - Read-only API calls, in your browser!

![alt tag](https://dl.dropboxusercontent.com/u/7390609/stockdev.jpg)

## Install
- clone the repo and run `npm install`. easy peasy.

## Build
Anytime you make changes to the lib files, just run `gulp` in the root of the folder. This will build concatenated and uglified dist files. I'll later add livereload functionality.

## Work
Currently only works with a site specific API key. Token-based auth (for Crystal) coming soon.

## Use
- Create your API key
- Create a new vhx instance like so `var vhxjs = new vhx('YOUR_API_KEY')`
- Follow the Node docs as shown on http://dev.vhx.tv/docs/api/


