function login(){
	console.log("Start login");
	var username = $("#username").val();
	var password = $("#password").val();
	var date = new Date();
	var minutes = 30;
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	$.ajax({
		url:'../FYPGetDataService.svc/loginToSystem/'+username+'_'+password,
		dataType: 'JSON',
		method: 'GET',
		success:function(response){
			console.log(response);
			if (response == null){
					alert("Incorrect username or password, Please try again!");
				}
				else{
					if(response.loginToSystemResult.type=="Instructor"){
						alert(response.loginToSystemResult.name+", Welcome to Comp2611 Distributed Tool");
						window.location.href = "Home_Ins.html";
					}	
					else{
						var userId = response.loginToSystemResult.id;
						Cookies.set('userId', userId, { expires: date });
						alert(response.loginToSystemResult.name+", Welcome to Comp2611 Distributed Tool");
						window.location.href = "Home_Stu.html";
					}
				}
		},
	})
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function refresh_message_box(){
	$.ajax({
		url: '../FYPGetDataService.svc/getMessageBox/'+courseCode+'_'+courseNumber,
		dataType:"json",
		method:'get',
		success: function (data) {
			console.log(data);
			$("#msg-area").html('');
			var message_list = data.GetMessageBoxResult["Message List"];
			for (var i=0; i<message_list.length; i++) {
				var message = message_list[i];
				var line = message["Ask by"]+" : "+message.Question;
				line += "<br />";
				var time = message["Date of create"];
				line += "<div style='float:right;font-size:15px'>"+time+"</div>";
				line += "<br />";
				var answer_list = message["Answer List"];
				for (var j=0; j<answer_list.length; j++) {
					var answer = answer_list[j];
					//audio part not finished
					if (answer["Answer type"] == "Text") {
						//line += "<br />";
						line += "<span class='professor_answer'>"+ "Answer : "+answer.Answer+"</span>";
					}
					if (answer["Answer type"] == "Audio") {
						//Audio
					}
				}
				$("#msg-area").append('<div class="msg animated bounceInRight" msg_id="'+message["Q&A ID"]+'">'+line+'</div>');
				$("#msg-area").append("<br />");
			}
			$("#msg-area").scrollTop($("#msg-area").height());
		},
		error: function (err) {
			//alert(err);
		}

	});
	
}

function send_message(){
	console.log("Start sending");
	var message = $("#msginput").val();
	$.ajax({
		url: '../FYPGetDataService.svc/insertNewMessage/'+courseCode+'_'+courseNumber+'/'+userId+'_'+message,
		dataType: 'JSON',
		method: 'GET',
		success: function(response){
			refresh_message_box();
			$("#msginput").val('');
			console.log('message sent success, response: '+response);
		},

	});
}

function instrcutor_reply_message(msg_id){
	var reply_message = $("#reply_msginput").val();
	// var test_message = {};
	// test_message[0] = "msg1";
	// test_message[1] = "msg2";
	// reply_message = encodeURIComponent(JSON.stringify(test_message));
	// reply_message = "1234, 123";
	console.log(reply_message);
	var answer_type = "2101";
	$.ajax({
		url: '../FYPGetDataService.svc/insertNewMessage/'+courseCode+'_'+courseNumber+'/'+msg_id+'_'+answer_type+'_'+reply_message,
		dataType: 'JSON',
		method: 'GET',
		success: function(response){
			refresh_message_box();
			$("#reply_msginput").val('');
			console.log('message sent success, response: '+response);
		},

	});
}

