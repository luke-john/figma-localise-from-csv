import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Button, Textarea } from 'react-figma-plugin-ds';
import 'react-figma/rpc';
import { View, Text, render } from 'react-figma';

import 'react-figma-plugin-ds/figma-plugin-ds.css';
// import { drahMainClient } from './drahUI';

import './ui.scss';

function App() {
    const [code, setCode] = React.useState('');
    function doThing(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        render(
            <View>
                <Text>Hello world!</Text>
            </View>
        );
    }

    return (
        <div className="app">
            <Textarea placeholder="code" rows={5} onChange={(value) => setCode(value)} defaultValue={code} />
            <Button onClick={doThing}>Do thing</Button>
        </div>
    );
}

async function setupApp() {
    // If you need to load any plugin data before first render, this is an easy place to load it (and pass to App)
    ReactDom.render(<App />, document.getElementById('react-app'));
}

setupApp();
