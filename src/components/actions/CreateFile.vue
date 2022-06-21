<template>
    <div class="p-4 flex text-sm items-center">
        {{ store.currentFile.model?.type != 'file' ? store.currentFile.model?.path + '/' : store.currentFile.model.path.replace(store.currentFile.model.name , '')}}
        <input class="ml-2" type="text" v-model="fileToCreate" placeholder="file name"/>
        <button v-if="fileToCreate" class="btn mx-4 bg-purple-500 text-white rounded">Create</button>
    </div>
</template>

<script setup lang="ts">
import { inject , ref } from 'vue'

const store = inject('useStore')

let fileToCreate = ref('')

store.dialogTitle = 'Create File'

</script>