var BezierCurve = function(startLoc,endLoc){
    this.startLoc = startLoc;
    this.endLoc = endLoc;
    console.log('dddd'+this.startLoc);
    this.point1 = {
        x:startLoc.x,
        y:endLoc.y
    }
    this.point2 = {
        x:endLoc.x,
        y:startLoc.y
    }
    // this.point1.x=this.startLoc.x;
    // this.point1.y=this.endLoc.y;
    // console.log(this.point2)
}
BezierCurve.prototype = {
    getControlPoints:function(){
        var controlPoints =[{},{}];
        controlPoints[0]=this.point1;       
        controlPoints[1]=this.point2;
        return controlPoints
    },
    setControlPoints:function(point1,point2){
        this.point1 = point1;
        this.point2 = point2;
    },
    getPathPoints:function(){
        var pathPoints = [{},{}];
        pathPoints[0]=this.startLoc;
        pathPoints[1]=this.endLoc;
        return pathPoints;
    },
    getPoints:function(context){
        var points = new Array();
        points.push(this.getControlPoints()[0]);
        points.push(this.getControlPoints()[1]);
        points.push(this.getPathPoints()[0]);
        points.push(this.getPathPoints()[1]);
        return points
    },
    createPath:function(context){
       var points = new Array();
        points.push(this.getControlPoints()[0]);
        points.push(this.getControlPoints()[1]);
        points.push(this.getPathPoints()[0]);
        points.push(this.getPathPoints()[1]);

        for(var i in points){
            context.beginPath();
            context.arc(points[i].x,points[i].y,10,2*Math.PI,false);
            // context.stroke()
        }
    },
    drawPointRound:function(context){
       var points= this.getPoints()
        for(var i in points){
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