import { setupDrahMain } from 'drah-figma/main';
import type { UIActions } from '../ui/drahUI';

const _mainActions = {
    setPluginData: (...parameters: Parameters<typeof figma.root.setPluginData>) => figma.root.setPluginData(...parameters),
    getPluginData: (...parameters: Parameters<typeof figma.root.getPluginData>) => figma.root.getPluginData(...parameters),
};

export const { drahUiClient } = setupDrahMain<UIActions>(_mainActions);
export type MainActions = typeof _mainActions;
