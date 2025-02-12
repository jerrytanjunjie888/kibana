/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import type { CoreTheme } from 'kibana/public';
import { EuiPopoverTitle, EuiSwitch, EuiWrappingPopover } from '@elastic/eui';
import { Observable } from 'rxjs';
import { FormattedMessage, I18nProvider } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { Storage } from '../../../../../src/plugins/kibana_utils/public';
import { KibanaThemeProvider } from '../../../../../src/plugins/kibana_react/public';
import {
  disableAutoApply,
  enableAutoApply,
  LensAppState,
  selectAutoApplyEnabled,
  useLensDispatch,
  useLensSelector,
} from '../state_management';
import { trackUiEvent } from '../lens_ui_telemetry';
import { writeToStorage } from '../settings_storage';
import { AUTO_APPLY_DISABLED_STORAGE_KEY } from '../editor_frame_service/editor_frame/workspace_panel/workspace_panel_wrapper';

const container = document.createElement('div');
let isOpen = false;

function SettingsMenu({
  anchorElement,
  onClose,
}: {
  anchorElement: HTMLElement;
  onClose: () => void;
}) {
  const autoApplyEnabled = useLensSelector(selectAutoApplyEnabled);

  const dispatch = useLensDispatch();

  const toggleAutoApply = useCallback(() => {
    trackUiEvent('toggle_autoapply');

    writeToStorage(
      new Storage(localStorage),
      AUTO_APPLY_DISABLED_STORAGE_KEY,
      String(autoApplyEnabled)
    );
    dispatch(autoApplyEnabled ? disableAutoApply() : enableAutoApply());
  }, [dispatch, autoApplyEnabled]);

  return (
    <EuiWrappingPopover
      data-test-subj="lnsApp__settingsMenu"
      ownFocus
      button={anchorElement}
      closePopover={onClose}
      isOpen
    >
      <EuiPopoverTitle>
        <FormattedMessage id="xpack.lens.settings.title" defaultMessage="Lens settings" />
      </EuiPopoverTitle>
      <EuiSwitch
        label={i18n.translate('xpack.lens.settings.autoApply', {
          defaultMessage: 'Auto-apply visualization changes',
        })}
        checked={autoApplyEnabled}
        onChange={() => toggleAutoApply()}
        data-test-subj="lnsToggleAutoApply"
      />
    </EuiWrappingPopover>
  );
}

function closeSettingsMenu() {
  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  isOpen = false;
}

export function toggleSettingsMenuOpen(props: {
  lensStore: Store<LensAppState>;
  anchorElement: HTMLElement;
  theme$: Observable<CoreTheme>;
}) {
  if (isOpen) {
    closeSettingsMenu();
    return;
  }

  isOpen = true;
  document.body.appendChild(container);

  const element = (
    <Provider store={props.lensStore}>
      <KibanaThemeProvider theme$={props.theme$}>
        <I18nProvider>
          <SettingsMenu {...props} onClose={closeSettingsMenu} />
        </I18nProvider>
      </KibanaThemeProvider>
    </Provider>
  );
  ReactDOM.render(element, container);
}
