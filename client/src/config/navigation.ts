import type { LucideIcon } from 'lucide-react';
import {
  BarChart3, BookOpen, Briefcase, Calculator, ClipboardCheck,
  ClipboardList, Clock, FileWarning, FolderKanban, LayoutDashboard,
  LayoutGrid, Network, NotebookPen, Rocket, Settings,
  SlidersHorizontal, Table, Target, UserSearch, Users, Wallet, Cpu, Link2,
  KanbanSquare, FileBarChart, Fingerprint, WalletCards, UserMinus,
  TrendingUp, MessageCircleQuestion,
} from 'lucide-react';
import type { AdminFunctionCode, AdminPermission } from '@/lib/permissions';

export interface AdminNavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  permission: AdminPermission;
  anyPermissions?: AdminPermission[];
  group: string;
  keywords?: string;
  fullAdminOnly?: boolean;
  /** Mảng = mở khi có một trong các chức năng. */
  functionCode?: AdminFunctionCode | readonly AdminFunctionCode[];
  hideForTeamlead?: boolean;
  /** Trưởng nhóm chỉ được mở không gian nhân viên của mục này. */
  teamleadEmployeeDocuments?: boolean;
}

/**
 * Một nguồn điều hướng duy nhất cho sidebar và tìm kiếm nhanh.
 * Thứ tự phản ánh vòng đời nghiệp vụ: thiết lập tổ chức → thu hút/tiếp nhận
 * nhân sự → vận hành công việc & thời gian → phát triển → hệ thống.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { to: '/admin/users', label: 'Hồ sơ nhân sự', description: 'Thông tin cá nhân, tình trạng làm việc và giấy tờ nhân viên', icon: Users, permission: 'users', group: 'Nhân sự', keywords: 'ho so nhan su danh ba nhan vien tai khoan' },

  { to: '/admin/leave', label: 'Trung tâm đơn từ', description: 'Duyệt nghỉ phép, đi muộn, về sớm, làm thêm và hủy phép', icon: ClipboardCheck, permission: 'leave', anyPermissions: ['leave', 'attendance', 'users'], group: 'Công', keywords: 'don tu xin nghi huy phep di muon ve som lam them tang ca' },

  { to: '/admin/training', label: 'Đào tạo', description: 'Khóa học, phân công và tiến độ học tập', icon: BookOpen, permission: 'training', group: 'Đào tạo', keywords: 'dao tao khoa hoc hoc tap' },

  { to: '/admin/settings', label: 'Cấu hình hệ thống', description: 'Thiết lập vận hành dùng chung toàn tổ chức', icon: Settings, permission: 'settings', group: 'Hệ thống', keywords: 'cau hinh thiet lap' },
  { to: '/admin/audit', label: 'Nhật ký hệ thống', description: 'Truy vết thay đổi dữ liệu và thao tác quản trị', icon: ClipboardCheck, permission: 'settings', group: 'Hệ thống', keywords: 'audit log lich su truy vet', functionCode: 'admin.audit' },
];

export interface StaffNavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: string;
  keywords?: string;
}

/**
 * Một nguồn điều hướng duy nhất cho sidebar nhân viên và tìm kiếm nhanh.
 * Khi bổ sung chức năng mới, hai lối vào sẽ luôn xuất hiện đồng thời.
 */
export const STAFF_NAV_ITEMS: StaffNavItem[] = [
  { to: '/staff/leave', label: 'Đơn từ của tôi', description: 'Nghỉ phép, đi muộn, về sớm, OT và làm thêm ca đêm', icon: ClipboardList, group: 'Công', keywords: 'don tu xin nghi quy phep di muon ve som lam them tang ca ot ngay thuong chu nhat ngay le ca dem' },

  { to: '/staff/training', label: 'Đào tạo của tôi', description: 'Khóa học được giao và tiến độ hoàn thành', icon: BookOpen, group: 'Đào tạo', keywords: 'dao tao khoa hoc hoc tap' },
];

/**
 * Cụm chức năng ở cấp một của sidebar.
 *
 * Sidebar phẳng phải in ra cả 30 mục cùng lúc, nghĩa là mỗi lần đổi trang
 * người dùng lại quét qua một danh sách dài gấp mấy lần màn hình. Dựng hai
 * cấp: cấp một chỉ còn 9 ô, bấm vào mới xổ ra chức năng con bên trong.
 *
 * Thứ tự ở đây quyết định thứ tự hiện trên sidebar — KHÔNG lấy theo thứ tự
 * xuất hiện trong `ADMIN_NAV_ITEMS`, vì thêm một mục mới vào giữa mảng đó sẽ
 * âm thầm đảo lộn cả sidebar.
 */
