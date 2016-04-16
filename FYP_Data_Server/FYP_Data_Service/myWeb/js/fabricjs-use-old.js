var canvas;

  fabric.Object.prototype.toObject = (function (toObject) {
      return function () {
        //if (this.get('type') === 'group'){
          return fabric.util.object.extend(toObject.call(this), {
            //foo: 123
              //"PrKnowledge Point name": this.item(1).text
          });
        //}
      };
  })(fabric.Object.prototype.toObject);

  fabric.Group.prototype.toObject = (function (toObject) {
      return function () {
        var circle = this.item(0);
        var text = this.item(1);
        var parents = circle.flowout;
        var children = circle.flowin;
        if (parents){

        }
        return {
          "Knowledge Point name": text.text,
          "Priority": circle.radius,
          "Knowledge point location X": circle.left,
          "Knowledge point location Y": circle.top,
          "Knowledge point parents": null 
        };
        //}
      };
  })(fabric.Group.prototype.toObject);

  /*$("#select").click(function(){
      canvas.isDrawingMode = false;
      canvas.selection= true;
      alert("Select Mode");
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
      canvas.forEachObject(function(o){ o.setCoords()});
  });*/


  var line, isDown;
  // select drawing method
  var drawingTool;

  var origX, origY;

  var radius;

  var eventObj, eventX, eventY;

  var selectMode = false;

  var textediting = false;
  /* pan */
  //var PanModeByMouse = false;

  function priority(priority){
    var radius;
    if (priority === "High-priority")
      radius = 100;
    else if (priority === "Medium-priority")
      radius = 80;
    else radius = 60;
    return radius;
  }

  // set onSelect-ed tool
  function onSelect(name){
    //return function(){
      drawingTool = name;
      //alert("Select " + name);
      if (name === "select"){
        // switch to dragging mode
        canvas.isDrawingMode = false;
        selectMode = true;
        // why after double click, object cannot be moved?
        // OK
        // why cannot edit text but text is selected? 
        // OK
        // WHY after edited, it goes to (0,0) and duplicted
        canvas.forEachObject(function(o){ 
          if (o.get('type') === 'group') {
            var group = o;
            // set selectable normal display
            group.set({
              selectable: true,
              hasControls: false,
              hasBorders: true,
              lockMovementX: false,
              lockMovementY: false
            });
            var circle = group.item(0);
            var text = group.item(1);
            // WHY cannot triggrt 'object:moving' after ungroup & regroup???
			group.on('mousedown', dblClickHandler(group, dblClickCallback));
            /*group.on('mousedown', dblClickHandler(group, function (obj) {

              textEditHandler (group, text);

              text.on('editing:exited', function () {
                var items = [];
                //canvas.forEachObject(function (object) {
                    items.push(circle);
                    canvas.remove(circle);
                    items.push(text);
                    canvas.remove(text);
                //});
                var x = circle.get('left');
                var y = circle.get('top');
                var grp = new fabric.Group(items, {
                  left: x,
                  top: y,
                  hasRotatingPoint: false,
                  lockScalingX: true,
                  lockScalingY: true,
                  hasControls: false,
                  selectable: true,
                  hasBorders: true
                  // assign arrows
                  //flowin: circle.flowin,
                  //flowout: circle.flowout
                });
                canvas.add(grp);
                //textediting = false;
                console.log("item(0).flowin length = " + circle.flowin.length + "; item(0).flowout length = " + circle.flowout.length);
                grp.on('mousedown', dblClickHandler(grp, function (object) {
                    textEditHandler (grp, text);
                    console.log("Double click");
                }));
              });
            }
            ));*/
            //o.selectable = true;
          } else {
			  // arrows
			  o.set({
              selectable: true,
              hasControls: false,
              hasBorders: true,
              lockMovementX: true,
              lockMovementY: true
            });
		  }
          o.setCoords();       
        });

      }else if(name === 'arrow'){
        console.log("onSelect name = " + name);
        // disable group selection
        canvas.selection = false;
        // indicate not in PAN mode
        selectMode = false;
          canvas.forEachObject(function(o){ 
          if (o.get('type') == 'group') {
            var group = o;
            // not display as selected
            group.set({
              selectable: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true
            });
          }
        });
        $("#text").addClass("hide");
      } else if (name === 'pan'){
        console.log("onSelect name = " + name);
        PanModeByMouse = true;
        $("#text").addClass("hide");
      } else {
        // switch to edit mode
        //canvas.isDrawingMode = true;
        canvas.selection = false;
        selectMode = false;
        // alert("selection is false");
        canvas.forEachObject(function(o) {
          o.selectable = false;
        });
        //canvas.on('mouse:down');
        //canvas.on('mouse:move');
        //canvas.on('mouse:up');
        $("#text").addClass("hide");
      }      
    //};

  };

  // from http://jsfiddle.net/srshah23/3pwb2404/2/
  function dblClickHandler (object, handler){
    return function () {
        if (object.clicked) 
          handler(object);
        else {
            object.clicked = true;
            setTimeout(function () {
                object.clicked = false;
            }, 500);
        }
    };
  }
  
 // TRY
   function dblClickCallback(object){
    if (!selectMode) return;
    //alert("text selected!");
    var object = canvas.getActiveObject();
    console.log(" object.length = " + object._objects.length);
    console.log("[dblClickCallback] selectMode = " + selectMode + "; object = " + object);

    if (object != null && object.get('type') === 'group'){
      var circle = object.item(0);
      var text = object.item(1);


      textEditHandler (object, text);

      /*text.on('editing:entered', function (){

      });*/

      text.on('editing:exited', function () {
        // format text
        var temp_text = text.get('text').replace(/\n/g, " ");
        var return_text = formatText(temp_text);
        text.set({text: return_text});

        var items = [];
        //canvas.forEachObject(function (object) {
        console.log("[Exit] x = " + circle.get('left') + " y = " + circle.get('top'));
            items.push(circle);
            canvas.remove(circle);
            items.push(text);
            canvas.remove(text);
        //});
        console.log("[Exit] items length = " + items.length + " x = " + circle.get('left') + " y = " + circle.get('top'));
        var x = circle.get('left');
        var y = circle.get('top');
        var grp = new fabric.Group(items, {
          left: x,
          top: y,
          hasRotatingPoint: false,
          lockScalingX: true,
          lockScalingY: true,
          hasControls: false,
          selectable: true,
          hasBorders: true
        });
        canvas.add(grp);
		grp.on('mousedown', dblClickHandler(grp, dblClickCallback));
        // IMPORTANT!
        // otherwise trigger multiple times
        text.off('editing:exited');
        console.log("[Add group] item(0).flowin length = " + circle.flowin.length + "; item(0).flowout length = " + circle.flowout.length);
        canvas.setActiveObject(grp);
        textediting = false;
      });
    }	  
  }

  function textEditHandler(groupObj, textObj){
    // alert("textEditHandler " + groupObj + " ");
    ungroup(groupObj);
    canvas.setActiveObject(textObj);
    textObj.enterEditing();
    textObj.selectAll();
    textediting = true;
    console.log("[Handler] groupObj.item(0).x = " + groupObj.item(0).get('left'));
  }

  function ungroup(groupObj) {
    var items = groupObj._objects;
    groupObj._restoreObjectsState();
    canvas.remove(groupObj);
    for (var i = 0; i < items.length; i++) {
        canvas.add(items[i]);
    }
    console.log("[Ungrouping] " + items.length + " items; items.get x = " + items[0].get('left') + "item(0).flowin " + items[0].flowin.length);
    // if you have disabled render on addition
    canvas.renderAll();
};

  function getCoordinates(event){
    var coor;
    //var object = canvas.getActiveObject();
    // findTarget can find ALL mouseevent (including mouse:moving ~ yeah~ )
    var object = canvas.findTarget(event, false);
    //console.log("selected " + object);
    if (object != null){
      if (object.get('type') === 'group'){
        //var top = object.get('top');
        //var left = object.get('left');
        var center = object.getCenterPoint();
        var from = new fabric.Point(center.x, center.y);
        // var from.y = center.y;
        coor = new fabric.Point(from.x, from.y);
      }
      else
        coor = null;
    }
    else { 
      coor = null;
    }
    return coor;
  }

  function findBoundary(sx, sy, ex, ey, r){
    var slope = findSlope(sx, sy, ex, ey);
    var distance = findDistance(sx, sy, ex, ey);
    var coor;
    // var ratio = (distance - r) / distance;
    //var x = ex + ((distance - r) * (sx - ex)) / distance;
    //var y = ey + ((distance - r) * (sy - ey)) / distance;
    // +8 for not touching the circle
    var x = ex + ((r + 8) * (sx - ex)) / distance;
    var y = ey + ((r + 8) * (sy - ey)) / distance;
    coor = new fabric.Point(x, y);
    return coor;
  }

  function findSlope(sx, sy, ex, ey){
    var m = (sx - ex) / (sy - ey);
    return m;
  }

  function findDistance(sx, sy, ex, ey){
    dx = Math.abs(sx - ex);
    dy = Math.abs(sy - ey);
    var distance = Math.sqrt(dx*dx + dy*dy);
    return distance;
  }
  //alert("Canvas (" + canvas.width +"x"+ canvas.height);

  /*function assignInToCircle(object, arrow){
    //var object = canvas.findTarget(event, false);
    if (object != null){
      if (object.get('type') === 'group'){
        console.log("assignInToCircle = " + arrow);
        object.item(0).flowin.push(arrow);
      }
    }
  }

  function assignOutToCircle(object, arrow){
    //var object = canvas.findTarget(event, false);
    if (object != null){
      if (object.get('type') === 'group'){
        console.log("assignOutToCircle = " + arrow);
        object.item(0).flowout.push(arrow);
      }
    }
  }*/

  function removeAssignArrow(object, arrow, type){
    //var object = canvas.findTarget(event, false);
    //console.log("removeAssignArrow object = " + object);
    if (object != null){
      if (object.get('type') === 'group'){
        //console.log("removeAssignArrow type = group");
        // IF on move move did not hit the circle, it should be the last added item
        //object.item(0).flowin.pop();
        if (type === 0){
          var inarrows = object.item(0).flowin;
          // find index
          var index = inarrows.indexOf(arrow);
          //console.log("inarrows length = " + inarrows.length);
          if(index != -1) {
            // (position where new elements should be added (spliced in), how many elements should be removed)
            inarrows.splice(index, 1);
            //console.log("APLICE inarrows length = " + inarrows.length);
            object.item(0).flowin = inarrows;
          }
        } else {
          var outarrows = object.item(0).flowout;
          // find index
          var index = outarrows.indexOf(arrow);
          if(index != -1) {
            // (position where new elements should be added (spliced in), how many elements should be removed)
            outarrows.splice(index, 1);
            object.item(0).flowout = outarrows;  
          }
        }
      }
    }
  }

  function sendRequest(x, y, r){
    var currenttime = new Date();
    //var milliseconds = formatDate(currenttime);//currenttime.toLocaleString();
    //console.log("Current time = " + currenttime);
    var result = insertNewKnowledgePoint(x, y, r, currenttime); //listOfKnowledgePoints[0].create);
    /*console.log("sendRequest = " + result);
    if (result){
      var newid = retrieveNewId(currenttime);
    }*/
  }

  function insertNewKnowledgePoint(x, y, r, time){
    var prior;

    if ( r === 100)
      prior = priorityType.High; //"High";
    else if ( r === 80)
      prior = priorityType.Medium; //"Medium";
    else prior = priorityType.Low; //"Low";
    console.log("prior = " + prior + ", posX = " + x + " posY = " + y + "; Current time = " + time);
    var parents = [];
    var temptime = formatDate(time);
    var tempKP = createOneKP(-1, "Title", prior, parseInt(x), parseInt(y), parents, temptime, temptime);

    console.log(JSON.stringify({
        updatedKnowledgePoint: tempKP
        }));
    $.ajax({
      type: "POST",
      url: '../FYPGetDataService.svc/updateKnowledgePoint',
      processData: true,
      data: JSON.stringify({
        updatedKnowledgePoint: tempKP
        }),
      dataType: 'json',     //'application/json',
      contentType: "application/json",
      success: function(response){
        console.log(JSON.stringify(response));
        listOfKnowledgePoints.push(tempKP);
        retrieveNewId(time, handleRetrieveNewId);
      },
      error: function (xhr, ajaxOptions, thrownError) {
          console.log(xhr.status);
          console.log("error:  " + thrownError);
      },
      failure: function (response) {
        console.log(response.d);

      }
    });

  }

  function handleRetrieveNewId(newid, currenttime){
    var formatted = formatDate(currenttime);
    console.log("[handleRetrieveNewId] newid = " + newid + ", formatted = " + formatted);
    if (newid != undefined){
      var result = $.grep(listOfKnowledgePoints, function (o){
        console.log("(create, lastmodified) = (" + o.create + ", " + o.lastmodified + ")");
        return o.create === formatted && o.lastmodified === formatted;
      });

      if (result == undefined || result.length > 1){
        console.log("Error! " + result.length + " cannot found!");
      }else if (result.length = 1){
        //result[0].id = newid;
        console.log("result.name " + result[0].name + " changes result[0].id(" + result[0].id + ") to " + newid);
		result[0].id = newid;
		// TODO
		// change fabric.js object id also
		activeKP.item(0).set({
			'id': newid
		});
		console.log("activeKP.item(0).get('id') = " + activeKP.item(0).get('id'));
      }
    }

  }

  function retrieveNewId(currenttime, handler){
    var id;
    $.ajax({
      type: "GET",
      url: '../FYPGetDataService.svc/GetKnowledgePointList/'+courseCode+'_'+courseNumber,
      processData: true,
      //date: {'course code': course, 'course number': 'L1'},
      dataType: 'json',     //'application/json',
      success: function(data){
        console.log("[retrieveNewId] success!");
        
      },error: function (xhr, ajaxOptions, thrownError) {
        console.log("error:  " + thrownError);
      },
    }).done(function(data) {
      var temp = JSON.stringify(data);
      console.log("Get JSON data = " + temp); 
      var newid = findNewKnowledgePointId(temp, currenttime);
      handler(newid, currenttime);
    });

  }

  function findNewKnowledgePointId(json, targettime){
    var object = $.parseJSON(json);
    var array = object.GetKnowledgePointListResult;

    var formatted = formatDate(targettime);
    console.log("time = " + targettime + ", formatted = " + formatted);
    var id;
    $.each(array, function (i, value){
      if (array[i]["Knowledge Point name"] === "Title"){
		console.log("[findNewKnowledgePointId]");
        console.log("array[i]['Knowledge Point name'] === 'Title'");
		console.log("array[i]['Date of create'] = " + array[i]["Date of create"] + " " + array[i]["Date of last modified"]);
        if ((formatted.localeCompare(array[i]["Date of create"]) == 0) && (formatted.localeCompare(array[i]["Date of last modified"]) === 0)){
          console.log("id found!");
          id = array[i]["Knowledge Point ID"];
        }
      }
    });

    console.log("findNewKnowledgePointId = " + id);
    if (id == undefined)
      alert("Error! ID not found!");
    return id;
  }

  function sendKnowledgePointDeletion(delete_id){
    var id = delete_id;
    $.ajax({
      type: "GET",
      url: '../FYPGetDataService.svc/deleteKnowledgePoint/'+id/*courseCode+'_'+courseNumber*/,
      processData: true,
      //date: {'course code': course, 'course number': 'L1'},
      dataType: 'json',     //'application/json',
      success: function(data){
        console.log("[sendKnowledgePointDeletion] success!");
        
      },error: function (xhr, ajaxOptions, thrownError) {
        console.log("[sendKnowledgePointDeletion] error:  " + thrownError);
      }
    });
    console.log("[sendKnowledgePointDeletion] delete id = " + delete_id);
  }

