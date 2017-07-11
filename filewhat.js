var tooltips = new Map();

function init(){
    var files = window.document.getElementsByClassName("octicon-file-text");
    Array.prototype.slice.call(files, 0).forEach(function (element) {
        var e = element.parentElement;
        var filename = e.nextSibling.nextSibling.textContent.replace(/ /g, '').replace(/\n/g, ''),
            id = uuid();

        // don't continue if our tooltipNode already exists
        if (!!e.getAttribute('data-filewhat-id')) {
            return;
        }

        // keep track of tooltips by id and activity
        tooltips.set(id, {
            active: false
        });

        // add attributes that allow us to identify this tooltipNode in some element
        e.setAttribute('data-filewhat-id', id);
        e.setAttribute('data-filewhat-filename', filename);

        // add our tooltipNode ui functionality to the element
        e.onmouseenter = onMouseEnter;
        e.onmouseleave = onMouseLeave;
    });
}

init();

// RFC 4122 compliant, from: https://gist.github.com/jcxplorer/823878
function uuid() {
    var uuid = "",
        i, random;

    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
}

function onMouseEnter(e) {
    var id = e.target.getAttribute('data-filewhat-id'),
        filename = e.target.getAttribute('data-filewhat-filename'),
        repo_width = window.document.getElementsByClassName("repository-content")[0].offsetWidth,
        tooltip, url;
    var tooltip_width = ((window.innerWidth - repo_width) / 2) - 10

    // don't continue if the tooltip id doesn't exist, or the tooltip already exists
    if (id === undefined) {
        return;
    }

    tooltip = tooltips.get(id);

    if (!tooltip || tooltip.active){
        return;
    }

    // create the tooltip node, append it to the td node, and then mark this tooltip as active
    var tooltipNode = document.createElement('div');
    tooltipNode.className = 'filewhat';
    tooltipNode.style.width = tooltip_width + 'px';
    e.target.parentElement.appendChild(tooltipNode);
    tooltip.active = true;

    buildTooltip(tooltipNode, filename, tooltip);
}

function onMouseLeave(e){
    var id = e.target.getAttribute('data-filewhat-id'),
        tooltipNode = e.target.parentElement.querySelector('.filewhat');

    // don't continue if either the tooltip id nor the tooltip node doesn't exist
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
        console.log("Error when attempting to remove tooltipNode div");
        console.log(e);
    }

    tooltip = tooltips.get(id);
    tooltip.active = false;
}

function buildTooltip(tooltipNode, filename){
    var tooltipTemplate = [
        '<div class="filetype-header">',
        filename,
        '</div><br>',
        '<div class="filetype-description">',
            '<p>%filetype-description%</p>',
        '</div>'
    ].join('');
    var descURL = chrome.runtime.getURL("descriptions/" + filename + ".html"),
        xmlhttp;

    tooltipNode.innerHTML = tooltipTemplate;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', descURL, true);

    xmlhttp.onreadystatechange = function () {
        var desc = 'No description found.';

        if (xmlhttp.status < 400 && xmlhttp.responseText && xmlhttp.readyState == 4){
            desc = xmlhttp.responseText;
        }

        if (xmlhttp.readyState == 4) {
            tooltipNode.innerHTML = tooltipNode.innerHTML.replace(
                '%filetype-description%', desc
            );
        }
    };

    xmlhttp.send(null);
}
