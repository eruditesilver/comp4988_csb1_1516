
var totalpages;

var pdfObject;

function popupPDFloaded(pdf){

	console.log("popupPDFloaded");
	pdfObject = pdf;
	var totalTags = 1;
	
	PDFJS.getDocument(pdf).then(function(pdfFile) {
	    var pageNumber = 1;
		totalpages = pdfFile.numPages;
		console.log('# Document Loaded');
		console.log('Number of Pages: ' + totalpages);

		/*$(".page-end").attr({
			'max': totalpages,
			'value': totalpages
		});
		$(".page-start").attr({
			'max': totalpages,
		});*/

		console.log("recall totalpages = "+totalpages);

		// How to call slider??
		$("#tag-slider").slider({
	      range: true,
	      min: 0,
	      max: totalpages,
	      values: [ 0, totalpages ],
	      slide: function( event, ui ) {
	      	console.log("ui.value = [" + ui.values[ 0 ] + ", " + ui.values[ 1 ] + "]");
	        $( "#tag-start" ).val( ui.values[ 0 ] );
	        $( "#tag-end" ).val( ui.values[ 1 ] );
	        if ($( "#tag-start" ).parent().hasClass("has-error")){
				$( "#tag-start" ).parent().removeClass("has-error");
				//$( "#tag-start" ).removeClass("invalid");
			}
	        if ($( "#tag-end" ).parent().hasClass("has-error")){
				//$( "#tag-end" ).removeClass("invalid");
				$( "#tag-end" ).parent().removeClass("has-error");
			}
	      }
	    });
	    /*$( "#page-start-1" ).attr({
	    	min: 0,
	    	max: totalpages 
	    });
	    $( "#page-end-1" ).attr({
	    	min: 0,
	    	max: totalpages 
	    });*/
	    $( "#tag-start" ).val( 0 );
	    $( "#tag-end" ).val( totalpages );
	    //var width = 0.6 * 0.9 * 100;
	    //$('.ui-slider').width('50%');
		$("#tag-start").on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o, totalpages);
			console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				$("#tag-slider").slider('values', 0, $(this).val());
			}
		});

		$("#tag-end").on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o, totalpages);
			console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				$("#tag-slider").slider('values', 1, o.val());
			}
		});
/*
    	// Fetch the page.
	    pdfFile.getPage(1).then(function (page) {
			var scale = 1.5;
			var viewport = page.getViewport(scale);

			// Prepare canvas using PDF page dimensions.
			var canvas = document.getElementById('canvas-viewer');
			var context = canvas.getContext('2d');
			//canvas.height = viewport.height;
			canvas.width = viewport.width;

			// Render PDF page into canvas context.
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			page.render(renderContext);
	    });

	    var currPageNumber = 1;

		var openNextPage = function() {
		    var pageNumber = Math.min(pdfFile.numPages, currPageNumber + 1);
		    if (pageNumber !== currPageNumber) {
		        currPageNumber = pageNumber;
		        openPage(pdfFile, currPageNumber);
		    }
		};

		var openPrevPage = function() {
		    var pageNumber = Math.max(1, currPageNumber - 1);
		    if (pageNumber !== currPageNumber) {
		        currPageNumber = pageNumber;
		        openPage(pdfFile, currPageNumber);
		    }
		};*/
	});

	/*$("#add-new-ppt-asset").on('click', function(event){
		console.log("add-new-ppt-asset Clicked!");
		var from = pdfObject;
		var name = $("#pdf-asset-name").val();
		var start = $("#tag-start").val();
		var end = $("#tag-end").val();
		var createdate = new Date();
		/*var container = $('<div>', {
			'id': "slider-"+newtag,
			'class': "ui-grid-b"
		});
		var start_container = $('<div>', {
		 'class': "page-start-container ui-block-a",
		 'style':"width:20%;"
		});
		var start_label = $('<label>', {
			'for': "page-start-"+newtag,
		});
		start_label.html("Start:");
		var start_text = $('<input>', {
			'type':"text",
			'name':"page-start-"+newtag,
			'class': "page-start",
			'id': "page-start-"+newtag
		});
		start_container.append(start_label).append(start_text);

		var slider_container = $('<div>', {
		 'class': "page-range-container ui-block-b",
		 'style':"width:60%;",
		 'id': "page-slider-"+newtag
		});

		var end_container = $('<div>', {
		 'class': "page-end-container ui-block-c",
		 'style':"width:20%;"
		});

		var end_label = $('<label>', {
			'for': "page-end-"+newtag,
		});
		end_label.html("End:");
		var end_text = $('<input>', {
			'type':"text",
			'name':"page-end-"+newtag,
			'class': "page-end",
			'id': "page-end-"+newtag
		});
		end_container.append(end_label).append(end_text);

		container.append(start_container).append(slider_container).append(end_container);
		// jQuery mobile adds its own styles and classes at Page load.
		//The element which are added later need to .trigger("create"); 
		// TO let jQuery mobile adds styles and classes to new elements added .
		container.appendTo($("#slider-container")).enhanceWithin();

		totalTags = totalTags +1;

		slider_container.slider({
	      range: true,
	      min: 0,
	      max: totalpages,
	      values: [ 0, totalpages ],
	      slide: function( event, ui ) {
	      	console.log("ui.value = [" + ui.values[ 0 ] + ", " + ui.values[ 1 ] + "]");
	        start_text.val( ui.values[ 0 ] );
	        end_text.val( ui.values[ 1 ] );
	        if (start_text.hasClass("invaid")){
				start_text.removeClass("invalid");
			}
	        if (end_text.hasClass("invaid")){
				end_text.removeClass("invalid");
			}
	      }
	    });
	    start_text.val( 0 );
	    end_text.val( totalpages );

	    start_text.on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o);
			//console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				slider_container.slider('values', 0, o.val());
			}
	    });
		end_text.on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o);
			//console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				slider_container.slider('values', 1, o.val());
			}
		});
	});*/

	//$('.slider-container').on('slidestop', function (event){
		//console.log("Slide stop on: ");
	//});

	//$("#pdf-viewer").setHeight();

	/*$(".page-start").on('keyup',function (e){
		var input = $(this).val();

	});

	$(".page-end").on('keyup',function (e){

	});*/

	$("#add-new-tag").on('click', function (event){
		
	});

}