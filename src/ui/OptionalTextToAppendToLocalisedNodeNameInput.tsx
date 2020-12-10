import * as React from 'react';

import { Input, Label } from 'react-figma-plugin-ds';

type Props = {
    optionalTextToAppendToLocalisedNodeName: string;
    setOptionalTextToAppendToLocalisedNodeName: (optionalTextToAppendToLocalisedNodeName: string) => void;
};

export function OptionalTextToAppendToLocalisedNodeNameInput(props: Props) {
    return (
        <div>
            <Label className="" size="small">
                Optional text to append to localised node name
            </Label>
            <Input
                className=""
                defaultValue={props.optionalTextToAppendToLocalisedNodeName}
                onChange={function E(value) {
                    props.setOptionalTextToAppendToLocalisedNodeName(value);
                }}
                placeholder="language"
            />
        </div>
    );
}
