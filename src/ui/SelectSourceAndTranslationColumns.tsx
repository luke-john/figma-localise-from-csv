import * as React from 'react';

import { Title, Select, Label } from 'react-figma-plugin-ds';
import type { CsvData } from './CsvLoader';
import { mainDrahClient } from './main-drah-client';

type Props = {
    csv: CsvData;
    sourceAndTranslationColumns: [source: string, translation: string];
    setSourceAndTranslationColumns: (sourceAndTranslationColumns: [source: string, translation: string]) => void;
};

export function SelectSourceAndTranslationColumns(props: Props) {
    const options = props.csv.header[0].map((item) => ({ label: item, value: item }));

    return (
        <div>
            <Title className="" level="h2" size="large" weight="bold">
                Select source and translation columns
            </Title>
            <Label className="" size="small">
                Source column
            </Label>
            <Select
                className=""
                defaultValue={props.sourceAndTranslationColumns[0]}
                onChange={function E(e) {
                    mainDrahClient.process('setPluginData', ['sourceColumn', e.value as string]);
                    props.setSourceAndTranslationColumns([e.value as string, props.sourceAndTranslationColumns[1]]);
                }}
                onExpand={function E() {}}
                options={options}
                placeholder="Select source column..."
            />
            <Label className="" size="small">
                Translation column
            </Label>
            <Select
                className=""
                defaultValue={props.sourceAndTranslationColumns[1]}
                onChange={function E(e) {
                    mainDrahClient.process('setPluginData', ['translationColumn', e.value as string]);
                    props.setSourceAndTranslationColumns([props.sourceAndTranslationColumns[0], e.value as string]);
                }}
                onExpand={function E() {}}
                options={options}
                placeholder="Select translation column..."
            />
        </div>
    );
}
