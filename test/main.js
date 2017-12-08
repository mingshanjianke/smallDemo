String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g,"");
};

//判断该节点下是否包含文本节点
var isIncludeTextRes=false;
var variousFlag=false;
function isIncludeTextNode(node){
	var nodeChildLen=0;
	if(node){
		nodeChildLen=node.childNodes.length;
	}
	if(nodeChildLen==0){
		if(node.nodeType==3){
			if(node.nodeValue && node.nodeValue.replace(/(^\s*)|(\s*$)/g, "").length>2){
				isIncludeTextRes=true;
				return;
			}
		}else if(node.nodeType==1){
			if(node.nodeName=='EMBED'){
				variousFlag=true;
				return;
			}else if(node.nodeName=='IFRAME'){
				variousFlag=true;
				return;
			}
		}
	}else{
		//if(node && node.nodeName=='UL'){
		//	isIncludeTextRes=true;
		//	return;
		//}else
		if(node && node.nodeName=='STYLE'){
			return;
		}else if(node && node.nodeName=='SCRIPT'){
			return;
		}
		for(var i=0;i<nodeChildLen;i++){
			var childTmp=node.childNodes[i];
			if(variousFlag){
				return;
			}
			if(isIncludeTextRes){
				return;
			}else{
				isIncludeTextNode(childTmp);
			}
		}
	}
}

//找到包含参数node最近的div元素
var mostVicinityDivNodeRes="";
function findMostVicinityDivNode(node){
	if(node && node.parentElement){
		if(node.parentElement.nodeType==1){
			if(node.parentElement.nodeName=='DIV' || node.parentElement.nodeName=='BODY' || node.parentElement.nodeName=='INS' || node.parentElement.nodeName=='LI'
			|| node.parentElement.nodeName=='ASIDE' || node.parentElement.nodeName=='SECTION'){
				mostVicinityDivNodeRes=node.parentElement;
				return;
			}else{
				var tmpNode=node.parentElement;
				findMostVicinityDivNode(tmpNode);
			}
		}
	}
}

//判断此div元素下面是否包含图片，图片类别包括用img引入与在css背景中的图片
//或者包含iframe或者是否包含a标签
var result=false;
function isIncludePic(divEle,type){
	var divEleChildrenLen=divEle.childNodes.length;
	if(divEleChildrenLen>=10){
		result=true;
		return;
	}
	if(type=='text'){
		if(divEleChildrenLen==0){
			if(divEle.nodeType==1){
				if(divEle.nodeName=='IMG'){
					result=true;
					return;
				}else if(divEle.nodeName=='IFRAME'){
					result=true;
					return;
				}else if(divEle.nodeName=='EMBED'){
					result=true;
					return;
				}
			}else if(divEle.nodeType==3){
				if(divEle.parentElement.nodeName=='A'){
					result=true;
					return;
				}
			}
		}else{
			if(divEle.nodeName=='IFRAME'){
				result=true;
				return;
			}else if(divEle.nodeName=='OBJECT'){
				result=true;
				return;
			}else if(divEle.nodeName=='EMBED'){
				result=true;
				return;
			}else if(divEle.nodeName=='LI'){
				result=true;
				return;
			}
			for(var z=0;z<divEleChildrenLen;z++){
				var childTextTmp=divEle.childNodes[z];
				if(result){
					break;
				}
				isIncludePic(childTextTmp,type);
			}
		}
	}else{
		if(divEleChildrenLen==0){
			if(divEle.nodeType==3){
				if(divEle.parentElement.nodeName=='A'){
					result=true;
					return;
				}
			}
			if(divEle.nodeType==1){
				if(divEle.nodeName=='A'){
					//console.log("a.........");
					//console.log(divEle);
					//console.log("a..........");
					var objDivEle=window.getComputedStyle(divEle);
					var objDivEleWidth=parseInt(objDivEle.width.replace(/[^0-9]/ig,"")),
						objDivEleHeight=parseInt(objDivEle.height.replace(/[^0-9]/ig,""));
					if(objDivEle.display=='block' && objDivEleWidth>=20 && objDivEleHeight>=20){
						//console.log("divEle");
						//console.log(divEle);
						result=true;
						return;
					}
				}else if(divEle.nodeName=='IMG' && divEle.parentElement.nodeName=='A'){
					result=true;
					return;
				}else if(divEle.nodeName=='IMG'){
					var previousEleNode=divEle.previousElementSibling,
						nextEleNode=divEle.nextElementSibling;
					if((previousEleNode&&previousEleNode.nodeName=='A'&&nextEleNode&&nextEleNode.nodeName=='IMG')||
						(previousEleNode&&previousEleNode.nodeName=='IMG'&&nextEleNode&&nextEleNode.nodeName=='A')){
						result=true;
						return;
					}
				}else if(divEle.nodeName=='IFRAME'){
					result=true;
					return;
				}else if(divEle.nodeName=='EMBED'){
					result=true;
					return;
				}else{
					var objBackgroundTmp=window.getComputedStyle(divEle);
					if(objBackgroundTmp.backgroundImage && objBackgroundTmp.backgroundImage!='none'){
						result=true;
						return;
					}
				}
			}
		}else{
		    if(divEle.nodeName=='IFRAME'){
				result=true;
				return;
			}else if(divEle.nodeName=='EMBED'){
				result=true;
				return;
			}else if(divEle.nodeName=='OBJECT'){
				result=true;
				return;
			}else if(divEle.nodeName=='LI'){
				result=true;
				return;
			}else{
				var obj=window.getComputedStyle(divEle);
				var divEleWidth=parseInt(obj.width.replace(/[^0-9]/ig,"")),
					divEleHeight=parseInt(obj.height.replace(/[^0-9]/ig,""));
				if(obj.backgroundImage && obj.backgroundImage!='none' && obj.position=="static" && divEleWidth>=50 && divEleHeight>=50){
					result=true;
					return;
				}
			}
			for(var i=0;i<divEleChildrenLen;i++){
				var childTmpOfDivEle=divEle.childNodes[i];
				if(childTmpOfDivEle.nodeName=='UL'){
					result=true;
					return;
				}
				if(result){
					break;
				}
				isIncludePic(childTmpOfDivEle,type);
			}
		}
	}
}


