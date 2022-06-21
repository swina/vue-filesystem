# Vue Filesystem


Access to local filesystem from a frontend app is not possible (and that's good from a security point of view), but if you need to interact with **local files** like json, html, etc. of your app you can easily setup a **local environment** to access them (read, write, delete, update, etc).

**Do not use this solution for public apps**

### Requirements
- a Vue3 app (Typescript)
- basic knowledge of nodejs/express
- docker


## To be safe use Docker
For security reasons **use your app in a docker container** in order to: 
- isolate your app to your local environment
- access to filesystem only inside your app and relative mounted volumes

In this way folders and files outside your app volumes are not accessible.