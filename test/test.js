function traverseDOM(node){
  var childLen=node.childNodes.length;
  console.log("traverseDOM");
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
      if(childTmp.nodeName=="DIV"){
        console.log(childTmp);
        if(childTmp.style){
          var obj=window.getComputedStyle(childTmp);
          if(obj.hasOwnProperty("position")){
            if(obj["position"]=="fixed"){
              childTmp.style.display="none";
            }
            return;
          }
        }
      }
      traverseDOM(childTmp);
    }
  }
}

traverseDOM(document);
console.log("this is plugin output");

