# Figma localise from csv

## Docs

### Transformation Logic

There are two modes supported by this plugin, translation per row or column. (per row not currently implemented)

#### Horizontal mode

In horizontal mode the plugin has four key user interactions (note: 1 and 2 do not need to occur sequentially).

1. select a node to localise
2. load a csv
3. select the source and translation columns
4. localise

##### 1. select a node (source node) to localise

While the plugin is running, the user needs to be able to select a node in the ui, and have feedback in the plugin ui which node has been selected.

##### 2. load a csv

In the ui the user needs to be able to upload a csv file, which will later be available to localise.

Once a csv has been uploaded, a preview of it should be available, along with the ability to replace it.

##### 3. select which columns should be treated as the source and translation columns

Once a csv has been uploaded, the user needs to be able to select which from which column text nodes names should be searched, and which column their characters replaced with.

##### 4. localise

Once a csv has been loaded, a source node to localise and source and translation columns have been selected, the user needs to be able to run the localisation.

The plugin should first duplicate the node (placing the new one immediately adjacent).

Then for each content row in the csv, this should;

-   search the duplicated node for ids which match the source column, replacing the content with the translation column value.

#### Vertical mode (not implemented)

In vertical mode the plugin has three or four key user interactions (note: 1 and 2 do not need to occur sequentially).

1. select a node to localise
2. load a csv
3. select which column should be appended to localised version (optional)
4. localise

##### 1. select a node (source node) to localise

While the plugin is running, the user needs to be able to select a node in the ui, and have feedback in the plugin ui which node has been selected.

##### 2. load a csv

In the ui the user needs to be able to upload a csv file, which will later be available to localise.

Once a csv has been uploaded, a preview of it should be available, along with the ability to replace it.

##### 3. select which column should be appended to localised version (optional)

Once a csv has been uploaded, users should be able to select a column that will be appended to the duplicated version of the source nodes title.

##### 4. localise

Once a csv has been loaded, and a source node to localise has been selected, the user needs to be able to run the localisation.

For each content row in a csv, this should;

-   duplicate the source node,
-   replace any text nodes inside the duplicated node which have an id that matches one of the csv rows columns title
-   if a column has been selected to append to the localised version, append its value to the duplicated nodes title

## Development

### Requirements

-   **node** [https://nodejs.org/]: JavaScript runtime
-   **yarn** [https://classic.yarnpkg.com/en/docs/install]: node dependency management and script runner

### Building the plugin

From the figma of the project run

```sh
yarn install # only required on initial setup to install dependencies
yarn build
```

This will bundle the plugin:

-   **ui** code from `src/ui/ui.tsx` into html file based on `src/ui/ui-template.html` into a html file with the js inlined at `dist/ui.html`
-   **main** code from `src/main/main.ts` into a js file at `dist/main.js`.

To bundle with react in development mode, you can instead run:

```
NODE_ENV=development yarn build
```

### Running the plugin in Figma

Go to **Menu** (Accessed by clicking your name on the figma home screen in the app landing page) > **Plugins** > **In Development** > **Create New Plugin +**

This will bring up the "Create a plugin" modal to create a plugin.

Under **Link existing plugin** click to choose a manifest.json file and select the manifest.json from the top level of this project.

Then from a file which has been setup for the plugin; open the plugin from any page, and click the **run** button.

A plugin testing file exists at https://www.figma.com/file/BkQK2RVWhGdByspbZYvlAH/PLUGIN-TESTING?node-id=1%3A3.

### Plugin structure and peculiarities

To understand how plugins run in Figma, please read https://www.figma.com/plugin-docs/how-plugins-run/.

Essentially you have two environments known as `main` and `ui`.

#### main

The `main` is run in a [jsvm sandbox](https://github.com/ftk/quickjspp) which does not give you the ability to set breakpoints, debug in the browser, or inspect crashes beyond what is logged (you also don't have access to the original stacktrace/error in the crash, but rather a textual "clone" of the stack trace).

The main thread can access the Figma "scene" (i.e. the hierarchy of layers that make up a Figma document) but not the browser APIs.

Because of the nature of how the code in main works, using traditional functions makes troubleshooting easier.

Also, in development pointer reference errors have been encountered, which appears to be an issue with the virtual machine not clearing memory across runs.

Closing figma and reopening seems to resolve this issue (error messages are cryptic and the specific messages were not captured while troubleshooting).

#### ui

The `ui` is run in an iframe with location set to `null`.

The iframe can access the browser APIs but not the Figma "scene."

#### communication between `main` and `ui`

The main thread and the iframe can communicate with each other through message passing, the apis are slightly different per environment.

-   main https://www.figma.com/plugin-docs/api/figma-ui/

    `figma.ui.postMessage`, `figma.ui.onmessage`, `figma.ui.on`, `figma.ui.once`, `figma.ui.off`

-   code https://www.figma.com/plugin-docs/creating-ui/

    `parent.postMessage`, `window.onmessage`

To faciliate messaging some communication helpers have been setup under `src/ui/actions` and `src/main/actions` using a tool we've built that allows you to write functions that are run in another environment with minimal setup https://github.com/luke-john/drah.

Main (`src/main/actions`) has a **MainActionClient** and **UiActionProcessor**.

Ui (`src/ui/actions`) has a **UiActionClient** and **MainActionProcessor**.

To communicate from `ENVIRONMENT_1:(Main|Ui)` to `ENVIRONMENT_2:(Main|Ui)` add a handler to the `ENVIRONMENT_1ActionProcessor` in the `src/ENVIRONMENT_2/actions` file. You will now be able to use the `ENVIRONMENT_1ActionClient` by calling ``ENVIRONMENT_1ActionClient['handler-key'], handlerOptions)`.