$(document).ready(function(){

  var courseCode = "COMP";
  var courseNumber = "2611";

  fabric = (function(f) { 
    var nativeOn = f.on;
    var dblClickSubscribers = []; 
    var nativeCanvas = f.Canvas;   

    f.Canvas = (function(domId, options) { 
      var canvasDomElement = document.getElementById(domId); 
      var c = new nativeCanvas(domId, options);   
      c.dblclick = function(handler) { 
        dblClickSubscribers.push(handler) 
      };   
      canvasDomElement.nextSibling.ondblclick = function(ev){ 
        for(var i = 0; i < dblClickSubscribers.length; i++) { 
          console.log(ev); 
          dblClickSubscribers[i]({ 
            e :ev 
          }); 
        } 
      }; 
      return c; 
    });   
    return f; 
  }(fabric));


  // from https://groups.google.com/forum/#!topic/fabricjs/KnBs8VApqQo

  canvas = new fabric.Canvas('canvas', { 
    selection: false,
    backgroundColor: '#F0F0F0'
  });

  // offset of canvas
  //var offset = canvas.offset();
  
  (function(){
    // resize fabric's canvas by using its object and window innerWidth and innerHeight
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
      canvas.setHeight(1000);
      //canvas.setHeight(window.innerHeight * 0.9);
      canvas.setWidth(window.innerWidth * 0.85);
      canvas.renderAll();
    }

    // resize on init
    resizeCanvas();
  })();

  /*canvas.setHeight(1000);
  canvas.setWidth(window.innerWidth * 0.8);
  canvas.renderAll();*/

  //console.log("height = " + canvas.height);

  $("#workarea-canvas-container").onscroll = function() {
      canvas.calcOffset();
    };

/*_initEventListeners: function() {
  var self = this;
  self.callSuper('_initEventListeners');

  addListener(self.upperCanvasEl, 'dblclick', self._onDoubleClick);
}
_onDoubleClick: function(e) {
  var self = this;

  var target = self.findTarget(e);
  self.fire('mouse:dblclick', {
    target: target,
    e: e
  });

  if (target && !self.isDrawingMode) {
    // To unify the behavior, the object's double click event does not fire on drawing mode.
    target.fire('object:dblclick', {
      e: e
    });
  }

  alert ("Target: " + e.className);
}*/

  //
  // TRY
  // ADDing new Class
  // Line with Arrow
  //
  // from https://groups.google.com/forum/#!topic/fabricjs/x8YBObF9zO4
  /*fabric.LineWithArrow = fabric.util.createClass(fabric.Line, {
  // var LineWithArrow = fabric.util.createClass(fabric.Line, {

    type: 'lineArrow',

    initialize: function(element, options) {
      options || (options = {});
      this.callSuper('initialize', element, options);
    },

    toObject: function() {
      return;
      //return fabric.util.object.extend(this.callSuper('toObject'));
    },

    _render: function(ctx){
      this.callSuper('_render', ctx);

      // do not render if width/height are zeros or object is not visible
      if (this.width === 0 || this.height === 0 || !this.visible) return;

      ctx.save();

      var xDiff = this.x2 - this.x1;
      var yDiff = this.y2 - this.y1;
      var angle = Math.atan2(yDiff, xDiff);
      ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
      ctx.moveTo(10,0);
      // -20 15
      ctx.lineTo(-10, 10);
      // -20 -15
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.fillStyle = this.stroke;
      ctx.fill();              

      ctx.restore();
      
    }
  });

  fabric.LineWithArrow.fromObject = function (object, callback) {
      callback && callback(new fabric.LineWithArrow([object.x1, object.y1, object.x2, object.y2],object));
  };

  fabric.LineWithArrow.async = true;*/

  // ADDing Toolbar
  var imgURL = "img/";
  var tools = [ "circle", "arrow", "select", "text", "eraser", /*"undo", "redo",*/ "zoom-in", "zoom-out", "one-to-one", /*"pan"*/ ];
  var subcircles = [ "High-priority", "Medium-priority", "Low-priority"];

  //for (var i = 0; i < tools.length; i++){
    // .forEach() provides a clean, natural way to get a distinct closure for every iteration
  tools.forEach(function (i){
    var toolName = i /*tools[i]*/;
    /*var tool = $('<div>', {
      'class': i,
      'style' : 'background-image: url(' + imgURL + i + '.png)',
    });*/
    var tool = $('<li>', {
      'id': i,
      // ONLY 'ui-menu-item' will activate submenu
      // otherwise will define as divider
      //'class': 'items-with-no-icon'
    });

    if (i === "circle"){
      var html = $('<a href="#popupmenu" data-rel="popup" data-position-to="#circle"><img src="' + imgURL + i + '.png"></a>');
      //img.appendTo(atag)
      html.appendTo(tool);

      /*var submenu = $('<ul></ul>');
      subcircles.forEach(function (j){
        var subtool = $('<li id="' + j + '"><img src ="' + imgURL + i  + '.png"></li>');*/
        /*var subtool = $('<div>', {
          'id': j,
          'style' : 'background-image: url(' + imgURL + i + '.png)',
        });*/ /*
        subtool.on('click', function(event){
          radius = priority(j);
          onSelect(toolName);
          console.log("onSelect item = " + i + "; priority = " + radius);
        });
        subtool.appendTo(submenu);
      })
      submenu.appendTo(tool);*/
      //console.log("tool = " + tool.html());
    } else {
      var html = $('<img src="' + imgURL + i + '.png" class="toolbar-menu">');
      html.appendTo(tool);
    }
    if (i === "arrow" || i === "select"){
      tool.on('click', function(event) {
        onSelect(toolName);
      });
    }
  tool.appendTo($("#toolbar-menu"));

  //$(".items-with-no-icon").removeClass('ui-btn-icon-right');
    });
  // WHY submenu cannot display???
    /*$("#toolbar-menu" ).menu({
      icons: { submenu: 'ui-icon-triangle-1-se'}
    });*/

    var popupdialog = $('<div>',{
      'id': "popupmenu",
      'data-role': "popup",
      //'class': "ui-content"
    });

    var menu = $('<ul>',{
      'data-role': "listview",
      'data-inset': "true"
    });

    subcircles.forEach(function (j){
      var subtool = $('<li id="'+j+'"><img src="'+imgURL+'circle.png"></li>');
      subtool.on('click', function(event){
          radius = priority(j);
          onSelect("circle");
          console.log("onSelect item = circle; priority = " + radius);
          $("#popupmenu").popup('close');
      });
      subtool.appendTo(menu);
    });
    menu.appendTo(popupdialog);
    popupdialog.appendTo($("#toolbar"));

    var tojson_button = $('<button id="save-graph">Save</button>');
    tojson_button.on('click', function(event) {
      //var allobjects = listOfKnowledgePoints;
      var newgraph = buildjson(); //canvas.toJSON(['to'], ['from'], ['flowin'], ['flowout']);
      //var json = ;
      canvas.includeDefaultValues = false;
      console.log("[toJSON] = " + JSON.stringify(newgraph));
      saveKnowledgePointGraph(newgraph);
    });
    tojson_button.insertAfter($("#workarea-canvas-container"));


    // hide text
    $("#text").addClass("hide");


  canvas.on('mouse:down', function(o){
    isDown = true;
    line = null;
    var pointer = canvas.getPointer(o.e);
    var points, startPoint;
    // var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
    // ADD shapes according to selected drawing tool
    //
    origX = pointer.x;
    origY = pointer.y;
    switch (drawingTool){
      case "circle":
        //radius = 100;
        /*
        var circle = new fabric.Circle({ 
          top: origY, 
          left: origX, 
          radius: radius, 
          fill: 'rgba(250, 253, 94, 0.9)',
          // assign arrows
          flowin: [],
          flowout: [],
          selectable: false
        });

        var iText = new fabric.IText('Title', { 
          fontFamily: 'arial black',
          left: origX + radius, 
          top: origY + radius,
          width: fixed_width,
          originX: 'center',
          originY: 'center',
          fontSize: 18,
          hasRotatingPoint: false,
          textAlign: 'center'
        });
       //canvas.add(iText);

        line = new fabric.Group([ circle, iText ], {
          left: origX,
          top: origY,
          //selectable: false
          //editable: true
          hasRotatingPoint: false,
          lockScalingX: true,
          lockScalingY: true,
          hasControls: false,
          selectable: false,
        });

        /*line.on('mousedown', dblClickHandler(line, function (obj) {
          var tempLine = line;
          var tempText = iText;
          //console.log(obj.get('id'));
          console.log ('textEditHandler.bind');
          textEditHandler (tempLine, tempText);
        ));*/
        
        sendRequest(origX, origY, radius);

        break;
      case "arrow":
        if (selectMode === false){
          startPoint = getCoordinates(o.e);
          var object = canvas.findTarget(o.e, false);          
          if (startPoint === null){
            // drop when it does not hit any knowlodge points
            points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
            line = null;
            return;
          } else {
            //console.log("Get center = ("+ startPoint.x + ", " + startPoint.y + ")");
            points = [ startPoint.x, startPoint.y, startPoint.x, startPoint.y ];
            //console.log("points = " + points);
            var from = canvas.findTarget(o.e, false);
            // ADD arrow at the end
            line = new fabric.LineWithArrow(points, {
              strokeWidth: 2,
              //fill: 'red',
              stroke: 'black',
              originX: 'center',
              originY: 'center',
              selectable: false,
              from: from
            });
            // arrow from object
            assignInToCircle(object, line);
            // console.log("Line = " + line);
          }
        }
        break;
      case "pan":
      //console.log("PanModeByMouse: " + PanModeByMouse);
        break;
      case "text":
        /*line = new fabric.IText('Title', { 
          fontFamily: 'arial black',
          left: origX, 
          top: origY,
          //textAlign: 'center'
        });*/

        break;
      case "eraser":
        // TODO OK
        // erase arrow
        // only when circle has at least one arrow assigned!

        break;
      default:
        return;
    }


    // EDIT
    /*line = new fabric.Line(points, {
      strokeWidth: 5,
      fill: 'red',
      stroke: 'black',
      originX: 'center',
      originY: 'center'
    });*/
    if (line != null)
      canvas.add(line);
    if (drawingTool === "arrow")
      canvas.sendToBack(line);
  });

  canvas.on('mouse:move', function(o){
    if (!isDown) return;
    console.log("on mouse:move");
    var pointer = canvas.getPointer(o.e);
    var endPoint, points;
    //alert ("x=" + pointer.x + " y= " + pointer.y);

    // check for out of boundary
    if (pointer.x < 0)
      pointer.x = 0;
    else if (pointer.x > canvas.width)
      pointer.x = canvas.width;
    
    if (pointer.y < 0)
      pointer.y = 0;
    else if (pointer.y > canvas.height)
      pointer.y = canvas.height;

    switch (drawingTool){
      case "circle":
        /*if(origX>pointer.x){
          line.item(0).set({ left: Math.abs(pointer.x) });
        }
        if(origY>pointer.y){
          line.item(0).set({ top: Math.abs(pointer.y) });
        }
        var tempX = Math.abs(origX - pointer.x) /2;
        var tempY = Math.abs(origX - pointer.y) /2;

        // check for out of boundary
        if (pointer.x < 0)
          pointer.x = 0;
        else if (pointer.x > canvas.width)
          pointer.x = canvas.width;
        
        if (pointer.y < 0)
          pointer.y = 0;
        else if (pointer.y > canvas.height)
          pointer.y = canvas.height;

        if (tempX < tempY)
          line.item(0).set({ radius: Math.abs(origX - pointer.x) /2});
        else line.item(0).set({ radius: tempY});*/
        break;
      case "arrow":
        if (line !== null){
          var object = canvas.findTarget(o.e, false);
          endPoint = getCoordinates(o.e);
          // set end points
          // line.set({ x2: pointer.x, y2: pointer.y });
          if (endPoint === null){
            // DO NOT drop when it does not hit any knowlodge points
            // ONLY DROP when mouse release
            // points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
            line.set({ x2: pointer.x, y2: pointer.y });
          } else {
            var r = object.item(0).radius;
            var boundary = findBoundary(line.get('x1'), line.get('y1'), endPoint.x, endPoint.y, r);
            line.set({ x2: boundary.x, y2: boundary.y });
            line.set({to: object});
          }
          //line.set({ x2: endPoint.x, y2: endPoint.y });
        }

        resizeCanvas();
        
        break;
      case "text":

        break;
      case "pan":
        /*if (PanModeByMouse){
            console.log("canvas.on(mouse:move):PanModeByMouse:: movementX: " + o.e.movementX +", " +o.e.movementY);
            panToByMouseCoords(o.e.movementX, o.e.movementY);
        }

        console.log("PanModeByMouse: " + PanModeByMouse);*/
        break;
    }
    // line.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
  });

  canvas.on('mouse:up', function(o){
    isDown = false;
    var pointer = canvas.getPointer(o.e);
    var endPoint, points;
    // var object = canvas.findTarget(o, false);
    // console.log("UP: active obj = " + object.get('type'));
    switch (drawingTool){
      case "arrow":
          if (line !== null){
            var object = canvas.findTarget(o.e, false);
            endPoint = getCoordinates(o.e);
            // set end points
            if (endPoint === null){
              // drop when it does not hit any knowlodge points
              // points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
              //line.set({ x2: pointer.x, y2: pointer.y });
              // event, cannot find parent point
              // 0 = IN
              var frompoint = line.from;
              removeAssignArrow(frompoint, line, 0);
              console.log("endPoint === null");
              canvas.remove(line);
              return;
            }
            // arrow to object
            assignOutToCircle(object, line);
            //line.set({ x2: endPoint.x , y2: endPoint.y });
        }
    }

  });

  // TRY 
  
  canvas.on('object:selected', function(o) {
    var object = o.target;
    if (object.get('type') === 'group'){
      console.log("objec:selected; object selected = " + object + " parents = [" + object.item(0).flowout[0]);
	  activeKP = object;
    //if ($("#text").hasClass("hide")){
      $("#text").removeClass("hide");
    //}
    }else{
      $("#text").addClass("hide");
    }

  });

  canvas.on('selection:cleared', function(o){
    $("#text").addClass("hide");
  })

  $("#eraser").on('click', function(event) {
    if (!selectMode) return;
    if (textediting) return;
    var object = canvas.getActiveObject();
    console.log("[Eraser] selectMode = " + selectMode + "; object = " + object);
    //console.log("Selected text editing= " + textediting);
    //.log("moving " + object);
    if (object !== null && object.get('type') === 'group'){  
      if (object.item(0).flowin.length > 0){
        // delete arrows
        // ALSO need to delete assignment of other circles
        // Clon the array of arrows
        // AS removeAssignArrow will remove .flowin at the same time
        var inarrows = object.item(0).flowin.slice(0);
        console.log("in length = " + inarrows.length);
        var count = 0;
        // ASSigned More than actual drawingS
        // cannot fully deleted
        // only iterate 0,1 BUT
        // only delete 0,2
        //inarrows.forEach(function (arrow){
        for (var i = 0; i < inarrows.length; i++){
          var arrow = inarrows[i];
          console.log("Removeing in: count = " + i +"; Arrow = " + arrow);
          // function rmoved the inarrows!!!
          removeAssignArrow(object, arrow, 0);
          var child = arrow.to;
          removeAssignArrow(child, arrow, 1);
          canvas.remove(arrow);
        }
      } 
      if (object.item(0).flowout.length > 0){
        console.log("out length = " + object.item(0).flowout.length);
        var outarrows = object.item(0).flowout.slice(0);
        //outarrows.forEach(function (arrow){
        for (var i = 0; i < outarrows.length; i++){
          var arrow = outarrows[i];
          console.log("Removeing out; count = " + i +"; Arrow = " + arrow);
          removeAssignArrow(object, arrow, 1);
          var parent = arrow.from;
          removeAssignArrow(parent, arrow, 0);
          canvas.remove(arrow);
        }

        sendKnowledgePointDeletion(object.item(0).get('id'));
      }else if (object.get('type') === 'Linearrow'){
        // check if circle has at least one arrow
        var parent = object.from;
        var child = object.to;

        var parentOK = parent.item(0).flowout > 1 || parent.item(0).flowout > 1 || (parent.item(0).flowin + parent.item(0).flowin) > 1;
        var childOK = child.item(0).flowout > 1 || child.item(0).flowout > 1 || (child.item(0).flowin + child.item(0).flowin) > 1;

        if (parentOK){
          console.log("parentOK");
          // remove assigned arrows in parents
          removeAssignArrow(object, arrow, 0);

        }
        if (childOK){
          console.log("childOK");
          // remove assigned arrows in 

          removeAssignArrow(child, arrow, 1);
        }

        if (!parentOK && !childOK){
          alert("PLease select a circle/arrow-with-more-than-one-arrow to delete!");
        }
      }
      canvas.remove(object);
    }
  });

  $("#text").on('click', function (event){
    if (!selectMode) return;
    //alert("text selected!");
    var object = canvas.getActiveObject();
    console.log(" object.length = " + object._objects.length);
    if (textediting) return;
    console.log("selectMode = " + selectMode + "; object = " + object);
    //console.log("Selected text editing= " + textediting);
    //.log("moving " + object);
    if (object != null && object.get('type') === 'group'){
      var circle = object.item(0);
      var text = object.item(1);


      textEditHandler (object, text);

      /*text.on('editing:entered', function (){

      });*/

      text.on('editing:exited', function () {
        // format text
        var temp_text = text.get('text').replace(/\n/g, " ");
        var return_text = formatText(temp_text);
        text.set({text: return_text});

        var items = [];
        //canvas.forEachObject(function (object) {
        console.log("[Exit] x = " + circle.get('left') + " y = " + circle.get('top'));
            items.push(circle);
            canvas.remove(circle);
            items.push(text);
            canvas.remove(text);
        //});
        console.log("[Exit] items length = " + items.length + " x = " + circle.get('left') + " y = " + circle.get('top'));
        var x = circle.get('left');
        var y = circle.get('top');
        var grp = new fabric.Group(items, {
          left: x,
          top: y,
          hasRotatingPoint: false,
          lockScalingX: true,
          lockScalingY: true,
          hasControls: false,
          selectable: true,
          hasBorders: true
        });
        canvas.add(grp);
        // IMPORTANT!
        // otherwise trigger multiple times
        text.off('editing:exited');
        console.log("[Add group] item(0).flowin length = " + circle.flowin.length + "; item(0).flowout length = " + circle.flowout.length);
        canvas.setActiveObject(grp);
        textediting = false;
      });
    }
  });

  $("#zoom-in").on('click', function(){
    // button Pan
    zoomIn();
  });

  $("#zoom-out").on('click', function(){
    // button Pan
    zoomOut();
  });

  $("#one-to-one").on('click', function(){
    resetZoom();
  });

  // HOW TO disable moving when text editing
  canvas.on('object:moving', function(o){
    if (!selectMode) return;
    if (textediting) return;
    //console.log("Moving textediting = " + textediting);
    var object = o.target;
    console.log("Moving circle.flowin length = " + object.item(0).flowin.length + "; circle.flowout length = " + object.item(0).flowout.length);
    //.log("moving " + object);
    if (object != null){
      if (object.get('type') === 'group'){
        var center = object.getCenterPoint();
        var r = object.item(0).radius;
        if ((center.x - r) < 0){
          object.setLeft(0);
        } 
        if ((center.y -r) < 0){
          object.setTop(0);
        }
        
        if ((center.x + r) > canvas.width){
          object.setLeft(canvas.width - 2*r);
        }
        if ((center.y + r) > canvas.height){
          object.setTop(canvas.height - 2*r);
        }
        var fromcenter = object.getCenterPoint();
        var from = new fabric.Point(fromcenter.x, fromcenter.y);
        
        var inarrows = object.item(0).flowin;
        var outarrows = object.item(0).flowout;

        inarrows.forEach(function (arrow){
          // WHY will drop sometimes??????
          arrow.set({x1: from.x, y1: from.y});
        });

        outarrows.forEach(function (arrow){
          var boundary = findBoundary(arrow.get('x1'), arrow.get('y1'), from.x, from.y, r);
          arrow.set({x2: boundary.x, y2: boundary.y});
        });
      }
    }
  });

  updateGraph(courseCode, courseNumber);

  // TRY
  // NOT WORKING
  // HOW to prevent \n on inputing, but keep when formatting?????
  /*
  canvas.on('text:changed', function(e) {

      //Remove new line char if user pressed Return while editing
    var target = canvas.getActiveObject();
    // if an active object exists
    if (target) { 

        var typeDesc = target.get('type');
        console.log("Object type = " + typeDesc + " e = " + e + " e.keyCode = " + e.keyCode);

        if (e.keyCode == 10 || e.keyCode == 13) 
          e.preventDefault();

        if (typeDesc == 'i-text') { // make changes only if a text object
          
          var textEditing = true;    // editing iTEXT
          var textOriginal = target.getText();
          console.log("textOriginal = " + textOriginal);

          // Remove all 3 types (PC, UNIX, iOS) of line breaks
          //var textRevised = textOriginal.replace(/(\r\n|\n|\r)/gm, "");
          console.log("textOriginal = " + textOriginal);
          //target.set({text: textRevised}); // update the iText
     
          if (textRevised != textOriginal) { // set cursor back if text changed
              target.moveCursorLeft(e);
          }
        }
      }
      canvas.renderAll(); // Update canvas
    });*/

    // TRY jquery
    // Does not trigger keydown when press 'enter'??
    /*$(document).on('keydown', function (event){
      console.log("[keydown] event = " + event + " event.keyCode = " + event.keyCode);
        if (event.keyCode == 10 || event.keyCode == 13) 
          event.preventDefault();
    });*/
  

});