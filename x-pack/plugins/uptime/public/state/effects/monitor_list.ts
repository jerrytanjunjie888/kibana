/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
  getMonitorList,
  getMonitorListSuccess,
  getMonitorListFailure,
  getUpdatedMonitor,
  testNowMonitorAction,
} from '../actions';
import { fetchMonitorList, testNowMonitor } from '../api';
import { fetchEffectFactory } from './fetch_effect';

export function* fetchMonitorListEffect() {
  yield takeLatest(
    getMonitorList,
    fetchEffectFactory(fetchMonitorList, getMonitorListSuccess, getMonitorListFailure)
  );
}

export function* fetchUpdatedMonitorEffect() {
  yield takeLatest(
    getUpdatedMonitor.get,
    fetchEffectFactory(fetchMonitorList, getUpdatedMonitor.success, getUpdatedMonitor.fail)
  );
}

export function* fetchRunNowMonitorEffect() {
  yield takeEvery(
    testNowMonitorAction.get,
    fetchEffectFactory(testNowMonitor, testNowMonitorAction.success, testNowMonitorAction.fail)
  );
}
