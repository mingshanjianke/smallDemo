/**
 * Created by user on 2017/5/24.
 */
(function($){
    function Carousel(poster){
        var self=this;
        this.poster=poster;
        this.posterItemMain=poster.querySelector(".poster-list");
        this.nextBtn=poster.querySelector('.poster-next-btn');
        this.prevBtn=poster.querySelector('.poster-prev-btn');
        this.posterItems=poster.querySelectorAll('.poster-item');
        this.posterFirstItem=this.posterItems[0];
        this.posterLastItem=this.posterItems[this.posterItems.length-1];
        this.rotateFlag=true;

        //默认配置参数
        this.setting={
            width:1000, //幻灯片的宽度
            height:270, //幻灯片的高度
            posterWidth:640, //幻灯片第一帧的宽度
            posterHeight:270, //幻灯片第一帧的高度
            scale:0.9, //记录显示比例关系
            speed:500,
            autoPlay:true,
            delay:2000,
            verticalAlign:"middle"
        };
        //当用户没有指定相关参数时，则设置默认配置参数
        Object.assign(this.setting,this.getSetting());

        this.setSettingValue();
        this.setPosterPos();


        this.nextBtn.addEventListener('click',function(){
            if(self.rotateFlag){
                self.carouselRotate("left");
                self.rotateFlag=false;
            }

        })


        this.prevBtn.addEventListener('click',function(){
            if(self.rotateFlag){
                self.carouselRotate('right');
                self.rotateFlag=false;
            }
        });

        //是否开启自动播放
        if(this.setting.autoPlay){
            this.autoPlay();
            $(this.poster).hover(function(){
                clearInterval(self.timer);
            },function(){
                self.autoPlay();
            });
        }
    }
    Carousel.prototype={
        autoPlay:function(){
            var self=this;
            this.timer=setInterval(function(){
                self.nextBtn.click();
            },this.setting.delay);
        },
        //获取人工配置参数
        getSetting:function(){
            var setting=this.poster.getAttribute("data-setting");
            if(setting&&setting!=""){
                return JSON.parse(setting);
            }else{
                return {};
            }
        },
        //设置配置参数值去控制基本的宽度高度
        setSettingValue:function(){
            this.poster.style.width=this.setting.width+"px";
            this.poster.style.height=this.setting.height+"px";

            this.posterItemMain.style.width=this.setting.posterWidth+"px";
            this.posterItemMain.style.height=this.setting.posterHeight+"px";

            //计算上下切换按钮的宽度
            var btnWidth=(this.setting.width-this.setting.posterWidth)/2;


            this.nextBtn.style.width=btnWidth+"px";
            this.nextBtn.style.height=this.setting.posterHeight+"px";
            this.nextBtn.style.zIndex=Math.ceil(this.posterItems.length/2);

            this.prevBtn.style.width=btnWidth+"px";
            this.prevBtn.style.height=this.setting.posterHeight+"px";
            this.prevBtn.style.zIndex=Math.ceil(this.posterItems.length/2);

            //设置第一张图片的样式
            this.posterFirstItem.style.width=this.setting.posterWidth+"px";
            this.posterFirstItem.style.height=this.setting.posterHeight+"px";
            this.posterFirstItem.style.left=btnWidth+"px";
            this.posterFirstItem.style.zIndex=Math.floor(this.posterItems.length/2);
        },

        //设置剩余的帧的位置关系
        setPosterPos:function(){
            var self=this;
            var posterItems=[].slice.call(this.posterItems);
            var sliceItems=posterItems.slice(1),
                sliceSize=sliceItems.length/ 2,
                rightSlice=sliceItems.slice(0,sliceSize), //右边帧
                level=Math.floor(posterItems.length/2),
                leftSlice=sliceItems.slice(sliceSize);    //左边帧

            var rw=this.setting.posterWidth,
                rh=this.setting.posterHeight,
                gap=((this.setting.width-this.setting.posterWidth)/2)/level;

            var firstLeft=(this.setting.width-this.setting.posterWidth)/2;
            //对于第一帧右边的帧来说，总是在fixOffsetLeft这个固定的值上加一些变化的值
            var fixOffsetLeft=firstLeft+rw;

            //设置右边帧的位置关系和宽度高度top
            rightSlice.forEach(function(item,index){
                level--;

                rw=rw*self.setting.scale;
                rh=rh*self.setting.scale;

                var j=index;
                item.style.zIndex=level;
                item.style.width=rw+"px";
                item.style.height=rh+"px";
                item.style.opacity=1/(++index);
                item.style.left=(fixOffsetLeft+(++j)*gap-rw)+"px";
                item.style.top=self.setVerticalAlign(rh)+"px";
            });


            //设置左边的位置关系
            var lwStr=rightSlice[rightSlice.length-1].style.width,
                lhStr=rightSlice[rightSlice.length-1].style.height,
                lw=lwStr.substring(0,lwStr.length-2),
                lh=lhStr.substring(0,lhStr.length-2),
                oloop=Math.floor(this.posterItems.length/2);



            leftSlice.forEach(function(item,index){
                item.style.zIndex=index;
                item.style.width=lw+"px";
                item.style.height=lh+"px";
                item.style.opacity=1/oloop;
                item.style.left=index*gap+"px";
                item.style.top=self.setVerticalAlign(lh)+"px";

                lw=lw/self.setting.scale;
                lh=lh/self.setting.scale;
                oloop--;
            });

        },
        //设置对齐方式
        setVerticalAlign:function(height){
            var verticalType=this.setting.verticalAlign,
                top=0;
            if(verticalType==="middle"){
                top=(this.setting.height-height)/2;
            }else if(verticalType==="top"){
                top=0;
            }else if(verticalType==="bottom"){
                top=this.setting.height-height;
            }else{
                top=(this.setting.height-height)/2;
            }
            return top;
        },

        //旋转
        carouselRotate:function(dir){
            var _this_=this;
            var zIndexArr=[];
            if(dir==="left"){
                this.posterItems.forEach(function(item){
                    var prev=item.previousElementSibling?item.previousElementSibling:_this_.posterLastItem,
                        width=prev.style.width,
                        height=prev.style.height,
                        zIndex=prev.style.zIndex,
                        opacity=prev.style.opacity,
                        left=prev.style.left,
                        top=prev.style.top;
                    zIndexArr.push(zIndex);
                    $(item).animate({
                        width:width,
                        height:height,
                        opacity:opacity,
                        left:left,
                        top:top
                    },_this_.setting.speed,function(){
                        _this_.rotateFlag=true;
                    });
                });
                this.posterItems.forEach(function(item,index){
                    item.style.zIndex=zIndexArr[index];
                });
            }else if(dir==="right"){
                this.posterItems.forEach(function(item){
                    var next=item.nextElementSibling?item.nextElementSibling:_this_.posterFirstItem,
                        width=next.style.width,
                        height=next.style.height,
                        zIndex=next.style.zIndex,
                        opacity=next.style.opacity,
                        left=next.style.left,
                        top=next.style.top;
                    zIndexArr.push(zIndex);
                    $(item).animate({
                        width:width,
                        height:height,
                        opacity:opacity,
                        left:left,
                        top:top
                    },_this_.setting.speed,function(){
                        _this_.rotateFlag=true;
                    });
                });
                this.posterItems.forEach(function(item,index){
                    item.style.zIndex=zIndexArr[index];
                });
            }
        }
    };
    Carousel.prototype.constructor=Carousel;


    Carousel.init=function(posters){
        var _this_=this;
        var posters=[].slice.call(posters);
        posters.forEach(function(item){
            new _this_(item);
        });
    };

    window.Carousel=Carousel;
})(jQuery);