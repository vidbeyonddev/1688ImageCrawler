//alert("aa");
//document.body.style.background = 'yellow';
//console.log("this is msg from content.js");

// var imgURL = chrome.runtime.getURL("images/myimage.jpg");
  // //document.getElementById("body").src = imgURL;
  // alert(imgURL);
  
  // chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	  // alert(message.data);
	// //console.log(JSON.stringify(message.data));	
	// // chrome.windows.create({
		// // type : 'popup',
		// // url : 'popup1.html',
		// // type: "popup"
	// // }, function(newWindow) {
	// // });
// });


	
	
chrome.runtime.onConnect.addListener(function(port) {
	//console.log(port);

	var jinConvertTeVndContainer = document.querySelector('#jinConvertTeVndContainer');
	var jinQrCodeContainer = document.querySelector('#jinQrCodeContainer');

	if (jinConvertTeVndContainer){
		$(jinConvertTeVndContainer).hide();
	}

	if (jinQrCodeContainer){
		$(jinQrCodeContainer).hide();
	}

	if(port.name == "channelName"){
		port.onMessage.addListener(function(response) {
			//console.log(response);

			if(response.url == window.location.href){	
				if (!jinConvertTeVndContainer) {
					jinConvertTeVndContainer = document.createElement('div');
					//jinConvertTeVndContainer.style.visibility = 'hidden';
					//jinConvertTeVndContainer.style.width = '160px';
					jinConvertTeVndContainer.style.backgroundColor = '#555';
					jinConvertTeVndContainer.style.color = '#fff';
					jinConvertTeVndContainer.style.border = "solid 1px snow";
					jinConvertTeVndContainer.style.textAlign = 'center';
					//jinConvertTeVndContainer.style.borderRadius = ' 6px';
					jinConvertTeVndContainer.style.padding = '8px';
					jinConvertTeVndContainer.style.fontSize = "22px";
					jinConvertTeVndContainer.style.position = 'fixed';
					jinConvertTeVndContainer.style.zIndex = '999999';
					jinConvertTeVndContainer.style.opacity = '0.75';
					jinConvertTeVndContainer.style.top = "10px";
					jinConvertTeVndContainer.style.right = "10px";
					//jinConvertTeVndContainer.style.marginLeft = '-80px';
					jinConvertTeVndContainer.style.marginTop = '-1px';
					jinConvertTeVndContainer.style.marginRight = '-1px';
					jinConvertTeVndContainer.id = 'jinConvertTeVndContainer';
					//document.body.appendChild(jinConvertTeVndContainer);
					document.body.appendChild(jinConvertTeVndContainer);
				}
				
				$(jinConvertTeVndContainer).empty();
				$(jinConvertTeVndContainer).text(response.result);
				$(jinConvertTeVndContainer).hide().show().delay(5000).fadeOut(400);
			}
		}); 
	}

	if(port.name == "genQRCodeChannel"){
		port.onMessage.addListener(function(response) {
			if (!jinQrCodeContainer) {
				jinQrCodeContainer = document.createElement('div');
				//jinQrCodeContainer.style.visibility = 'hidden';
				//jinQrCodeContainer.style.width = '160px';
				jinQrCodeContainer.style.backgroundColor = '#ccc';
				jinQrCodeContainer.style.color = '#fff';
				jinQrCodeContainer.style.border = "solid 1px snow";
				jinQrCodeContainer.style.textAlign = 'center';
				//jinQrCodeContainer.style.borderRadius = ' 6px';
				jinQrCodeContainer.style.padding = '20px';
				jinQrCodeContainer.style.fontSize = "22px";
				jinQrCodeContainer.style.position = 'fixed';
				jinQrCodeContainer.style.zIndex = '999999';
				//jinQrCodeContainer.style.opacity = '0.75';
				jinQrCodeContainer.style.top = "40%";
				jinQrCodeContainer.style.left = "40%";
				//jinQrCodeContainer.style.marginLeft = '-80px';
				jinQrCodeContainer.style.marginTop = '-1px';
				jinQrCodeContainer.style.marginRight = '-1px';
				jinQrCodeContainer.id = 'jinQrCodeContainer';
				//document.body.appendChild(jinQrCodeContainer);
				document.body.appendChild(jinQrCodeContainer);

				$(jinQrCodeContainer).click(e=>{
					$(jinQrCodeContainer).hide();
				});
			}
			
			$(jinQrCodeContainer).empty();

			var qrcode = new QRCode($(jinQrCodeContainer)[0], {
				text: response.result,
				width: 128,
				height: 128,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.H
			});

			//$(jinQrCodeContainer).text(response.result);
			$(jinQrCodeContainer).hide().show().delay(15000).fadeOut(400);
		});		
	}
});

function getSelectedText() {    // this code is within the iframe
	//console.log("huhuu");
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}

document.onmouseup = function() { 
	// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		// console.log("sent from tab.id=", sender.tab.id);
	// });

	// chrome.tabs.getSelected(null, function(tab){
		// console.log(tab);
	// });

	// chrome.tabs.getCurrent(function(_tabId){
		// console.log("aaa");
		// if(_tabId){
			// var _SELECTION = {};
			// _SELECTION[tabId] = window.getSelection().toString();
			// chrome.storage.local.set(_SELECTION, function() {
				// console.log('Selection saved: ', _SELECTION[tabId]);
			// });
		// }
	// });
	
	//console.log(window.getSelection().toString());
	
	chrome.runtime.sendMessage({method: "sendSelectedText", msg: getSelectedText().toString()}, function(response) {
		//console.log(response.abc);
	});

	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		//console.log(response.farewell);
	});
	
}






