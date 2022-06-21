<template>

    <!-- File Explorer -->
    <TreeContainer context="/" @file="loadFile"/>
    
    <!-- Text editor (textarea) -->
    <FileEditor :key="randomID" :content="store.currentFile.file" v-if="store.currentFile.model?.path && store.currentFile?.file"/>
    
    <!-- Status Bar -->
    <div class="z-modal text-xs fixed bottom-0 left-0 w-full bg-black text-gray-500 p-2 h-12 flex items-center justify-start">
        <div class="pr-20">{{ store.currentFile.model?.path || store.rootPath }} [{{ store.currentFile.model?.size}}]</div>
        {{ store.currentFile.lastOpened }}
        <div v-if="store.message.data" class="absolute right-0 mr-10 p-2 bg-purple-600 text-white" id="message">{{ store.message.data }}</div>
    </div>
    
    <!-- Modal -->
    <Modal v-if="store.dialog"/>

    <!-- Loading -->
    <Loading v-if="store.loading"/>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { randomID } from '/@/composables/UseLocalApi'

const store = inject ( 'useStore') 

const loadFile = async ( file:Object , filePath:String, model:Object ) => {
    store.currentFile.file = file 
    store.currentFile.path = filePath
    store.currentFile.model = model
    store.editor = file
    store.currentFile.lastOpened = model.path.replace ( model.name , '' )
}

</script>