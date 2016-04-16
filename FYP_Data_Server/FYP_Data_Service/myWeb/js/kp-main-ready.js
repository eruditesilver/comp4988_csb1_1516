$(document).ready(function(){

	studentMode = false;

	canvas = new fabric.Canvas('canvas', { 
	    selection: false,
	    backgroundColor: '#F0F0F0'
	});

	canvas.setHeight(1000);
	//canvas.setHeight(window.innerHeight * 0.9);
	canvas.setWidth(1500);
	canvas.renderAll();

	// create SAVE button
	//var save_button = $('<button id="save">Save</button>');
    $("#save").on('click', function(event) {
      var json = buildjson(); //canvas.toJSON(['to'], ['from'], ['flowin'], ['flowout']);
      canvas.includeDefaultValues = false;
      console.log("[toJSON] = " + JSON.stringify(json, null, 2));
      //saveKnowledgePointGraph(json);
      //dragdropMode = false;
      //$("#edit-drag-drop").show();
	  $('.nav-pills a[href="#1a"]').tab('show');
      //save_button.hide();
    });
    //save_button.insertAfter($("#workarea-canvas-container"));
    //save_button.hide();

	$("#edit-drag-drop").on('click', function(event){
		dragdropMode = true;
		$("#edit-drag-drop").hide();
		save_button.show();
		console.log("dragdropMode = " + dragdropMode);
	});

	$("#link-to-draw").on('click', function(event){
		window.location.assign("fabric-draw.html");
	});

  $("#workarea-canvas-container").onscroll = function() {
      canvas.calcOffset();
    };

	// template
	// var li_tag = $('<li>');

	$( '.popupParent' ).on({
		popupafterclose: function() {
			//console.log("popupafterclose");
			//setTimeout( function(){ $( '.popupChild' ).popup( 'open' ) }, 1 );
		}
	});

	canvas.on('mouse:down', function(o){
		if (editMode) return;
		var e = canvas.findTarget(o.e, false); //canvas.getActiveObject();
		// WHY undefined??
		// getObject -> only SELECTED
		if (e != null && e.get('type') === 'group'){
			var selected_KnowlodgePoint_id = e.item(0).get('id');
			var selected_KnowlodgePoint_name = e.item(1).get('text');
			//console.log("getActiveGroup = " + e + "; selected_KnowlodgePoint_id = " + selected_KnowlodgePoint_id);

			// set cookies
			Cookies.set('selected_KnowlodgePoint_id', selected_KnowlodgePoint_id, { expires: 1 });
			Cookies.set('selected_KnowlodgePoint_name', selected_KnowlodgePoint_name, { expires: 1 });

			clearIndividual();
			createIndividual(selected_KnowlodgePoint_id, dragdropMode, studentMode);
			$("#individual-popup").modal('show');
		}
	});

	var canvas_container = $(".canvas-container");
	canvas_container.on('dragover', allowDrop);
	canvas_container.on('drop', drop);

	updateGraph(courseCode, courseNumber);

	getAllMaterials();

		$.ajax({
		  type: "GET",
		  url: assetsURL,
		  success: function(data){
		  	console.log("Get JSON Asset/COMP_2611/Lecture_1"); // + JSON.stringify(data, null, 4));
		  	console.log(data);
		  	traceFileList(data);
		  },
	      error: function (xhr, ajaxOptions, thrownError) {
	        alert(xhr.status + "(" + thrownError + ")");
	      },
          failure: function (response) {
            alert(response.d);
          }
		});

  canvas.on('mouse:down', function(o){
  	console.log("mouse:down editmode = " + editMode);
  	if (!editMode) return;
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
      	console.log("mouse:down arrow!");
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
    //$("#text").addClass("hide");
  });

  $("#High-priority").on('click', subcircle);
  $("#Medium-priority").on('click', subcircle);
  $("#Low-priority").on('click', subcircle);

  $("#arrow").on('click', function (event) {
  	onSelect("arrow");
	$(".tool").removeClass("active");
	$(this).addClass("active");
	$("#circle img").attr({
		'src': "img/circle.png"
	});
  });

  $("#select").on('click', function (event) {
  	onSelect("select");
	$(".tool").removeClass("active");
	$(this).addClass("active");
	$("#circle img").attr({
		'src': "img/circle.png"
	});
  });

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

	$("#tab1 a:last").on('shown.bs.tab', function (event) {
		dragdropMode = true;
		console.log("Asset tab on show, dragdropMode = " + dragdropMode);
	});

	$("#tab1 a:last").on('hidden.bs.tab', function (event) {
		dragdropMode = false;
		console.log("Asset tab on show, dragdropMode = " + dragdropMode);
	});

	$("#tab1 a:eq(1)").on('shown.bs.tab', function (event) {
		editMode = true;
		console.log("Asset tab on show, editmode = " + editMode);
	});

	$("#tab1 a:eq(1)").on('hidden.bs.tab', function (event) {
		editMode = false;
		console.log("Asset tab on show, editmode = " + editMode);
	});	

});