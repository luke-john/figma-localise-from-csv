import * as React from 'react';

import { Button } from 'react-figma-plugin-ds';

import type { Translations } from '../main/runLocalisation';

import { mainDrahClient } from './main-drah-client';
import { CsvData } from './CsvLoader';

type Props = {
    sourceColumn: string;
    translationColumn: string;
    csv: CsvData;
    optionalTextToAppendToLocalisedNodeName?: string;
};

export function RunLocalisation({ sourceColumn, translationColumn, csv, optionalTextToAppendToLocalisedNodeName }: Props) {
    const sourceIndex = csv.header[0].indexOf(sourceColumn);
    const translationIndex = csv.header[0].indexOf(translationColumn);

    const translations = csv.data.reduce<Translations>((acc, curr) => {
        acc[curr[sourceIndex]] = curr[translationIndex];
        return acc;
    }, {});

    console.log(translations);

    return (
        <div>
            <Button
                onClick={async function E() {
                    const selection = await mainDrahClient.process('runLocalisation', { translations, optionalTextToAppendToLocalisedNodeName });

                    console.log(selection);
                }}
            >
                Run localisation
            </Button>
        </div>
    );
}
