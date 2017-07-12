// BSD License Disclaimer
// This code based on https://github.com/orbitbot/chrome-extensions-examples
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var store = chrome.storage;

function $(id) {
  return document.getElementById(id);
}

/**
 * Updates the UI to reflect the state of the preference.
 *
 * @param settings{object} A settings object, as returned from |get()| or the
 * |onchanged| event.
 */
function updateUI(settings) {
  document.getElementById('show_generic_filetypes').checked = settings['show_generic_filetypes'];
}

/**
 * Wrapper for |updateUI| which is used as callback for the |get()| method and
 * which logs the result.
 * If there was an error getting the preference, does nothing.
 *
 * @param settings{object} A settings object, as returned from |get()|.
 */
function updateUIFromGet(settings) {
  if (settings) {
    updateUI(settings);
  }
}

/*
 * Initializes the UI.
 */
function init() {
  store.sync.get(['show_generic_filetypes'], updateUIFromGet);
  store.onChanged.addListener(updateUI);

  $('show_generic_filetypes').addEventListener('click', function () {
    setPrefValue(this.checked);
  });
}

/**
 * Called from the UI to change the preference value.
 *
 * @param enabled{boolean} The new preference value.
 */
function setPrefValue(enabled) {
  store.sync.set({'show_generic_filetypes': enabled});
}

// Call `init` to kick things off.
document.addEventListener('DOMContentLoaded', init);
