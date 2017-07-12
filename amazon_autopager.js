// ==UserScript==
// @name            Amazon Autopager (Infinite Scroll)
// @version         1.04.2
// @icon            https://www.amazon.com/favicon.ico
// @description     Loads next page of search results automatically on Amazon
// @namespace       https://github.com/jjohns71/Monkey-Scripts
// @author          Original: https://greasyfork.org/en/scripts/23471-amazon-autopager
// @contributor     jjohns71
// @include         https://www.amazon.com/s/*
// @include         https://smile.amazon.com/s/*
// @include         https://www.amazon.co.uk/s/*
// @include         https://www.amazon.co.jp/s/*
// @grant           none
// @homepage        https://github.com/jjohns71/Monkey-Scripts/blob/master/amazon_autopager.js
// @downloadURL     https://raw.githubusercontent.com/jjohns71/Monkey-Scripts/master/amazon_autopager.js
// ==/UserScript==

(function () {
	'use strict';
    function fscroll()
    {
        var	next=D.getElementById('pagnNextLink'),
            cont,
            pager,
            req;

        if(!next||lock){return;}
        if(next.getBoundingClientRect().bottom<innerHeight>>1)
        {
            lock=1;
            cont=D.getElementById('s-results-list-atf');
            pager=D.getElementById('pagn');
            req=new XMLHttpRequest();
            req.open('GET',next.href);
            req.responseType='document';
            req.onload=function()
            {
                var	res=req.response,
                    frag=D.createDocumentFragment(),
                    col=res.querySelectorAll('li[id^=result_]'),
                    len=col.length,
                    i;

                for(i=0;i<len;i++)
				{
                    frag.appendChild(col.item(i));
				}
                cont.appendChild(frag);
                pager.parentNode.replaceChild(res.getElementById('pagn'),pager);
                lock=0;
            };
            req.send();
		}
	}
	var	D=document,
		lock=0;
	addEventListener('scroll',fscroll);
}());
