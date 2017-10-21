function traverseDOM(node){
  var childLen=node.childNodes.length;
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
      if(childTmp.nodeName=="DIV"){
        if(childTmp.id=="tanx-popwin-outermm_51073678_5024723_15460009"){
          console.log(window.getComputedStyle(childTmp));
        }
        var obj=window.getComputedStyle(childTmp);
        if(obj.hasOwnProperty("position")){
          if(obj["position"]=="fixed"){
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
},500);



