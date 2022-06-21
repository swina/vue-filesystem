import { reactive , watch } from 'vue'

export const store = reactive ({
  rootPath: import.meta.env.VITE_APP_ROOT_PATH,
  dialog: null,
  dialogTile : 'Dialog',
  dialogCSS : 'w-full md:w-1/2 lg:w-1/3',
  message: {
    data:'',
    console: ''
  },
  currentFile: { file: null , path: null, model: null , lastOpened: null } ,
  loading: false,
  editor: ''
})

watch ( () => store.message.data , (msg) => {
  console.log ( 'store message has changed' , msg )
  if ( msg ){
    window.setTimeout(()=>{
      store.message.data = ''
    },4000)
  }
})

export const dragDrop = reactive({
  source:Object,
  target:Object
})


export function slugify ( value:string ){
    if ( !value ) return ''
    return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}


export function removeNestedObjectsKey( currentNode:Object = {} , arrayKey:Object = [] , deleteKey:String = ''){
  delete currentNode[deleteKey]
  currentNode[arrayKey].forEach ( obj => {
      removeNestedObjectsKey ( obj , arrayKey , deleteKey)
  })
  return currentNode
 
}

