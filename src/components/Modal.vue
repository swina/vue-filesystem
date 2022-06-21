<template>
    <div v-if="store.dialog" class="z-modal fixed inset-0 h-screen w-screen bg-black bg-opacity-30 items-center justify-center flex flex-col" style="z-index:999999999;" id="contextDialog">
        <div class="flex flex-col m-auto bg-white z-modal relative" :class="store.dialogCSS"> 
            <div class="bg-purple-700 text-white flex items-center p-2">{{ store.dialogTitle || 'Dialog' }}</div>
            <span class="absolute right-0 top-0 m-1 text-white cursor-pointer" @click="store.dialog=null"><i class="material-icons">close</i></span>
            <CreateFolder v-if="store.dialog === 'CreateFolder'"/>
            <CreateFile v-if="store.dialog === 'CreateFile'"/>
            <DeleteItem v-if="store.dialog === 'DeleteItem'"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { openContextDialog , closeCtx } from '/@/composables/contextMenu';

const store = inject ( 'useStore' );

</script>