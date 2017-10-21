function traverseDOM(node){
  var childLen=node.childNodes.length;
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
      if(childTmp.nodeName=="DIV"){
        if(childTmp.style){
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
      }
      traverseDOM(childTmp);
    }
  }
}
console.log(document.body);
traverseDOM(document.body);


