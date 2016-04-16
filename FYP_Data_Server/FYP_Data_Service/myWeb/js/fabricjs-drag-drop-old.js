	//
	//
	// tagging
	//
	// on drag & drop
	var dragdropMode = false;
	var dragging = false;

	var resource_class, dragging_originaldata;

	function allowDrop(event) {
		if (!dragdropMode) return;
		if (!dragging) return;
		event.preventDefault();
		console.log("ondragover"); //ev.preventDefault();
	}

	function drag(event) {
		if (!dragdropMode) return;
		//event.stopPropagation();
		//event.preventDefault();
	    event.originalEvent.dataTransfer.setData("text", event.target.id);
	    console.log("dragstart");
	    dragging = true;
	}


	function dragenter (event){
		event.preventDefault();
	}

	function drop(event) {
		//event.preventDefault();
		if (!dragdropMode) return;
		if (!dragging) return;
		//console.log("ondrop event = " + event);
	    event.preventDefault();
	    var data = event.originalEvent.dataTransfer.getData("text");
	    console.log("ondrop id = " + data + "$('#'+data) = " + $("#"+data));
	    dragging = false;
	    //var data = ev.dataTransfer.getData("text");
	    //ev.target.appendChild(document.getElementById(data));


	    // get back the original item
	    resource_class = data.substring(0, data.indexOf('-'));
	    // convert into int -> compare
	    var resource_id = parseInt(data.substring(data.lastIndexOf('-')+1, data.length));
	    console.log("ondrop original class = " + resource_class + ", id = " + resource_id);

	    var lists;
	    var object;
	    if (resource_class === "asset"){
	    	lists = listOfassets;
	    	// Without ID
	    	if (resource_id < 1000){
	    		console.log("lists[resource_id] = " + lists[resource_id] + " lists.length = " + lists.length);
	    		object = lists[resource_id];
	    		var currenttime = new Date();
	    		var formatted = formatDate(currenttime);
	    		object.create = formatted;
	    		object.lastmodified = formatted;
	    		console.log("object.lastmodified = " + object.lastmodified);
	    	// With ID 
	    	}else {
	    		var result = $.grep(lists, function (o){
		    		console.log("id = " + o.id);
		    		return o.id === resource_id;
		    	});
		    	object = result[0];
	    	}
	    }else if (resource_class === "message"){
	    	lists = listOfmessage;
	    	// With ID
		    var result = $.grep(lists, function (o){
		    	console.log("id = " + o.id);
		    	return o.id === resource_id;
		    }); 
		    //console.log("lists.length = " + lists.length + " result.length = " + result.length);
		    object = result[0];
	    }




	    dragging_originaldata = object;
	    // push into KP
	    var x = (event.originalEvent.clientX - ($('#canvas').offset().left - $('#canvas').scrollLeft())) - 2;
	    var y = (event.originalEvent.clientY - ($('#canvas').offset().top - $('#canvas').scrollTop())) - 2;

	    //console.log("event.clientX = " + event.originalEvent.clientX + " canvas.offsetLeft = " + $('#canvas').offset().left + " canvas.scrollLeft = " + $('#canvas').scrollLeft());

	    //var simulateEvent = new MouseEvent();
	    var hitKnowledgePoint = droponCanvas(resource_class, object, x, y);

	    if (hitKnowledgePoint && resource_class === "asset"){
		    // hide the dragging element
		    // ONLY when drag into a KP
		    //$("#"+data).hide();
		    //console.log("Hide data = " + data);
		    // Tagging popup
			// build tagging popup
			passAttributes(object);
	    }



	    // Error! drop event listener on container, not canvas!
	    /*var e = canvas.findTarget(event.e, false);
	    var targetKP;
	    if (e != null && e.get('type') === 'group'){
	    	var id = e.item(0).get('id');
	    	var id_result = $.grep(listOfKnowledgePoints, function (o){
	    		return o.id === id;
	    	});

	    	targetKP = id_result[0];
		}

	    if (resource_class === "asset"){
	    	targetKP.assets.push(object);
	    }else if (resource_class === "message"){
	    	targetKP.qanda.push(object);
	    }	    */
	}

	function clearIndividual(){
		$(".popup-header").empty();
		$(".assetslist").empty();
		$(".selftestlist").empty();
		$(".msglist").empty();
	}

	function clear2nd(){
		$("#individual-2nd-popup-header").empty();
		$("#individual-2nd-popup-content").empty();
	}

	function build2ndPopup(event){
		var path = $(this).attr('src');
		var temp_id = $(this).attr('id');
		// TODO id => 3xxx
		var id = temp_id.slice(6);
		var resource_class = $(this).attr('class');

		var type = path.substring(path.lastIndexOf(".") + 1, path.length);
		var title = $('<h4>'+path.substring(path.lastIndexOf("/") + 1, path.length)+'</h4>');
		
		console.log("clicked path = " + path + ", id = " + id + ", type = " + type);

		// var link = "tag-tool.html";
		clear2nd();
		var content;
		if (type === "pdf"){
			console.log("Type === pdf");
			content = $('<object data="' + path +'"></object>');
		}else if ($.inArray(type, videoType) !== -1){
			content = $('<video controls><source src="' + assetsURL + path +'" type="video/' + type + '"></video>');
		}else if ($.inArray(type, audioType) !== -1){
			content = $('<audio controls><source data="' + assetsURL + path + '" type="audio/' + type + '"></audio>');
		}

		title.appendTo($("#individual-2nd-popup-header"));

		content.appendTo($("#individual-2nd-popup-content"));
		console.log("title = " + title + ", content = " + content);
		$("#individual-2nd-popup").modal('open');		
	}

	// Tag Asset when drag on KP
	// Build pass into popup
	function passAttributes(file_object){
		var path = file_object.path;
		var id = file_object.id;
		// TODO id => 3xxx
		//var id = temp_id.slice(6);
		//var resource_class = $(this).attr('class');

		var type = path.substring(path.lastIndexOf(".") + 1, path.length);

		console.log("[passAttributes] path = " + path + ", id = " + id + ", type = " + type);

		// var link = "tag-tool.html";
		clearTagtoolpopup();
		if (type === "pdf"){
			
			//link = "tag-tool.html";
			createPDFpopup(id, dragdropMode);
		} else if ($.inArray(type, videoType) !== -1){
			console.log("[passAttributes] type == videoType");
			//link = "tag-tool-video.html";
			createVideopopup(id, dragdropMode);
		} else if ($.inArray(type, audioType) !== -1){
			console.log("[passAttributes] type == audioType");
			//link = "tag-tool-audio.html";
			createAudiopopup(id, dragdropMode);
		}
		Cookies.set('selected_asset_id', id, { expires: 1 });
		Cookies.set('selected_asset_path', path, { expires: 1 });
		// OFF first, otherwise will fire multiple times!!!
		$(".add-new-asset").off('click').on('click', addNewAsset);

		// window.location.assign(link);
		//clearPDFpopup();
		//createPDFpopup(id, dragdropMode);
		//createVideopopup(id, dragdropMode);

	}

	// filled in pop up lists
	function createIndividual(knowledgepointid, editmode, studentMode){
		var result = $.grep(listOfKnowledgePoints, function(o){ 
			return o.id === knowledgepointid; 
		});
		var KnowledgePoint = result[0];
		var id = KnowledgePoint.id;
		var assets = KnowledgePoint.assets;
		var parents = KnowledgePoint.parents;
		var tests = KnowledgePoint.tests;
		var messages = KnowledgePoint.qanda;

		var header = $('<h4 class="modal-title">'+KnowledgePoint.name+'</h4>');

		// Resources
		console.log("[editmode] = " + editmode + " Parents length = " + parents.length + "; Selftest length = " + tests.length + "; Msg length = " + messages.length);
		$.each(assets, function (i, item){
			console.log("[editmode] assets["+i+"] = " + item);
			var path = item.path;
			// id = -1, how to get back the taglist item?
			// console.log("item.id = " + item.id);
			var name = path.substring(path.lastIndexOf("/") + 1);
			var start = item.startpoint;
			var end = item.endpoint;

			//var oneitem = $('<li >');
			var oneasset = $('<a class="list-group-item" href="#individual-2nd-popup">[from:'+start + ' to ' + end + '] ' + name + '</a>');

			// On click -> build 2nd popup
			oneasset.on('click', function (event){
				clear2nd();
				//var asset_location = "../Asset/COMP_2611/Lecture_1/L1.pdf";
				var asset_location = assetsURL + name;

				console.log("CLicked Asset = " + asset_location + " assethtml ID = " + item.id + " start = " + start + " end = " + end);

				var title = $('<h4 class="modal-title">'+ name +"{from: " +start + ", to: " + end + "}"+'</h4>');
				var type = path.substring(path.lastIndexOf(".") + 1, path.length);

				var content;
				if (type === "pdf"){
					content = $('<object data="' + asset_location +"#page=" + start + '"></object>');
				}else if ($.inArray(type, videoType) !== -1){
					content = $('<video controls><source src="' + asset_location + '#t=' + start + ','+ end +'" type="video/' + type + '"></video>');
				}else if ($.inArray(type, audioType) !== -1){
					content = $('<audio controls><source src="' + asset_location +"#t=" + start + ','+ end + '" type="audio/' + type + '"></audio>');
				}

				title.appendTo($("#individual-2nd-popup-header"));

				content.appendTo($("#individual-2nd-popup-content"));

				//setTimeout( function(){ $( '.popupChild' ).popup( 'open' ) }, 1 );
				$("#individual-popup").modal('hide');
				//$("#individual-2nd-popup").popup('open');
				//$("#individual-2nd-popup").popup().enhanceWithin();
				$("#individual-2nd-popup").modal('show');
				setTimeout( function(){ $( '.popupChild' ).modal( 'show' ) }, 100 );
			});
			// Add delete button
			//var deleteicon = $('<a href="#" data-icon="delete">Delete</a>');
			var deleteicon = $('<span class="label label-default pull-right">Delete</span>'); //$('<span class="icon-remove pull-right"></span>');
			deleteicon.on('click', function(event){
				if (!editmode) return;
				console.log("Delete On click");
				var target = item;
				var item_id = target.id;
				var index = KnowledgePoint.assets.indexOf(target);
				KnowledgePoint.assets.splice(index, 1);
				
				// Show in tagging list AGAIN
				if (item_id !== -1 || item_id >= 3000){
					console.log("listOfassetslength = " + listOfassets.length);
					var result = $.grep(listOfassets, function (o){
						return o.id === item_id;
					});
					if (result.length > 1){
						console.log("Having more than 1 asset with id = " + item_id);
					}else if (result[0] == undefined){
						listOfassets.push(target);
						console.log("Not exist item_id = " + item_id);
						// How to still HIDE assigned assets??
						// displayAssetList(listOfassets);	
						//addNewAssetIntoHTML(target);
					}else{
						// Exist in listOfAssets
						$("#asset-"+item_id).show();
						console.log("Exist in listOfAssets with id. result[0] = " + result[0]);
					}
				}else {
					// item_id = -1 || item_id < 3000
					// TODO HOW to show it again???
					$("#asset-"+item_id).show();
					console.log("$('#asset-'+item_id) = " + "#asset-" + item_id);
					console.log("Exist in listOfAssets with id = -1");
				}
				// refresh the popup!!!
				oneasset.hide();
			});
			console.log("[editmode] deleteicon = " + deleteicon);

			if (!editmode){
				deleteicon.hide();
			}
			//oneasset.appendTo(oneitem);
			//deleteicon.appendTo(oneitem);
			deleteicon.appendTo(oneasset);
			//oneitem.appendTo($(".assetslist"));
			oneasset.appendTo($(".assetslist"));
		});

		if (tests.length > 0){
			$.each(tests, function (i, item){
				// undefined???
				var question = item.question;
				//console.log("question = " + question);
				var oneasset = $('<li>' + question + '</li>');
				oneasset.appendTo($(".selftestlist"));
			});			
		}else {
			/*var form = $('<form>', {
				'method': "post",
				'action': "selftest.php"
			});
			var hidden = $('<input type="hidden" name="id" value='+ id + '>');*/
			var test_button = $('<button class="list-group-item">Go to Selftest Page</button>');
			test_button.on('click',  function(){
				window.location.assign("graph-drag-drop.html");
			});

			//form.append(hidden);
			//form.append(test_button);
			//form.appendTo($(".selftestlist"));
			test_button.appendTo($(".selftestlist"));
		}


		$.each(messages, function (i, item){
			// undefined???
			var question = item.question;
			//console.log("question = " + question);
			var oneasset = $('<li><a>' + question + '</a></li>');

			// Add delete button
			var deleteicon = $('<a href="#" data-icon="delete">Delete</a>');
			deleteicon.on('click', function(event){
				console.log("Delete On click");
				var target = item;
				var index = KnowledgePoint.qanda.indexOf(target);
				KnowledgePoint.qanda.splice(index, 1);

				// Show in tagging list AGAIN
				$("#message-"+target.id).show();

				// refresh the popup!!!
				oneasset.hide();
			});
			//console.log("[editmode] deleteicon = " + deleteicon);

			if (!editmode){
				deleteicon.hide();
			}
			//messagehtml.appendTo(oneitem);
			deleteicon.appendTo(oneasset);


			oneasset.appendTo($(".msglist"));
		});

		header.appendTo($("#individual-popup-header"));

		//$('ul').listview('refresh');

		/*console.log("listOfKnowledgePoints[0] = " + listOfKnowledgePoints[0]);
		console.log("listOfKnowledgePoints[0].assets[0] = " + listOfKnowledgePoints[0].assets[0]);
		console.log("listOfKnowledgePoints[0].assets[0].path = " + listOfKnowledgePoints[0].assets[0].path);*/
	}

	/*function closePopup(){
		console.log("Closed 2nd");
		$("#2nd-popup").popup("close");
		$("#individual-popup").popup("open");
	}	*/
	
	// fill pdf popup
	function createPDFpopup(pdfid, editmode){
		if (!editmode) return;
		console.log("[createPDFpopup] pdfid = " + pdfid);
		var result = $.grep(listOfassets, function (o){ 
			// console.log("id = " + o.id);
			return o.id === parseInt(pdfid);
		});
		var temp_asset = result[0];
		console.log("[createPDFpopup] temp_asset = " + result);
		if (temp_asset == undefined){
			temp_asset = listOfassets[pdfid];
		}
		// untagged?
		// Not asset?
		//var asset = result[0];
		var asset = temp_asset;
		var id = asset.id;
		var path = asset.path;
		var name = path.substring(path.lastIndexOf("/") + 1);
		//var tests = asset.tests;
		//var messages = asset.qanda;

		var header = $('<h4 class="modal-title">'+name+'</h4>');
		
		$("#pdf-viewer").attr({
			data: path
		});
		
		// link to use.js??
		
		header.appendTo($("#tag-tool-pdf-header"));
		//$("#tag-tool-pdf-popup").trigger('popupPDFloaded');
		$("#tag-tool-pdf-popup").modal('open');
		popupPDFloaded(path);
	}
	
	function createVideopopup(videoid, editmode){
		if (!editmode) return;
		console.log("[createVideopopup] videoid = " + videoid);
		var result = $.grep(listOfassets, function (o){ 
			// console.log("id = " + o.id);
			return o.id === parseInt(videoid);
		});
		var temp_asset = result[0];
		console.log("[createVideopopup] temp_asset = " + result);
		if (temp_asset == undefined){
			temp_asset = listOfassets[videoid];
		}
		// untagged?
		// Not asset?
		var asset = temp_asset;
		var id = asset.id;
		var path = asset.path;
		var name = path.substring(path.lastIndexOf("/") + 1);
		var format = path.substring(path.lastIndexOf('.') +1);
		//var type = asset.type;
		//var tests = asset.tests;
		//var messages = asset.qanda;

		var header = $('<h4 class="modal-title">'+name+'</h4>');
		
		var source = $('<source src="' + assetsURL + path + '" type="video/' + format + '">');
		
		source.appendTo($("#video-player"));
		
		// link to use.js??
		
		header.appendTo($("#tag-tool-video-header"));
		
		// $("#tag-tool-video-popup").addClass('popup-visible').popup('open');
		$("#tag-tool-video-popup").modal('open');
		
		$("#video-player").on('canplay', function(){
			console.log("canplay");
			/*$("#tag-tool-video-popup").popup('reposition', {
			  positionTo: "window"
			});*/
		});

		popupVideoloaded(path);
	}

	function createAudiopopup(audioid, editmode){
		if (!editmode) return;
		console.log("[createAudiopopup] audioid = " + audioid);
		var result = $.grep(listOfassets, function (o){ 
			// console.log("id = " + o.id);
			return o.id === parseInt(audioid);
		});
		var temp_asset = result[0];
		console.log("[createAudiopopup] temp_asset = " + result);
		if (temp_asset == undefined){
			temp_asset = listOfassets[audioid];
		}
		// untagged?
		// Not asset?
		var asset = temp_asset;
		var id = asset.id;
		var path = asset.path;
		var name = path.substring(path.lastIndexOf("/") + 1);
		var format = path.substring(path.lastIndexOf('.') +1, path.length);
		//var type = asset.type;
		//var tests = asset.tests;
		//var messages = asset.qanda;

		var header = $('<h4 class="modal-title">'+name+'</h4>');
		
		var source = $('<source src="' + assetsURL + path + '" type="audio/' + format + '">');
		
		source.appendTo($("#audio-player"));
		
		// link to use.js??
		
		header.appendTo($("#tag-tool-audio-header"));
		
		// $("#tag-tool-video-popup").addClass('popup-visible').popup('open');
		$("#tag-tool-audio-popup").modal('open');
		
		$("#audio-player").on('canplay', function(){
			console.log("canplay");
			/*$("#tag-tool-audio-popup").popup('reposition', {
			  positionTo: "window"
			});*/
		});

		popupAudioloaded(path);
	}

	function clearTagtoolpopup(){
		//console.log("clearTagtoolpopup");
		//$("#tag-tool-video-popup").removeClass('popup-visible');
		$(".tag-tool-popup-header").empty();
		$(".invalid-information").empty();
		$(".tag-start").val("");
		$(".tag-end").val("");
		// remove red
        if ($( ".tag-start" ).hasClass("invaid")){
			$( ".tag-start" ).removeClass("invalid");
		}
        if ($( ".tag-end" ).hasClass("invaid")){
			$( ".tag-end" ).removeClass("invalid");
		}
		$(".asset-name").val("");
	}

	function getMessageBox(courseCode, courseNumber){
		$.ajax({
		  type: "GET",
		  url: "../FYPGetDataService.svc/getMessageBox/"+courseCode+'_'+courseNumber,
		  processData: true,
		  //date: {'course code': course, 'course number': 'L1'},
		  // "The advent of JSONP — essentially a consensual cross-site scripting hack — has opened the door to powerful mashups of content."
		  dataType: 'json', 		//'application/json',
		  success: function(data){
		  	console.log("Get JSON MessageBox"); // + JSON.stringify(data, null, 4));
		  	displayMessageBox(JSON.stringify(data));
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

	function getAllMaterials(){
		//var assets = getAssets(courseCode, courseNumber);
		var messageBox = getMessageBox(courseCode, courseNumber);
	}

	function displayMessageBox (data){
		readjsonMessageBox(data);

		//
		$.when($.each(listOfmessage, function (i, v) {
			var messagehtml = $('<li id="message-'+v.id+'" class="list-group-item" draggable="true">'+v.question+'</li>');
			messagehtml.on('dragstart', drag);
			//messagehtml.draggable({ opacity: 0.7, helper: "clone" });
			messagehtml.appendTo($(".all-msglist"));
		})).done(function (){
			//;
			//$('ul').listview('refresh');
		});
		
	}

	function readjsonMessageBox(data){
		listOfmessage = [];
		var obj = $.parseJSON(data);
		var messageList = obj.GetMessageBoxResult["Message List"];

		$.each(messageList, function (i, v) {
			var listOfAnswer = [];
			var currentMessage;

			var question = v["Question"];
			var askBy = v["Ask by"];
			var id = v["Q&A ID"];
			var createdate = v["Date of create"];

			var answerList = v["Answer List"];

			$.each(answerList, function (j, w) {
				var answer_content = w["Answer"];
				var answer_type = w["Answer type"];
				var currentAnswer = new answer(answer_content, answer_type);

				listOfAnswer.push(currentAnswer);
			});

			currentMessage = new QandA(id, askBy, question, answerList, createdate);

			if (currentMessage !== null)
				listOfmessage.push(currentMessage);
		});
	}

	function droponCanvas(object_class, object, x, y){
		//var e = canvas.findTarget(event, false); 
		var point = new fabric.Point(x, y);
		var target_id;
		console.log("object = " + object + "(point = " + point.x + ", " + point.y + ")");
		canvas.forEachObject(function(o){ 
			if (o.get('type') === 'group') {
				var isFound = o.containsPoint(point);
				console.log("isFound = " + isFound);
				if (isFound)
					target_id = o.item(0).get('id');
			}
		});
		var targetKP;
		console.log("target_id = " + target_id );
		//if (e != null && e.get('type') === 'group'){
	    	//var id = e.item(0).get('id');
	    	var id_result = $.grep(listOfKnowledgePoints, function (o){
	    		return o.id === target_id;
	    	});

	    	targetKP = id_result[0];
	    	// On drop -> OPen 2nd popup
	    	if (targetKP != null){
	    		currentKP = targetKP;
		    	console.log("KP o.item(0).get('id') = " + target_id + " targetKP = " + targetKP);

			    if (object_class === "asset"){
			    	//targetKP.assets.push(dragging_originaldata);
			    	console.log("dragging_originaldata = " + dragging_originaldata);
			    }else if (object_class === "message"){
			    	targetKP.qanda.push(dragging_originaldata);
			    	console.log("dragging_originaldata = " + dragging_originaldata);
				}
				return true;	    		
	    	}

		console.log("dragging_originaldata = " + dragging_originaldata);
		return false;	
	}

	function traceFileList(html){
		var temp_string = html.split('<br>');
		
		//console.log("temp_string.length = " + temp_string.length);

		$.each(temp_string, function (i){
			//console.log("temp_string["+i+"] = " + temp_string[i]);
		});

		var fileList = temp_string.slice(2, temp_string.length - 1);
		// format into path + filename
		$.each(fileList, function (i){
			fileList[i] = fileList[i].slice(fileList[i].indexOf('A HREF="') + 8, fileList[i].lastIndexOf("</A>"));
		});


		//console.log("fileList = " + fileList);

		createAssetList(fileList);
	}

	function createAssetList(list){
		listOfassets = [];

		$.each(list, function (i){
			var path = list[i].slice(0, list[i].indexOf('">'));
			console.log("asset path = " + path);
			var name = list[i].slice(list[i].indexOf('">') + 2, list[i].length - 4);
			var type = list[i].slice(-3, list[i].length);
			// Generate ID match with db
			// Server X this interface
			// for fileupload simulate
			var id = 3000;
			var temp_filename = path.substring(path.lastIndexOf("/") +1) ;
			if (temp_filename === "COMP2611.mp4"){
				id = 3006;
			}else if (temp_filename === "intro.pdf"){
				id = 3005;
			}else if (temp_filename === "L1.pdf"){
				id = 3000;
			}else if (temp_filename === "sample.wav"){
				id = 3007;
			}

			var oneasset = new asset(id/*i*//*-1*/, assetsURL+temp_filename , type, -1, -1, null, null);
			console.log("[createAssetList] Name(path) = " + temp_filename + "(" + path + "), id = " + id);
			listOfassets.push(oneasset);
		});

		console.log("[createAssetList] listOfassets.length = " + listOfassets.length);
		// console.log("listOfassets[0] = " + listOfassets[0].path + ", listOfassets[1] = " + listOfassets[1].type);

		displayAssetList(listOfassets);
	}

	function displayAssetList(list){
		$('.all-assetslist').empty();

		$.when($.each(list, function (i, v) {
			console.log("lists["+i+"] = " + v);
			var path = v.path.slice(v.path.lastIndexOf('/') + 1);
			var temp_id;
			if (v.id === -1)
				temp_id = i;
			else temp_id = v.id
			var icon;
			var type = v.type;
			if (type === "pdf"){
				icon = "glyphicon glyphicon-file";
			}else if ($.inArray(type, audioType) !== -1){
				icon = "glyphicon glyphicon-volume-up";
			}else if($.inArray(type, videoType) !== -1){
				icon = "glyphicon glyphicon-facetime-video";
				
			}
			var assethtml = $('<li id="asset-'+temp_id+'" draggable="true" class="asset list-group-item" src="'+v.path+'"><span class="'+ icon + '"></span> '+path+'</li>');
			assethtml.on('dragstart', drag);
			assethtml.on('click', build2ndPopup);
			//messagehtml.draggable({ opacity: 0.7, helper: "clone" });
			assethtml.appendTo($(".all-assetslist"));
		})).done(function (){
			//;
			//$('ul').listview('refresh');
		});
	}

	function addNewAsset(event){
		console.log("[addNewAsset]");
		var start = $(".ui-popup-active .tag-start").val();
		var end = $(".ui-popup-active .tag-end").val();
		var name = $(".ui-popup-active .asset-name").val();
		var id = Cookies.get('selected_asset_id');
		var path = Cookies.get('selected_asset_path');

		if (name == ""){
			alert("Please input asset name!");
			return;
		}
		console.log("end = " + end);
		addNewAssetIntoList(id, path, name, start, end);
		
		console.log("addNewAsset start = " + start + ", end = " + end + ", name = " + name + ", **id = " + id + ", path = " + path);

		$(".ui-popup-active .ui-popup").modal('close');
	}

	function addNewAssetIntoList(id, path, name, start, end){
		var now = new Date();
		var formattedDate = formatDate(now);
		var type = path.substring(path.lastIndexOf(".") + 1);
		//if (id < 1000)
			//id = -1;
			//id = listOfassets.length -1;
		var oneasset = new asset(id, path, type, start, end, formattedDate, formattedDate);
		console.log(JSON.stringify(oneasset));
		listOfassets.push(oneasset);
		if (currentKP != null)
			currentKP.assets.push(oneasset);
		console.log("listOfassets.length = " + listOfassets.length + ", oneasset = " + oneasset);

		// displayAssetList(listOfassets);
		// ONLY display newly added asset
		//addNewAssetIntoHTML(oneasset);
	}

	function addNewAssetIntoHTML(newasset){

		console.log("addNewAssetIntoHTML");
		var path = newasset.path.slice(newasset.path.lastIndexOf('/') + 1);
		var temp_id = newasset.id; //listOfassets.length -1; //newasset.id;
		console.log("temp_id = " + temp_id);
		var assethtml = $('<li id="asset-'+temp_id+'" draggable="true" class="asset list-group-item" src="'+newasset.path+'">'+path+'</li>');
		assethtml.on('dragstart', drag);
		assethtml.on('click', build2ndPopup);
		//messagehtml.draggable({ opacity: 0.7, helper: "clone" });
		assethtml.appendTo($(".all-assetslist"));

		//$('ul').listview('refresh');
	
	}


$(document).ready(function(){

	studentMode = false;

	canvas = new fabric.Canvas('canvas', { 
	    selection: false,
	    backgroundColor: '#F0F0F0'
	});

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

	// create SAVE button
	var save_button = $('<button id="save">Save</button>');
    save_button.on('click', function(event) {
      var json = buildjson(); //canvas.toJSON(['to'], ['from'], ['flowin'], ['flowout']);
      canvas.includeDefaultValues = false;
      console.log("[toJSON] = " + JSON.stringify(json, null, 2));
      saveKnowledgePointGraph(json);
      dragdropMode = false;
      $("#edit-drag-drop").show();
      save_button.hide();
    });
    save_button.insertAfter($("#workarea-canvas-container"));
    save_button.hide();

	$("#edit-drag-drop").on('click', function(event){
		dragdropMode = true;
		$("#edit-drag-drop").hide();
		save_button.show();
		console.log("dragdropMode = " + dragdropMode);
	});

	$("#link-to-draw").on('click', function(event){
		window.location.assign("fabric-draw.html");
	});

	//$('[data-role="listview"]').find('.ui-btn-icon-left').removeClass('ui-btn-icon-left').addClass('ui-btn-icon-right');

	// template
	var li_tag = $('<li>');

	/*var temp_img = $('<img>', {
		'class': "asset",
		'id': "asset-1",
		'src': "img/zoom-in.png",
		//'draggable': true,
	});
	temp_img.on('dragstart', function (event){
		if (!dragdropMode) return;
	    event.originalEvent.dataTransfer.setData("text", event.target.id);
	    console.log("dragstart");
	    dragging = true;
	});
	temp_img.on('click', passAttributes);
	li_tag.append(temp_img);
	console.log(li_tag.html());
	li_tag.appendTo($(".all-assetslist"));*/

	$( '.popupParent' ).on({
		popupafterclose: function() {
			//console.log("popupafterclose");
			//setTimeout( function(){ $( '.popupChild' ).popup( 'open' ) }, 1 );
		}
	});

	canvas.on('mouse:down', function(o){
		var e = canvas.findTarget(o.e, false); //canvas.getActiveObject();
		//console.log("e = " + e + "; o.e = " + o.e);
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

	/*canvas.on('mouse:up', function (o){
		console.log("canvas.on('mouse:up')");
		if (!dragging) return;
			var e = canvas.findTarget(o.e, false); 
			var targetKP;
			if (e != null && e.get('type') === 'group'){
		    	var id = e.item(0).get('id');
		    	var id_result = $.grep(listOfKnowledgePoints, function (o){
		    		return o.id === id;
		    	});

		    	targetKP = id_result[0];
			}

		    if (resource_class === "asset"){
		    	//targetKP.assets.push(dragging_originaldata);
		    }else if (resource_class === "message"){
		    	targetKP.qanda.push(dragging_originaldata);
			}
			console.log("dragging_originaldata = " + dragging_originaldata);
	});*/

	/*canvas.droppable({
		over: allowDrop,
		drop: drop
	});*/
	var canvas_container = $(".canvas-container");
	canvas_container.on('dragover', allowDrop);
	canvas_container.on('drop', drop);

	//var canvas_html = $("#canvas");
	//console.log("canvas_html = " + canvas_html);
	//canvas_html.on('drag', allowDrop);
	//canvas_html.on('drop', drop);

	//canvas.on('drop', drop); //{
		// drop(event)

	//});


	//canvas.on('dragover', allowDrop); //function(event){
		// allowDrop(event)

	//});
	// jQuery UI
	/*canvas.draggable({
		accept: "img";
		drop: drop()
	}) */

	updateGraph(courseCode, courseNumber);

	getAllMaterials();

		$.ajax({
		  type: "GET",
		  url: assetsURL,
		  //processData: true,
		  //date: {'course code': course, 'course number': 'L1'},
		  // "The advent of JSONP — essentially a consensual cross-site scripting hack — has opened the door to powerful mashups of content."
		  //dataType: 'json', 		//'application/json',
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

	$("#tab1 a:last").on('shown.bs.tab', function (event) {
		dragdropMode = true;
		console.log("Asset tab on show, dragdropMode = " + dragdropMode);
	});

	$("#tab1 a:last").on('hidden.bs.tab', function (event) {
		dragdropMode = false;
		console.log("Asset tab on show, dragdropMode = " + dragdropMode);
	});

	$("#tab1 a:last").on('shown.bs.tab', function (event) {
		editmode = true;
		console.log("Asset tab on show, editmode = " + dragdropMode);
	});

	$("#tab1 a:last").on('hidden.bs.tab', function (event) {
		editmode = false;
		console.log("Asset tab on show, editmode = " + editmode);
	});	

});