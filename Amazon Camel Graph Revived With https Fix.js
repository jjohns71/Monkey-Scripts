// ==UserScript==
// @name            Amazon Camel Graph Revived With https Fix
// @version         1.1.2
// @description     Add CamelCamelCamel graph + link to Amazon product pages.
// @namespace       https://github.com/jjohns71/Monkey-Scripts
// @include         https://*.amazon.*/*
// @include         https://amazon.*/*
// @include         https://*.camelcamelcamel.com/*
// @include         https://camelcamelcamel.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_xmlhttpRequest
// @homepage	    https://github.com/jjohns71/Monkey-Scripts/blob/master/Amazon%20Camel%20Graph%20Revived%20With%20https%20Fix
// @downloadURL 	https://raw.githubusercontent.com/jjohns71/Monkey-Scripts/master/Amazon%20Camel%20Graph%20Revived%20With%20https%20Fix.js
// ==/UserScript==


var width = 400;
var height = 250;
var chart = "amazon-new"; //Possible other values are "amazon", "new", "used", "new-used", & "amazon-new-used"


var arr = document.domain.split(".");
var country = arr[arr.length - 1];
if (country=="com") {country = "us";}

var element = $(':input[id="ASIN"]');
var asin = $.trim(element.attr("value"));
		if (asin==="")
        {
		element = $(':input[id="ASIN"]');
		asin = $.trim(element.attr("value"));
		}
var link2 = "<a  target='blank' href='https://camelcamelcamel.com/product/" + asin + "'><img src='https://charts.camelcamelcamel.com/" + country + "/" + asin + "/" + chart + ".png?force=1&zero=0&w=" + width + "&h=" + height + "&desired=false&legend=1&ilt=1&tp=all&fo=0' /></a>";
var camelurl = 'https://camelcamelcamel.com/product/' + asin;
GM_xmlhttpRequest({
    method: 'GET',
    url: camelurl,
    onload: function(response) {

	var parser      = new DOMParser ();
    	var responseDoc = parser.parseFromString (response.responseText, "text/html");
	var chartpost = 0;
if (chart=="amazon"||chart=="amazon-new"||chart=="amazon-new-used"||chart=="amazon-used")
{
	if(responseDoc !=='undefined')
	{
        if (!responseDoc.getElementById('price_type_0').disabled && chartpost===0)
        {
$("#averageCustomerReviews_feature_div").append("<div id='camelcamelcamel' style='margin-top: 10px; margin-left: -10px'>" + link2 + "</div>");
chartpost = 1;
	    }
	}
}

if (chart=="new"||chart=="amazon-new"||chart=="amazon-new-used"||chart=="new-used")
{
        if (!responseDoc.getElementById('price_type_1').disabled && chartpost===0)
        {
$("#averageCustomerReviews_feature_div").append("<div id='camelcamelcamel' style='margin-top: 10px; margin-left: -10px'>" + link2 + "</div>");
chartpost = 1;
	      }
}


if (chart=="used"||chart=="amazon-used"||chart=="amazon-new-used"||chart=="new-used")
{
        if (!responseDoc.getElementById('price_type_2').disabled && chartpost===0)
        {
$("#averageCustomerReviews_feature_div").append("<div id='camelcamelcamel' style='margin-top: 10px; margin-left: -10px'>" + link2 + "</div>");

	      }
}

    }
});

function thisCodeProduct ()
{
  var url = unescape(location.href);
  var pattern = "https://([a-z]{0,2}).?camelcamelcamel.com/(.*)/product/B([A-Z0-9]{9}).*";
  var exp = new RegExp(pattern, "gi");
  return url.replace(exp,"$3");
}

var url = unescape(location.href);
var pattern = "https://([a-z]{0,2}).?camelcamelcamel.com/.*";
var exp = new RegExp(pattern, "gi");
var code = url.replace(exp,"$1");

if (code === '')
  code = 'com';
else if (code == 'uk')
  code = 'co.uk';

$(document).ready(function () {
	var links = document.evaluate("//a[contains(@href, 'camelcamelcamel.com')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  	for (var i = 0; i < links.snapshotLength; i++)
  	{
  	  var link = links.snapshotItem(i);
  	  if (link.title == 'View the product page at Amazon')
      {
  	    link.removeAttribute('onclick');
  	    link.href = 'https://www.amazon.'+code+'/dp/B'+thisCodeProduct()+'/';
  	  }
  	}

});

(function(doc) {
    // ASIN.0 in kindle store
    var asin = doc.getElementById("ASIN") || doc.getElementsByName("ASIN.0")[0];
    if (asin) {
        asin = asin.value;
        history.replaceState(null, "", "/dp/" + asin + "/");
    }

})(document);
