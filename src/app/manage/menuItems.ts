// import { Role } from '@/constants/type'
import {
  Home,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Pizza,
  Receipt,
  Tag,
  Apple,
  Warehouse,
  MessageCircle,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Sản phẩm",
    Icon: Pizza,
    href: "/manage/products",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Danh mục",
    Icon: Table,
    href: "/manage/menus",
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    // roles: [Role.Owner]
  },
  {
    title: "Khuyến mãi",
    Icon: Tag,
    href: "/manage/promotes",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Vouchers",
    Icon: Receipt,
    href: "/manage/vouchers",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Nhà cung cấp",
    Icon: Warehouse,
    href: "/manage/suppliers",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Nguyên liệu",
    Icon: Apple,
    href: "/manage/ingredients",
    // roles: [Role.Owner, Role.Employee]
  },
  {
    title: "Hỗ trợ khách hàng",
    Icon: MessageCircle,
    href: "/manage/supports",
    // roles: [Role.Owner, Role.Employee]
  },
  // {
  //   title: "Bàn ăn",
  //   Icon: Table,
  //   href: "/manage/tables",
  //   // roles: [Role.Owner, Role.Employee]
  // },
  // {
  //   title: "Món ăn",
  //   Icon: Salad,
  //   href: "/manage/dishes",
  //   // roles: [Role.Owner, Role.Employee]
  // },
];

export default menuItems;
