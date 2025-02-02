var clientId = "r_g_UZdbr6k9kEHi6Kjinpvj-G9OQl7IqeWJgjdG";
var clientSecret = "mnIb1ZLkF6xA-qRM2TxpdQCIrag44SKeTYEmL_aT";
var accessToken = "";

(function() {
	window.addEventListener("load", function() {
		// this.accessToken = 'g9h6FG0W7avkgKz2F0yfz8Lh3N71SB';
		// adding multiple tag lines....

		getToken();

		function deselect(e) {
  			$('.pop').slideFadeToggle(function() {
    			e.removeClass('selected');
  			});    
		}

		$('#upload-url').on('click', function() {
    		if($(this).hasClass('selected')) {
     			deselect($('#popup'));               
    		} else {
      			$(this).addClass('selected');
      			$('.pop').slideFadeToggle();
    		}
    		return false;
  		});

  		$('.close').on('click', function() {
    		deselect($('#contact'));
    		return false;
  		});

  		$.fn.slideFadeToggle = function(easing, callback) {
			return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
		};

		var tagline = new Array();
		tagline.push("Give us an image and well turn it into feels");
		tagline.push("Your poetry is too mainstream to belong here");
		tagline.push("It's meh, da best");
		tagline.push("Not as dope as Disneyland");
        tagline.push("The Llama's inner goddess");

		document.getElementById("tagline").innerHTML = 
			tagline[Math.floor(tagline.length * Math.random())];

		$('#close-popup').on('click', function() {
			deselect($(this));
		});

		$("#upload-file").on("click", function () {
			console.log("file-change");
		});

		$("#upload-url").on("click", function() {
            newQuery();
        });

		//ajax call to our node server
		function sendToServer(data) {
			$.ajax( "/api/poems",
			{
				'data' : { "data" : data.results[0].result.tag.classes },
				'dataType' : 'json',
				'method' : "POST",
				'success' : function(data) { initPopup(data) },
				'error' : function(e) {
					reportClarifaiError();
				}
			});
		}

		function reportClarifaiError() {
			reportError("Sorry :( Your access token may have expired. Try reloading the page!");
		}

		function tryAgain() {
			reportError("Sorry, try again!");

		}

		function reportError(body) {
			console.log("error");
			var popup = $('#popup');
			popup.blur();
            var par = $("#popup p");
            for(var i = 0; i < par.length; i++) {
                par[i].remove();
            }

            
        	var p = document.createElement("P");
			p.innerHTML = body;
			popup.append(p);
		}

		var initPopup = function(data) {
			console.log("Success");
			var img = $('upload-url').innerHTML;
			// img = "url('" + img + "');";
			//$('.messagepopup').style.backgroundImage = img;

			// var blur = $('.blur');//.blur();
			// blur.blur();

			var popup = $('#popup');
			popup.blur();
            var par = $("#popup p");
            for(var i = 0; i < par.length; i++) {
                par[i].remove();
            }

            data.forEach(function(tag) {
				var p = document.createElement("P");
				p.innerHTML = tag;
				popup.append(p);
				var btn = $('#upload-url');
	    		if(btn.hasClass('selected')) {
	     			// deselect($(this));               
	    		} else {
	      			btn.addClass('selected');
	      			$('.pop').slideFadeToggle();
	    		}
			});
    		return false;
		}

        document.getElementById("paste-url").addEventListener("keydown", function(e) {
            if (e.keyCode ==13) {
                newQuery();
                e.preventDefault();
                return false;
            }
        });
		
        function newQuery() { 
			var popup = $('#popup');
			popup.children('#uppicture').remove();
			popup.append('<img id="uppicture" src='+ $("#paste-url").val() +' />');
			//ajax call to clarifai
			$.ajax( 
				{
					'url' : "https://api.clarifai.com/v1/tag/",
					'data' : {
						"url" : $("#paste-url").val()
					},
					'type' : "POST",
					'headers' : {
						'Authorization': 'Bearer ' + accessToken
					},
					'success' : function(data) { sendToServer(data) },
					'error' : function(err) {
						console.log(err);
						reportClarifaiError();
					}
				}
			);
        }

        function getToken() {
        	$.ajax( 
				{
					'url' : "https://api.clarifai.com/v1/token/",
					'data' : { 
						"grant_type" : "client_credentials",
						"client_id" : clientId,
						"client_secret" : clientSecret
					},
					'type' : "POST",
					'success' : function(data) { accessToken = data["access_token"] },
					'error' : function(err) {
						console.log(err);
						reportClarifaiError();
					}
				}
			);
        }

		var f = document.createElement("input");
		f.type = "file";
		f.style.visibility = "hidden";
		f.style.position = "absolute";
		f.style.top = 0;
		document.body.appendChild(f);
        f.addEventListener("change", function(e) {
            console.log(e);
            $.ajax({
                'type': "POST",
                'enctype': "multipart/form-data",
                'url': "https://api.clarifai.com/v1/tag/",
                'data' : {'encoded_data' : "@" +  e.target.value},
                'headers' : {
					'Authorization': 'Bearer ' + accessToken
				},
                'success': function(data) {
                    sendToServer(data);
                }
            });
        });
		
		$("#upload-file").on("click", function() {
			f.click();
		});
    });
})();
