function modifyDOM() {
    //You can play with your DOM here or check URL against your regex
    //console.log('Tab script:');
    //console.log(document.body);

    let tabUrl = window.location.href;
    let siteKey = "1688offer";

    if (tabUrl.indexOf("1688.com/pic/") > -1){
        siteKey = "1688pic";
    }

    let data = [];
    let offerId = 0;

    switch (siteKey) {
        case "1688offer":

            let b2c_auction_meta = document.querySelectorAll('meta[name="b2c_auction"]')[0];

            if (b2c_auction_meta) {
                offerId = document.querySelectorAll('meta[name="b2c_auction"]')[0].getAttribute("content");
            }
        
            let detailGallery = document.getElementsByClassName('region-detail-gallery')[0];
            if (detailGallery) {
                let detailGalleryContent = detailGallery.getElementsByClassName('content')[0];
                if (detailGalleryContent) {
                    let imageItems = detailGalleryContent.getElementsByTagName('img');
                    for (let i in imageItems) {
                        if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')) {
                            data.push({
                                url: imageItems[i].src,
                                isImage: true
                            });
                        }
                    }
        
                    let videoItems = detailGalleryContent.getElementsByTagName('video');
                    for (let i in videoItems) {
                        if (videoItems[i].src) {
                            data.push({
                                url: videoItems[i].src,
                                isImage: false
                            });
                        }
                    }
                }
            }
        
        
            let listLeadingGallery = document.getElementsByClassName('list-leading')[0];
            if (listLeadingGallery) {
                let imageItems = listLeadingGallery.getElementsByTagName('img');
                for (let i in imageItems) {
                    if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')) {
                        data.push({
                            url: imageItems[i].src,
                            isImage: true
                        });
                    }
                }
            }
        
            let tableSku = document.getElementsByClassName('table-sku')[0];
            if (tableSku) {
                let imageItems = tableSku.getElementsByTagName('img');
                for (let i in imageItems) {
                    if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')) {
                        data.push({
                            url: imageItems[i].src,
                            isImage: true
                        });
                    }
                }
            }

        break;

        case "1688pic":
            let firstRegexKey = "detail.1688.com\/pic\/";
            let secondRegexKey = ".html\?";

            var regExString = new RegExp("(?:"+firstRegexKey+")((.[\\s\\S]*))(?:"+secondRegexKey+")", "ig");
            var testRE = regExString.exec(tabUrl);

            offerId = testRE[1];

            let tabNav = document.getElementById('dt-bp-tab-nav');

            if (tabNav) {
                let imageItems = tabNav.getElementsByTagName('img');
                for (let i in imageItems) {
                    if (imageItems[i].src && !imageItems[i].src.endsWith('lazyload.png') && !imageItems[i].src.startsWith('data:image') && imageItems[i].src.includes('img/ibank')) {
                        data.push({
                            url: imageItems[i].src,
                            isImage: true
                        });
                    }
                }

                let videoItems = tabNav.getElementsByTagName('video');
                for (let i in videoItems) {
                    if (videoItems[i].src) {
                        data.push({
                            url: videoItems[i].src,
                            isImage: false
                        });
                    }
                }                    
            }
        break;
    }

    //console.log(data);

    return JSON.stringify({
        offerId: offerId,
        urlData: data
    });

    //return document.body.innerHTML;
}

// function downloadResource(url, filename) {
//   if (!filename) filename = url.split('\\').pop().split('/').pop();
//   fetch(url, {
//       headers: new Headers({
//         'Origin': location.origin
//       }),
//       mode: 'cors'
//     })
//     .then(response => response.blob())
//     .then(blob => {
//       let blobUrl = window.URL.createObjectURL(blob);
//       forceDownload(blobUrl, filename);
//     })
//     .catch(e => console.error(e));
// }

