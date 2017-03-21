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
        // console.log(x+y)
        var canvasLocation = canvas.getBoundingClientRect();
        return {x:x-canvasLocation.left,
                y:y-canvasLocation.top }
        }
 }
  // 用对象 去表示
var canvasEvent ={
            loc:undefined,
            endLoc:undefined,
            press:false,
            editModel:false,
            offsetX:undefined,
            offsetY:undefined,
            polygons :[],
            clickedPolygon:undefined,
            checked:function(e){
                console.log(this)
               
            },
            mousedown:function(e){
                canvasEvent.press = true;
                canvasEvent.loc = draw.windowToCanvas.call(this,e.clientX, e.clientY);
                e.preventDefault();
                if (canvasEvent.editModel) {
                    canvasEvent.clickedPolygon= undefined
                    canvasEvent.polygons.forEach(function (polygon) {
                        polygon.createPath(context);
                        if (context.isPointInPath(canvasEvent.loc.x, canvasEvent.loc.y)) {
                            draw.saveDrawingSurface();
                            canvasEvent.clickedPolygon = polygon;
                           canvasEvent.offsetX = canvasEvent.loc.x - polygon.x;
                            canvasEvent.offsetY = canvasEvent.loc.y - polygon.y;
                           canvasEvent.press = true;
                        }
                    })
                } else {
                    draw.saveDrawingSurface();
                    canvasEvent.press = true;
                }
            },
            mousemove:function(e){
                canvasEvent.endLoc = draw.windowToCanvas(e.clientX, e.clientY);
                if (canvasEvent.press && canvasEvent.editModel) {
                    canvasEvent.clickedPolygon.x =canvasEvent.endLoc.x - canvasEvent.offsetX;
                    canvasEvent.clickedPolygon.y = canvasEvent.endLoc.y - canvasEvent.offsetY;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    draw.drawGrid();
                    // drawPolygon.movePolygon()
                } else {
                    if (canvasEvent.press) {

                        draw.restoreDrawingSurface();
                        drawBezierCurve.getControlPoint(canvasEvent.loc,canvasEvent.endLoc);
                        drawBezierCurve.getEndPoint(canvasEvent.loc,canvasEvent.endLoc);
                        drawBezierCurve.drawBezierCurve()
                        // drawPolygon.drawPolygon(canvasEvent.endLoc)
                    } else {
                        return;
                    }
                }
            },
            mouseup:function(e){
                canvasEvent.endLoc = draw.windowToCanvas(e.clientX, e.clientY);
                canvasEvent.press = false;
                if (canvasEvent.editModel) {
                    // draw.saveDrawingSurface();
                } else {
                    draw.restoreDrawingSurface();
                    // drawBezierCurve.initDraw(canvasEvent.loc,canvasEvent.endLoc)
                    var bezierCurve = new BezierCurve(canvasEvent.loc,canvasEvent.endLoc);
                    var aaaa= bezierCurve.getPathPoints();
                    bezierCurve.drawPointRound(context);
                    bezierCurve.drawBezierCurve(context)
                    // canvasEvent.editModel=true;
                    // drawPolygon.drawPolygon(canvasEvent.endLoc)
                }
            },
            
            

          
        }
var drawBezierCurve={
    controlPoint:[{},{}],
    endPoint:[{},{}],
    initDraw:function(startLoc,endLoc){
        drawBezierCurve.getControlPoint(startLoc,endLoc);
        drawBezierCurve.getEndPoint(startLoc,endLoc);
        drawBezierCurve.drawBezierCurve();
        if(!canvasEvent.press){

        }
    },
    getControlPoint:function(startLoc,endLoc){
        drawBezierCurve.controlPoint[0].x=startLoc.x;
        drawBezierCurve.controlPoint[0].y=endLoc.y;        
        drawBezierCurve.controlPoint[1].x=endLoc.x;
        drawBezierCurve.controlPoint[1].y=startLoc.y;
        drawBezierCurve.drawControlPoint(drawBezierCurve.controlPoint[0]);
        drawBezierCurve.drawControlPoint(drawBezierCurve.controlPoint[1]);
    },
    getEndPoint:function(startLoc,endLoc){
        drawBezierCurve.endPoint[0]=startLoc;
        drawBezierCurve.endPoint[1]=endLoc;      
        drawBezierCurve.drawControlPoint(drawBezierCurve.endPoint[0]);
        drawBezierCurve.drawControlPoint(drawBezierCurve.endPoint[1]);
    },
    drawControlPoint:function(point){
        context.beginPath();
        context.arc(point.x,point.y,10,2*Math.PI,false);
        context.stroke()
    },
    drawBezierCurve:function(){
        context.beginPath();
        context.moveTo(drawBezierCurve.endPoint[0].x,drawBezierCurve.endPoint[0].y);
        context.bezierCurveTo(drawBezierCurve.controlPoint[0].x,drawBezierCurve.controlPoint[0].y,
                              drawBezierCurve.controlPoint[1].x,drawBezierCurve.controlPoint[1].y,
                              drawBezierCurve.endPoint[1].x,drawBezierCurve.endPoint[1].y)
        context.stroke();
    }
}
var drawPolygon = {
    drawPolygon:function(endLoc){
        console.log(canvasEvent.loc)
        var radius = Math.sqrt(Math.pow(endLoc.x - canvasEvent.loc.x, 2) + Math.pow(endLoc.y - canvasEvent.loc.y, 2));
        var polygon = new Polygon(canvasEvent.loc.x, canvasEvent.loc.y, radius, 5, 30, context.strokeStyle, context.fillStyle);
        drawPolygon.drawPolygonChild(polygon);
        console.log(radius)
        if (!canvasEvent.press) {
            canvasEvent.polygons.push(polygon);
        }
    },
    drawPolygonChild:function(polygon){
        context.beginPath();
        polygon.stroke(context);
        polygon.fill(context);
    },
    movePolygon:function(){
            canvasEvent.polygons.forEach(function (polygon) {
            drawPolygon.drawPolygonChild(polygon)
        })

    }
}