import { RootState } from '../../app/store';
import { notificationsSelectors } from '../../slices/notifications.slice';

export const hasNotification = (state: RootState, message: string) =>
  notificationsSelectors.selectAll(state).find((notification) => notification.message === message);
