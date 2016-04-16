
	// Global variables
	//var canvas;
	var listOfKnowledgePoints = [];
	var currentKP;
	var activeKP;		// pointer to selected KP object
	var currentQandA;
	var listOfparents = [];
	var listOfassets = [];
	var listOfmessage = [];
	var currentQandAanslist = [];
	var readingparent, readingassets, readingmessage, readingans = false;

	var assetsURL = "/Asset/COMP_2611/Lecture_1/";

	var course = "COMP 2611";
	var courseCode = "COMP";
	var courseNumber = "2611";

	var videoType = ["mp4", "ogg"];
	var audioType = ["mp3", /*"ogg",*/ "wav"];

	var priorityType = {
		High: {value: 100, name: "High"},
		Medium: {value: 80, name: "Medium"},
		Low: {value: 60, name: "Low"},
	}
	// fixed_width -> itext
	var fixed_width = 100;
	var fixed_stringsize = 10;
	//updateGraph();
	//addNewPoint();
	/* Zoom */
	var SCALE_FACTOR = 1.2;
	var zoomMax = 3;
	var zoomMin = 0.3;
	/* pan */
	/*
	var canvasHeight = 1080;
	var canvasWidth = 1920;
	*/

  // offset of canvas
  //var offset = canvas.offset();
	//
	// TRY
	// ADDing new Class
	// Line with Arrow
	//
	// from https://groups.google.com/forum/#!topic/fabricjs/x8YBObF9zO4
	fabric.LineWithArrow = fabric.util.createClass(fabric.Line, {
		// var LineWithArrow = fabric.util.createClass(fabric.Line, {

		type: 'lineArrow',

		initialize: function(element, options) {
			options || (options = {});
			this.callSuper('initialize', element, options);
		},

		toObject: function() {
			return fabric.util.object.extend(this.callSuper('toObject'));
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
			ctx.moveTo(5,0);
			// -20 15
			ctx.lineTo(-5, 5);
			// -20 -15
			ctx.lineTo(-5, -5);
			ctx.closePath();
			ctx.fillStyle = this.stroke;
			ctx.fill();              

			ctx.restore();
		  
		}
	});

	fabric.LineWithArrow.fromObject = function (object, callback) {
		callback && callback(new fabric.LineWithArrow([object.x1, object.y1, object.x2, object.y2],object));
	};

	fabric.LineWithArrow.async = true;

  	// Define prototype
  	function KnowledgePoint(course, id, name, priority, x, y, parents, createdate, modifydate) {
  		this.course = course;
	    this.id = id;
	    this.create = createdate;
	    this.lastmodified = modifydate;
	    this.name = name;
	    this.priority = priority;
	    this.x = x;
	    this.y = y;
	    //this.name = function() {return this.firstName + " " + this.lastName;};
	    this.assets = [];
	    this.parents = parents;
	    this.tests = [];
	    this.qanda = [];

	    //console.log("parents = " + parents + " currentKP.parents " + this.parents);
	}

	KnowledgePoint.prototype.toJSON = function () {
		var prior = this.priority.name;
		// everything that needs to get stored
	    return {
	      "Knowledge Point name": formatNameBySpace(this.name), 
          "Knowledge Point ID": this.id,
          "Course ID": 9000,
          "Priority": prior, 
          "Knowledge point location X": parseInt(this.x), 
          "Knowledge point location Y": parseInt(this.y), 
          "Date of create": this.create, 
          "Date of last modified": this.lastmodified, 
          "Knowledge point parents": this.parents,
          "Related Assets": this.assets,
          "Related message in Q&A": {
          	"Course Id": 9000,
          	"Lecture session": "",
			"Last modified date": formatDate(new Date()), //findlastmodifieddate(this.qanda);
          	"Message List": this.qanda,
          },
          "Related self test set": this.tests
	    }; 
	}
	
	function findlastmodifieddate(qanda_list){
		var result = Date.parse(new Date("1/1/2000 1:00:00 AM"));
		$.each(qanda_list, function (item) {
			var tempdate = Date.parse(item.last);
		});
	}

	function asset(id, path, type, start, end, createdate, modifydate){
	    this.id = id;
	    this.create = createdate;
	    this.lastmodified = modifydate;
	    //this.name = name;
	    this.path = path;
	    this.type = type;
	    this.startpoint = start;
	    this.endpoint = end;
	    //this.createdate = createdate;
	}

	asset.prototype.toJSON = function () {
		var typename = this.type;
		if (typename === "ppt"){
			typename = "PPT";
		} else if (typename === "pdf"){
			typename = "PDF";
		} else if ($.inArray(typename, audioType) !== -1){
			typename = "Audio";
		} else if ($.inArray(typename, videoType) !== -1){
			typename = "Video";
		}
		// everything that needs to get stored
	    return {
	      //"Knowledge Point name": this.name, 
          "Asset ID": (this.id < 3000)? -1: this.id,
          "Course ID": 9000,
          "Asset path": this.path,
          "Asset type": typename, 
          "Point of start": this.startpoint, 
          "Point of end": this.endpoint, 
          "Date of create": this.create,
          "Date of last modified": this.lastmodified
	    }; 
	}

	function QandA(id, person, question, answerlist, createdate){
	    this.id = id;
	    //this.lastmodified = date;
	    this.question = question;
	    this.person = person;
	    this.ans = answerlist;
	    this.create = createdate;
	}

	QandA.prototype.toJSON = function () {
		// everything that needs to get stored
	    return {
	      //"Knowledge Point name": this.name, 
          "Q&A ID": this.id,
          "Ask by": this.person, 
          "Question": this.question, 
          "Date of create": this.create,
          "Answer List": this.ans
	    }; 
	}

	function answer(ans, type){
		this.content = ans;
		this.type = type;
	}

	answer.prototype.toJSON = function () {
		// everything that needs to get stored
	    return {
	      //"Knowledge Point name": this.name, 
          "Answer": this.content,
          "Answer type": this.type
	    }; 
	}

	function selftest(answer, createdate, question){
	    /*this.id = id;
	    this.lastmodified = date;
	    this.name = name;
	    this.path = path;*/
	    this.createdate = createdate;
	    this.answer = answer;
	    this.question = question;
	}

	selftest.prototype.toJSON = function () {
		// everything that needs to get stored
	    return {
	      //"Knowledge Point name": this.name, 
          "Answer Key": this.answer,
          "Date of create": this.createdate,
          "Question": this.question
	    }; 
	}

	function assignInToCircle(fromobject, arrow){
	    //var object = canvas.findTarget(event, false);
	    if (fromobject != null){
	      if (fromobject.get('type') === 'group'){
	        console.log("assignInToCircle = " + arrow);
	        fromobject.item(0).flowin.push(arrow);
	      }
	    }
	}

	function assignOutToCircle(toobject, arrow){
	    //var object = canvas.findTarget(event, false);
	    if (toobject != null){
	      if (toobject.get('type') === 'group'){
	        console.log("assignOutToCircle = " + arrow);
	        toobject.item(0).flowout.push(arrow);
	      }
	    }
	}

  	// 
    function updateGraph(courseCode, courseNumber) {
        /*$.getJSON(
        	//'https://api.github.com/users/mralexgray/repos',
        	'http://localhost:49995/FYPGetDataService.svc/getKnowledgePoints/COMP2611_L1', 
	        //{datasize: datasize}, 
	        function(json) {      // '1024'
	            addNewPoint(json);
	        }
	    );*/
		$.ajax({
		  type: "GET",
		  url: '../FYPGetDataService.svc/GetKnowledgePointList/'+courseCode+'_'+courseNumber,
		  processData: true,
		  //date: {'course code': course, 'course number': 'L1'},
		  // "The advent of JSONP — essentially a consensual cross-site scripting hack — has opened the door to powerful mashups of content."
		  dataType: 'json', 		//'application/json',
		  success: function(data){
		  	console.log("Get JSON data = " + JSON.stringify(data, null, 2));
		  	addNewPoint(JSON.stringify(data));
		  },
	      error: function (xhr, ajaxOptions, thrownError) {
	        alert(xhr.status);
	        alert(thrownError);
	      },
          failure: function (response) {
            alert(response.d);
          }
		});
    }

    	//called with every property and it's value
		function traverse(object) {
			var currentKPid, currentKPname, currentKPpriority, currentKPX, currentKPY, currentKPcreate, currentKPmodified;
			console.log(object + " : "+ object["Knowledge Point ID"]);

			currentKPid = object["Knowledge Point ID"];					        
			currentKPname = object["Knowledge Point name"];
			currentKPX = object["Knowledge point location X"];			
			currentKPY = object["Knowledge point location Y"];
			currentKPcreate = object["Date of create"];
			currentKPmodified = object["Date of last modified"];

			var value = object["Priority"];
			if (value === "High")
				currentKPpriority = priorityType.High;
			else if (value === "Medium")
				currentKPpriority = priorityType.Medium;
			else if (value === "Low")
				currentKPpriority = priorityType.Low;

			console.log("Current KP id = " + currentKPid);
			console.log("Current KP name = " + currentKPname);
			//console.log("Current KP X = " + currentKPX);
			//console.log("Current KP Y = " + currentKPY);
			//console.log("Current KP Date of create = " + currentKPcreate);
			console.log("Current KP Date of last modified = " + currentKPmodified);
			listOfparents = object["Knowledge point parents"];
			console.log("Reading parents = [" + listOfparents + "]");
			console.log("Current KP priority = " + currentKPpriority + ";  listOfparents = " + listOfparents);

			currentKP = createOneKP(currentKPid, currentKPname, currentKPpriority, currentKPX, currentKPY, listOfparents, currentKPcreate, currentKPmodified);

			var temp_assetslist = object["Related Assets"];
			console.log("[Related Assets] = " + temp_assetslist);
			$.each(temp_assetslist, function (i){
				currentAsset_id = temp_assetslist[i]["Asset ID"];
				currentAsset_path = temp_assetslist[i]["Asset path"];
				currentAsset_type = temp_assetslist[i]["Asset type"];
				currentAsset_start = temp_assetslist[i]["Point of start"];
				currentAsset_end = temp_assetslist[i]["Point of end"];
				currentAsset_createdate = temp_assetslist[i]["Date of create"];
				currentAsset_modifydate = temp_assetslist[i]["Date of last modified"];
				console.log("Current Asset id = " + currentAsset_id);
				console.log("Current Asset path = " + currentAsset_path);
				console.log("Current Asset start = " + currentAsset_start);
				console.log("Current Asset end = " + currentAsset_end);
				createOneAsset(currentAsset_id, currentAsset_path, currentAsset_type, currentAsset_start, currentAsset_end, currentAsset_createdate, currentAsset_modifydate);
			});

			var temp_messagelist = object["Related message in Q&A"]["Message List"];
			var currentQandAid, currentQandAperson, currentQandAquestion, currentQandAcreatedate;
			$.each(temp_messagelist, function (i){
				currentQandAid = temp_messagelist[i]["Q&A ID"];
				currentQandAperson = temp_messagelist[i]["Ask by"];
				currentQandAquestion = temp_messagelist[i]["Question"];
				currentQandAcreatedate = temp_messagelist[i]["Date of create"];
				var temp_anslist = temp_messagelist[i]["Answer List"];
				var currentQandAanslist_ans, currentQandAanslist_content, currentQandAanslist_type;
				$.each(temp_anslist, function (j){
					currentQandAanslist_content = temp_anslist[j]["Answer"];
					currentQandAanslist_type = temp_anslist[j]["Answer type"];
					currentQandAanslist_ans = new answer(currentQandAanslist_content, currentQandAanslist_type);
					currentQandAanslist.push(currentQandAanslist_ans);
				});
				createOneQandA(currentQandAid, currentQandAperson, currentQandAquestion, currentQandAanslist, currentQandAcreatedate);
			});
			
			var temp_selftestlist = object["Related self test set"];
			var currentTest_answerkey, currentTest_createdate, currentTest_question;

			$.each(temp_selftestlist, function (i){
				currentTest_answerkey = temp_selftestlist[i]["Answer Key"];
				currentTest_createdate = temp_selftestlist[i]["Date of create"];
				currentTest_question = temp_selftestlist[i]["Question"];
				createOneSelftest(currentTest_answerkey, currentTest_createdate, currentTest_question);
			});
			
			        //console.log("Reading messages = " + readingmessage);

			    	/*if (readingparent){
			    		var temp = value;
			    		if (temp !== null){
				    		console.log("parents.push" + temp);
				    		listOfparents.push(temp);
				    	}*/
				    //}else if(readingassets){
			    		//readingparent = false;

			    	//}else if (readingmessage){
			    		//readingassets = false;
			    				
			    	//}else{
			    		//readingmessage = false;
			    	//}
		}

		/*function traverse(o,func) {
		    for (var i in o) {
		        func.apply(this);  
		        // console.log("i = " + i);
		        if (o[i] !== null && typeof(o[i])==="object") {
		            //going on step down in the object tree
		            console.log("step down!");
		            traverse(o[i],func);
		        }
		    }
		}*/

		function createOneKP(id, name, priority, x, y, parents, createdate, modifydate){
			var point = new KnowledgePoint(course, id, name, priority, x, y, parents, createdate, modifydate);
			console.log(">>>> KP point.id = " + point.id);
			drawKnowledgePoint(point);
			return point;
		}

		function createOneAsset(id, path, type, start, end, createdate, modifydate){
			var currentAsset = new asset(id, path, type, start, end, createdate, modifydate);
			// push into current KP
			console.log("Pushing current assets = " + currentAsset.path);
			currentKP.assets.push(currentAsset);
		}

		function createOneQandA(id, person, question, answerlist, createdate){
			currentQandA = new QandA(id, person, question, answerlist, createdate);
			currentKP.qanda.push(currentQandA);
		}

		function createOneSelftest(answerkey, createdate, question){
			var currentTest = new selftest(answerkey, createdate, question);
			currentKP.tests.push(currentTest);
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

		function drawKnowledgePoint(knowledgepoint){
			var id = knowledgepoint.id;
			var origX = knowledgepoint.x;
			var origY = knowledgepoint.y;
			var radius = knowledgepoint.priority.value; //getRadiusFromPriority(knowledgepoint.priority);
			var temp_title = knowledgepoint.name;
			// break lines by word wrapped
			//var words = temp_title.split(' ');
			var title = formatText(temp_title.toString());


	        var circle = new fabric.Circle({ 
	          top: origY, 
	          left: origX, 
	          radius: radius, 
	          fill: 'rgba(250, 253, 94, 1)',
	          // assign arrows
	          flowin: [],
	          flowout: [],
	          selectable: false
	        });

	        var iText = new fabric.IText(title, { 
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

	        var group = new fabric.Group([ circle, iText ], {
	          left: origX,
	          top: origY,
	          //selectable: false
	          //editable: true
	          hasRotatingPoint: false,
	          lockScalingX: true,
	          lockScalingY: true,
	          hasControls: false,
	          selectable: false
	        });

	        circle.set('id', id);
	        circle.set('this', knowledgepoint);

	        canvas.add(group);
			
			activeKP = group;
		}

		function drawArrows(listOfPoints){
			// listOfPoints is JS Object,
			// not canvas object
			$.each(listOfPoints, function(i, v) {
				//console.log("drawArrows i = " + i + ", v = " + v);
				//var name = v.name;
				//console.log("name = " + name);
				var parents = v.parents;
				var canvas_this = findObjectInCanvasByid(v.id);

				if (parents !== null && parents.length > 0){
					console.log("parents = " + parents);
					var myCenter = new fabric.Point(v.x, v.y);
					$.each(parents, function(j, parentid) {
						// grep return an array
						var result = $.grep(listOfPoints, function(o){ 
							return o.id === parentid; 
						});
						//console.log("parentid = " + parentid + "; Parent result id = " + result[0].id);
						// draw arrow between v and result
						var temp_parent = result[0];
						//console.log("parentid = " + parentid + "; temp_parent = " + temp_parent);
						var canvas_parent = findObjectInCanvasByid(temp_parent.id);
						//console.log("find canvas parent = " + canvas_parent);
						// x:top y:left
						var boundary = findBoundary(temp_parent.x + temp_parent.priority.value, temp_parent.y  +temp_parent.priority.value, v.x  + v.priority.value, v.y + v.priority.value, v.priority.value);
			            var points = [ temp_parent.x  + temp_parent.priority.value, temp_parent.y  + temp_parent.priority.value, boundary.x, boundary.y];
			            //console.log("points = " + points);
			            // ADD arrow at the end
			            var arrow = new fabric.LineWithArrow(points, {
			              strokeWidth: 2,
			              //fill: 'red',
			              stroke: 'black',
			              originX: 'center',
			              originY: 'center',
			              selectable: false,
			              // Fabric
			              from: canvas_parent,
			              to: canvas_this
			            });

			            canvas.add(arrow);
			            canvas.sendToBack(arrow);
			            assignInToCircle(canvas_parent, arrow);
			            assignOutToCircle(canvas_this, arrow);
					});
				}
			});
		}

    function addNewPoint(json) {
    	// reset
    	listOfKnowledgePoints = [];
    	//var temp = json;
		//var json = '{"GetKnowledgePointsResult":[{"Course ID":"COMP2611 L1","Date of create":"26\/1\/2016 13:25:51","Date of last modified":"26\/1\/2016 13:25:51","Knowledge Point ID":1,"Knowledge point location X":0,"Knowledge point location Y":0,"Knowledge point parents":[],"PrKnowledge Point name":"binary system","Priority":"High","Related Assets":[{"Asset ID":1001,"Asset path":"\/L1\/introduction.pdf","Asset type":"PDF","Point of end":8,"Point of start":3},{"Asset ID":1002,"Asset path":"\/L1\/introduction.ppt","Asset type":"PPT","Point of end":2,"Point of start":1},{"Asset ID":1003,"Asset path":"\/L1\/introduction.acc","Asset type":"Audio","Point of end":25,"Point of start":0},{"Asset ID":1004,"Asset path":"\/L1\/introduction.mp4","Asset type":"Video","Point of end":300,"Point of start":0}],"Related message in Q&A":{"Course Id":"COMP2611 L1","Last modified date":"26\/1\/2016 13:25:51","Lecture session":null,"Message List":[{"Answer List":[],"Ask by":"ypy","Date of create":"26\/1\/2016 13:25:51","Q&A ID":1,"Question":"Is this the question 1?"},{"Answer List":[],"Ask by":"rv","Date of create":"26\/1\/2016 13:25:51","Q&A ID":2,"Question":"Is this the question 2?"},{"Answer List":[{"Answer":"\\path\\3\\Q3\\answer.acc","Answer type":"Audio"}],"Ask by":"wsf","Date of create":"26\/1\/2016 13:25:51","Q&A ID":3,"Question":"Is this answered question 3?"},{"Answer List":[{"Answer":"This is the answer of Q4","Answer type":"Text"}],"Ask by":"tmy","Date of create":"26\/1\/2016 13:25:51","Q&A ID":4,"Question":"Is this answered question 4?"}]},"Related self test set":[{"Answer Key":"This is answer key","Question":"This is self test question Q1 with answer"},{"Answer Key":null,"Question":"This is self test question Q2 without answer (might be drawing answer)"}]},{"Course ID":"COMP2611_L1","Date of create":"26\/1\/2016 13:25:51","Date of last modified":"26\/1\/2016 13:25:51","Knowledge Point ID":2,"Knowledge point location X":0,"Knowledge point location Y":1,"Knowledge point parents":[1],"PrKnowledge Point name":"binary addition","Priority":"Medium","Related Assets":[{"Asset ID":1007,"Asset path":"\/L1\/introduction.ppt","Asset type":"PPT","Point of end":6,"Point of start":5}],"Related message in Q&A":{"Course Id":"COMP2611_L1","Last modified date":"26\/1\/2016 13:25:51","Lecture session":null,"Message List":[]},"Related self test set":[]},{"Course ID":"COMP2611_L1","Date of create":"26\/1\/2016 13:25:51","Date of last modified":"26\/1\/2016 13:25:51","Knowledge Point ID":3,"Knowledge point location X":2,"Knowledge point location Y":1,"Knowledge point parents":[1],"PrKnowledge Point name":"binary substraction","Priority":"Medium","Related Assets":[{"Asset ID":1008,"Asset path":"\/L1\/introduction.ppt","Asset type":"PPT","Point of end":9,"Point of start":7}],"Related message in Q&A":{"Course Id":"COMP2611_L1","Last modified date":"26\/1\/2016 13:25:51","Lecture session":null,"Message List":[]},"Related self test set":[]},{"Course ID":"COMP2611_L1","Date of create":"26\/1\/2016 13:25:51","Date of last modified":"26\/1\/2016 13:25:51","Knowledge Point ID":4,"Knowledge point location X":0,"Knowledge point location Y":2,"Knowledge point parents":[2,3],"PrKnowledge Point name":"binary operation","Priority":"Low","Related Assets":[{"Asset ID":1009,"Asset path":"\/L1\/introduction.ppt","Asset type":"PPT","Point of end":10,"Point of start":10}],"Related message in Q&A":{"Course Id":"COMP2611_L1","Last modified date":"26\/1\/2016 13:25:51","Lecture session":null,"Message List":[]},"Related self test set":[]}]}';
		//var err =  temp.charCodeAt(2);
		//console.log("chars at 2 = " + temp.charAt(2) /*+json.charAt(1515)+json.charAt(1516)+json.charAt(1517)+json.charAt(1518)+json.charAt(1519)*/);
		//console.log("charCodeAt(2): " + err);

		// NOT WORKING, ERROR: JSON.parse: bad escaped character at line 1 column 1516 of the JSON data
		var obj = $.parseJSON(json);
    	//console.log("Length = " + Object.keys(obj.GetKnowledgePointsResult).length);
        $.each(obj.GetKnowledgePointListResult, function (i, v) {
        	console.log("-------------item " + i + "----------------");
        	// reset
        	listOfparents = [];
        	//listOfassets = [];
        	//listOfmessage = [];
        	var currentAsset_id, currentAsset_type, currentAsset_path, currentAsset_start, currentAsset_end;
        	traverse(v);
        	if (currentKP !== null){
        		$.each(currentKP.assets, function (j, w){
        			console.log("currentKP.assets[" + j + "] = "+ currentKP.assets[j].id + " , from " + currentKP.assets[j].path + ", (" + currentKP.assets[j].startpoint + ", " + currentKP.assets[j].endpoint + ")");
        		});
         		$.each(currentKP.qanda, function (j, w){
        			console.log("currentKP.qanda[" + j + "] = "+ currentKP.qanda[j].question);
        		});
        		$.each(currentKP.tests, function (j, w){
        			console.log("currentKP.selftest = {Q:"+ currentKP.tests[j].question +", A:"+ currentKP.tests[j].answer);
        		});      		
        		listOfKnowledgePoints.push(currentKP);
        	}
        });

		//that's all... no magic, no bloated framework
		//traverse(obj, process);

		drawArrows(listOfKnowledgePoints);
		//convertToJSON(listOfKnowledgePoints);
	}

	function findObjectInCanvasByid(id){
		var result;
		canvas.forEachObject(function(o){ 
			if (o.get('type') === 'group') {
				if (o.item(0).get('id') === id){
					//console.log("o.item(0).get('id') = " + o);
					result = o;
				}
			}
		});
		return result;
	}

	function convertToJSON(object){
		var json = JSON.stringify(object);
		//var json = $.toJSON(object);
		console.log("toJSON = " + json);
	}

	function buildjson(){
		var temp = listOfKnowledgePoints;
		var afteradding = updateKnowledgePoint();
		// find deleted objects
		var result;
		if (afteradding.length <= listOfKnowledgePoints.length){
			console.log("[buildjson] afteradding size <= listOfKnowledgePoints size ? " + true + "afteradding.length =" + afteradding.length + ", listOfKnowledgePoints.length = "+ listOfKnowledgePoints.length);
			result = afteradding;
		}
		// TODO!!!!!
		// find edited objects
		// change last modified date
		return result;
	}

	// update ListOfKnowledgePoint
	// then use toJSON
	function updateKnowledgePoint(){
		// How about deleted KP???
		var allpoints = new Array();
		canvas.forEachObject(function (o){
			console.log("[canvas.forEachObject]");
			var group = o;
			var updateresult;
			if (group.get('type') === 'group') {
				var id = group.item(0).get('id');
				console.log("group.item(0).get('id') = " + id);
				var result = $.grep(listOfKnowledgePoints, function(p){ 
					console.log("p.id = " + p.id);
					return p.id === id; 
				});
				console.log("[updateKnowledgePoint] allpoints.length = " + allpoints.length + ", updateresult = " + result[0] + ", result.length = " + result.length);
				if (result.length > 0){
					updateresult = result[0];		
				
					console.log("[updateKnowledgePoint] group type = " + group.get('type') + ", item(1) = " + group.item(1));
					updateresult.name = group.item(1).get('text');
					updateresult.x = group.get('left');
					updateresult.y = group.get('top');
					// convert into id
					var temp_outarrows = group.item(0).flowout;
					var newparents = [];
					$.each(temp_outarrows, function (i){
						// get the ids from parents
						// UNDEFined?
						console.log("temp_outarrows[i].from = " + temp_outarrows[i].from);
						newparents.push(temp_outarrows[i].from.item(0).get('id'));
					});
					updateresult.parents = newparents;
					console.log("tojson parents = " + JSON.stringify(updateresult.parents));

					// push into array
					allpoints.push(updateresult);
				}else {
					console.log("Error! KP not found");
				}
			}
		});
		return allpoints;
	}

	function saveKnowledgePointGraph(json){
		console.log(JSON.stringify({updatedKnowledgePointList: json}, null, 2));
	    $.ajax({
	      	type: "POST",
	      	url: '../FYPGetDataService.svc/updateKnowledgePoints',
	      	processData: true,
	      	data: JSON.stringify({updatedKnowledgePointList: json}),
			dataType: 'json',     //'application/json',
			contentType: "application/json",
			success: function(response){
			console.log("New json response = " + response);
				//addNewPoint(data);
			},
			// BAD REQUEST???
			error: function (xhr, ajaxOptions, thrownError) {
			  console.log(xhr.status);
			  console.log("error:  " + thrownError);
			},
			failure: function (response) {
			console.log(response.d);
			}
		});
	}

	function formatDate(date){
		var day = date.getDate();
		var month = date.getMonth() +1;
		var year = date.getFullYear();

		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();

		/*var tt = "AM";

		// formatting
		if (hour >= 12){
			hour = hour - 12;
			tt = "PM";
		}*/
		if (minute < 10){
			minute = '0'+minute;
		}
		if (second < 10){
			second = '0'+second;
		}

		var result = day+"/"+month+"/"+year + " "+hour+":"+minute+":"+second/*+" "+tt*/;

		return result;
	}

	function formatNameBySpace(name){
		return name.replace(/\n/g, " ");
	}

	// NOT working???
	function resizeCanvas(){
		var height = canvas.height;
		var width = canvas.width;
		// if object overflow canvas height
		var maxheight = 0;
		var maxwidth = 0;
		canvas.forEachObject(function(o){ 
			if (o.get('type') === 'group') {
				var center = o.getCenterPoint();
				var radius = o.item(0).get('radius');
				var object_height = center.x + radius;
				var object_width = center.y + radius;
				if (object_height > maxheight)
					maxheight = object_height;
				else if (object_width > maxwidth)
					maxwidth = object_width;
			}
		});

		if (maxheight > height)
			canvas.setHeight(maxheight);
		else if (maxwidth > width)
			canvas.setWidth(maxwidth);
		canvas.renderAll();

		//console.log("height = " + canvas.height);
	}

	// from http://jsfiddle.net/dudih/y0z33gym/1/?utm_source=website&utm_medium=embed&utm_campaign=y0z33gym
	/*
	var getFabricCanvases = (function () {
	    var fabricCanvasCollection;
	    return function getCanvases() {
	        if (!fabricCanvasCollection) {
	            fabricCanvasCollection = [];
	            var fabricCanvas = $('.canvas-container canvas');
	            fabricCanvas.each(function(index, item) {
	                fabricCanvasCollection.push($(item));
	            });
	        }
	        return fabricCanvasCollection;
	    }
	})();

	function zoomCalcYpos(yPos) {
	    if (yPos>0){
	        return 0;
	    }
	    if (yPos+canvas.getHeight() < canvasHeight) {
	        return canvasHeight - canvas.getHeight();
	    }
	    return yPos;
	}

	function zoomCalcXpos(xPos) {
	    if (xPos>0){
	        return 0;
	    }
	    if (xPos+canvas.getWidth() < canvasWidth){
	        return canvasWidth - canvas.getWidth();
	    }
	    return xPos;
	}*/

	// Zoom In
	function zoomIn() {
	    if(canvas.getZoom().toFixed(5) > zoomMax){
	        console.log("zoomIn: Error: cannot zoom-in anymore");
	        return;
	    }

	    canvas.setZoom(canvas.getZoom()*SCALE_FACTOR);
	    canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
	    canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);
	    canvas.renderAll();
	}

	// Zoom Out
	function zoomOut() {
	    if( canvas.getZoom().toFixed(5) <= zoomMin ){
	        console.log("zoomOut: Error: cannot zoom-out anymore");
	        return;
	    }

	    canvas.setZoom(canvas.getZoom()/SCALE_FACTOR);
	    canvas.setHeight(canvas.getHeight() / SCALE_FACTOR);
	    canvas.setWidth(canvas.getWidth() / SCALE_FACTOR);
	    canvas.renderAll();
	}

	// Reset Zoom
	function resetZoom() {

	    canvas.setHeight(canvas.getHeight() /canvas.getZoom() );
	    canvas.setWidth(canvas.getWidth() / canvas.getZoom() );
	    canvas.setZoom(1);

	    canvas.renderAll();

	    /*getFabricCanvases().forEach(function(item){
	        item.css('left', 0);
	        item.css('top', 0);
	    });*/

	}
	/*
	//panToByMouseCoords
	function panToByMouseCoords(xDelta, yDelta) {

	    getFabricCanvases().forEach(function(elementValue) {
	        var currentTop = Number(elementValue.css("top").replace(/[^\d\.\-]/g, '') );
	        var currentLeft = Number(elementValue.css("left").replace(/[^\d\.\-]/g, '') );

	        console.log("panToByMouseCoords:: (currentTop, yDelta): (" + currentTop + ", " + yDelta +")" +", (currentLeft, xDelta): (" + currentLeft + ", " + xDelta +")");

	        currentTop = zoomCalcYpos(currentTop + yDelta);
	        currentLeft = zoomCalcXpos(currentLeft + xDelta);
	        elementValue.css("top", currentTop);
	        elementValue.css("left", currentLeft);
	    });
	}*/


	function formatText(string){
		var newString = "";
		var words = string.split(' ');
		var length = words.length;
		console.log("[formatText] words = " + words);
		for (var index = 1; index <= length; index++){
			var str = words.slice(0, index).join(' ');
			var strlength = str.length;
			if (strlength > fixed_stringsize){
	            newString += words.slice(0, index - 1).join(' ');
	            newString += '\n';
	            words = words.splice(index - 1);
	            //length = words.length;
	            //index = 1;
	            console.log("[formatText] words.slice(0, " + (index - 1) +") = " + words.slice(0, index - 1));
			} 
		}
	    if (index > 0) {
	        var txt = words.join(' ');
	        newString += txt;
	    }
	    return newString;
	}

	/* tag tool .js */
	// validation
	function checkMin(input, min){
		if (input >= min)
			return true;
		else return false;
	}

	function checkMax(input, max){
		if (input <= max)
			return true;
		else return false;
	}

	function checkifInvalidExist(total){
		var exist = $("input").hasClass("invalid");
		if (exist)
			$('.information-container p').html("Input range should be 0 to " + total);
		else $('.information-container p').empty();
	}

	function keyupValidation(obj, max){

		console.log("on Keyup! this = " + obj);
		var result;
		var input = obj.val();
		var largerthenmin = checkMin(input, 0);
		var smallerthenmax = checkMax(input, max);
		//console.log("on Keyup input = " + input + ", largerthenmin = " + largerthenmin + ", smallerthenmax = " + smallerthenmax);
		if (largerthenmin === false || smallerthenmax === false ){
			//console.log("Invalid!");
			//$('p').html("Input range should be 0 to " + totalpages);
			obj.addClass("invalid");
			result = false;
		}
		else if (isNaN(input) || input === ""){
			obj.addClass("invalid");
			result = false;
		}else {
			if (obj.hasClass("invalid")){
				//console.log("hasClass invalid");
				//$('p').empty();
				obj.removeClass("invalid");
			}
			result = true;
		}
		checkifInvalidExist(max);
		return result;
	}

	//var result = $.grep(listOfKnowledgePoints, function(o){ return o.id === 1; });
	//console.log("currentKP.parents[0] = " + currentKP.parents[0] + ", listOfparents[1] = " + listOfparents[1]);
	//console.log("result id = " + result.id);
//};

//});