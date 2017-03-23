 var draw ={
    drawGrid: function (){
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
  // 用对象 去表示
var canvasEvent ={
    loc:undefined,
    endLoc:undefined,
    press:false,
    editModel:false,
    offsetX:undefined,
    offsetY:undefined,
    polygons :[],
    clickRound:undefined,
    dragRound:false,
    bezierCurves:[],
    clickedPolygon:undefined,
    checked:function(e){
        
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
                canvasEvent.bezierCurves.forEach(function(bezierCurve){
                    var clickRound,
                    clickPathRound;
                    clickRound =  cursorIsRound(bezierCurve.getControlPoints());
                    clickPathRound = cursorIsRound(bezierCurve.getPathPoints());
                    if(clickRound||clickPathRound) {
                        canvasEvent.clickRound =clickRound||clickPathRound;
                        // console.log(canvasEvent.clickRound)
                        canvasEvent.dragRound=true;
                        canvasEvent.offsetX = canvasEvent.loc.x-canvasEvent.clickRound.x;
                        canvasEvent.offsetY = canvasEvent.loc.y-canvasEvent.clickRound.y;
                    }   
                })
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
        } else {
            if (canvasEvent.press) {
                if(canvasEvent.dragRound){
                    canvasEvent.clickRound.x =canvasEvent.endLoc.x - canvasEvent.offsetX;
                    canvasEvent.clickRound.y = canvasEvent.endLoc.y - canvasEvent.offsetY;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    draw.drawGrid();
                    drawBezierCurve.drawBezierCurves()
                }else{
                    draw.restoreDrawingSurface();
                    var bezierCurve = new BezierCurve(canvasEvent.loc,canvasEvent.endLoc);
                    bezierCurve.drawPointRound(context);
                    bezierCurve.drawBezierCurve(context);
                }
                
            } else {
                return;
            }
        }
    },
    mouseup:function(e){
        canvasEvent.endLoc = draw.windowToCanvas(e.clientX, e.clientY);
        canvasEvent.press = false;
        if (canvasEvent.editModel) {
            
        } else {
            if(canvasEvent.dragRound){
                canvasEvent.dragRound=false;
            }else{
                draw.restoreDrawingSurface();
                drawBezierCurve.drawBezierCurve(canvasEvent.loc,canvasEvent.endLoc)
            }
            
            
        }
    },
}
    function cursorIsRound(points){
        var clickRound;
        points.forEach(function(point){
            context.beginPath();
             context.arc(point.x,point.y,10,2*Math.PI,false);
            //  context.stroke()
            if(context.isPointInPath(canvasEvent.loc.x,canvasEvent.loc.y)){
                 clickRound=point

            }
        })
            return clickRound;
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
    drawBezierCurve:function(loc,endLoc){
         var bezierCurve = new BezierCurve(loc,endLoc);
         bezierCurve.drawPointRound(context);
         bezierCurve.drawBezierCurve(context);
         bezierCurve.createPath(context)
         if(!canvasEvent.press){
            canvasEvent.bezierCurves.push(bezierCurve);
         }
       
    },
    drawBezierCurves:function(){
        canvasEvent.bezierCurves.forEach(function(bezierCurve){
            bezierCurve.drawPointRound(context);
                    bezierCurve.drawBezierCurve(context);
        })
    }
}
var drawPolygon = {
    drawPolygon:function(endLoc){
        var radius = Math.sqrt(Math.pow(endLoc.x - canvasEvent.loc.x, 2) + Math.pow(endLoc.y - canvasEvent.loc.y, 2));
        var polygon = new Polygon(canvasEvent.loc.x, canvasEvent.loc.y, radius, 5, 30, context.strokeStyle, context.fillStyle);
        drawPolygon.drawPolygonChild(polygon);
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
            drawPolygon.drawPolygonChild(polygon);

        })

    }
}