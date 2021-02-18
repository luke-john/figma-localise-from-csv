import type { CsvData } from '../ui/CsvLoader';

export async function runLocalisation({ csv }: { csv: CsvData }) {
    if (!figma.currentPage.selection || figma.currentPage.selection.length === 0) {
        figma.notify('You need to select a node to localise.');
        return false;
    }

    if (figma.currentPage.selection.length !== 1) {
        figma.notify('You can only select one node to localise at a time');
        return false;
    }

    try {
        const titleRow = csv.header[0];

        // the first column in the csv.header is the source column, so we start at the 2nd (index 1)
        for (let langCol = 1; langCol < titleRow.length; langCol++) {
            const lang = titleRow[langCol];

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

                    clonedNode.name = `${clonedNode.name} - ${lang}`;

                    selectionNode.parent?.appendChild(clonedNode);

                    children = clonedNode.findAll(() => true) as SceneNode[];
            }

            const translations = csv.data.reduce<{ [Source: string]: string }>((acc, currentRow) => {
                acc[currentRow[0]] = currentRow[langCol];
                return acc;
            }, {});

            for (const child of children) {
                if (child.type === 'TEXT') {
                    const possibleTranslation = translations[child.name];

                    if (possibleTranslation !== undefined) {
                        const { text, ranges } = convertTranslationToTextWithRanges(possibleTranslation);

                        // In order to modify text, the plugin first needs to load any fonts used in it
                        // font loading code taken from https://www.figma.com/plugin-docs/api/TextNode/
                        let len = child.characters.length;
                        for (let i = 0; i < len; i++) {
                            // @ts-ignore
                            await figma.loadFontAsync(child.getRangeFontName(i, i + 1));
                        }

                        child.characters = text;

                        for (let { start, end, format } of ranges) {
                            if (format === 'u') {
                                child.setRangeTextDecoration(start, end, 'UNDERLINE');
                            } else {
                                // Note: this assumes the font that the origin is using has `Bold`, `Italic` and `Bold Italic` variants loaded.
                                const currentRangeFontName = child.getRangeFontName(start, end) as FontName;

                                let newFontStyle: string;

                                if ((currentRangeFontName.style === 'Bold' && format === 'i') || (currentRangeFontName.style === 'Italic' && format === 'b')) {
                                    newFontStyle = 'Bold Italic';
                                } else if (format === 'b') {
                                    newFontStyle = 'Bold';
                                } else if (format === 'i') {
                                    newFontStyle = 'Italic';
                                }

                                await figma.loadFontAsync({ ...currentRangeFontName, style: newFontStyle });
                                child.setRangeFontName(start, end, { ...currentRangeFontName, style: newFontStyle });
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        figma.notify('Failed to localise node.');
    }
}

function convertTranslationToTextWithRanges(translation: string) {
    const nonBreakingSpace = ' ';
    const nonBreakingHyphen = '‑';
    const translationWithSpecialStringsConverted = translation.replaceAll('{{__NB_SPACE__}}', nonBreakingSpace).replaceAll('{{__NB_HYPHEN__}}', nonBreakingHyphen);

    const { text, ranges } = htmlToTextWithRanges(translationWithSpecialStringsConverted);

    return {
        text,
        ranges,
    };
}

function htmlToTextWithRanges(html: string) {
    // this only supports the tags b, u and i.
    // if greater support was needed, using something like unified would be a better option

    let ranges: { start: number; end: number; format: 'b' | 'u' | 'i' }[] = [];

    const buiTagsRegex = /<(b|u|i)>(.*?)<\/\1>/;

    while (true) {
        const match = html.match(buiTagsRegex);

        if (!match) {
            break;
        }

        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        ranges.forEach((range) => {
            if (range.end >= matchStart) {
                if (range.end >= matchEnd) {
                    range.end = range.end - 7;
                } else {
                    range.end = range.end - 3;
                }
            }
        });

        ranges.push({
            start: matchStart,
            end: matchEnd - 7,
            format: match[1] as 'b' | 'u' | 'i',
        });

        html = html.replace(buiTagsRegex, '$2');
    }

    return {
        text: html,
        ranges,
    };
}
