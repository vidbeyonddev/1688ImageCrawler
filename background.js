$(document).ready(function(){
	//chrome.contextMenus.removeAll();

	function doSomething(word){
		//console.log(word);
		let query = word.selectionText;
		query = query.replace('元', '');
		query = query.replace('¥', '');
		
		let hasComma = query.indexOf(',') >= 0;
		let hasDot = query.indexOf('.') >= 0;
		
		if (hasComma && !hasDot)
		{
			query = query.replace(',', '.');
		}
		
		let rate = 3500;
		let floatValue = parseFloat(query);
		if (isNaN(floatValue))
			floatValue = 0;
		
		let result = rate * floatValue;
			
			
		//alert(result);

	// chrome.runtime.sendMessage({data: result},function(response){

	// });
		
	// var url = "popup1.html?result="+result;
    // var windowName = "extension_popup";
    // newwindow=window.open(url,windowName,'width=300, height=400, status=no, scrollbars=yes, resizable=no');
    // if (window.focus) {newwindow.focus()}
    // return false;
	
	// var w = 440;
    // var h = 220;
    // var left = (screen.width/2)-(w/2);
    // var top = (screen.height/2)-(h/2); 
	
	//chrome.windows.create({url:"background.html", type: 'popup', height: h, width: w, 'left': left, 'top': top});

// var popup = document.querySelector('#myPopup');
  // if (!popup) {
    // popup = document.createElement('div');
    // popup.style.visibility = 'hidden';
    // popup.style.width = '160px';
    // popup.style.backgroundColor = '#555';
    // popup.style.color = '#fff';
    // popup.style.textAlign = 'center';
    // popup.style.borderRadius = ' 6px';
    // popup.style.padding = '8px 0';
    // popup.style.position = 'absolute';
    // popup.style.zIndex = '1';
    // popup.style.bottom = '125%';
    // popup.style.left = '50%';
    // popup.style.marginLeft = '-80px';
    // popup.innerText = 'A Simple Popup!';
    // popup.id = 'myPopup';
    // //document.body.appendChild(popup);
	// document.body.appendChild(popup);
  // }

  // if (popup.style.visibility === 'hidden')
    // popup.style.visibility = 'visible';
  // else
    // popup.style.visibility = 'hidden';

chrome.tabs.query({currentWindow: true,active: true}, function(tabs){ 
        port = chrome.tabs.connect(tabs[0].id,{name: "channelName"});
        port.postMessage({url:tabs[0].url, result: floatValue + " tệ = " + result.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})});
});

		//alert(floatValue + " tệ = " + result.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}));
		//chrome.tabs.create({url: "http://www.urbandictionary.com/define.php?term=" + word.selectionText});
		
		//alert(window.jQuery);
		// if (window.jQuery) {  
			// // jQuery is loaded  
			// //console.log("hhhhhhhhhhhhhhhhhhh");
			// //alert("Yeah!");
			
			// //console.log($('<div id="container">aaaaaaaaaaaaaaaaaaaa</div>'));
			
			// $('<div id="container"><h1>Error</h1><p>Message</p></div>').dialog({
			 // title: "Error"
		 // });
		 
		// } else {
			// // jQuery is not loaded
			// alert("Doesn't Work");
		// }
	
		 
	};

	chrome.contextMenus.create({
		  title: "Tệ => VNĐ",
		  contexts: ["selection"],
		  onclick: doSomething
	});

})