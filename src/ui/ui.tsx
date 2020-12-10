import * as React from 'react';
import * as ReactDom from 'react-dom';

import 'react-figma-plugin-ds/figma-plugin-ds.css';

import { CsvData, CsvLoader } from './CsvLoader';
import { mainDrahClient } from './main-drah-client';
import { OptionalTextToAppendToLocalisedNodeNameInput } from './OptionalTextToAppendToLocalisedNodeNameInput';
import { RunLocalisation } from './RunLocalisation';
import { SelectSourceAndTranslationColumns } from './SelectSourceAndTranslationColumns';

import './ui.scss';

function App({ initialSourceColumn, initialTranslationColumn }: { initialSourceColumn?: string; initialTranslationColumn?: string }) {
    const [csv, _setCsv] = React.useState<CsvData>();
    const [[sourceColumn, translationColumn], _setSourceAndTranslationColumns] = React.useState<[source: string, translation: string]>([initialSourceColumn, initialTranslationColumn]);
    const [optionalTextToAppendToLocalisedNodeName, setOptionalTextToAppendToLocalisedNodeName] = React.useState<string>();

    const csvLoaded = csv !== undefined;

    function setSourceAndTranslationColumns(sourceAndTranslationColumns: [source: string, translation: string]) {
        _setSourceAndTranslationColumns(sourceAndTranslationColumns);
    }

    function setCsv(csvData: CsvData) {
        // :thinking: For more resilience we could wipe sourceAndTranslationColumns if they were previously set, but do not exist on the new csvData
        _setCsv(csvData);
    }

    return (
        <div className="app">
            {csvLoaded && (
                <SelectSourceAndTranslationColumns sourceAndTranslationColumns={[sourceColumn, translationColumn]} setSourceAndTranslationColumns={setSourceAndTranslationColumns} csv={csv} />
            )}
            <CsvLoader csvLoaded={csvLoaded} setCsv={setCsv} />
            {csvLoaded && (
                <OptionalTextToAppendToLocalisedNodeNameInput
                    optionalTextToAppendToLocalisedNodeName={optionalTextToAppendToLocalisedNodeName}
                    setOptionalTextToAppendToLocalisedNodeName={setOptionalTextToAppendToLocalisedNodeName}
                />
            )}
            {sourceColumn && translationColumn && csvLoaded && (
                <RunLocalisation sourceColumn={sourceColumn} translationColumn={translationColumn} csv={csv} optionalTextToAppendToLocalisedNodeName={optionalTextToAppendToLocalisedNodeName} />
            )}
        </div>
    );
}

async function setupApp() {
    // this should only take milliseconds
    const storedPluginDataSourceColumn = await mainDrahClient.process('getPluginData', ['sourceColumn']);
    const storedPluginDataTranslationColumn = await mainDrahClient.process('getPluginData', ['translationColumn']);

    ReactDom.render(<App initialSourceColumn={storedPluginDataSourceColumn} initialTranslationColumn={storedPluginDataTranslationColumn} />, document.getElementById('react-app'));
}

setupApp();
