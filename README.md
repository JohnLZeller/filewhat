# FileWhat

This is a Chrome Extension which adds a simple tooltip to common filenames in any Github repository, with a brief explanation of what the file is used for, and some possible resources for learning more.

With more and more tools showing up in our toolbelts everyday, it can feel a little onerous when viewing a project using many things you've never seen before. This extension helps by reducing the legwork it takes to ask, "What is this file for?"

Think of it as a Grok helper.

Here is a Github repository list without FileWhat

![Before](images/before.png)

Here is one with FileWhat

![After](images/after.png)

So helpful!

## How to use

There is a set of settings available to you:

* Toggle tooltips for generic filetypes such as .js or .py.
* Add a comma-separated list of strings representing filenames that you would like to exclude from showing tooltips.

Also, all files that show a tooltip will also make the file icon clickable and it will open a new tab, going to a link with more information about the type of file.