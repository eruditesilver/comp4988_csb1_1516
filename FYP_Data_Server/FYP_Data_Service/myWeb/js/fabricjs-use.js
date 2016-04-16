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

  function subcircle(event){
    var id = $(this).attr("id");
	var prior = "low.png";
	if (id === "High-priority"){
		prior = "high.png";
	}else if (id === "Medium-priority"){
		prior = "medium.png";
	}else if (id === "Low-priority"){
		prior = "low.png";
	}
	prior = "img/" + prior;
    radius = priority(id);
	$(".tool").removeClass("active");
    onSelect("circle");
	$("#circle").addClass("active");
	$("#circle img").attr({
		'src': prior
	});
    console.log("onSelect item = circle; priority = " + radius);
  }

//$(document).ready(function(){


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





    /*var popupdialog = $('<div>',{
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
    */