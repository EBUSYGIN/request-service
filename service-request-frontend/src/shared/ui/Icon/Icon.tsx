import Logo from '@assets/img/icons/logo.svg?react';
import Notifications from '@assets/img/icons/notifications.svg?react';
import ProductsList from '@assets/img/icons/products-list.svg?react';
import Workshop from '@assets/img/icons/workshop.svg?react';
import OrderCalc from '@assets/img/icons/calc-order.svg?react';

export const Icon = {
  Logo,
  Notifications,
  ProductsList,
  Workshop,
  OrderCalc,
};

export type IconType = keyof typeof Icon;
