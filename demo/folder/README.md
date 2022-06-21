# VUE FILESYSTEM 1.0

VUE FileSystem is a simple demo app to access to the local filesystem inside the app container.

**This app doesn't access to your local filesystem but only to the app container mounted volume**

Thus means that if your container has /app as mounted volume, you can access only to /app volume and not outside the container. This is developed by design in order to avoid any risk to access to your local file system and volumes.

## Root Folder

You can assign the root folder (ROOT_PATH) of your app to any folder of your mounted volumes.

To easily create a root folder (that you can update whenever you need) create an .env file with the following variable (the path must be an existing path and must be related to the container mounted volume):

```
VITE_APP_ROOT_PATH=/app/demo/
```