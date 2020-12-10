import * as React from 'react';
import csvparse from 'js-csvparser';

import './CsvLoader.scss';

export type CsvData = { data: Array<string[]>; header: [string[]] };

type Props = {
    csvLoaded: boolean;
    setCsv: (csv: CsvData) => void;
};

export function CsvLoader(props: Props) {
    const ref = React.useRef<HTMLInputElement>();

    async function handleCsvInputChange(event: Parameters<React.InputHTMLAttributes<HTMLInputElement>['onChange']>[0]) {
        const csvFile = ref.current.files[0]!;

        const csvFileObjectURL = window.URL.createObjectURL(csvFile);

        let csvFileBlob = await fetch(csvFileObjectURL).then((r) => r.blob());

        let csvFileText = await csvFileBlob.text();

        const csv = csvparse(csvFileText, { header: 1 }) as CsvData;

        props.setCsv(csv);
    }

    return (
        <div className="csv-upload-container">
            <input type="file" className="csv-upload" accept=".csv" ref={ref} id="file-input-id" onChange={handleCsvInputChange}></input>
        </div>
    );
}