//记录节点attributes的内容
function recordAttr(node){
	var currNodeAttr={};
	if(node.attributes){
		for(var i=0;i<node.attributes.length;i++){
			var tmpAttr=node.attributes[i];
			if(tmpAttr.nodeName!='class' && tmpAttr.nodeName!='id'){
				currNodeAttr[tmpAttr.nodeName]=tmpAttr.nodeValue;
			}
		}
	}
}

var aResult=false;
//判断是否广告作为一个专栏，即这里判断"广告"上层包裹元素是否为a元素
function isAElement(node){
	var parentNode=node.parentElement;
	if(parentNode.nodeName=="A"){
		aResult=true;
	}
}

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
					break;
				}
			}
			isIncludeLiInFixedEle(childTmp);
		}
	}
}


var realAdvertisementResult=true;
//判断广告字样是否是真正的广告，或者广告也是网站的内容的一个部分
function isTrueAdvertisement(node){
	var previousNode=node.previousElementSibling;
	var nextNode=node.nextElementSibling;
	var currNodeAttr=recordAttr(node);
	var currNodeAttrValue,prevNodeAttrValue,nextNodeAttrValue,prevNodeAttr,nextNodeAttr;
	if(previousNode && nextNode){
		prevNodeAttr=recordAttr(previousNode);
		nextNodeAttr=recordAttr(nextNode);
		for(var key in currNodeAttr){
			currNodeAttrValue=currNodeAttr[key];
			prevNodeAttrValue=prevNodeAttr[key];
			nextNodeAttrValue=nextNodeAttr[key];
			if(parseInt(currNodeAttrValue)-1==parseInt(prevNodeAttrValue) && parseInt(currNodeAttrValue)+1==parseInt(nextNodeAttrValue)){
				realAdvertisementResult=false;
				return;
			}
		}
	}else if(previousNode){
		prevNodeAttr=recordAttr(previousNode);
		for(var key in currNodeAttr){
			currNodeAttrValue=currNodeAttr[key];
			prevNodeAttrValue=prevNodeAttr[key];
			if(parseInt(currNodeAttrValue)-1==parseInt(prevNodeAttrValue)){
				realAdvertisementResult=false;
				return;
			}
		}
	}else if(nextNode){
		nextNodeAttr=recordAttr(nextNode);
		for(var key in currNodeAttr){
			currNodeAttrValue=currNodeAttr[key];
			nextNodeAttrValue=nextNodeAttr[key];
			if(parseInt(currNodeAttrValue)+1==parseInt(nextNodeAttrValue)){
				realAdvertisementResult=false;
				return;
			}
		}
	}
}


