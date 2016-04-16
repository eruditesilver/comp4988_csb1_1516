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
		
		var name = path.substring(path.lastIndexOf("/") + 1);
		
		console.log("clicked path = " + path + ", id = " + id + ", type = " + type);

		// var link = "tag-tool.html";
		clear2nd();
		var content;
		if (type === "pdf"){
			console.log("Type === pdf");
			content = $('<object data="' + path +'"></object>');
		}else if ($.inArray(type, videoType) !== -1){
			content = $('<video controls><source src="' + assetsURL + name +'" type="video/' + type + '"></video>');
		}else if ($.inArray(type, audioType) !== -1){
			content = $('<audio controls><source src="' + assetsURL + name + '" type="audio/' + type + '"></audio>');
		}

		title.appendTo($("#individual-2nd-popup-header"));

		content.appendTo($("#individual-2nd-popup-content"));
		console.log("title = " + title + ", content = " + content);
		$("#individual-2nd-popup").modal('show');		
	}
	
	// filled in pop up lists
	function createIndividual(knowledgepointid, popIndividual, studentMode){
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
		console.log("[dragdropMode] = " + popIndividual + " Parents length = " + parents.length + "; Selftest length = " + tests.length + "; Msg length = " + messages.length);
		$.each(assets, function (i, item){
			console.log("[dragdropMode] assets["+i+"] = " + item);
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
				if (!popIndividual) return;
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
				oneasset.off('click');
				oneasset.hide();
			});
			console.log("[dragdropMode] deleteicon = " + deleteicon);

			if (!popIndividual){
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

			if (!popIndividual){
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

var dragdropMode = false;
var studentMode = true;

$(document).ready(function(){

	canvas = new fabric.Canvas('canvas', { 
	    selection: false,
	    backgroundColor: '#F0F0F0'
	});

	canvas.setHeight(1000);
	//canvas.setHeight(window.innerHeight * 0.9);
	canvas.setWidth(1500);
	canvas.renderAll();

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

	updateGraph(courseCode, courseNumber);



});