function downloadAndZipFiles(offerId, urls, suffix) {
	
    //alert("test");
    //return;
    var zip = new JSZip();
    var count = 0;
    var zipFilename = (offerId || "1688zipData") + "_" + suffix + ".zip";

    urls.forEach(function(url) {

        //console.log(url);

        var filename = url.split('/').pop();
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, function(err, data) {
            if (err) {
                return;
                //throw err; // or handle the error
            }
            zip.file(filename, data, {
                binary: true
            });
            count++;
            if (count == urls.length) {
                zip.generateAsync({
                    type: 'blob'
                }).then(function(content) {
                    saveAs(content, zipFilename);
                });
            }
        });
    });
};

String.prototype.nthLastIndexOf = function(searchString, n) {
    var url = this;
    if (url === null) {
        return -1;
    }
    if (!n || isNaN(n) || n <= 1) {
        return url.lastIndexOf(searchString);
    }
    n--;
    return url.lastIndexOf(searchString, url.nthLastIndexOf(searchString, n) - 1);
}

chrome.tabs.query({ // Get active tab
    active: true,
    currentWindow: true
}, function(tabs) {
    let url = tabs[0].url;

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript(tabs[0].id, {
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (jsonText) => {

        let jsonObj = JSON.parse(jsonText);
        console.log(jsonObj);

        let offerId = jsonObj.offerId;
		if (offerId){
			document.getElementById("offerId").innerText = "Offer ID: " + offerId;
		}else{
			document.getElementById("offerId").innerText = "This page is not supported :)";			
		}
		
        let newUrlData = [];

        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
        document.getElementById("sources").innerHTML = '';

        for (var i in jsonObj.urlData) {

            var originalUrl = jsonObj.urlData[i].url;
            
            if (originalUrl.endsWith("_.webp"))
            {
                originalUrl = originalUrl.replace(new RegExp("[" + "_.webp" + "]+$"), "");
            }
            
            var slash = originalUrl.nthLastIndexOf("/", 1);
            var dot1 = originalUrl.nthLastIndexOf(".", 1);
            var dot2 = originalUrl.nthLastIndexOf(".", 2);

            if (dot2 > slash) {
                var newUrl = originalUrl.replace(originalUrl.substring(dot2, dot1), "");
				if (newUrlData.map(x=>x.url).indexOf(newUrl) == -1){
					newUrlData.push({
						url: newUrl,
						isImage: jsonObj.urlData[i].isImage
					});	
				}                
            } else {
				if (newUrlData.map(x=>x.url).indexOf(originalUrl) == -1){					
					newUrlData.push({
						url: originalUrl,
						isImage: jsonObj.urlData[i].isImage
					});	
				}
                
            }
        }

        for (var i in newUrlData) {
            if (newUrlData[i].isImage) {
                var img = document.createElement('img');
                img.src = newUrlData[i].url;
                document.getElementById("sources").appendChild(img);
            } else {
                var video = document.createElement('VIDEO');
                video.src = newUrlData[i].url;
                video.setAttribute("src", newUrlData[i].url);
                video.setAttribute("controls", "controls");

                document.getElementById("sources").appendChild(video);
            }
        }

		if (newUrlData.length > 0){
			document.getElementById("btnZip").style.display = "block";
			
			document.getElementById("btnZip").addEventListener("click", function() {
				downloadAndZipFiles(offerId, newUrlData.filter(x=>x.isImage).map(x => x.url), "images");
				downloadAndZipFiles(offerId, newUrlData.filter(x=>!x.isImage).map(x => x.url), "videos");
			}, false);
		}

        //console.log(results[0]);
    });
});

// chrome.runtime.sendMessage({data:"Handshake"},function(response){
	
// });

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	//console.log(JSON.stringify(message.data));	
	// chrome.windows.create({
		// type : 'popup',
		// url : 'popup1.html',
		// type: "popup"
	// }, function(newWindow) {
	// });
});

// document.addEventListener("DOMContentLoaded", () => {
//     chrome.extension.sendMessage({action: "ping"}, function(resp) {
//         console.log(JSON.stringify(resp));
//     });
// });


// detect selected text
// chrome.tabs.executeScript( {
//     code: "window.getSelection().toString();"
// }, function(selection) {
// 	console.log(selection);
//     alert(selection[0]);
// });