var liResult=false;
var divLevel=0;
//在到达第一个div元素前是否有li元素
function isIncludeLi(node){
	if(node){
		var tmpParent=node.parentElement;
		divLevel++;
		if(tmpParent && tmpParent.nodeName=="LI"){
			liResult=true;
		}else if(tmpParent && tmpParent.nodeName=='DIV' && divLevel!=1){
			return;
		}else{
			isIncludeLi(tmpParent);
		}
	}
}

/*
 * 该函数用于找到在包裹node的节点中，
 * 第一个为div标签的节点且这个的css高度大于16px
 * */
var finalParentNode=null;
var divNum=0;

function findTheFirstDiv(node,type){
	finalParentNode=node.parentElement;
	if(!finalParentNode){
		return;
	}
	//if(finalParentNode.nodeName=='BODY'){
	//	return;
	//}
	if(finalParentNode.nodeName!=='DIV' && finalParentNode.nodeName!='INS'&&finalParentNode.nodeName!='LI' && finalParentNode.nodeName!='UL'){
		findTheFirstDiv(finalParentNode,type);
	}else{
		//用于判断div下面是否包含图片，拥有图片才认为是包含了广告的
		//console.log("isIncludePic");
		//console.log(finalParentNode);
		//console.log("isIncludePic");
		if(finalParentNode.className.indexOf('right1 fr')!=-1){
			var helloStr="hellow";
			var tmpNodeEle=finalParentNode;
		}
		isIncludePic(finalParentNode,type);
		if(result){
			result=false;
			return;
		}else{
			findTheFirstDiv(finalParentNode,type);
		}
	}
}

//最后屏蔽节点的函数
function shieldNode(node,type){
	//console.log('shieldNode.........');
	//console.log(node);
	//console.log('shieldNode.........');
	findTheFirstDiv(node,type);
	//console.log("............");
	//console.log(node);
	//console.log(node.parentElement);
	//console.log(node.parentElement.parentElement);
	//var obj=window.getComputedStyle(node);
	//console.log(obj.backgroundImage);
	//console.log(finalParentNode);
	//console.log("............");
	//if(finalParentNode.nodeName=='BODY'){
	//	return;
	//}
	if(finalParentNode){
		if(finalParentNode.id.indexOf("foot")!=-1 || finalParentNode.className.indexOf("foot")!=-1){
			var tmp=finalParentNode;
			return;
		}
		//finalParentNode.style.display='none';
		var shieldNodeParent=finalParentNode.parentElement;
		if(shieldNodeParent){
			//为了避免移除节点后带来的影响
			//var divEle=document.createElement('div');
			//shieldNodeParent.insertBefore(divEle,finalParentNode);
			//var retChild=shieldNodeParent.removeChild(finalParentNode);

			if(finalParentNode.nodeName=='LI'){
				//var liEle=finalParentNode.cloneNode();
				//var divEleInLi=document.createElement('div');
				//liEle.appendChild(divEleInLi);
				//shieldNodeParent.insertBefore(liEle,finalParentNode);
				//var retChild=shieldNodeParent.removeChild(finalParentNode);
				var childOfLi=finalParentNode.children[0];
				finalParentNode.removeChild(childOfLi);
			}else{
				var divEle=document.createElement('div');
				shieldNodeParent.insertBefore(divEle,finalParentNode);
				var retChild=shieldNodeParent.removeChild(finalParentNode);
			}

			//console.log("removeChild");
			//console.log(retChild);
		}else{
			finalParentNode.style.display='none';
			//console.log("display");
		}

		//finalParentNode.style.display='none';

		finalParentNode=null;
	}
}


