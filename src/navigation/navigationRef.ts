import { createNavigationContainerRef } from '@react-navigation/native';

import type { AppNavigatorParamList } from './types';

export const navigationRef =
  createNavigationContainerRef<AppNavigatorParamList>();

export function getCurrentRouteName() {
  return navigationRef.getCurrentRoute()?.name;
}
