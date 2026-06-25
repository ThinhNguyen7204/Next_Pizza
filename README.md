# 🍕 La Pizzaia — Client (Next.js)

<div align="center">

![La Pizzaia](https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800&h=200)

**Ứng dụng đặt hàng và quản lý nhà hàng pizza phong cách Ý hiện đại**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Live Demo](https://img.shields.io/badge/Demo-la--pizzaia.site-FF4500?logo=firefox)](https://la-pizzaia.site)

</div>

---

## 🌐 Live Demo

**→ [https://la-pizzaia.site](https://la-pizzaia.site)**

### Tài khoản test

| Vai trò | Email | Mật khẩu | Truy cập |
|---------|-------|----------|---------|
| **Admin** | `admin@order.com` | `123456` | Toàn bộ hệ thống |
| **Customer** | `customer@order.com` | `123456` | Đặt hàng, giỏ hàng |
| **Customer 2** | `customer2@order.com` | `123456` | Đặt hàng, giỏ hàng |

---

## ✨ Tính năng chính

### 👤 Phía Khách hàng (Public)
- 🏠 **Trang chủ** — Gallery hình ảnh, giới thiệu nhà hàng
- 🍕 **Menu** — Duyệt món theo danh mục (Pizza, Sides, Dessert, Drink), tìm kiếm, xem chi tiết và chọn size
- 🛒 **Giỏ hàng** — Thêm/xóa món, chọn size, áp mã voucher
- 📦 **Checkout** — Đặt hàng, thanh toán
- 📋 **Profile** — Cập nhật thông tin, đổi mật khẩu
- 🎉 **Events** — Xem sự kiện của nhà hàng
- 💬 **Hỗ trợ** (`/contact`) — Gửi phàn nàn/góp ý, theo dõi trạng thái phiếu

### 🔧 Phía Admin/Quản lý (`/manage`)
- 📊 **Dashboard** — Doanh thu, đơn hàng, khách hàng, biểu đồ thống kê realtime
- 🛍️ **Đơn hàng** — Quản lý, cập nhật trạng thái đơn hàng
- 🍽️ **Sản phẩm** — CRUD món ăn, phân loại theo menu
- 📂 **Menu** — Quản lý danh mục món ăn
- 👥 **Tài khoản** — Quản lý nhân viên, phân quyền (Admin/Manager/Sales)
- 🧾 **Nguyên liệu** — Quản lý kho nguyên liệu
- 🚚 **Nhà cung cấp** — Danh sách và thông tin nhà cung cấp
- 🎫 **Voucher** — Tạo và quản lý mã giảm giá
- 🏆 **Chương trình thành viên** — Loyalty points
- 💬 **Hỗ trợ khách hàng** — Xem và phản hồi các phiếu hỗ trợ
- ⚙️ **Cài đặt** — Cập nhật profile, đổi mật khẩu

---

## 🛠️ Tech Stack

| Công nghệ | Mô tả |
|-----------|-------|
| **Next.js 16** (App Router) | Framework React với SSR/SSG |
| **React 19** | UI Library |
| **TypeScript 5** | Type safety |
| **TailwindCSS 4** | Styling utility-first |
| **Framer Motion** | Animations & transitions |
| **TanStack Query v5** | Data fetching & caching |
| **TanStack Table v8** | Data tables cho admin |
| **React Hook Form + Zod** | Form validation |
| **Zustand** | Global state management |
| **Socket.IO Client** | Realtime updates |
| **Recharts** | Biểu đồ thống kê |
| **Shadcn/UI + Radix UI** | UI Components |
| **Sonner** | Toast notifications |
| **Lucide React** | Icons |

---

## 📁 Cấu trúc dự án

```
client/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── (auth)/          # Login, Register
│   │   │   └── (main)/          # Public pages
│   │   │       ├── page.tsx     # Trang chủ / Gallery
│   │   │       ├── products/    # Menu & sản phẩm
│   │   │       ├── about/       # Giới thiệu
│   │   │       ├── events/      # Sự kiện
│   │   │       ├── contact/     # Hỗ trợ khách hàng
│   │   │       ├── checkout/    # Thanh toán
│   │   │       └── profile/     # Tài khoản khách
│   │   ├── manage/              # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── menus/
│   │   │   ├── accounts/
│   │   │   ├── ingredients/
│   │   │   ├── suppliers/
│   │   │   ├── vouchers/
│   │   │   ├── promotes/
│   │   │   ├── supports/
│   │   │   └── setting/
│   │   └── api/                 # Next.js API routes (proxy)
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   └── widgets/             # Header, Footer, Cart
│   ├── queries/                 # TanStack Query hooks
│   ├── store/                   # Zustand stores
│   ├── lib/                     # Utilities, HTTP client
│   ├── schemaValidations/       # Zod schemas
│   └── config/                  # Constants, config
├── public/
├── .env                         # Biến môi trường local
└── package.json
```

---

## 🚀 Chạy localhost

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn
- Backend server đang chạy (xem `../sever/README.md`)

### 1. Clone và cài đặt

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` tại thư mục `client/`:

```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
NEXT_PUBLIC_URL=http://localhost:3000
```

> ⚠️ Đảm bảo backend server đang chạy trên port `4000` trước khi khởi động client.

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**

### 4. Các lệnh hữu ích

```bash
# Development
npm run dev

# Build production
npm run build

# Chạy production build
npm start

# Lint
npm run lint
```

---

## 🔐 Phân quyền

| Role | Trang | Quyền |
|------|-------|-------|
| `Admin` | `/manage/*` | Toàn quyền |
| `Manager` | `/manage/*` | Xem + sửa (trừ accounts) |
| `Sales` | `/manage/orders` | Chỉ quản lý đơn hàng |
| `Customer` | Public pages | Đặt hàng, profile |

---

## 🌍 Môi trường Production

```env
NEXT_PUBLIC_API_ENDPOINT=https://api.la-pizzaia.site
NEXT_PUBLIC_URL=https://la-pizzaia.site
```

---

## 📸 Screenshots

> Truy cập **[https://la-pizzaia.site](https://la-pizzaia.site)** để xem giao diện thực tế.

- 🏠 Trang chủ với gallery ảnh đẹp phong cách Ý
- 🍕 Menu với bộ lọc danh mục và tìm kiếm
- 🛒 Chi tiết sản phẩm với chọn size S/M/L
- 📊 Dashboard admin với biểu đồ doanh thu realtime
- 💬 Hệ thống hỗ trợ khách hàng 2 chiều

---

<div align="center">

Made with ❤️ by **Thinh Nguyen** — La Pizzaia Restaurant System

</div>
