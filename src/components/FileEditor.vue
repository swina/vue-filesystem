<template>
    <div class="md:ml-1/4 -ml-30 pt-4">
        
        <div class="text-xs p-2 bg-gray-300 mr-4">Path: {{ store.currentFile?.model.path }} Size: {{ store.currentFile?.model.size }}</div>
        <div v-if="store.currentFile?.model.path" class="mr-4">
            <textarea v-model="store.editor" class="w-full text-sm font-mono p-1 h-screen-sm"/>
        </div>
        <button class="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-800" @click="saveEditor">Save</button>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, useAttrs } from 'vue'
import { saveFile } from '/@/composables/UseLocalApi'


const store = inject ( 'useStore' )

// const props = defineProps({
//     content:String
// })
// const attrs = useAttrs()
// let editor = ref(attrs.content)

const saveEditor = async ()=>{
    store.loading =! store.loading
    const res = await saveFile({ data:store.editor,path:store.currentFile.path})
    store.message.data = res.message
    store.loading =! store.loading
}
</script>