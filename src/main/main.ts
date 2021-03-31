// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

import './drahMain';

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 200 });

// This needs to be loaded prior to adding text via the plugin, otherwise the script will crash.
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
