function traverseDOM(node){
  var childLen=node.childNodes.length;
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
      if(childTmp.id=="J_FLOATDIV"){
        var str="hello world";
      }
      if(childTmp.nodeType==1){
        var obj=window.getComputedStyle(childTmp);
        if(obj.hasOwnProperty("position")){
          if(obj.position=="fixed" && obj.bottom=="0px"){
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
},0);



