var BezierCurve = function(startLoc,endLoc){
    this.startLoc = startLoc;
    this.endLoc = endLoc;
}
BezierCurve.prototype = {
    getControlPoints:function(){
        var controlPoints =[{},{}];
        controlPoints[0].x=this.startLoc.x;
        controlPoints[0].y=this.endLoc.y;        
        controlPoints[1].x=this.endLoc.x;
        controlPoints[1].y=this.startLoc.y;
        return controlPoints
    },
    getPathPoints:function(){
        var pathPoints = [{},{}];
        pathPoints[0]=this.startLoc;
        pathPoints[1]=this.endLoc;
        return pathPoints;
    },
    drawPointRound:function(context){
        // var points =[{},{}]
        var points = new Array();
        points.push(this.getControlPoints()[0]);
        points.push(this.getControlPoints()[1]);
        points.push(this.getPathPoints()[0]);
        points.push(this.getPathPoints()[1]);
        // console.log(points.pop())
        console.log(points.length)
        for(var i in points){
            // console.log(i)
            context.beginPath();
            context.arc(points[i].x,points[i].y,10,2*Math.PI,false);
            context.stroke()
        }
        
    },
    drawBezierCurve:function(context){
        var points = new Array();
        context.beginPath();
        context.moveTo(this.getPathPoints()[0].x,this.getPathPoints()[0].y);
        context.bezierCurveTo(this.getControlPoints()[0].x,this.getControlPoints()[0].y,
                              this.getControlPoints()[1].x,this.getControlPoints()[1].y,
                              this.getPathPoints()[1].x,this.getPathPoints()[1].y)
        context.stroke();
    }
}