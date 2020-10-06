
function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        //console.log('Tab script:');
        //console.log(document.body);
		
		let data = [];
		
		let detailGallery = document.getElementsByClassName('region-detail-gallery')[0];		
		if (detailGallery){
			let detailGalleryContent = detailGallery.getElementsByClassName('content')[0];
			if (detailGalleryContent){
				let imageItems = detailGalleryContent.getElementsByTagName('img');
				for (let i in imageItems){
					if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')){
						data.push(imageItems[i].src);
					}
				}			
			}			
		}
		
		let listLeadingGallery = document.getElementsByClassName('list-leading')[0];		
		if (listLeadingGallery){
			let imageItems = listLeadingGallery.getElementsByTagName('img');
			for (let i in imageItems){
				if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')){
					data.push(imageItems[i].src);
				}
			}
		}
		
		let tableSku = document.getElementsByClassName('table-sku')[0];		
		if (tableSku){
			let imageItems = tableSku.getElementsByTagName('img');
			for (let i in imageItems){
				if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')){
					data.push(imageItems[i].src);
				}
			}
		}
		
		console.log(data);
		
		return JSON.stringify(data);
		
        //return document.body.innerHTML;
    }
	
	function downloadAndZipImgs(urls){
		//alert("test");
		//return;
		var zip = new JSZip();
		var count = 0;
		var zipFilename = "zipFilename.zip";

		urls.forEach(function(url){
			console.log(url);
			
		  var filename = url.split('/').pop();
		  // loading a file and add it in a zip file
		  JSZipUtils.getBinaryContent(url, function (err, data) {
			 if(err) {
				throw err; // or handle the error
			 }
			 zip.file(filename, data, {binary:true});
			 count++;
			 if (count == urls.length) {
			   zip.generateAsync({type:'blob'}).then(function(content) {
				  saveAs(content, zipFilename);
			   });
			}
		  });
		});		
	};
	
	String.prototype.nthLastIndexOf = function(searchString, n){
		var url = this;
		if(url === null) {
			return -1;
		}
		if(!n || isNaN(n) || n <= 1){
			return url.lastIndexOf(searchString);
		}
		n--;
		return url.lastIndexOf(searchString, url.nthLastIndexOf(searchString, n) - 1);
	}

chrome.tabs.query({ // Get active tab
    active: true,
    currentWindow: true
}, function (tabs) {


    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (jsonText) => {

		let urls = JSON.parse(jsonText);
		let newUrls = [];
		
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
		document.getElementById("sources").innerHTML = '';
		
		 for (var i in urls) {
			
			var originalUrl = urls[i];
			
			var slash = originalUrl.nthLastIndexOf("/", 1);
			var dot1 = originalUrl.nthLastIndexOf(".", 1);
			var dot2 = originalUrl.nthLastIndexOf(".", 2);
			
			if (dot2 > slash)
			{	
				var newUrl = originalUrl.replace(originalUrl.substring(dot2, dot1), "");
				newUrls.push(newUrl);
			}
			else{
				newUrls.push(originalUrl);
			}
		 }
		 
		 var uniqueUrls = newUrls.filter((a, b) => newUrls.indexOf(a) === b);
console.log(uniqueUrls);
		 for (var i in uniqueUrls){			 
			 var img = document.createElement('img');
			 img.src = uniqueUrls[i];
			 document.getElementById("sources").appendChild(img);
		 }
		
		document.getElementById("btnZip").addEventListener("click", function(){downloadAndZipImgs(uniqueUrls)}, false);
		
        //console.log(results[0]);
    });
});