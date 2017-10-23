function traverseDOM(node){
  var childLen=node.childNodes.length;
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
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

var flag=false;
var referrer=document.referrer;
var domain=document.domain;
if(referrer=="" || referrer.indexOf(domain)!=-1){
  flag=true;
}else{
  flag=false;
}
if(flag){
  console.log("flag");
  setTimeout(function(){
     traverseDOM(document.body);
  },1000);
}



