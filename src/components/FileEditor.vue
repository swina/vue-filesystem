<template>
    <div class="md:ml-1/4 -ml-30 pt-4">
        
        <div class="text-xs p-2 bg-gray-300 mr-4">Path: {{ store.currentFile?.model.path }} Size: {{ store.currentFile?.model.size }}</div>
        <div v-if="store.currentFile?.model.path" class="mr-4">
            <textarea v-if="!isImage" v-model="store.editor" class="w-full text-sm font-mono p-1 h-screen-sm"/>
            <img class="previewImage" :src="previewFile()" v-if="isImage"/>
        </div>
        <button class="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-800" @click="saveEditor">Save</button>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { saveFile } from '/@/composables/UseLocalApi'


const store = inject ( 'useStore' )

const isImage = computed(()=> {
    return store.currentFile.model?.extension === 'jpg' ? true : 
        store.currentFile.model?.extension === 'png' ? true : 
        store.currentFile.model?.extension === 'gif' ? true : 
        store.currentFile.model?.extension === 'webp' ? true : false
})



const previewFile = async ()=>{
    const reader = new FileReader();
    const blob = await new Blob([store.editor], {type: 'image/png'});
    console.log ( URL.createObjectURL(blob) )
    return await URL.createObjectURL(blob)
    
}

const saveEditor = async ()=>{
    store.loading =! store.loading
    const res = await saveFile({ data:store.editor,path:store.currentFile.path})
    store.message.data = res.message
    store.loading =! store.loading
}
</script>