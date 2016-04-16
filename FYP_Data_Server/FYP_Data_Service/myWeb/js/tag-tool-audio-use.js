var totalDuration;

function popupAudioloaded(video){

	totalDuration = $("#audio-player").duration;

	// console.log("popupAudioloaded totalduration = " + totalDuration);

	var myAudio = $("#audio-player");

	myAudio.on('canplay', function (){
		totalDuration = Math.round(this.duration);
		console.log("recall myAudio = " + myAudio + " totalDuration = "+ totalDuration);
	//var totalTags = 1;
		// How to call slider??
		$("#tag-audio-slider").slider({
	      range: true,
	      min: 0,
	      max: totalDuration,
	      values: [ 0, totalDuration ],
	      slide: function( event, ui ) {
	      	console.log("ui.value = [" + ui.values[ 0 ] + ", " + ui.values[ 1 ] + "]");
	        $( "#audio-tag-start" ).val( ui.values[ 0 ] );
	        $( "#audio-tag-end" ).val( ui.values[ 1 ] );
	        if ($( "#audio-tag-start" ).parent().hasClass("has-error")){
				$( "#audio-tag-start" ).parent().removeClass("has-error");
			}
	        if ($( "#audio-tag-end" ).parent().hasClass("has-error")){
				$( "#audio-tag-end" ).parent().removeClass("has-error");
			}
	      }
	    });

	    $( "#audio-tag-start" ).val( 0 );
	    $( "#audio-tag-end" ).val( totalDuration );
	    //var width = 0.6 * 0.9 * 100;
	    //$('.ui-slider').width('50%');
		$("#audio-tag-start").on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o, totalDuration);
			//console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				$("#tag-audio-slider").slider('values', 0, $(this).val());
			}
		});

		$("#audio-tag-end").on('keyup', function (e){
			var o = $(this);
			var valid = keyupValidation(o, totalDuration);
			//console.log("valid = " + valid);
			if (valid){
				//console.log("$(this).val() = "+ $(this).val());
				$("#tag-audio-slider").slider('values', 1, o.val());
			}
		});
	});
}
