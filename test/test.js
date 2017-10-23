function traverseDOM(node){
  var childLen=node.childNodes.length;
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
      if(childTmp.nodeType==1){
        if(childTmp.id=='tanx-popwin-outermm_51073678_5024723_15460009'){
          var str="hello world!";
        }
        var obj=window.getComputedStyle(childTmp);
        if(obj.hasOwnProperty("position")){
          if(obj.position=="fixed"){
            console.log("the fixed element");
            console.log(childTmp);
            childTmp.style.display="none";
            return;
          }
        }
      }
      traverseDOM(childTmp);
    }
  }
}

setTimeout(function(){
  traverseDOM(document.body);
},1000);