function traverseDOM(node,flag){
	if(node&&node.nodeType==1&& node.id=='tanxssp_con_mm_15890324_2192376_23114697'){
		console.log(node);
	}
	//var childNodeTmp=node;
	//console.log(node);
	//if(node.nodeType==1){
	//	var nodeObj=window.getComputedStyle(node);
	//	if(nodeObj.display=='none'){
	//		return;
	//	}
	//}
    var childLen=0;
	if(node){
		childLen=node.childNodes.length;
	}else{
		return;
	}
	if(childLen==0){
		if(node.nodeType==3){
			var re= /[\u4E00-\u9FA5]/g;
			var str="";
			if(node.nodeValue.match(re)){
				str=node.nodeValue.match(re).join("");
			}
			//console.log("textNode");
			//console.log(str);
			//console.log(node.parentNode);
			if(str.indexOf('广告')!=-1 && str.length==2){

				if (flag) {
					//console.log(".......text.........");
					isAElement(node);

					if (aResult) {
						//console.log(".......a........");
						aResult=false;
						return;
					}
					isTrueAdvertisement(node.parentElement);
					if (!realAdvertisementResult) {
						//console.log(".......realAdvertisement.........");
						realAdvertisementResult=true;
						return;
					}
					isIncludeLi(node);
					if (liResult) {
						divLevel=0;
						liResult = false;
						return;
					}
					//console.log(".......After text.........");
					//var tmp=node;
					//var str="hello";
					//console.log("from text");
					//console.log("text");
					//console.log(node);
					//console.log(node.parentNode);
					//console.log(".......text.......");
					shieldNode(node,"text");

					//如果处于iframe页面，则直接屏蔽
				} else {
					var tmp = node;
					if(node && node.ownerDocument && node.ownerDocument.body && node.ownerDocument.body.style ){
						node.ownerDocument.body.style.display = "none";
					}

				}
			}
		}else if(node.nodeType==1){
			//处理img标签

			if(node.nodeName=='IMG'){
				//if(node.src.indexOf('TB1tWvVJFXXXXc_aXXXXXXXXXXX-40-26.png')!=-1){
				//	var strHello='hello world';
				//	var tmpNode=node;
				//}
				//if(node.src.indexOf('up.png')!=-1){
				//	var strHello="hello world";
				//	var tmpNode=node;
				//}
				//console.log(node.src);
				var imgStyle=window.getComputedStyle(node);
				var imgWidth=imgStyle.width,
					imgHeight=imgStyle.height;
				if(imgWidth=='auto' || imgHeight=='auto'){
					return;
				}
				var imgWidthNum=parseInt(imgWidth.replace(/[^0-9]/ig,"")),
					imgHeightNum=parseInt(imgHeight.replace(/[^0-9]/ig,""));
				if(imgWidthNum<=40 && imgHeightNum<=40){
					if(node.src){
						if(node.src.indexOf("base64")==-1 && node.src.indexOf('about:blank')==-1){
							if(localStorage.hasOwnProperty(node.src)){
								var localRes=localStorage.getItem(node.src);
								if(localRes=='true'){
									if(flag){
										shieldNode(node,'img');
									}else{
										node.ownerDocument.body.style.display='none';
									}
								}
								return;
							}
							//console.log(node.src);
							var xhr=new XMLHttpRequest();
							var url="http://127.0.0.1:3000/"+node.src;

							//console.log(url);
							xhr.open("GET",url);
							//console.log(url);
							xhr.onreadystatechange=function(){
								if(xhr.readyState==4 && xhr.status==200){

									if(xhr.responseText=="true"){
										localStorage.setItem(node.src,'true');
										if(flag){
											//console.log('from img ajax');
											shieldNode(node,'img');
										}else{
											node.ownerDocument.body.style.display='none';
										}
										//console.log('true from server');
									}else{
										localStorage.setItem(node.src,'false');
										//console.log('false from server');
									}

								}
							};
							xhr.send();
						}
					}
				}
				//console.log("............");
				//console.log(node);
				//console.log(node.parentElement);
				//console.log(node.parentElement.parentElement);
				//console.log("............");
				findMostVicinityDivNode(node);
				var mostVicinityDivNode=mostVicinityDivNodeRes;
				mostVicinityDivNodeRes="";
				isIncludeTextNode(mostVicinityDivNode);
				if(variousFlag){
					variousFlag=false;
					if(node.src){
						if(node.src.indexOf("base64")==-1 && node.src.indexOf('about:blank')==-1){
							if(localStorage.hasOwnProperty(node.src)){
								var localRes=localStorage.getItem(node.src);
								if(localRes=='true'){
									if(flag){
										shieldNode(node,'img');
									}else{
										node.ownerDocument.body.style.display='none';
									}
								}
								return;
							}
							//console.log(node.src);
							var xhr=new XMLHttpRequest();
							var url="http://127.0.0.1:3000/"+node.src;

							//console.log(url);
							xhr.open("GET",url);
							//console.log(url);
							xhr.onreadystatechange=function(){
								if(xhr.readyState==4 && xhr.status==200){

									if(xhr.responseText=="true"){
										localStorage.setItem(node.src,'true');
										if(flag){
											//console.log('from img ajax');
											shieldNode(node,'img');
										}else{
											node.ownerDocument.body.style.display='none';
										}
										//console.log('true from server');
									}else{
										localStorage.setItem(node.src,'false');
										//console.log('false from server');
									}

								}
							};
							xhr.send();
						}
					}
					return;
				}
				if(isIncludeTextRes){
					isIncludeTextRes=false;
					return;
				}else{
					findMostVicinityDivNode(mostVicinityDivNode);
					var secondMostVicinityDivNode=mostVicinityDivNodeRes;
					mostVicinityDivNodeRes="";
					if(secondMostVicinityDivNode && secondMostVicinityDivNode.childNodes.length>=10){
						if(node.src){
							if(node.src.indexOf("base64")==-1 && node.src.indexOf('about:blank')==-1){
								if(localStorage.hasOwnProperty(node.src)){
									var localRes=localStorage.getItem(node.src);
									if(localRes=='true'){
										if(flag){
											shieldNode(node,'img');
										}else{
											node.ownerDocument.body.style.display='none';
										}
									}
									return;
								}
								//console.log(node.src);
								var xhr=new XMLHttpRequest();
								var url="http://127.0.0.1:3000/"+node.src;

								//console.log(url);
								xhr.open("GET",url);
								//console.log(url);
								xhr.onreadystatechange=function(){
									if(xhr.readyState==4 && xhr.status==200){

										if(xhr.responseText=="true"){
											localStorage.setItem(node.src,'true');
											if(flag){
												//console.log('from img ajax');
												shieldNode(node,'img');
											}else{
												node.ownerDocument.body.style.display='none';
											}
											//console.log('true from server');
										}else{
											localStorage.setItem(node.src,'false');
											//console.log('false from server');
										}

									}
								};
								xhr.send();
							}
						}
						return;
					}
					isIncludeTextNode(secondMostVicinityDivNode);
					if(isIncludeTextRes){
						isIncludeTextRes=false;
						return;
					}else{
						var imgObj=window.getComputedStyle(node);
						if(imgObj.display=='none'){
							return;
						}

						if(node.src){
							if(node.src.indexOf("base64")==-1 && node.src.indexOf('about:blank')==-1){
								if(localStorage.hasOwnProperty(node.src)){
									var localRes=localStorage.getItem(node.src);
									if(localRes=='true'){
										if(flag){
											shieldNode(node,'img');
										}else{
											node.ownerDocument.body.style.display='none';
										}
									}
									return;
								}
								//console.log(node.src);
								var xhr=new XMLHttpRequest();
								var url="http://127.0.0.1:3000/"+node.src;

								//console.log(url);
								xhr.open("GET",url);
								//console.log(url);
								xhr.onreadystatechange=function(){
									if(xhr.readyState==4 && xhr.status==200){

										if(xhr.responseText=="true"){
											localStorage.setItem(node.src,'true');
											if(flag){
												//console.log('from img ajax');
												shieldNode(node,'img');
											}else{
												node.ownerDocument.body.style.display='none';
											}
											//console.log('true from server');
										}else{
											localStorage.setItem(node.src,'false');
											//console.log('false from server');
										}

									}
								};
								xhr.send();
							}
						}
					}
				}
			}else if(node.nodeName=='IFRAME'){
				//console.log("iframe");
				//console.log(node);
				//console.log("iframe");
				if(node.src=="" || node.src.indexOf('javascript')!=-1 || node.src.indexOf('about:blank')!=-1){
                    //if(node.id=='sinaadtk_sandbox_id_1'){
					//	var tmpStr='hello';
					//	var tmpNode=node;
					//}
					var iframeDocument="";
					if(node.contentDocument.childNodes.length==1){
						iframeDocument=node.contentDocument.childNodes[0];
					}else{
						iframeDocument=node.contentDocument.childNodes[1];
					}
					//var iframeDocument=childTmp.contentDocument.childNodes[1];
					if(iframeDocument){
						for(var j=0;j<iframeDocument.childNodes.length;j++){
							var iframeNode=iframeDocument.childNodes[j];
							//console.log("......just for test again........");
							traverseDOM(iframeNode,flag);
						}
					}
				}
			}else{
				var obj = window.getComputedStyle(node);
				//因为即使是通过background的形式引入的样式
				//还是可以通过backgroundImage得到其引入的图片

				//雪碧图情况
				//position属性值为absolute
				//左上top:0px,left:0px
				//左下bottom:0px,left:0px
				//右上top:0px,right:0px
				//右下bottom:0px,right:0px
				if(obj.position=='absolute'){
					var objTop=parseInt(obj.top.replace(/[^0-9]/ig,"")),
						objLeft=parseInt(obj.left.replace(/[^0-9]/ig,"")),
						objBottom=parseInt(obj.bottom.replace(/[^0-9]/ig,"")),
						objRight=parseInt(obj.right.replace(/[^0-9]/ig,''));
					if((objTop<=5&&objLeft<=5)||(objBottom<=5 && objLeft<=5)
						|| (objTop<=5 && objRight<=5) || (objBottom<=5&& objRight<=5)){
						if((node.id&&node.id.indexOf('ad')!=-1) || (node.className&&node.className.indexOf('ad')!=-1)){
							//if(flag){
							//	shieldNode(node);
							//}else{
							//	node.ownerDocument.body.style.display='none';
							//}
							//console.log("from background absolute");
							shieldNode(node,'absolute');
							return;
						}
					}
				}
				if(obj.backgroundImage && obj.backgroundImage!='none'){
					if(obj.backgroundImage.indexOf('base64')==-1 && obj.backgroundImage.indexOf('about:blank')==-1){
						var widthByCSSProperty=obj.width,heightByCSSProperty=obj.height;
						if(widthByCSSProperty=='auto' || heightByCSSProperty=='auto'){
							return;
						}else{
							var widthWithNum=parseInt(widthByCSSProperty.replace(/[^0-9]/ig,"")),
								heightWithNum=parseInt(heightByCSSProperty.replace(/[^0-9]/ig,""));
							if(widthWithNum>30 && heightWithNum>30){
								return;
							}else{
								var finalUrl = "";
								var urlImg = obj.backgroundImage;
								var pattern = /"(.*)"/; //提取""号的内容
								if (urlImg) {
									var result = urlImg.match(pattern);
									var imageUrl = null;
									if (result != null) {
										imageUrl = result[1]; //得到result中的第二个内容
										var index = imageUrl.indexOf('/'); //判断此url前是否有协议http或者https
										//如果前面没有协议，则手动加上协议
										if (index == 0) {
											finalUrl = "http:" + imageUrl;
										} else {
											finalUrl = imageUrl;
										}
										if(localStorage.hasOwnProperty(finalUrl)){
											var localRes=localStorage.getItem(finalUrl);
											if(localRes=='true'){
												if(flag){
													shieldNode(node,'background');
												}else{
													node.ownerDocument.body.style.display='none';
												}
											}
											return;
										}
										//console.log(node);
										//console.log(finalUrl);
										var xhr = new XMLHttpRequest();
										if (finalUrl) {
											var url = "http://127.0.0.1:3000/" + finalUrl;
										} else {
											return;
										}
										//console.log(url);
										//console.log(url);
										xhr.open("GET", url);
										xhr.onreadystatechange = function () {
											if (xhr.readyState == 4 && xhr.status == 200) {
												if (xhr.responseText == "true") {
													localStorage.setItem(finalUrl,'true');
													if(flag){
														//console.log("from background ajax");
														//console.log(node);
														//是为了解决异步问题
														var shouldShieldNode=node;
														shieldNode(shouldShieldNode,'background');
													}else{
														node.ownerDocument.body.style.display='none';
													}
												}else{
													localStorage.setItem(finalUrl,'false');
												}
											}
										};
										xhr.send();
									}
								}
							}
						}
					}
				}
			}
		}
	}else{
        if(node){
			if(node.nodeType==1){
				//if(node.className=='gglist'){
				//	var strHello="hello world";
				//	var tmpNode=node;
				//}
				if(node.nodeName=='IFRAME') {
					//console.log("....iframe....");
					//console.log(node);
					//console.log("....iframe....");
					if(node.src=="" || node.src.indexOf('javascript')!=-1 || node.src.indexOf('about:blank')!=-1){
						//console.log("..........");
						//console.log(node);
						//console.log("..........");
						var iframeDocument="";
						if(node.contentDocument.childNodes.length==1){
							iframeDocument=node.contentDocument.childNodes[0];
						}else{
							iframeDocument=node.contentDocument.childNodes[1];
						}
						//var iframeDocument=childTmp.contentDocument.childNodes[1];
						if(iframeDocument){
							for(var j=0;j<iframeDocument.childNodes.length;j++){
								var iframeNode=iframeDocument.childNodes[j];
								traverseDOM(iframeNode,flag);
							}
						}
					}
				}else {
					var obj=window.getComputedStyle(node);
					if(obj.hasOwnProperty('position') && obj.position=='fixed'){
						if(obj.bottom=='0px' || obj.left=='0px' || obj.right=='0px'){
							//为了避免某些网站使用fixed来作为固定菜单的情况，如牛客网
							isIncludeLiInFixedEle(node);
							if(fixedWithLiResult){
								fixedWithLiResult=false;
								return;
							}
							if(flag) {
								var parentTmp = node.parentElement;
								parentTmp.removeChild(node);
							}
							//}else{
							//	node.style.display='none';
							//}
						}
					}else if(obj.backgroundImage && obj.backgroundImage!='none'){
						//console.log(obj.backgroundImage);
						if(obj.backgroundImage.indexOf('base64')==-1 && obj.backgroundImage.indexOf('about:blank')==-1){
							var widthByCSSProperty=obj.width,heightByCSSProperty=obj.height;
							if(widthByCSSProperty=='auto' || heightByCSSProperty=='auto'){
								return;
							}else{
								var widthWithNum=parseInt(widthByCSSProperty.replace(/[^0-9]/ig,"")),
									heightWithNum=parseInt(heightByCSSProperty.replace(/[^0-9]/ig,""));
								if(widthWithNum>30 || heightWithNum>30){
									return;
								}else{
									var finalUrl = "";
									var urlImg = obj.backgroundImage;
									var pattern = /"(.*)"/; //提取""号的内容
									if (urlImg) {
										var result = urlImg.match(pattern);
										var imageUrl = null;
										if (result != null) {
											imageUrl = result[1]; //得到result中的第二个内容
											var index = imageUrl.indexOf('/'); //判断此url前是否有协议http或者https
											//如果前面没有协议，则手动加上协议
											if (index == 0) {
												finalUrl = "http:" + imageUrl;
											} else {
												finalUrl = imageUrl;
											}
											if(localStorage.hasOwnProperty(finalUrl)){
												var localRes=localStorage.getItem(finalUrl);
												if(localRes=='true'){
													if(flag){
														shieldNode(node,'background');
													}else{
														node.ownerDocument.body.style.display='none';
													}
												}
												return;
											}
											//console.log(node);
											//console.log(finalUrl);
											var xhr = new XMLHttpRequest();
											if (finalUrl) {
												var url = "http://127.0.0.1:3000/" + finalUrl;
											} else {
												return;
											}
											//console.log(url);
											//console.log(url);
											xhr.open("GET", url);
											xhr.onreadystatechange = function () {
												if (xhr.readyState == 4 && xhr.status == 200) {
													if (xhr.responseText == "true") {
														localStorage.setItem(finalUrl,'true');
														if(flag){
															//console.log(obj.backgroundImage);
															//console.log("from background ajax multiNode");
															shieldNode(node,'background');
															return;
														}else{
															node.ownerDocument.body.style.display='none';
															return;
														}
														//shieldNode(node);
														//return;
													} else {
														localStorage.setItem(finalUrl,'false');
														//console.log("false from server");
													}
												}
											};
											xhr.send();
										}
									}
								}
							}
						}
					}
				}
			}
		}
		for(var i=0;i<childLen;i++){
			var childTmp=node.childNodes[i];
			traverseDOM(childTmp,flag);
		}
	}
}


window.addEventListener("load",function load(event){
	//console.log("DOMContentLoaded");
	//window.removeEventListener("load",load,false);
	//var str="hello world";
	//console.log(str);
	//var tmp=str;

	//console.log("11111111");
	var root=document;
	//console.log(root);
	var flag=false;
	var referrer=document.referrer; //得到当前document的referrer
	var domain=document.domain; //得到当前document的domain
	/*
	 * 如果referrer中包含domain则为主页面
	 * 否则为iframe页面
	 * */
	if(referrer=="" || referrer.indexOf(domain)!=-1){
		flag=true;
	}else{
		flag=false;
	}
    //localStorage.clear();
    //console.log(".........");
    //console.log(document);
    //console.log(".........");
    setTimeout(function(){
		var tmpRecord=document;
		var str="hello";
		traverseDOM(document,flag);
    },800);
	//traverseDOM(document,flag);

});
