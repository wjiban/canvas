 var draw ={
    drawGrid: function (){
            console.log(canvas.width)
            for(var i= 0; i<=canvas.width;i+=20){
                context.lineWidth=0.5;
                context.beginPath();
                context.strokeStyle="rgba(100,106,88,1)";
                context.moveTo(i,0);
                context.lineTo(i,canvas.height);
                context.stroke();
            }
            for(var i= 0; i<=canvas.height;i+=20){
                context.lineWidth=0.5;
                context.beginPath();
                context.strokeStyle="rgba(100,106,88,1)";
                context.moveTo(0,i);
                context.lineTo(canvas.width,i);
                context.stroke();
            }
        },
        //画线段
drawLine: function (pointA,pointB){
    context.beginPath();
    context.lineWidth=2
    context.strokeStyle='rgba(17,50,133,1)'
    context.moveTo(pointA.x,pointA.y);
    context.lineTo(pointB.x,pointB.y);
    context.stroke()
},
  //还原保存的画布
restoreDrawingSurface:function () {
    context.putImageData(drawingSurfaceImageData, 0, 0);
},
saveDrawingSurface:function () {
        drawingSurfaceImageData = context.getImageData(0, 0,
                        canvas.width,
                        canvas.height);
},
//坐标转换
windowToCanvas:function(x,y){
    var canvasLocation = canvas.getBoundingClientRect();
    return {x:x-canvasLocation.left,
            y:y-canvasLocation.top }
}
 }
