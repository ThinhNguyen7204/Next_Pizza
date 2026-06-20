export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken'
} as const

export const Role = {
  Admin: 'Admin',
  Sales: 'Sales',
  CustomerSupport: 'CustomerSupport',
  Kitchen: 'Kitchen',
  Delivery: 'Delivery',
  Manager: 'Manager',
  Customer: 'Customer'
} as const

export const RoleValues = [
  Role.Admin,
  Role.Sales,
  Role.CustomerSupport,
  Role.Kitchen,
  Role.Delivery,
  Role.Manager,
  Role.Customer
] as const

export const ProductStatus = {
  Available: 'Available',
  Unavailable: 'Unavailable',
  Hidden: 'Hidden'
} as const

export const ProductStatusValues = [ProductStatus.Available, ProductStatus.Unavailable, ProductStatus.Hidden] as const

export const OrderStatus = {
  Pending: 'Pending',
  Processing: 'Processing',
  Shipping: 'Shipping',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Paid: 'Paid'
} as const

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Shipping,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
  OrderStatus.Paid
] as const

export const DeliveryType = {
  Delivery: 'Delivery',
  Pickup: 'Pickup'
} as const

export const DeliveryTypeValues = [DeliveryType.Delivery, DeliveryType.Pickup] as const

export const DiscountType = {
  Percentage: 'Percentage',
  FixedAmount: 'FixedAmount'
} as const

export const DiscountTypeValues = [DiscountType.Percentage, DiscountType.FixedAmount] as const