export interface AdminNavGroup {
  name: string;
  icon: LucideIcon;
  hint: string;
  /**
   * Lop Tailwind viet SAN, khong ghep chuoi.
   *
   * Tailwind quet ma nguon de biet phai sinh ra lop nao. Ghep kieu
   * `bg-${tone}-50` thi trong ma nguon khong co chuoi "bg-sky-50" nao, lop do
   * khong duoc sinh, va mau bien mat o ban build that - trong khi chay dev
   * van dung. Loi kieu do chi lo ra sau khi deploy.
   */
  iconIdle: string;
  iconOn: string;
  tileOn: string;
  textOn: string;
  chip: string;
}

/**
 * Cum chuc nang o cap mot cua dieu huong.
 *
 * Sidebar phang phai in ra ca 30 muc cung luc, nghia la moi lan doi trang
 * nguoi dung lai quet qua mot danh sach dai gap may lan man hinh. Dung hai
 * cap: cap mot chi con 8 o, bam vao moi xo ra chuc nang con ben trong.
 *
 * Moi cum mot mau: 8 o vuong cung mau xam thi phai DOC ten moi phan biet
 * duoc, con khac mau thi nho duoc bang vi tri va mau sac sau vai lan dung.
 *
 * Thu tu o day quyet dinh thu tu hien tren sidebar - KHONG lay theo thu tu
 * xuat hien trong `ADMIN_NAV_ITEMS`, vi them mot muc moi vao giua mang do se
 * am tham dao lon ca sidebar.
 */
/**
 * Moi quyen mo duoc nhung module nao - suy thang tu `ADMIN_NAV_ITEMS`.
 *
 * Nhan quyen truoc day viet tay ("Quan ly User", "Cham cong") va lech han voi
 * ten module nguoi dung nhin thay ngoai man chon ("To chuc & Nhan su", "Thoi
 * gian & Nghi phep"). Nguoi cap quyen phai tu doan tich cai nao thi mo ra cai
 * gi - doan sai thi hoac khoa mat viec cua nguoi ta, hoac mo rong hon minh
 * tuong.
 *
 * Tinh tu menu chu khong chep tay lan nua: them mot muc moi vao menu la bang
 * nay tu dung theo, khong co duong cho hai noi noi hai dieu khac nhau.
 */
