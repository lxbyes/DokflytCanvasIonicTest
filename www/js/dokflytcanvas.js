'use strict';

var Dokflytcanvas = function(selector, bgImg, uiImg) {
    
    var face = {};
    
    var DEFAULT_SIZE = 4, DEFAULT_COLOR = '#ff3300';
    
    function getComputedLength(str) {
        return parseInt(str.substring(0, str.length - 2));
    }
        
    // set canvas size, equal to parent
    function setCanvasSize(canvas, parent) {        
        var parentStyle = getComputedStyle(parent);
        canvas.width = getComputedLength(parentStyle.width);
        canvas.height = getComputedLength(parentStyle.height);
    }
    
    function getX(e) {
        var rect = e.target.getBoundingClientRect();
        if(e.clientX) {
            return e.clientX - rect.left;
        }
        if(e.touches && e.touches.length > 0) {
            return e.touches[0].clientX - rect.left;
        }
        if(e.changedTouches && e.changedTouches.length > 0) {
            return e.changedTouches[0].clientX - rect.left;
        }
        // assert not excute
        return 0;
    };
    
    function getY(e) {
        var rect = e.target.getBoundingClientRect();
        if(e.clientY) {
            return e.clientY - rect.top;
        }
        if(e.touches && e.touches.length > 0) {
            return e.touches[0].clientY - rect.top;
        }
        if(e.changedTouches && e.changedTouches.length > 0) {
            return e.changedTouches[0].clientY - rect.top;
        }
        // assert not excute
        return 0;
    };
    
    var Pencil = function(uiCtx, paintCtx) {
        var start = {};
        var linePoints = [];
        var obj = {
            color: DEFAULT_COLOR,
            size: DEFAULT_SIZE,
            onPaintStart: function(e) {
                start.painting = true;
                start.painted = false;
                start.x = getX(e);
                start.y = getY(e);
                paintCtx.strokeStyle = this.color;
                paintCtx.lineWidth = this.size;
                uiCtx.strokeStyle = this.color;
                uiCtx.lineWidth = this.size;
                // Hide dashboard
                document.querySelector('.dashboard').style.display = 'none';         
            },
            onPaint: function(e) {
                if(start.painting) {
                    start.painted = true;
                    var x = getX(e);
                    var y = getY(e);
                    
                    linePoints.push({x: x, y: y});
                    // Reset each time
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);  
                    paintCtx.beginPath();
                    paintCtx.moveTo(start.x, start.y);              
                    for(var i in linePoints) {
                        var point = linePoints[i];
                        paintCtx.lineTo(point.x, point.y);
                    }
                    paintCtx.stroke();             
                }
            },
            onPaintEnd: function(e) {
                if(start.painting && start.painted) {
                    start.painting = false;
                    start.painted = false;
                    var x = getX(e);
                    var y = getY(e);            
                    
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    uiCtx.beginPath();
                    uiCtx.moveTo(start.x, start.y);
                    for(var i in linePoints) {
                        var point = linePoints[i];
                        uiCtx.lineTo(point.x, point.y);
                    }
                    uiCtx.stroke();
                    // Reset data
                    linePoints.length = 0;
                    cloneToStack();
                    
                    // Show tools: eraser, undo, clear, save
                    document.querySelector('.eraser-ctl').style.display = 'block';
                    document.querySelector('.undo-ctl').style.display = 'block'; 
                    document.querySelector('.clear-ctl').style.display = 'block';
                    document.querySelector('.save-ctl').style.display = 'block';              
                } 
                // Show dashboard
                document.querySelector('.dashboard').style.display = 'block';
            }
        };
        return obj;
    };
    
    var Rect = function(uiCtx, paintCtx) {
        var start = {};
        var obj = {
            color: DEFAULT_COLOR,
            size: DEFAULT_SIZE,
            onPaintStart: function(e) {
                start.painting = true;
                start.painted = false;
                start.x = getX(e);
                start.y = getY(e);
                paintCtx.strokeStyle = this.color;
                paintCtx.lineWidth = this.size;
                uiCtx.strokeStyle = this.color;
                uiCtx.lineWidth = this.size;
                // Hide dashboard
                document.querySelector('.dashboard').style.display = 'none';
            },
            onPaint: function(e) {
                if(start.painting) {
                    start.painted = true;
                    var x = getX(e);
                    var y = getY(e);
                    // Reset each time
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);                    
                    paintCtx.strokeRect(start.x, start.y, x - start.x, y - start.y);
                }
            },
            onPaintEnd: function(e) {
                if(start.painting && start.painted) {
                    start.painting = false;
                    start.painted = false;
                    var x = getX(e);
                    var y = getY(e);            
                    
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    uiCtx.strokeRect(start.x, start.y, x - start.x, y - start.y);
                    cloneToStack();
                    
                    // Show tools: eraser, undo, clear, save
                    document.querySelector('.eraser-ctl').style.display = 'block';
                    document.querySelector('.undo-ctl').style.display = 'block'; 
                    document.querySelector('.clear-ctl').style.display = 'block';
                    document.querySelector('.save-ctl').style.display = 'block';
                } 
                // Show dashboard
                document.querySelector('.dashboard').style.display = 'block';
            }
        };
        return obj;
    };
    
    var Ellipse = function(uiCtx, paintCtx) {
        var start = {};
        var obj = {
            color: DEFAULT_COLOR,
            size: DEFAULT_SIZE,
            onPaintStart: function(e) {
                start.painting = true;
                start.painted = false;
                start.x = getX(e);
                start.y = getY(e);
                paintCtx.strokeStyle = this.color;
                paintCtx.lineWidth = this.size;
                uiCtx.strokeStyle = this.color;
                uiCtx.lineWidth = this.size;
                // Hide dashboard
                document.querySelector('.dashboard').style.display = 'none';
            },
            onPaint: function(e) {
                if(start.painting) {
                    start.painted = true;
                    var x = getX(e);
                    var y = getY(e);
                    // Reset each time
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    paintCtx.save();                    
                    var a = Math.abs(x - start.x) / 2, b = Math.abs(y - start.y) / 2;
                    var r = (a > b) ? a : b;
                    var ratioX = a / r; //horizontal axis scaling ratio
                    var ratioY = b / r; //vertical axis scaling ratio
                    var centerX = (x + start.x) / 2;
                    var centerY = (y + start.y) / 2;
                    paintCtx.scale(ratioX, ratioY); //scaling
                    paintCtx.beginPath();
                    //Draw counterclockwise from the left point of the ellipse
                    paintCtx.moveTo((centerX + a) / ratioX, centerY / ratioY);
                    paintCtx.arc(centerX / ratioX, centerY / ratioY, r, 0, 2 * Math.PI);
                    paintCtx.closePath();
                    paintCtx.stroke();
                    paintCtx.restore();  
                }
            },
            onPaintEnd: function(e) {
                if(start.painting && start.painted) {
                    start.painting = false;
                    start.painted = false;
                    var x = getX(e);
                    var y = getY(e);            
                    
                    // reset
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    uiCtx.save();                    
                    var a = Math.abs(x - start.x) / 2, b = Math.abs(y - start.y) / 2;
                    var r = (a > b) ? a : b;
                    var ratioX = a / r; //horizontal axis scaling ratio
                    var ratioY = b / r; //vertical axis scaling ratio
                    var centerX = (x + start.x) / 2;
                    var centerY = (y + start.y) / 2;
                    uiCtx.scale(ratioX, ratioY); //scaling
                    uiCtx.beginPath();
                    //Draw counterclockwise from the left point of the ellipse
                    uiCtx.moveTo((centerX + a) / ratioX, centerY / ratioY);
                    uiCtx.arc(centerX / ratioX, centerY / ratioY, r, 0, 2 * Math.PI);
                    uiCtx.closePath();
                    uiCtx.stroke();
                    uiCtx.restore();
                    cloneToStack();
                    
                    // Show tools: eraser, undo, clear, save
                    document.querySelector('.eraser-ctl').style.display = 'block';
                    document.querySelector('.undo-ctl').style.display = 'block'; 
                    document.querySelector('.clear-ctl').style.display = 'block';
                    document.querySelector('.save-ctl').style.display = 'block';
                } 
                // Show dashboard
                document.querySelector('.dashboard').style.display = 'block';
            }
        };
        return obj;
    };
    
    var Arrow = function(uiCtx, paintCtx) {
        var start = {};
        var drawArrow = function(ctx, x0, y0, x1, y1) {
            var len = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
            // too short to process
            if(len < ctx.lineWidth * 5) {
                return;
            }
            // draw the line
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
                                
            ctx.save();
            // the angle to x axis
            var ang = Math.atan(Math.abs(y1 - y0)/Math.abs(x1 - x0));
            // move origin Coordinate to (x1, y1)
            ctx.translate(x1, y1);
            if(x1 >= x0 && y1 <= y0) {
                ctx.rotate(-ang);
            } else if(x1 >= x0 && y1 >= y0) {
                ctx.rotate(ang);
            } else if(x1 <= x0 && y1 <= y0) {
                ctx.rotate(Math.PI + ang);
            } else if(x1 <= x0 && y1 >= y0) {
                ctx.rotate(Math.PI - ang);
            }
            // draw the arrow head        
            ctx.beginPath();
            ctx.moveTo(ctx.lineWidth + 2, 0);
            ctx.lineTo(-ctx.lineWidth * 4, ctx.lineWidth * 2);
            ctx.lineTo(-ctx.lineWidth * 4, -ctx.lineWidth * 2);
            ctx.fill();
            ctx.restore();
        };
        var obj = {
            color: DEFAULT_COLOR,
            size: DEFAULT_SIZE,
            onPaintStart: function(e) {
                start.painting = true;
                start.painted = false;
                start.x = getX(e);
                start.y = getY(e);
                paintCtx.strokeStyle = this.color;
                paintCtx.fillStyle = this.color;
                paintCtx.lineWidth = this.size;
                uiCtx.strokeStyle = this.color;
                uiCtx.fillStyle = this.color;
                uiCtx.lineWidth = this.size;
                // Hide dashboard
                document.querySelector('.dashboard').style.display = 'none';       
            },
            onPaint: function(e) {
                if(start.painting) {
                    start.painted = true;
                    var x = getX(e);
                    var y = getY(e);
                    // Reset each time
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    drawArrow(paintCtx, start.x, start.y, x, y);
                }
            },
            onPaintEnd: function(e) {
                if(start.painting && start.painted) {
                    start.painting = false;
                    start.painted = false;
                    var x = getX(e);
                    var y = getY(e);            
                    
                    // reset
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    drawArrow(uiCtx, start.x, start.y, x, y);
                    cloneToStack();
                   
                    // Show tools: eraser, undo, clear, save
                    document.querySelector('.eraser-ctl').style.display = 'block';
                    document.querySelector('.undo-ctl').style.display = 'block'; 
                    document.querySelector('.clear-ctl').style.display = 'block';
                    document.querySelector('.save-ctl').style.display = 'block';
                } 
                // Show dashboard
                document.querySelector('.dashboard').style.display = 'block';
            }
        };
        return obj;
    };
    
    var Eraser = function(uiCtx) {
        var start = {};
        var lastPoint = {};
        var obj = {
            color: 'white',
            size: DEFAULT_SIZE,
            onPaintStart: function(e) {
                start.painting = true;
                start.painted = false;
                lastPoint.x = start.x = getX(e);
                lastPoint.y = start.y = getY(e);
                uiCtx.strokeStyle = this.color;
                uiCtx.lineWidth = this.size;
                uiCtx.globalCompositeOperation = 'destination-out'; 
                // Hide dashboard
                document.querySelector('.dashboard').style.display = 'none';   
            },
            onPaint: function(e) {
                if(start.painting) {
                    start.painted = true;
                    var x = getX(e);
                    var y = getY(e);
                    uiCtx.beginPath();
                    uiCtx.moveTo(lastPoint.x, lastPoint.y);
                    uiCtx.lineTo(x, y);
                    uiCtx.stroke();
                    lastPoint.x = x;
                    lastPoint.y = y;
                }
            },
            onPaintEnd: function(e) {
                if(start.painting && start.painted) {
                    start.painting = false;  
                    start.painted = false;  
                    // recover
                    uiCtx.globalCompositeOperation = 'source-over';
                    cloneToStack();                                                                                        
                } 
                // Show dashboard
                document.querySelector('.dashboard').style.display = 'block';
            }
        };
        return obj;
    };
    
    var MarkPanel = function(uiCtx, paintCtx) {
        var start = {};
        var obj = {
            color: DEFAULT_COLOR,
            size: DEFAULT_SIZE,
            onPaintStart: function(e) {
                start.painting = true;
                start.painted = false;
                start.x = getX(e);
                start.y = getY(e);
                // Hide dashboard
                document.querySelector('.dashboard').style.display = 'none';
            },
            onPaint: function(e) {
                if(start.painting) {
                    start.painted = true;
                    var x = getX(e);
                    var y = getY(e);
                    // Reset each time
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    var w = x - start.x;
                    var h = y - start.y;
                    var mark = document.querySelector('.mark-box img.active');
                    paintCtx.drawImage(mark, start.x, start.y, w, h); 
                }
            },
            onPaintEnd: function(e) {
                if(start.painting && start.painted) {
                    start.painting = false;
                    start.painted = false;
                    var x = getX(e);
                    var y = getY(e);            
                    
                    // reset
                    paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                    var w = x - start.x;
                    var h = y - start.y;
                    var mark = document.querySelector('.mark-box img.active');
                    uiCtx.drawImage(mark, start.x, start.y, w, h);
                    cloneToStack();
                    
                    // Show tools: eraser, undo, clear, save
                    document.querySelector('.eraser-ctl').style.display = 'block';
                    document.querySelector('.undo-ctl').style.display = 'block'; 
                    document.querySelector('.clear-ctl').style.display = 'block';
                    document.querySelector('.save-ctl').style.display = 'block';
                } 
                // Show dashboard
                document.querySelector('.dashboard').style.display = 'block';
            }
        };
        return obj;
    };
    
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    var oriWidth, oriHeight, bgScale, oriScale;
        
    var sketch = document.querySelector(selector);

    var bgCanvas = document.createElement('canvas');
    var uiCanvas = document.createElement('canvas');
    var paintCanvas = document.createElement('canvas');

    var bgCtx = bgCanvas.getContext('2d');
    var uiCtx = uiCanvas.getContext('2d');
    var paintCtx = paintCanvas.getContext('2d');
    
    var paintTools = {};    
    paintTools['rect'] = Rect(uiCtx, paintCtx);
    paintTools['pencil'] = Pencil(uiCtx, paintCtx);
    paintTools['ellipse'] = Ellipse(uiCtx, paintCtx);
    paintTools['arrow'] = Arrow(uiCtx, paintCtx);
    paintTools['eraser'] = Eraser(uiCtx, paintCtx);
    paintTools['mark'] = MarkPanel(uiCtx, paintCtx);
    var brushButtons = document.querySelectorAll('.dashboard .brush i'),
        sizeButtons = document.querySelectorAll('.dashboard .size i'),
        paintCtrls = document.querySelectorAll('.dashboard .paint-ctl div');
    var currentTool;
    var stack = new Array();

    var defineSize = function(width, height, top, left) {
        // UI layer
        uiCanvas.classList.add('ui-layer');
        uiCanvas.width = width;
        uiCanvas.height = height;
        uiCanvas.style.position = 'absolute';
        uiCanvas.style.top = top.toString() + 'px';
        uiCanvas.style.left = left.toString() + 'px';
        uiCanvas.style.zIndex = 2;
        // keep repainting on canvas layer
        paintCanvas.classList.add('paint-layer');
        paintCanvas.width = width;
        paintCanvas.height = height;
        paintCanvas.style.position = 'absolute';
        paintCanvas.style.top = top.toString() + 'px';
        paintCanvas.style.left = left.toString() + 'px';
        paintCanvas.style.zIndex = 3;
        paintCanvas.style.cursor = 'crosshair';
        
        // add to sketch
        sketch.appendChild(bgCanvas);
        sketch.appendChild(uiCanvas);
        sketch.appendChild(paintCanvas);
    }
    
    var cloneToStack = function() {
        var c = document.createElement('canvas');
        c.width = uiCanvas.width;
        c.height = uiCanvas.height;  
        c.getContext('2d').drawImage(uiCanvas, 0, 0, c.width, c.height);
        stack.push(c);
    };
    
    var backToLastCanvas = function() {
        // clear the ui canvas
        uiCanvas.width = uiCanvas.width;
        stack.pop();
        if(stack.length === 0) {
            // Hide tools
            document.querySelector('.eraser-ctl').style.display = 'none';
            document.querySelector('.undo-ctl').style.display = 'none';
            document.querySelector('.clear-ctl').style.display = 'none';
            document.querySelector('.save-ctl').style.display = 'none';
            document.querySelector('.mark-box').style.display = 'none';
            document.querySelector('.size').style.display = 'none';
            document.querySelector('.color').style.display = 'none';
            document.querySelector('.brush').style.display = 'none';
            return;
        }        
        var canvas = stack[stack.length - 1];
        if(canvas) {            
            // repaint the canvas
            uiCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        }        
    };
    
    var selectTool = function(selector, dom) {
        if(paintTools[selector]) {
            currentTool = paintTools[selector];
            activeSizeButton(currentTool.size);
            if(dom) {
                resetActive(dom);
            }
        } else {
            currentTool = null;
        }
    };    
    
    var pickColor = function(color) {
        if(currentTool) {
            currentTool.color = color;           
        }
        resetColor(color);
    };
    
    var changePaintToolSize = function(size) {
        if(currentTool) {
            currentTool.size = size;
        }
    };
    
    var activeSizeButton = function(size) {
        if(!size) {
            return;
        }
        var sizeBtns = document.querySelectorAll('.dashboard .size i');
        for(var i = 0; i < sizeBtns.length; i ++) {
            var s = parseInt(sizeBtns[i].getAttribute('data-size'));
            if(s === size) {
                resetActive(sizeBtns[i]);
                return;
            }
        }   
        resetColor(currentTool.color);     
    };   
    
    var resetActive = function(item) {
        if(item) {
            var parent = item.parentNode;
            if(parent) {
                var oldActive = parent.querySelector('.active');                
                if(oldActive) {
                    oldActive.classList.remove('active');
                }
            }
            item.classList.add('active');
        }
        resetColor(currentTool.color);
    };
    
    var resetColor = function(color) {
        for(var i = 0; i< brushButtons.length; i++) {
            var brushBtn = brushButtons[i];
            if(brushBtn.className.indexOf('active') != -1) {
                brushBtn.style.backgroundColor = color;
            } else {
                brushBtn.style.backgroundColor = null;
            }
        }
        for(var i = 0; i< sizeButtons.length; i++) {
            var sizeBtn = sizeButtons[i];
            if(sizeBtn.className.indexOf('active') != -1) {
                sizeBtn.style.backgroundColor = color;
            } else {
                sizeBtn.style.backgroundColor = null;
            }
        }
    };

    // Paint controllers
    var onCtrlClick = function() {
        var that = this;
            
        if(that.className.indexOf('brush-ctl') !== -1) {
            var dom = document.querySelector('.dashboard .brush i.active');
            selectTool(dom.getAttribute('data-op'));
            document.querySelector('.mark-box').style.display = 'none';
            document.querySelector('.size').style.display = 'block';
            document.querySelector('.color').style.display = 'block';
            document.querySelector('.brush').style.display = 'block';
        } else if(that.className.indexOf('eraser-ctl') !== -1) {
            selectTool('eraser');
            document.querySelector('.mark-box').style.display = 'none';
            document.querySelector('.color').style.display = 'none';
            document.querySelector('.brush').style.display = 'none';
            document.querySelector('.size').style.display = 'block';          
        } else if(that.className.indexOf('undo-ctl') !== -1) {
            // undo
            backToLastCanvas();
        } else if(that.className.indexOf('picture') !== -1) {
            var fileInput = that.querySelector('input[type="file"]');
            fileInput.click();           
        } else if(that.className.indexOf('save-ctl') !== -1) {
            saveAsImage();
        } else if(that.className.indexOf('clear-ctl') !== -1) {
            uiCanvas.width = paintCanvas.width;
            stack.length = 0;
            // Hide tools
            document.querySelector('.eraser-ctl').style.display = 'none';
            document.querySelector('.undo-ctl').style.display = 'none';
            document.querySelector('.clear-ctl').style.display = 'none';
            document.querySelector('.save-ctl').style.display = 'none';
            document.querySelector('.size').style.display = 'none';
            document.querySelector('.color').style.display = 'none';
            document.querySelector('.brush').style.display = 'none';
        } else if(that.className.indexOf('mark-ctl') !== -1) {
            selectTool('mark');
            document.querySelector('.mark-box').style.display = 'block';
            document.querySelector('.size').style.display = 'none';
            document.querySelector('.color').style.display = 'block';
            document.querySelector('.brush').style.display = 'none';
        }
    };

    // click on brush
    var onBrushClick = function() {
        var that = this;
            
        if(that.className.indexOf('paint') !== -1) {
            selectTool(that.getAttribute('data-op'), that);
            document.querySelector('.size').style.display = 'block';
            document.querySelector('.color').style.display = 'block';           
        } else if(that.className.indexOf('eraser') !== -1) {
            selectTool(that.getAttribute('data-op'), that);
            document.querySelector('.size').style.display = 'block';
            document.querySelector('.color').style.display = 'none';
        } else if(that.className.indexOf('undo') !== -1) {
            // undo
            backToLastCanvas();
        } else if(that.className.indexOf('picture') !== -1) {
            var fileInput = that.querySelector('input[type="file"]');
            fileInput.click();           
        } else if(that.className.indexOf('save') !== -1) {
            saveAsImage();
        } else if(that.className.indexOf('clear') !== -1) {
            uiCanvas.width = paintCanvas.width;
            stack.length = 0;
        }
    };
       
    // click on size
    var onSizeClick = function() {
        var that = this;
        resetActive(that);
        changePaintToolSize(parseInt(that.getAttribute('data-size')));
    };
    
    var onColorPanelClick = function(e) {
        var color = this.getAttribute('data-color');
        pickColor(color);
        // TODO: improve
        if(currentTool === paintTools['mark']) {
            var cur = document.querySelector('.mark-box img.active');
            cur.src = '../images/mark/mark_' + cur.getAttribute('data-mark') + '_' + this.getAttribute('data-mark') + '.png';
        }
    };
    
    var drawImage = function(img) {
        if(img) {
            // clear the data
            bgCanvas.width = bgCanvas.width;
            bgCtx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
        }        
    };
        
    var saveAsImage = function() {       
        //paintCtx.width = paintCtx.width;
        //paintCtx.drawImage(bgCanvas, 0, 0, bgCanvas.width, bgCanvas.height);
        //paintCtx.drawImage(uiCanvas, 0, 0, uiCanvas.width, uiCanvas.height);
                
        // save and download original image + canvas image (as jpeg)
        //var all = document.createElement('a');
        //all.href = paintCanvas.toDataURL('image/jpeg');
        //all.download = new Date() + '.jpeg';
        //all.click();
        // save and download original image (as jpeg)
        //var bg = document.createElement('a');
        //bg.href = bgCanvas.toDataURL('image/jpeg');
        //bg.download = new Date() + '_bg.png';
        //bg.click();
        // save and download canvas image (as png)
        //var ui = document.createElement('a');
        //ui.href = uiCanvas.toDataURL('image/png');
        //ui.download = new Date() + '_ui.png';
        //ui.click();
        //if(face.onSaveAsImage) {
        //    face.onSaveAsImage(bgCanvas.toDataURL('image/jpeg'), uiCanvas.toDataURL('image/png'), paintCanvas.toDataURL('image/jpeg'));
        //}

        // create an new canvas for ui layer
        var uiLayer = document.createElement('canvas'),
            uiCtx = uiLayer.getContext('2d');

        uiLayer.width = oriWidth;
        uiLayer.height = oriHeight;

        var ui = new Image();
        ui.src = uiCanvas.toDataURL('image/png');
        uiCtx.drawImage(ui, 0, 0, oriWidth, oriHeight);

        // uncomment if want to download
        // var uiImgDownload = document.createElement('a');
        // uiImgDownload.href = uiLayer.toDataURL();
        // uiImgDownload.download = new Date() + '_ui.png';
        // uiImgDownload.click();

        // return canvas image base64 code
        return uiLayer.toDataURL();
    };
    
    var dashboard = {
        isHidden: false,
        toggle: function() {
            var db = sketch.querySelector('.dashboard');
            this.isHidden = !this.isHidden;
            if(this.isHidden) {
                db.style.display = 'none';
            } else {
                db.style.display = 'block';
            }
        }
    };
    
    var init = function() {
        // when init, select the default tool
        selectTool('pencil', document.getElementById('default-tool'));
        for(var i = 0; i < paintCtrls.length; i++) {
            paintCtrls[i].addEventListener('click', onCtrlClick, false);
        } 

        for(var i = 0; i < brushButtons.length; i++) {
            brushButtons[i].addEventListener('click', onBrushClick, false);
        }    
    
        for(var i = 0; i < sizeButtons.length; i++) {
            sizeButtons[i].addEventListener('click', onSizeClick, false);
        }
        
        var colorBtns = document.querySelectorAll('.dashboard .color i');
        for(var i = 0; i < colorBtns.length; i ++) {
            colorBtns[i].addEventListener('click', onColorPanelClick, false);
        }
        
        var markImgs = document.querySelectorAll('.mark-box img');
        for(var i = 0; i < markImgs.length; i ++) {
            markImgs[i].addEventListener('click', function() {
                document.querySelector('.mark-box img.active').classList.remove('active');
                this.classList.add('active');
            }, false);
        }
        
        //document.querySelector('.dashboard .brush input[type="file"]').addEventListener('change', function(e) {
        //    var that = this;
        //    var files = that.files;
        //    if(files && files.length >= 1) {
        //        var file = files[0];
        //        var reader = new FileReader();
        //        reader.onload = function(e) {
        //            var img = new Image();
        //            img.src = e.target.result;
        //            img.onload = function() {
        //                drawImage(img);
        //            };                   
        //        }
        //        reader.readAsDataURL(file);
        //    }
        //}, false);
        
        // event cycle, add to paint canvas
        paintCanvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaintStart(e);
                paintCanvas.style.zIndex = 6;
            }        
        });
           
        paintCanvas.addEventListener('mousemove', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaint(e); 
            }
        });
        
        paintCanvas.addEventListener('mouseup', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaintEnd(e);
                paintCanvas.style.zIndex = 3;   
            }    
        });
    
        paintCanvas.addEventListener('mouseout', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaintEnd(e);
                paintCanvas.style.zIndex = 3;
            } 
        });
        
        paintCanvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaintStart(e);
                paintCanvas.style.zIndex = 6;
            }        
        });
        
        paintCanvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaint(e); 
            }
        });
    
        paintCanvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaintEnd(e);
                paintCanvas.style.zIndex = 3;
            }
        });
           
        paintCanvas.addEventListener('touchcancel', function(e) {
            e.preventDefault();
            if(currentTool) {
                currentTool.onPaintEnd(e);
                paintCanvas.style.zIndex = 3;
            }  
        });
           
        bgCtx.fillStyle = 'transparent';
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        if(bgImg) {
            var oriImg = new Image();
            oriImg.src = bgImg;
            oriImg.onload = function() {
                var width, height, top, left;
                oriWidth = oriImg.width;
                oriHeight = oriImg.height;
                bgScale = screenWidth / screenHeight;
                oriScale = oriWidth / oriHeight;
                if (bgScale > oriScale) {
                    width = (screenHeight - t) * oriScale;
                    height = (screenHeight - t);
                    top = 0;
                    left = screenWidth / 2 - (screenHeight - t) * oriScale / 2;
                } else {
                    width = screenWidth;
                    height = screenWidth / oriScale;
                    top = screenHeight / 2 - screenWidth / oriScale / 2;
                    left = 0;
                }
                bgCanvas.classList.add('bg-layer');
                bgCanvas.width = width;
                bgCanvas.height = height;
                bgCanvas.style.position = 'absolute';
                bgCanvas.style.top = top.toString() + 'px';
                bgCanvas.style.left = left.toString() + 'px';
                bgCanvas.style.zIndex = 1;

                bgCtx.drawImage(oriImg, 0, 0, width, height);
                defineSize(width, height, top, left);

                if(uiImg) {
                    var canvasImg = new Image();
                    canvasImg.src = uiImg;
                    canvasImg.onload = function() {
                        uiCtx.drawImage(canvasImg, 0, 0, width, height);
                        cloneToStack();
                    };
                }
            }
        } else {
            console.log('Please add a background image first!');
        }
    };
    init();
    
    return face;
};
