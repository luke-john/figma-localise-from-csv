import { setupDrahUI } from 'drah-figma/ui';
import type { MainActions } from '../main/drahMain';

const _uiActions = {
    demo: () => 'from ui',
};

export const { drahMainClient } = setupDrahUI<MainActions>(_uiActions);
export type UIActions = typeof _uiActions;
