#!/bin/bash
set -e

NODE_VERSION="v20.10.0"
NODE_DIST="node-$NODE_VERSION-linux-x64"
URL="https://nodejs.org/dist/$NODE_VERSION/$NODE_DIST.tar.xz"

mkdir -p tools
cd tools

if [ ! -d "node" ]; then
    echo "Downloading Node.js $NODE_VERSION..."
    curl -O "$URL"
    echo "Extracting..."
    tar -xf "$NODE_DIST.tar.xz"
    mv "$NODE_DIST" node
    rm "$NODE_DIST.tar.xz"
    echo "Node.js installed to $(pwd)/node"
else
    echo "Node.js already installed."
fi

export PATH="$(pwd)/node/bin:$PATH"
node --version
npm --version
