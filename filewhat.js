var tooltips = new Map(),
    fileExtensions = {
        '.py': {
            'name': 'Python',
            'link': 'https://www.python.org/',
            'description': 'Python is an interpreted, object-oriented, high-level programming language \
                            with dynamic semantics. Its high-level built in data structures, combined with \
                            dynamic typing and dynamic binding, make it very attractive for Rapid Application \
                            Development, as well as for use as a scripting or glue language to connect existing \
                            components together.'
        },
        '.md': {
            'name': 'Markdown',
            'link': 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet',
            'description': ''
        },
        '.gs': {
            'name': 'Google App Script',
            'link': 'https://www.google.com/script/start/',
            'description': 'Google Apps Script is a JavaScript cloud scripting language that \
                            provides easy ways to automate tasks across Google products and third \
                            party services and build web applications.'
        },
        '.jar': {
            'name': 'Java Archive',
            'link': 'https://docs.oracle.com/javase/tutorial/deployment/jar/basicsindex.html',
            'description': 'JAR files are packaged with the ZIP file format, so you can use them for \
                            tasks such as lossless data compression, archiving, decompression, and \
                            archive unpacking.'
        },
        '.csv': {
            'name': 'Comma Separated Values',
            'link': '',
            'description': 'A CSV is a comma separated values file which allows data to be saved in a \
                            table structured format. CSVs look like a garden-variety spreadsheet but with \
                            a .csv extension (Traditionally they take the form of a text file containing \
                            information separated by commas, hence the name).'
            },
        '.gemspec': {
            'name': 'Gemspec',
            'link': 'http://guides.rubygems.org/what-is-a-gem/',
            'description': 'A .gemspec file is a standard format for describing all of the information that \
                            gets packed with gems then deployed to rubygems.org. This includes info on what’s \
                            in the gem, who made it, and the version. All the info you see on a gem page comes \
                            from the gemspec file. A gem is a Ruby package, and RubyGems is a package manager \
                            for Ruby.'
            },
        '.php': {
            'name': '\'PHP: Hypertext Preprocessor\'',
            'link': 'http://php.net/docs.php',
            'description': 'PHP (recursive acronym for PHP: Hypertext Preprocessor) is a widely-used open source \
                            general-purpose scripting language that is especially suited for web development and \
                            can be embedded into HTML.'
        },
        '.yml': {
            'name': 'YAML',
            'link': 'http://www.yaml.org/start.html',
            'description': 'YAML is a human-readable data serialization language, commonly used for configuration \
                            files, but could be used in many applications where data is being stored (e.g. debugging \
                            output) or transmitted (e.g. document headers).'
        },
        '.json': {
            'name': 'JavaScript Object Notation (JSON)',
            'link': 'https://www.w3schools.com/js/js_json_intro.asp',
            'description': 'JSON, or JavaScript Object Notation, is a minimal, readable format for structuring data. \
                            It is used primarily to transmit data between a server and web application, as an alternative \
                            to XML.'
        },
        '.js': {
            'name': 'JavaScript',
            'link': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
            'description': 'JavaScript is a cross-platform, object-oriented scripting language. It is a small and \
                            lightweight language. Inside a host environment (for example, a web browser), JavaScript can be \
                            connected to the objects of its environment to provide programmatic control over them.'
        },
        '.ts': {
            'name': 'TypeScript',
            'link': 'http://www.typescriptlang.org/',
            'description': 'TypeScript is a superset of JavaScript which primarily provides optional static typing, classes \
                            and interfaces. TypeScript compiles to plain JavaScript. One of the big benefits is to enable IDEs \
                            to provide a richer environment for spotting common errors as you type the code.'
        },
        '.sh': {
            'name': 'Shell Executable',
            'link': 'http://linuxcommand.org/writing_shell_scripts.php',
            'description': 'A .sh file is a unix (linux) shell executable file. Typically this is a shell script which you can \
                            execute in a terminal.'
        },
        '.pem': {
            'name': 'Privacy Enhanced Mail',
            'link': 'http://how2ssl.com/articles/working_with_pem_files/',
            'description': 'PEM or Privacy Enhanced Mail is a Base64 encoded DER certificate. PEM certificates are frequently \
                            used for web servers as they can easily be translated into readable data using a simple text editor. \
                            PEM is the standard format for OpenSSL and many other SSL tools. This format is designed to be safe \
                            for inclusion in ascii or even rich-text documents, such as emails. This means that you can simple \
                            copy and paste the content of a pem file to another document and back.'
        },
        '.css': {
            'name': 'Cascading Style Sheets',
            'link': 'https://www.w3schools.com/css/css_intro.asp',
            'description': 'Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a \
                            document written in a markup language, such as HTML. CSS describes how HTML elements are to be \
                            displayed on screen, paper, or in other media'
        },
        '.rb': {
            'name': 'Ruby',
            'link': 'https://www.ruby-lang.org/en/',
            'description': 'Ruby is a dynamic, reflective, object-oriented, general-purpose programming language.'
        },
        '.log': {
            'name': 'Log',
            'link': '',
            'description': 'A log file is simply a text file containing the output of some arbitrary log stream.'
        },
        '.sql': {
            'name': 'Structured Query Language (SQL)',
            'link': 'http://www.sqlcourse.com/intro.html',
            'description': 'SQL stands for Structured Query Language. SQL is used to communicate with a database. According to ANSI \
                            (American National Standards Institute), it is the standard language for relational database management \
                            systems.'
        },
        '.coffee': {
            'name': 'CoffeeScript',
            'link': 'http://coffeescript.org/',
            'description': 'CoffeeScript is a little language that compiles into JavaScript. Underneath that awkward Java-esque patina, \
                            JavaScript has always had a gorgeous heart. CoffeeScript is an attempt to expose the good parts of JavaScript \
                            in a simple way. The golden rule of CoffeeScript is: "It\'s just JavaScript".'
        },
    };

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

    fetchDescription(tooltipNode, tooltipTemplate, filename);
}

function fetchDescription(tooltipNode, tooltipTemplate, filename){
    var descURL = chrome.runtime.getURL("descriptions/" + filename + ".html"),
        xmlhttp, extDesc, ext;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', descURL, true);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status < 400 && xmlhttp.responseText && xmlhttp.readyState == 4){
            tooltipNode.innerHTML = tooltipTemplate.replace(
                '%filetype-description%', xmlhttp.responseText
            );
        }
    };

    xmlhttp.onerror = function () {
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
            '%filetype-description%', extDesc['description'] + '<br><br>' + extDesc['link']
        );
    };

    xmlhttp.send(null);
}