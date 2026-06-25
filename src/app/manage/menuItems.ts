import { Role } from '@/constants/type'
import { RoleType } from '@/types/jwt.types'
import {
  Home,
  ShoppingCart,
  Users2,
  Table,
  Pizza,
  Receipt,
  Tag,
  Apple,
  Warehouse,
  MessageCircle,
} from "lucide-react";

// roles: undefined = tất cả staff (Admin, Manager, Sales...) đều thấy
// roles: [Role.Admin] = chỉ Admin thấy
// roles: [Role.Admin, Role.Manager] = Admin + Manager thấy

const menuItems: { title: string; Icon: any; href: string; roles?: RoleType[] }[] = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    roles: [Role.Admin, Role.Manager, Role.Sales],
  },
  {
    title: "Sản phẩm",
    Icon: Pizza,
    href: "/manage/products",
    roles: [Role.Admin, Role.Manager],
  },
  {
    title: "Danh mục",
    Icon: Table,
    href: "/manage/menus",
    roles: [Role.Admin, Role.Manager],
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
    roles: [Role.Admin, Role.Manager, Role.Sales],
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    roles: [Role.Admin], // Chỉ Admin mới quản lý nhân viên
  },
  {
    title: "Khuyến mãi",
    Icon: Tag,
    href: "/manage/promotes",
    roles: [Role.Admin, Role.Manager],
  },
  {
    title: "Vouchers",
    Icon: Receipt,
    href: "/manage/vouchers",
    roles: [Role.Admin, Role.Manager],
  },
  {
    title: "Nhà cung cấp",
    Icon: Warehouse,
    href: "/manage/suppliers",
    roles: [Role.Admin, Role.Manager],
  },
  {
    title: "Nguyên liệu",
    Icon: Apple,
    href: "/manage/ingredients",
    roles: [Role.Admin, Role.Manager],
  },
  {
    title: "Hỗ trợ khách hàng",
    Icon: MessageCircle,
    href: "/manage/supports",
    roles: [Role.Admin, Role.Manager, Role.Sales],
  },
];

export default menuItems;
