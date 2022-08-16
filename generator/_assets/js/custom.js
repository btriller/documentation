'use strict';
var is_mobile = true;
$(document).ready(function() {
    if ($(window).width() > 800)
    {
        is_mobile = false;
    }
    var scrollPos = 380;
    /*show/hide moveTop link */
    var showMoveTop = false;

    if (is_mobile === false)
    {
        $("#moveTop a").click(function(e) {
            $(window).scrollTop($('#nav_wrapper').offset().top);
            showMoveTop = false;
            $("#moveTop").hide();
            e.preventDefault();
        });

        $(window).scroll(function() {
            if ($(window).scrollTop() > scrollPos && showMoveTop===false) {
                $("#moveTop").show();
                showMoveTop = true;
            } else if($(window).scrollTop() < scrollPos && showMoveTop === true ) {
                $("#moveTop").hide();
                showMoveTop = false;
            }
        });
    }

    if ($(window).scrollTop() > scrollPos && is_mobile === false)
    {
        $("#moveTop").show();
        showMoveTop = true;
    }


    var ToC_start =
        "<nav role='navigation'>" +
             "<ul>";
    var ToC_End =
            "</ul>" +
        "</nav>";

    var newLine, el, title, link, elClass, url, ToC='';
    $(".article h2, .article h3, .article h4").each(function() {
        el      = $(this);
        title   = el.text();
        link    = "#" + el.attr("id");
        elClass = "link_" + el.prop("tagName").toLowerCase()
        url     = window.location.pathname;

        // if header has data-behavior= exclude-from-toc - do not include it to the TOC list
        if (el.children('center').attr('data-behavior') !=="exclude-from-toc")
        {
            newLine =
                "<li class='" + elClass  +  "'>" +
                    "<a href='" + url + link + "'>" +
                        title +
                    "</a>" +
                "</li>";
            ToC += newLine;
        }
    });
    
    if (ToC.length)
    {
        if  (is_mobile === false)
        {
            $("#TOCbox_wrapper").show();
        }
        var result = ToC_start + ToC + ToC_End;

        $("#TOCbox_wrapper #TOCbox_list").html('');
        $("#print_TOC").html('');

        $("#TOCbox_wrapper #TOCbox_list").append(result);
        $("#print_TOC").append(result);
    } else {
        $("#TOCbox_wrapper").hide();
    }

    // detect print event, display TOC
    var beforePrint = function() {
        $("#print_TOC_wrapper").show();
    };
    var afterPrint = function() {
        $("#print_TOC_wrapper").hide();
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;


});

document.querySelectorAll('pre').forEach(function (pre) {
    pre.closest('div.highlight').innerHTML += '<i data-closest=".highlight" data-copyfrom="code" class="bi bi-clipboard copy-to-clipboard"></i>';
});

document.querySelectorAll(".copy-to-clipboard").forEach(function (el) {
    el.addEventListener("click", function (event) {
        event.preventDefault();
        var target = event.target;
        var copyText = target.closest(event.target.dataset.closest).querySelector(event.target.dataset.copyfrom).innerText;
        navigator.clipboard.writeText(copyText);
        target.classList.remove('bi-clipboard');
        target.className += ' bi-check2 ';
        setTimeout(function ()  { target.className = 'bi bi-clipboard copy-to-clipboard' }, 2000);
    })
});

var tableOfContents = document.querySelector('.table-of-contents .TOC');
if (tableOfContents) {
    window.onclick = function (e) {
        if (!e.target.closest('.TOC') && !tableOfContents.querySelector('.closed')) {
            tableOfContents.classList.add('closed');
        }
    };
    tableOfContents.onclick = function () {
        tableOfContents.classList.toggle('closed');
    };
}


var menu = document.querySelector('.top_menu ul');
var overlay = document.querySelector('#overlay');
var openedClass = "opened";
var openMenuHandler = function (collapseMenu) {
    if (collapseMenu.className.indexOf(openedClass) == -1) {
        collapseMenu.classList.add(openedClass);
        menu.classList.add('d-b');
        overlay.style.display = "block";
    } else {
        collapseMenu.classList.remove(openedClass);
        menu.classList.remove('d-b');
        overlay.style.display = "none";
    }
}

var openNavigationHandler = function () {
    document.querySelector('.left-menu').classList.add(openedClass);
    overlay.style.display = "block";
}

document.querySelector('.left-menu .menu-close').onclick = function () {
    document.querySelector('.left-menu').classList.remove(openedClass);
    overlay.style.display = "none";
}

overlay.onclick = function () {
    document.querySelector('.collapse').classList.remove(openedClass);
    document.querySelector('.left-menu').classList.remove(openedClass);
    menu.classList.remove('d-b');
    overlay.style.display = "none";
}

var topMenuVersions = document.querySelector('.top_menu-versions');
topMenuVersions.onclick = function (event) {
    topMenuVersions.classList.toggle('opened');
}

document.querySelector('.top_menu-versions-title > span > span').innerText = document.querySelector('.top_menu-versions-list a[selected="selected"]').innerText;

var mainMenuCopy = document.querySelector('.left-menu ul.mainMenu').cloneNode(true);
var clickedMenuHistory = [{href: './', name: 'Home'}];
var renderNestedMenu = function (href) {
    if (href == null) {
        document.querySelector('.left-menu ul.mainMenu').replaceWith(mainMenuCopy);
    } else {
        var ul = mainMenuCopy.querySelector('li[data-url="'+ href +'"]').querySelector('ul').cloneNode(true);
        ul.classList.add('mainMenu');
        document.querySelector('.left-menu ul.mainMenu').replaceWith(ul);
    }

    applyOnclickToMenuItems();
}
var menuItemClickFn = function (e) {
    if (window.innerWidth < 1024) { // if the window width is less than 1024 then treat the menu as mobile one
        if (e.target.closest('li').classList.contains('parent')) {
            e.preventDefault();
            renderNestedMenu(e.target.getAttribute('href'));
            clickedMenuHistory.push({href: e.target.getAttribute('href'), name: e.target.innerText});
            buildBreadcrumbs(clickedMenuHistory);
        }
    }
};

var applyOnclickToMenuItems = function () {
    document
        .querySelector('.left-menu')
        .querySelectorAll('ul li.parent > a')
        .forEach(function (item) {
            item.onclick = menuItemClickFn
        });
}
applyOnclickToMenuItems();

var selectedMenu = document.querySelector('.selectedMenu');
var leftMenuBreadcrumbs = document.querySelector('.left-menu-breadcrumbs');
var buildBreadcrumbs = function (items) {
    var html = '';
    if (items.length > 3) {
        items = items.slice(-3);
        html = '<li>...</li><li>/</li>';
    }
    items.forEach(function (item, index) {
        if (index > 0) {
            html += '<li>/</li>';
        }
        html += '<li><a href="'+ item.href +'"><span>'+ item.name +'</span></a></li>'
    })
    leftMenuBreadcrumbs.innerHTML = html;
    var lastItem = items[items.length - 1];
    selectedMenu.innerHTML = lastItem.name !== 'Home' ?
        '<a href="'+ lastItem.href +'">'+ lastItem.name +' <i class="bi bi-box-arrow-up-right"></i></a>' :
        '';
}
buildBreadcrumbs(clickedMenuHistory);

document.querySelector('.menu-back').onclick = function () {
    if (clickedMenuHistory.length != 1) {
        clickedMenuHistory.pop();
        var lastHistoryElement = clickedMenuHistory[clickedMenuHistory.length - 1];
        renderNestedMenu(lastHistoryElement['name'] !== 'Home' ? lastHistoryElement['href'] : null);
        buildBreadcrumbs(clickedMenuHistory);
    }
}

var urlPaths = document.location.pathname.split('/');
var url = urlPaths[urlPaths.length - 1]; // get last url part
var currentMenuItem = document.querySelector('.left-menu li[data-url="'+ url +'"]');
currentMenuItem.className += ' opened current';

if (window.innerWidth > 1023) { // if the window width more than 1023 then treat the menu as desktop one
    var closest = currentMenuItem.closest('ul').closest('li');
    while (true) {
        if (!closest) break;
        closest.classList.add('opened');
        closest = closest.closest('ul').closest('li');
    }
}

function fillVersionWrapperSelect(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState != 4 || xmlhttp.status != 200) {
            return
        }
        var str = ''; //generated HTML
        var data = JSON.parse(xmlhttp.responseText);
        for (var i = 0; i < data.docs.length; i++) {
            var branch = data.docs[i];
            var selected = '';
            if (location.pathname.indexOf(branch.Link) == 0) {
                // this is version that we're currently looking at
                selected = ' selected';
                window.currentVersionLink = branch.Link;
            }
            str += '<option value="' + branch.Link + '"' + selected + '>' + branch.Title + '</option>';
        }
        document.querySelector('#top_version_wrapper select').innerHTML = str;
    }
    xmlhttp.send(null);
};

function selectVersion(value) {
    if (value.indexOf('archive') == -1 && window.currentVersionLink) {
        window.location = window.location.href.replace(window.currentVersionLink, value);
    } else {
        window.location = value;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    fillVersionWrapperSelect('/docs/branches.json')
});
