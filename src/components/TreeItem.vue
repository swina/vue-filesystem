
<template>
  <li class="ml-2 text-sm tree-item" v-if="model">
    <div
        :id="model.hash"
        :data-path="model.path"
        :class="currentCSS(model)"
        @reloadTree="$emit(reloadTree)"
        @click="toggle(model)"
        @openTemplate="loadFile"
        @drop="handleDrop($event,model)"
        @dragover.prevent
        @dragenter.prevent
        >
        <span class="flex tree-item items-center hover:bg-purple-800 p-1 text-white" @contextmenu="openContextMenu($event,model)" @dragend="handleDragEnd($event,model)" draggable="true" >
            <span class="material-icons mr-2" v-if="isFolder && !isOpen">folder</span>
            <span class="material-symbols-outlined mr-2" v-if="isFolder && isOpen">folder_open</span>
            <span class="material-symbols-outlined mr-2 text-lg" v-if="model.type==='file'">description</span>
            <span class="tree-item text-vase" :title="model.name">{{ model.name  }}
            </span>
        </span>
    </div>
   
    <ul class="tree-root" v-show="isOpen" v-if="isFolder">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem
        v-for="model in model.children"
        :model="model"
        :root="root"
        @openTemplate="loadFile"
        @reloadTree="refreshTree">
      </TreeItem>
    </ul>
  </li>
  
</template>

<script setup lang="ts">
import { ref, computed , inject } from 'vue'
import { openContextDialog, openCtx , closeCtx } from '/@/composables/contextMenu'
import { moveFile , fileTree , paths } from '/@/composables/UseLocalApi';
import { dragDrop  } from '/@/composables/useUtils';

const props = defineProps({
  model: {},
  root: String
})

const store = inject ( 'useStore')

const emit = defineEmits(['openTemplate','reloadTree','selectedFolder'])

const isOpen = ref ( store.currentFile.lastOpened === props.model.path ? true : false )

const isFolder = computed(() => {
    return props.model.children && props.model.children.length || props.model.type === 'directory'
})

function toggle(model,open=true) {
    if ( model.type === 'file' && open ){
        emit('openTemplate',model)
    } else {
        store.currentFile.file = null 
        store.currentFile.model = model
        store.currentFile.path = null //props.current.file = null
    }
    isOpen.value = !isOpen.value
}

function changeType(model) {
    if ( model.type === 'directory' ){
        openContextDialog()
    }
}

const addFile = () => {
    openContextDialog() 
}


const addFolder = () => {
    openContextDialog() 
}

const deleteItem = async () => {
    openContextDialog() 
    emit ( 'reloadTree' )
}

const currentCSS = (model)=>{
    return model.path === store.currentFile.path ? 'bg-black' : 'text-purple-300 bg-blue-gray-800'
}
const loadFile = async ( item ) => {
    emit('openTemplate' , item )
}

const refreshTree = async () => {
    emit('reloadTree')
}

let source = ref({})
let target = ref({})
let fs = ref (fileTree)

const handleDragEnd = async (e,item) => {
    console.log ( 'drag stop ' , item , dragDrop.target )
    source.value = item.path
    dragDrop.source = item
    
    let targetPath = dragDrop.target.path
    if ( typeof dragDrop.target.path === 'undefined' ){
        targetPath = props.root
    }
    try {
        const result = await moveFile ( item.path , targetPath , item.name , fs.value )
        store.message.data = await result.message
        fileTree.reload = true
    } catch ( err ) {
        store.message.data = "No drop area found"
    }
}

const handleDrop = (e:any,item:Object) => {
    console.log ( 'drag drop ' ,  item )
    dragDrop.target = item
}

const openContextMenu = (e:any,model:Object) => {
    e.preventDefault()
    openCtx('archiveCtx', e)
}

</script>
<!-- 
<style>
.tree-root { 
    margin:0;
    padding:0px;
}
.tree-item {
    list-style: none;
}
</style> -->