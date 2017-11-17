var fixedWithLiResult=false;
//判断元素position属性值为fixed的元素中是否包含li元素
function isIncludeLiInFixedEle(node){
	var childLen=node.childNodes.length;
	if(childLen==0){

	}else{
		for(var i=0;i<childLen;i++){
			var childTmp=node.childNodes[i];
			if(childTmp.nodeType==1){
				if(childTmp.nodeName=="LI"){
					fixedWithLiResult=true;
					return;
				}
			}
			isIncludeLiInFixedEle(childTmp);
		}
	}
}


function traverseDOM(node){
  var childLen=node.childNodes.length;
  if(childLen==0){
  }else{
    for(var i=0;i<childLen;i++){
      var childTmp=node.childNodes[i];
      if(childTmp.nodeType==1){
        if(childTmp.nodeName=="DIV"){
          var str="hello world!"
        }
        var obj=window.getComputedStyle(childTmp);
        if(obj.hasOwnProperty("position")){
          if(obj.position=="fixed" && obj.bottom=="0px"){
            isIncludeLiInFixedEle(childTmp);
            if(fixedWithLiResult){
              fixedWithLiResult=false;
              continue;
            }
            childTmp.style.display="none";
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




