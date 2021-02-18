import * as React from 'react';

import { Button } from 'react-figma-plugin-ds';

import { mainDrahClient } from './main-drah-client';
import { CsvData } from './CsvLoader';

type Props = {
    csv: CsvData;
};

export function RunLocalisation({ csv }: Props) {
    return (
        <div>
            <Button
                onClick={async function E() {
                    await mainDrahClient.runLocalisation({ csv });
                }}
            >
                Run localisation
            </Button>
        </div>
    );
}
