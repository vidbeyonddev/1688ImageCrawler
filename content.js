//alert("aa");
//document.body.style.background = 'yellow';
console.log("this is msg from content.js");

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
	
        if(port.name == "channelName"){
        port.onMessage.addListener(function(response) {
console.log(response);

            if(response.url == window.location.href){				
				
				var popup = document.querySelector('#myPopup');
				if (!popup) {
					popup = document.createElement('div');
					//popup.style.visibility = 'hidden';
					//popup.style.width = '160px';
					popup.style.backgroundColor = '#555';
					popup.style.color = '#fff';
					popup.style.border = "solid 1px snow";
					popup.style.textAlign = 'center';
					//popup.style.borderRadius = ' 6px';
					popup.style.padding = '8px';
					popup.style.fontSize = "22px";
					popup.style.position = 'fixed';
					popup.style.zIndex = '999999';
					popup.style.opacity = '0.75';
					popup.style.top = "10px";
					popup.style.right = "10px";
					//popup.style.marginLeft = '-80px';
					popup.style.marginTop = '-1px';
					popup.style.marginRight = '-1px';
					popup.id = 'myPopup';
					//document.body.appendChild(popup);
					document.body.appendChild(popup);
				}
				
			  $(popup).text(response.result);
				$(popup).hide().show().delay(5000).fadeOut(400);
            }
        }); 
    }
});