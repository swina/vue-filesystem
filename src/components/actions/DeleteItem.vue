<template>
    <div class="p-4 flex text-sm items-center">
        {{ store.currentFile.model?.path}}
        <button class="btn mx-4 bg-purple-500 text-white rounded" @click="deleteItem(store.currentFile.model.path)">Delete</button>
    </div>
</template>

<script setup lang="ts">
import { inject , ref } from 'vue'
import { deleteItem } from '/@/composables/UseLocalApi'

const store = inject('useStore')

let folderToCreate = ref('')

store.dialogTitle = 'Delete'

</script>