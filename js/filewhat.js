var store = chrome.storage,
    observer = new MutationObserver(function() { init(); });

function init(){
    var files = document.getElementsByClassName("octicon-file-text");
    Array.prototype.slice.call(files, 0).forEach(function (element) {
        var e = element.parentElement;
        var filename = e.nextSibling.nextSibling.textContent.replace(/ /g, '').replace(/\n/g, ''),
            id = uuid();

        // don't continue if our tooltipNode already exists
        if (!!e.getAttribute('data-filewhat-id')) {
            return;
        }

        // add attributes that allow us to identify this tooltipNode in some element
        e.setAttribute('data-filewhat-id', id);
        e.setAttribute('data-filewhat-filename', filename);

        // add our tooltipNode ui functionality to the element
        e.onmouseenter = onMouseEnter;
        e.onmouseleave = onMouseLeave;
    });
}

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
        repo_width = document.getElementsByClassName("repository-content")[0].offsetWidth,
        blacklist_files = [],
        url;
    var tooltip_width = ((window.innerWidth - repo_width) / 2) - 10

    // don't continue if the tooltip id doesn't exist, or the tooltip already exists
    if (id === undefined) {
        return;
    }

    // only show if this filename/type is not blacklisted
    chrome.storage.sync.get(['blacklist_files'], function(settings) {
        if (settings['blacklist_files']) {
            blacklist_files = settings['blacklist_files'].replace(/ /g, '').split(",");
        }

        if (blacklist_files.indexOf(filename) < 0) {
            // create the tooltip node, append it to the td node, and then mark this tooltip as active
            var tooltipNode = document.createElement('div');
            tooltipNode.className = 'filewhat';
            tooltipNode.style.width = tooltip_width + 'px';
            tooltipNode.style.opacity = 0;
            e.target.parentElement.appendChild(tooltipNode);

            buildTooltip(tooltipNode, filename);
        }
    });
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
        tooltipNode.parentElement.onclick = null;
        tooltipNode.parentElement.removeChild(tooltipNode);
    } catch (e) {
        console.log("Error when attempting to remove tooltipNode div");
        console.log(e);
    }
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

    fetchDescription(tooltipNode, tooltipTemplate, filename);
}

function fetchDescription(tooltipNode, tooltipTemplate, filename){
    var descURL, xmlhttp, extDesc, ext, showGenericFiletypes, id, pieces, url;

    // encode filename
    if (filename.startsWith('.')) {
        filename = "dot_" + filename.substring(1)
    }
    descURL = chrome.runtime.getURL("descriptions/" + filename + ".html");

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', descURL, true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status < 400 && xmlhttp.responseText && xmlhttp.readyState == 4){
            pieces = xmlhttp.responseText.split("\n");
            url = pieces.pop(-1)
            if (url.startsWith('http')) {
                pieces.pop(-1);  // remove <br><br>
                tooltipNode.innerHTML = tooltipTemplate.replace(
                    '%filetype-description%', pieces.join('\n')
                );
                tooltipNode.parentElement.onclick = function(){ window.open(url, "_blank"); };
            } else {
                tooltipNode.innerHTML = tooltipTemplate.replace(
                    '%filetype-description%', xmlhttp.responseText
                );
            }
            tooltipNode.style.opacity = null;
        }
    };

    xmlhttp.onerror = function () {
        chrome.storage.sync.get(['show_generic_filetypes'], function(settings) {
            if (settings['show_generic_filetypes']) {
                ext = filename.split('.');
                ext = '.' + ext[ext.length - 1];
                extDesc = fileExtensions[ext];

                if (extDesc == undefined) {
                    return;
                }

                tooltipTemplate = tooltipTemplate.replace(
                    filename, extDesc['name'] + ' file'
                );
                tooltipNode.innerHTML = tooltipTemplate.replace(
                    '%filetype-description%', extDesc['description']
                );
                tooltipNode.parentElement.onclick = function(){ window.open(extDesc['link'], "_blank"); };
                tooltipNode.style.opacity = null;
            } else {
                id = document.getElementsByClassName('filewhat')[0].parentElement.firstElementChild.getAttribute('data-filewhat-id');
                removeTooltip(id, tooltipNode);
            }
        });
    };

    xmlhttp.send(null);
}

init();

// Setup a mutation observer to look for mutations on the document.body because Github uses pjax to build new pages without refreshing
// and once a page is being rebuilt, we need to re-initialize ourselves.
observer.observe(document.body, {
    'childList': true,
    'subtree': true
});
