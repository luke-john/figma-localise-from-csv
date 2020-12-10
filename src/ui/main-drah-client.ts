import { DrahClient } from 'drah-client';

import type { MainDrahServerActions } from '../main/main-drah-server';

export const mainDrahClient = new DrahClient<MainDrahServerActions>({
    sendToServer: (serializedData) => {
        window.parent.postMessage(
            {
                pluginMessage: {
                    type: 'from-main-drah-client',
                    data: serializedData,
                },
            },
            '*'
        );
    },
});

window.onmessage = async (event: MessageEvent<any>) => {
    const pluginMessage = event.data.pluginMessage;

    switch (pluginMessage.type) {
        case 'from-main-drah-server':
            mainDrahClient.receiveFromServer(pluginMessage.data);

            return;
    }
};
