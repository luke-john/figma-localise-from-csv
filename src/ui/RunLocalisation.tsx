import * as React from 'react';

import { Button } from 'react-figma-plugin-ds';

import { drahMainClient } from './drahUI';
import { CsvData } from './CsvLoader';

type Props = {
    csv: CsvData;
};

export function RunLocalisation({ csv }: Props) {
    return (
        <div>
            <Button
                onClick={async function E() {
                    await drahMainClient.runLocalisation({ csv });
                }}
            >
                Run localisation
            </Button>
        </div>
    );
}