export const MODULES_BY_PERMISSION: Partial<Record<AdminPermission, string[]>> = (() => {
  const map: Partial<Record<AdminPermission, string[]>> = {};
  for (const item of ADMIN_NAV_ITEMS) {
    // Mot muc menu co the mo duoc bang NHIEU quyen (`anyPermissions`): ví dụ
    // "Trung tâm đơn từ" mở được bằng `leave` HOẶC `attendance`. Chỉ quy nó
    // về `item.permission` thì bảng này báo THIẾU — admin cấp quyền
    // `attendance` cho ai đó mà không hề biết mình vừa mở luôn cả màn duyệt
    // đơn từ. Đây là màn dùng để quyết định cấp quyền, báo thiếu ở đây là
    // chỗ quyết định sai.
    for (const permission of item.anyPermissions ?? [item.permission]) {
      const list = map[permission] ?? (map[permission] = []);
      if (!list.includes(item.group)) list.push(item.group);
    }
  }
  return map;
})();

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    name: 'Tổng quan', icon: LayoutDashboard, hint: 'Dashboard và báo cáo toàn công ty',
    iconIdle: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400', iconOn: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30',
    tileOn: 'bg-indigo-50 dark:bg-indigo-500/15', textOn: 'text-indigo-700 dark:text-indigo-300',
    chip: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700',
  },
  {
    name: 'Nhân sự', icon: Network, hint: 'Sơ đồ tổ chức, hồ sơ và tài khoản nhân sự',
    // Cyan chu khong phai sky: mau chinh cua he thong da la blue, ma o
    // "Tong quan" nam ngay ben trai o nay trong bang luoi - hai sac xanh
    // duong canh nhau thi phai doc ten moi phan biet.
    iconIdle: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400', iconOn: 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30',
    tileOn: 'bg-cyan-50 dark:bg-cyan-500/15', textOn: 'text-cyan-700 dark:text-cyan-300',
    chip: 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30 hover:bg-cyan-700',
  },
  {
    name: 'Tuyển dụng', icon: UserSearch, hint: 'Đề xuất tuyển, ứng viên, hồ sơ và giấy tờ',
    iconIdle: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400', iconOn: 'bg-violet-600 text-white shadow-sm shadow-violet-600/30',
    tileOn: 'bg-violet-50 dark:bg-violet-500/15', textOn: 'text-violet-700 dark:text-violet-300',
    chip: 'bg-violet-600 text-white shadow-sm shadow-violet-600/30 hover:bg-violet-700',
  },
  {
    name: 'Dự án', icon: FolderKanban, hint: 'Dự án, thành viên và nhật ký giờ',
    // Cam chu khong phai tim: tim nam ngay canh indigo cua "Tong quan" nen
    // hai o dau bang luoi nhin gan nhu cung mot mau. Cam la mau am duy nhat
    // o khu vuc do, va trong luoi no o goc doi dien voi amber cua "Thoi gian"
    // nen hai mau am khong ke nhau.
    iconIdle: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400', iconOn: 'bg-orange-600 text-white shadow-sm shadow-orange-600/30',
    tileOn: 'bg-orange-50 dark:bg-orange-500/15', textOn: 'text-orange-700 dark:text-orange-300',
    chip: 'bg-orange-600 text-white shadow-sm shadow-orange-600/30 hover:bg-orange-700',
  },
  {
    // Lime: cam la cua "Du an", tim/indigo da co o "Tong quan" - lime la sac
    // lanh con trong, khong dung voi cum nao canh no.
    name: 'Giao việc', icon: ClipboardList, hint: 'Phân công và xác nhận việc hằng ngày',
    iconIdle: 'bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-400', iconOn: 'bg-lime-600 text-white shadow-sm shadow-lime-600/30',
    tileOn: 'bg-lime-50 dark:bg-lime-500/15', textOn: 'text-lime-700 dark:text-lime-300',
    chip: 'bg-lime-600 text-white shadow-sm shadow-lime-600/30 hover:bg-lime-700',
  },
  {
    name: 'Công', icon: Clock, hint: 'Chấm công, bảng công và mọi loại đơn',
    iconIdle: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400', iconOn: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
    tileOn: 'bg-amber-50 dark:bg-amber-500/15', textOn: 'text-amber-700 dark:text-amber-300',
    chip: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 hover:bg-amber-600',
  },
  {
    name: 'Lương', icon: Wallet, hint: 'Bảng lương, cơ chế và tham số',
    iconIdle: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', iconOn: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30',
    tileOn: 'bg-emerald-50 dark:bg-emerald-500/15', textOn: 'text-emerald-700 dark:text-emerald-300',
    chip: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700',
  },
  {
    // Fuchsia chu khong phai rose: mau chinh cua he thong gio la do thuong
    // hieu Huy Phong, ma rose chinh la do nhat - o KPI se trong y het o
    // "Tong quan" va nguoi dung phai doc ten moi phan biet duoc.
    name: 'KPI', icon: Target, hint: 'Chấm điểm, bộ tiêu chí và cách quy ra lương',
    iconIdle: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400', iconOn: 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30',
    tileOn: 'bg-fuchsia-50 dark:bg-fuchsia-500/15', textOn: 'text-fuchsia-700 dark:text-fuchsia-300',
    chip: 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30 hover:bg-fuchsia-700',
  },
  {
    name: 'Đào tạo', icon: BookOpen, hint: 'Khóa học và thư viện quy trình',
    iconIdle: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400', iconOn: 'bg-teal-600 text-white shadow-sm shadow-teal-600/30',
    tileOn: 'bg-teal-50 dark:bg-teal-500/15', textOn: 'text-teal-700 dark:text-teal-300',
    chip: 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 hover:bg-teal-700',
  },
  {
    name: 'Hệ thống', icon: Settings, hint: 'Cấu hình, nhật ký và tính năng',
    iconIdle: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300', iconOn: 'bg-slate-700 text-white shadow-sm shadow-slate-700/30',
    tileOn: 'bg-slate-100 dark:bg-slate-700/40', textOn: 'text-slate-800 dark:text-slate-200',
    chip: 'bg-slate-700 text-white shadow-sm shadow-slate-700/30 hover:bg-slate-800',
  },
];
