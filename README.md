# Figma localise from csv

## Docs

### Expected source format

This expects a title row with the first column for Source, and additional columms for each language to be translated.

ie. (note, these are not actual translations).

```csv
Source,lang1,lang2,lang3,...
"What","Чего","Woraus","Que","¿A qué?",...
"I","Я","Wo","Je","A",...
```

It also has support for;

-   basic HTML tags (b, i, u)
-   converting some special strings
    -   `{{__NB_SPACE__}}` -> not-breaking space
    -   `{{__NB_HYPHEN__}}` -> not-breaking hyphen

For use of the b and i html tags, this plugin requires the original node that is being translated to use a font which has `italic`, `bold` and `bold italic` styles available.

### Plugin Guide

The plugin has three key user interactions (note: 1 and 2 do not need to occur sequentially).

1. select a node to localise
2. load a csv
3. localise

#### 1. select a node (original node) to localise

While the plugin is running, the user needs to be able to select a node in the ui, and have feedback in the plugin ui which node has been selected.

#### 2. load a csv

In the ui the user needs to be able to upload a csv file, which will later be available to localise.

Once a csv has been uploaded, a preview of it should be available, along with the ability to replace it.

#### 3. localise

Once a csv has been loaded, and an original node to localise has been selected, the user needs to be able to run the localisation.

For each language column in the loaded csv, this should;

-   duplicate the original node,
-   replace any text nodes inside the duplicated node which have an id that matches an entry in the the Source column.

    when replacing, this should;

    -   handle basic html tags (b, u, i)
    -   convert some special strings
        -   `{{__NB_SPACE__}}` -> not-breaking space
        -   `{{__NB_HYPHEN__}}` -> not-breaking hyphen

-   append the language name to the duplicated nodes title

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
