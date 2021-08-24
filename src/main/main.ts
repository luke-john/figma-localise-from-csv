// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// import { setupMainThread } from 'react-figma/rpc';

import './drahMain';

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 200 });

// setupMainThread();
