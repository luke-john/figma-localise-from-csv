import * as React from 'react';
import * as ReactDom from 'react-dom';

import 'react-figma-plugin-ds/figma-plugin-ds.css';

import { CsvData, CsvLoader } from './CsvLoader';
import { RunLocalisation } from './RunLocalisation';

import './ui.scss';

function App() {
    const [csv, _setCsv] = React.useState<CsvData>();

    const csvLoaded = csv !== undefined;

    function setCsv(csvData: CsvData) {
        // :thinking: For more resilience we could wipe sourceAndTranslationColumns if they were previously set, but do not exist on the new csvData
        _setCsv(csvData);
    }

    return (
        <div className="app">
            <CsvLoader csvLoaded={csvLoaded} setCsv={setCsv} />
            {csvLoaded && <RunLocalisation csv={csv} />}
        </div>
    );
}

async function setupApp() {
    // If you need to load any plugin data before first render, this is an easy place to load it (and pass to App)
    ReactDom.render(<App />, document.getElementById('react-app'));
}

setupApp();
