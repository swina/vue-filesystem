// ./src/composables/UseLocalApi.ts
import { reactive } from 'vue'
const endpoint = 'http://localhost:9000'
import { store } from './useUtils'

export const fileTree = reactive({
    folders:Object,
    reload:false
})

export async function readFolder ( path:string ){
    const res = await fetch ( endpoint + `/tree/${path}` )
    return await res.json()
}

export async function readRoot (){
    const res = await fetch ( endpoint + `/root` )
    return await res.json()
}

// Create a random ID
export function randomID(){
    return 'app-' + Math.random().toString(36).substr(2, 5)
}

export async function openPath ( filePath:string ) {
    const res = await fetch ( endpoint + '/file?path=' + filePath )
    try {
        console.log ( await res )
        return await res.json()
    } catch ( err ) {
        const body = await res.text()
        return body    
    }
} 

export const moveFile = async ( source:String , target: String , filename:String , fs:Object ) => {
    const mv = await fetch ( endpoint + '/move?source=' + source + '&target=' + target + '&filename=' + filename )
    return await mv.json() ?? mv 
}

export const saveFile = async ( json:Object ) => {
    let data = { data: json , path: json.path }
    const res = await fetch ( endpoint + '/file/save' ,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    return await res.json() ?? res
}

export const deleteItem = async ( path:String ) => {
    //if ( store.currentFile.model.type === 'file' ){
        const res = await fetch ( endpoint + '/delete?path=' + path )
        store.message.data = await res?.message || ''
        store.dialog = null
        store.editor = ''
        fileTree.reload = true
    //} else {
    //    store.message.data = 'Folders cannot be deleted'
    //}
}
