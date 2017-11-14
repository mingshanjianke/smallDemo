function traverseDOM(node){
    var childLen=node.childNodes.length;
    if(childLen!=0){
       for(var i=0;i<childLen;i++){
          var childTmp=node.childNodes[i];
          if(childTmp){
             if(childTmp.nodeType==1){
                var obj=window.getComputedStyle(childTmp);
                if(obj.hasOwnProperty('position')){
                   if(obj.position=='fixed' && obj.bottom=='0px'){
                      console.log('fixed');
                   }
                }
             }
          }
          traverseDOM(childTmp);
       }
    }
}
setTimeout(function(){
   traverseDOM(document);
},500);
