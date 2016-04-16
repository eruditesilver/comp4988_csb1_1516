var totalDuration;

function popupVideoloaded(video){

	totalDuration = $("#video-player").duration;

	console.log("popupVideoloaded totalduration = " + totalDuration);

	var myVideo = $("#video-player");

	myVideo.on('canplay', function (){
		totalDuration = Math.round(this.duration);
		console.log("recall myVideo = " + myVideo + " totalDuration = "+ totalDuration);
	//var totalTags = 1;
		// How to call slider??
		$("#tag-video-slider").slider({
	      range: true,
	      min: 0,
	      max: totalDuration,
	      values: [ 0, totalDuration ],
	      slide: function( event, ui ) {
	      	// console.log("ui.value = [" + ui.values[ 0 ] + ", " + ui.values[ 1 ] + "]");
	        $( "#video-tag-start" ).val( ui.values[ 0 ] );
	        $( "#video-tag-end" ).val( ui.values[ 1 ] );
	        if ($( "#video-tag-start" ).parent().hasClass("has-error")){
				$( "#video-tag-start" ).parent().removeClass("has-error");
			}
	        if ($( "#video-tag-end" ).parent().hasClass("has-error")){
				$( "#video-tag-end" ).parent().removeClass("has-error");
			}
	      }
	    });

	    $( "#video-tag-start" ).val( 0 );
	    $( "#video-tag-end" ).val( totalDuration );
	    //var width = 0.6 * 0.9 * 100;
	    //$('.ui-slider').width('50%');
		$("#video-tag-start").on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o, totalDuration);
			//console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				$("#tag-video-slider").slider('values', 0, $(this).val());
			}
		});

		$("#video-tag-end").on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o, totalDuration);
			//console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				$("#tag-video-slider").slider('values', 1, o.val());
			}
		});
	});
}
