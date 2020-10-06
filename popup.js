function modifyDOM() {
    //You can play with your DOM here or check URL against your regex
    //console.log('Tab script:');
    //console.log(document.body);

    let data = [];

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


    console.log(data);

    let b2c_auction_meta = document.querySelectorAll('meta[name="b2c_auction"]')[0];
    let offerId = 0;

    if (b2c_auction_meta) {
        offerId = document.querySelectorAll('meta[name="b2c_auction"]')[0].getAttribute("content");
    }

    return JSON.stringify({
        offerId: offerId,
        urlData: data
    });

    //return document.body.innerHTML;
}

function downloadResource(url, filename) {
  if (!filename) filename = url.split('\\').pop().split('/').pop();
  fetch(url, {
      headers: new Headers({
        'Origin': location.origin
      }),
      mode: 'cors'
    })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch(e => console.error(e));
}

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


    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (jsonText) => {

        let jsonObj = JSON.parse(jsonText);

        let offerId = jsonObj.offerId;
        document.getElementById("offerId").innerText = "Offer ID: " + (offerId || "Don't know :(");

        let newUrlData = [];

        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
        document.getElementById("sources").innerHTML = '';

        for (var i in jsonObj.urlData) {

            var originalUrl = jsonObj.urlData[i].url;

            var slash = originalUrl.nthLastIndexOf("/", 1);
            var dot1 = originalUrl.nthLastIndexOf(".", 1);
            var dot2 = originalUrl.nthLastIndexOf(".", 2);

            if (dot2 > slash) {
                var newUrl = originalUrl.replace(originalUrl.substring(dot2, dot1), "");
                newUrlData.push({
                    url: newUrl,
                    isImage: jsonObj.urlData[i].isImage
                });
            } else {
                newUrlData.push({
                    url: originalUrl,
                    isImage: jsonObj.urlData[i].isImage
                });
            }
        }

        var uniqueUrls = newUrlData.filter((a, b) => newUrlData.indexOf(a) === b);
        //console.log(uniqueUrls);

        for (var i in uniqueUrls) {
            if (uniqueUrls[i].isImage) {
                var img = document.createElement('img');
                img.src = uniqueUrls[i].url;
                document.getElementById("sources").appendChild(img);
            } else {
                var video = document.createElement('VIDEO');
                video.src = uniqueUrls[i].url;
                video.setAttribute("src", uniqueUrls[i].url);
                video.setAttribute("controls", "controls");

                document.getElementById("sources").appendChild(video);
            }
        }

        document.getElementById("btnZip").addEventListener("click", function() {
            downloadAndZipFiles(offerId, uniqueUrls.filter(x=>x.isImage).map(x => x.url), "images");
			downloadAndZipFiles(offerId, uniqueUrls.filter(x=>!x.isImage).map(x => x.url), "videos");
        }, false);

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