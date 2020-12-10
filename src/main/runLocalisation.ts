export type Translations = { [key: string]: string };

export async function runLocalisation({ translations, optionalTextToAppendToLocalisedNodeName }: { translations: Translations; optionalTextToAppendToLocalisedNodeName?: string }) {
    console.log(figma.currentPage.selection);

    if (!figma.currentPage.selection || figma.currentPage.selection.length === 0) {
        figma.notify('You need to select a node to localise.');
        return false;
    }

    if (figma.currentPage.selection.length !== 1) {
        figma.notify('You can only select one node to localise at a time');
        return false;
    }

    try {
        const selectionNode = figma.currentPage.selection[0];

        let children: SceneNode[];

        switch (selectionNode.type) {
            case 'SLICE':
            case 'VECTOR':
            case 'STAR':
            case 'LINE':
            case 'ELLIPSE':
            case 'POLYGON':
            case 'RECTANGLE':
            case 'TEXT':
                figma.notify(`Unable to localise "${selectionNode.type}" nodes.`);
                return;
            default:
                const clonedNode = selectionNode.clone();

                if (optionalTextToAppendToLocalisedNodeName) {
                    clonedNode.name = `${clonedNode.name} - ${optionalTextToAppendToLocalisedNodeName}`;
                }

                selectionNode.parent?.appendChild(clonedNode);

                children = clonedNode.findAll(() => true) as SceneNode[];
        }

        for (const child of children) {
            if (child.type === 'TEXT') {
                const possibleTranslation = translations[child.name];
                if (possibleTranslation !== undefined) {
                    // In order to modify text, the plugin first needs to load any fonts used in it
                    // font loading code taken from https://www.figma.com/plugin-docs/api/TextNode/
                    let len = child.characters.length;
                    for (let i = 0; i < len; i++) {
                        // @ts-ignore
                        await figma.loadFontAsync(child.getRangeFontName(i, i + 1));
                    }

                    child.characters = possibleTranslation;
                }
            }
        }
    } catch (err) {
        console.log(err);
        figma.notify('Failed to localise node.');
    }
}
