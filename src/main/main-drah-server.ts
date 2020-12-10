import { DrahServer, ExtractActionsFromServer } from 'drah-server';
import { runLocalisation } from './runLocalisation';

export const mainDrahServer = new DrahServer({
    handlers: {
        runLocalisation,
        setPluginData: (parameters: Parameters<typeof figma.root.setPluginData>) => figma.root.setPluginData(...parameters),
        getPluginData: (parameters: Parameters<typeof figma.root.getPluginData>) => figma.root.getPluginData(...parameters),
    },
    sendToClient: (message: string) => {
        figma.ui.postMessage({
            type: 'from-main-drah-server',
            data: message,
        });
    },
});

export type MainDrahServerActions = ExtractActionsFromServer<typeof mainDrahServer>;

figma.ui.onmessage = async function handleMessage(pluginMessage) {
    if (pluginMessage.type === 'from-main-drah-client') {
        mainDrahServer.receiveFromClient(pluginMessage.data);
        return;
    }
};
