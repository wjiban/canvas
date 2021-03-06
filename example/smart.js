  var smart = {
            init:function(x,y,width){
                this.round(x+width/2,y+width/2,width/2)
                this.eye(x+width/4,y+2*width/5,width/5,0,Math.PI);
                this.eye(x+3*width/4,y+2*width/5,width/5,0,Math.PI);
                //brows
                this.brow(x+width/4,y+3*width/10,x+width/4+width/5,y+2*width/5,x+width/4+7*width/50,y+3*width/10);
                this.brow(x+53*width/100,y+16*width/50,x+297*width/500,y+16*width/50,x+281*width/500,y+9*width/25);
                this.brow(x+297*width/500,y+16*width/50,x+17*width/20,y+width/5,x+77*width/100,y+width/10)
                this.brow(x+39*width/100,y+7*width/10,x+67*width/100,y+16*width/25,x+51*width/100,y+37*width/50)
          },
            round:function(x,y,redius){
                context.beginPath();
                context.arc(x,y,redius,0,2*Math.PI,false)
                context.stroke()
            },
            eye:function(x,y,redius,start,end,direction){
                context.beginPath();
                context.arc(x,y,redius,start,end,false);
                context.closePath();
                context.stroke()
                context.beginPath();
                context.arc(x+6*redius/10,y,4*redius/10,0,Math.PI,false);
                context.stroke();
                context.fill()
            },
            brow:function(x1,y1,x2,y2,x3,y3){
                context.beginPath();
                context.moveTo(x1,y1);
                context.quadraticCurveTo(x3,y3,x2,y2)
                context.stroke();
            },
            mouth:function(){
                context.beginPath();
                context.moveTo(x1,y1);
                context.quadraticCurveTo(x3,y3,x2,y2)
                context.stroke();
            }
        }