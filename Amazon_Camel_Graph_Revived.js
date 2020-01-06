// ==UserScript==
// @name           Amazon Camel Graph Revived/Fixed
// @version        1.1.3
// @icon           https://www.amazon.com/favicon.ico
// @description    Add CamelCamelCamel graph + link to Amazon product pages.
// @namespace      https://github.com/jjohns71/Monkey-Scripts
// @include        http*://*.amazon.*/*
// @exclude        /^https?://.*aws.amazon\.com/?/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant          GM_xmlhttpRequest
// @homepage       https://github.com/jjohns71/Monkey-Scripts/blob/master/Amazon_Camel_Graph_Revived.js
// @downloadURL    https://raw.githubusercontent.com/jjohns71/Monkey-Scripts/master/Amazon_Camel_Graph_Revived.js
// ==/UserScript==


var width = 400;
var height = 250;
var chart = "amazon-new-used"; //Possible other values are "amazon", "new", "used", "new-used", & "amazon-new-used"
var arr = document.domain.split(".");
var country = arr[arr.length - 1];
if (country=="com") {country = "us";}

/* 
The following code errors out on some pages, e.g. https://www.amazon.com/dp/B001FNW09U/?th=1 
but works on others e.g. https://www.amazon.com/dp/B004L5JCZ4/?th=1
replaced ftSelectAsin with ASIN below

var element = $(':input[id="ftSelectAsin"]');
var asin = $.trim(element.attr("value"));
		if (asin=="") {
		element = $(':input[id="ftSelectAsin"]');
		asin = $.trim(element.attr("value"));
		}
        
*/

var element = $(':input[id="ASIN"]');
var asin = $.trim(element.attr("value"));
    if (asin=="") {
    element = $(':input[id="ASIN"]');
    asin = $.trim(element.attr("value"));
		}

var link2 = "<a  target='blank' href='https://" + country + ".camelcamelcamel.com/product/" + asin + "'><img src='https://charts.camelcamelcamel.com/" + country + "/" + asin + "/" + chart + ".png?force=1&zero=0&w=" + width + "&h=" + height + "&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en' /></a>";
var camelurl = 'https://' + country + '.camelcamelcamel.com/product/' + asin;
GM_xmlhttpRequest({
    method: 'GET',
    url: camelurl,
    onload: function(response) {

	var parser = new DOMParser ();
    var responseDoc = parser.parseFromString (response.responseText, "text/html");
	var chartpost = 0;


/* Desktop page display */
$("#unifiedPrice_feature_div").append("<div id='camelcamelcamel' style='margin-top: 10px; margin-left: -10px'>" + link2 + "</div>");


/* Mobile page display */
$("#newPitchPriceWrapper_feature_div").append("<div id='camelcamelcamel' style='margin-top: 10px; margin-left: -10px'>" + link2 + "</div>");


    }
});


function thisCodeProduct () {
  var url = unescape(location.href);
  var pattern = "https://([a-z]{0,2}).?camelcamelcamel.com/(.*)/product/B([A-Z0-9]{9}).*";
  var exp = new RegExp(pattern, "gi");
  return url.replace(exp,"$3");
}

var url = unescape(location.href);
var pattern = "https://([a-z]{0,2}).?camelcamelcamel.com/.*";
var exp = new RegExp(pattern, "gi");
var code = url.replace(exp,"$1");

if (code == '') code = 'com';
else if (code == 'uk') code = 'co.uk';

$(document).ready(function () {
	var links = document.evaluate("//a[contains(@href, 'camelcamelcamel.com')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  	for (var i = 0; i < links.snapshotLength; i++)
  	{
  	  var link = links.snapshotItem(i);
  	  if (link.title == 'View the product page at Amazon') {
  	    link.removeAttribute('onclick');
  	    link.href = 'https://www.amazon.'+code+'/dp/B'+thisCodeProduct()+'/';
  	  }
  	}
});

(function(doc) {
    // ASIN.0 in kindle store
    var asin = doc.getElementById("ftSelectAsin") || doc.getElementsByName("ASIN.0")[0];
    if (asin) {
        asin = asin.value
        history.replaceState(null, "", "/dp/" + asin + "/");
    }
})(document);
