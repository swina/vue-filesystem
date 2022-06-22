# Vue Filesystem

VUE FileSystem is a simple demo app to access to the local filesystem inside the app container.

Access to local filesystem from a frontend app is not possible (and that's good from a security point of view), but if you need to interact with **local files** like json, html, etc. of your app you can easily setup a **local environment** to access them (read, write, delete, update, etc).

## To be safe use Docker

For security reasons **use your app in a docker container** in order to isolate your app to your local environment

**This app doesn't access to your local filesystem but only to the app container mounted volume**
Thus means that if your container has /app as mounted volume, you can access only to /app volume and not outside the container. This is developed by design in order to avoid any risk to access to your local file system and volumes.


**Do not use this solution for public apps**

**node_modules** and **.git** folders are not scanned by default. Check ./src/composables/UseLocalApi.ts to change this options but you can get timeout errors due to the folders size.

## Features

- File Explorer like GUI
- Create, Rename, Upload, Delete folders and files
- Basic text editor for files with save option
- Images and SVG preview

## Installation

#### Root Folder

You can assign the root folder (ROOT_PATH) of your app to any folder of your mounted volumes.

To easily create a root folder (that you can update whenever you need) create an .env file with the following variable (the path must be an existing path and must be related to the container mounted volume):

```
VITE_APP_ROOT_PATH=/app/demo/
```

From the root of your project run :

```
docker-compose run --name vue-filesystem -p 3000:3000 -p 9000:9000 -p 24678:24678 --rm app bash
npm install
```

## Start 

From the console inside the container
```
npm run all
```

Go to <http://localhost:3000/> to checkout.

