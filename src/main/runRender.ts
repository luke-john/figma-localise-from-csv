// import ReactDOMServer from 'react-dom/server';

// import JsxParser from 'react-jsx-parser';

export async function runRender(code: string) {
    if (!figma.currentPage.selection || figma.currentPage.selection.length === 0) {
        figma.notify('You need to select a node to render into.');
        return false;
    }

    if (figma.currentPage.selection.length !== 1) {
        figma.notify('You can only select one node to render into at a time');
        return false;
    }

    try {
        // @ts-ignore
        render('', figma.currentPage.selection);

        // console.log(staticMarkup);
    } catch (err) {
        console.log(err);
        figma.notify('Failed to localise node.');
    }
}
