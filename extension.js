console.log('Filewhat initialized');

var collection = new Map();

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function initialize(){
    var files = window.document.getElementsByClassName("octicon-file-text");
    Array.prototype.slice.call(files, 0).forEach(function (element) {
        var e = element.parentElement;
        var isAlreadyInitialized = !!e.getAttribute('data-filewhat-id'),
            filename = e.nextSibling.nextSibling.textContent.replace(/ /g, '').replace(/\n/g, ''),
            id;

        if (isAlreadyInitialized) {
            return;
        }

        id = uuid();

        collection.set(id, {
            render: populateInfoTooltip,
            active: false
        });
        e.setAttribute('data-filewhat-id', id);
        e.setAttribute('data-filewhat-filename', filename);
        e.onmouseenter = onMouseEnter;
        e.onmouseleave = onMouseLeave;
    });
}

initialize();

function onMouseEnter(e) {
    var id = e.target.getAttribute('data-filewhat-id'),
        filename = e.target.getAttribute('data-filewhat-filename'),
        tooltipAction, url;

    if (id === undefined) {
        return;
    }

    tooltipAction = collection.get(id);

    if (!tooltipAction || tooltipAction.active){
        return;
    }

    var tooltip = document.createElement('div');
    tooltip.className = 'filewhat';

    tooltipAction.active = true;
    e.target.parentElement.appendChild(tooltip);

    populateTooltip(tooltip, filename, tooltipAction);
}

function onMouseLeave(e){
    var id = e.target.getAttribute('data-filewhat-id'),
        tooltipNode = e.target.parentElement.querySelector('.filewhat');

    if (id === undefined || !tooltipNode) {
        return;
    }

    removeTooltip(id, tooltipNode);
}

function removeTooltip(id, tooltipNode){
    if (!tooltipNode || tooltipNode.parentElement == null) {
        return;
    }

    try {
        tooltipNode.parentElement.removeChild(tooltipNode);
    } catch (e) {
        console.log("Error when attempting to remove tooltip div");
        console.log(e);
    }

    tooltipAction = collection.get(id);
    tooltipAction.active = false;
}

function populateTooltip(tooltipNode, filename, tooltipAction){
    if (typeof tooltipAction.render === 'function'){
        tooltipAction.render.apply(this, arguments);
    } else {
        tooltipNode.style.display = 'none';
    }
}

function populateInfoTooltip(tooltipNode, filename, tooltipAction){
    var tooltipTemplate = [
        '<div class="filetype-header">',
        filename,
        '</div>',
        '<div class="filetype-description">',
            '<h5>Description</h5>',
            '<p>%filetype-description%</p>',
        '</div>'
    ].join('');

    var descURL = chrome.runtime.getURL("descriptions/default.html");

    tooltipNode.innerHTML = tooltipTemplate;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', descURL, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/html');

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status >= 400){
            return populateErrorTooltip(tooltipNode);
        }

        if (xmlhttp.responseText && xmlhttp.readyState == 4){
            tooltipNode.innerHTML = tooltipNode.innerHTML.replace(
                '%filetype-description%', xmlhttp.responseText
            );
        }
    };

    xmlhttp.send(null);
}

function populateErrorTooltip(tooltipNode){
    tooltipNode.innerHTML =
        '<div>Error</div>' +
        '<div>Opps, something went wrong :(</div>';
}

var callback = function(allmutations){
    initialize();
},
    mo = new MutationObserver(callback),
    options = {
        'childList': true,
        'subtree': true
    };
mo.observe(document.body, options);
