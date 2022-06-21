<template>
    <div class="md:w-1/3  lg:w-3/16 pb-20 text-xs cursor-pointer top-0 left-0 fixed h-screen z-2xtop bg-bluegray-800 text-gray-300 overflow-y-auto"  title="Right click on any item for more options">
        <h2 class="bg-purple-600 p-2">File Explorer</h2>
        <ul>
            <TreeItem 
                :key="fileTree.folders.name" 
                v-if="fileTree && fileTree?.folders" 
                :open="true" 
                :root="tree.path"
                :model="fileTree.folders" 
                @openTemplate="loadFile" 
                @reloadTree="reload"/>
        </ul>
    </div>
    <div class="fixed hidden z-modal cursor-pointer shadow-lg pr-10 text-white p-2 bg-bluegray-700 text-sm ctxMenus" id="archiveCtx" @mouseleave="closeCtx('archiveCtx')">
    <ul>
        <li class="py-1 p-1 hover:text-blue-400 flex items-center" @click="option('CreateFolder')"><i class="material-symbols-outlined mr-1">create_new_folder</i>Create folder</li>
        <li class="py-1 p-1 hover:text-blue-400 flex items-center" @click="option('CreateFile')" v-if="props.context!='assets'">
            <i class="material-symbols-outlined mr-1">note_add</i>
            Create file</li>
        <li class="py-1 p-1 hover:text-blue-400 flex items-center" @click="option('UploadFile')">
            <i class="material-symbols-outlined mr-1">upload</i>
            Upload file</li>
        <li class="py-1 p-1 hover:text-blue-400 flex items-center" @click="option('RenameFile')">
             <i class="material-symbols-outlined mr-1">drive_file_rename_outline</i>
             Rename ...</li>
        <li class="py-1 p-1 hover:text-blue-400 flex items-center" @click="option('DeleteItem')">
            <i class="material-symbols-outlined mr-1">delete_forever</i>
            Delete ...</li>
        <li class="py-1 p-1 hover:text-blue-400 flex items-center" @click="reload">
            <i class="material-symbols-outlined mr-1">refresh</i>
            Refresh
        </li>
    </ul>
    </div>
</template>


<script setup lang="ts">
import { ref , computed, watch , inject } from 'vue'
import { readFolder, readRoot , fileTree , openPath } from '/@/composables/UseLocalApi';
import { closeCtx , openContextDialog } from '/@/composables/contextMenu';

const store = inject ( 'useStore' )

const props = defineProps ( {
    context: String
})

const emits = defineEmits ( {
    file:String,
    reloadTree:String
})

let opened = ref ( props.open )

let tree = ref( {} )
let folders = ref ({} )

const loadTree = async ( context ) => {
    store.loading = !store.loading
    if ( context != '/' ) {
        tree.value = await readFolder ( context )
    } else {
        tree.value = await readRoot()
    }
    folders.value = { name: context , children: tree.value.children.filter ( a => a.type === 'directory' ).sort() }
    folders.value.children.push ( ...tree.value.children.filter( a => a.type === 'file' ).sort( (a,b) => a.type-b.type))
    fileTree.folders = folders.value
    store.loading = !store.loading
}

const reload = async () => {
    fileTree.folders = null
    console.log ( 'reload tree ...')
    await loadTree( props.context )
}


if ( props.context ){
    loadTree ( props.context )
}

watch( () => fileTree.reload, (refresh) => {
    refresh ? reload() : null
    fileTree.reload = false
  }
)

const loadFile = async ( file ) => {
    let element = document.getElementById(file.hash)
    let filePath = element?.getAttribute('data-path')
    const res = await openPath ( filePath )
    
    emits ( 'file' , res , filePath , file )
}

const option = async ( option:String ) => {
    store.dialog = option
}
</script>