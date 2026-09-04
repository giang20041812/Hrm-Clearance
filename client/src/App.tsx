import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, useEffect, type ReactNode } from 'react';
import { clearChunkReloadMarks, lazyRoute } from '@/lib/lazyRoute';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import { ViewModeProvider } from '@/contexts/ViewModeContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { IsolatedBoundary } from '@/components/PageErrorBoundary';
import { CommandPalette } from '@/components/CommandPalette';
import { InstallPrompt } from '@/components/InstallPrompt';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StaffLayout } from '@/components/layouts/StaffLayout';
import { ADMIN_NAV_ITEMS } from '@/config/navigation';

// Mỗi module được tải khi người dùng thực sự mở tới. Việc này giữ lần tải đầu
// nhẹ dù hệ thống tiếp tục mở rộng thêm nghiệp vụ và vai trò.
const LoginPage = lazyRoute('LoginPage', () => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazyRoute('ForgotPasswordPage', () => import('@/pages/auth/ForgotPasswordFlow').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazyRoute('ResetPasswordPage', () => import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const ChangePasswordPage = lazyRoute('ChangePasswordPage', () => import('@/pages/auth/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })));
const SetupPage = lazyRoute('SetupPage', () => import('@/pages/auth/SetupPage').then((m) => ({ default: m.SetupPage })));
const AdminUsers = lazyRoute('AdminUsers', () => import('@/pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsers })));
const AdminLeave = lazyRoute('AdminLeave', () => import('@/pages/admin/AdminLeave').then((m) => ({ default: m.AdminLeave })));
const AdminAudit = lazyRoute('AdminAudit', () => import('@/pages/admin/AdminAudit').then((m) => ({ default: m.AdminAudit })));
const AdminTraining = lazyRoute('AdminTraining', () => import('@/pages/admin/AdminTraining').then((m) => ({ default: m.AdminTraining })));
const ProfilePage = lazyRoute('ProfilePage', () => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const StaffLeave = lazyRoute('StaffLeave', () => import('@/pages/staff/StaffLeave').then((m) => ({ default: m.StaffLeave })));
const StaffTraining = lazyRoute('StaffTraining', () => import('@/pages/staff/StaffTraining').then((m) => ({ default: m.StaffTraining })));

function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ambient px-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" />
        <div>
          <p className="font-display text-sm font-bold text-slate-800 dark:text-slate-100">Đang mở không gian làm việc</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">HRM Huy Phong đang chuẩn bị dữ liệu cho bạn…</p>
        </div>
      </div>
    </div>
  );
}

function AuthRedirect() {
  const { profile, loading, supabaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!supabaseConfigured) return <SetupPage />;
  if (!profile) return <LoginPage />;
  if (profile.must_change_password) return <Navigate to="/change-password" replace />;

  if (location.pathname === '/' || location.pathname === '/login') {
    if (profile.role === 'admin' || profile.role === 'ceo') {
      return <Navigate to="/admin/overview" replace />;
    }
    // Trưởng nhóm vào thẳng khu quản lý nhóm — công việc chính của họ là giao
    // việc và duyệt. Họ vẫn tự chấm công/xin nghỉ ở khu nhân viên khi cần.
    if (profile.role === 'teamlead') {
      return <Navigate to="/admin/assignments" replace />;
    }
    // Vai trò nghiệp vụ tùy chỉnh có thể chỉ được cấp một vài module quản trị;
    // để AdminHomeRedirect chọn đúng module đầu tiên thay vì rơi nhầm vào khu
    // nhân viên chỉ vì cột role kỹ thuật vẫn là staff.
    if (hasAnyAdminPermission(profile)) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/staff/dashboard" replace />;
  }

  // Đường dẫn không khớp route nào (đường dẫn cũ, gõ sai, đã đăng nhập) —
  // trước đây trả về null nên trang trắng trơn. Đưa về trang chủ để điều hướng
  // theo vai trò.
  return <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) return null;
  if (profile) {
    if (profile.must_change_password) return <Navigate to="/change-password" replace />;
    if (profile.role === 'staff' && !hasAnyAdminPermission(profile)) return <Navigate to="/staff/dashboard" replace />;
    if (profile.role === 'teamlead') return <Navigate to="/admin/assignments" replace />;
    // Vai trò tùy chỉnh có thể chỉ được cấp một module quản trị và không có
    // quyền xem Tổng quan. Đi qua /admin để chọn đúng trang đầu tiên họ được
    // phép mở, tránh vòng chuyển hướng thừa qua một trang bị chặn.
    if (profile.role !== 'admin' && profile.role !== 'ceo') return <Navigate to="/admin" replace />;
    return <Navigate to="/admin/overview" replace />;
  }

  return <>{children}</>;
}

/** Trang khu quản trị, mở theo từng quyền lẻ (admin/CEO luôn thỏa). */
function admin(
  permission: AdminPermission,
  page: ReactNode,
  options: { fullAdminOnly?: boolean; functionCode?: AdminFunctionCode | readonly AdminFunctionCode[]; denyTeamlead?: boolean; teamleadEmployeeDocuments?: boolean } = {},
) {
  return <ProtectedRoute permission={permission} {...options}><AdminLayout>{page}</AdminLayout></ProtectedRoute>;
}

/** Quy trình liên phòng ban: trưởng bộ phận hoặc HR đều có thể tham gia. */
function adminAny(permissions: AdminPermission[], page: ReactNode) {
  return <ProtectedRoute anyPermission={permissions}><AdminLayout>{page}</AdminLayout></ProtectedRoute>;
}

function staff(page: ReactNode) {
  return <ProtectedRoute><StaffLayout>{page}</StaffLayout></ProtectedRoute>;
}

/**
 * Trang ai cũng vào được, nhưng phải nằm trong đúng layout của vai trò —
 * quản trị viên mở Hồ sơ cá nhân mà rơi vào giao diện nhân viên thì mất hết
 * thanh điều hướng đang dùng.
 */
function OwnLayout({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const Layout = hasAnyAdminPermission(profile) ? AdminLayout : StaffLayout;
  return <Layout>{children}</Layout>;
}

/** Vào /admin thì đẩy tới trang đầu tiên mà người dùng có quyền. */
function AdminHomeRedirect() {
  const { profile } = useAuth();
  // Admin/CEO: Tổng quan điều hành (chỉ họ mới xem được toàn danh mục).
  if (profile?.role === 'admin' || profile?.role === 'ceo') return <Navigate to="/admin/overview" replace />;
  // Trưởng nhóm: mục chính là Giao việc.
  if (profile?.role === 'teamlead') return <Navigate to="/admin/assignments" replace />;
  const target = ADMIN_NAV_ITEMS.find(({ permission, anyPermissions, fullAdminOnly, functionCode }) =>
    !fullAdminOnly
    && (anyPermissions
      ? anyPermissions.some((item) => hasPermission(profile, item))
      : hasPermission(profile, permission))
    && (!functionCode || hasAdminFunction(profile, functionCode)),
  );
  return <Navigate to={target ? target.to : '/staff/dashboard'} replace />;
}

/** Đường dẫn cũ → đường dẫn mới, giữ nguyên ?month=…&user=… */
function RedirectKeepQuery({ to }: { to: string }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/change-password" element={<ProtectedRoute allowPasswordChange><ChangePasswordPage /></ProtectedRoute>} />

      {/* Admin routes — mỗi trang gắn với một quyền lẻ */}
      <Route path="/admin" element={<AdminHomeRedirect />} />
      <Route path="/admin/users" element={admin('users', <AdminUsers />)} />
      <Route path="/admin/leave" element={adminAny(['leave', 'attendance', 'users'], <AdminLeave />)} />
      <Route path="/admin/training" element={admin('training', <AdminTraining />)} />
      {/* Nhật ký hệ thống — quyền module + chức năng nâng cao; RLS là hàng rào cuối. */}
      <Route path="/admin/audit" element={admin('settings', <AdminAudit />, { functionCode: 'admin.audit' })} />

      {/* Hồ sơ cá nhân — ai đăng nhập cũng có, layout theo vai trò */}
      <Route path="/profile" element={<ProtectedRoute><OwnLayout><ProfilePage /></OwnLayout></ProtectedRoute>} />

      <Route path="/staff/leave" element={staff(<StaffLeave />)} />
      <Route path="/staff/training" element={staff(<StaffTraining />)} />
      <Route path="/staff/growth" element={<Navigate to="/staff/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}

export default function App() {
  // App dung duoc nghia la ban build hien tai da tai tron ven. Xoa dau vet
  // "da thu tai lai vi chunk hong" de lan deploy sau co che phuc hoi con dung
  // duoc, thay vi chi cuu duoc mot lan moi phien.
  useEffect(() => { clearChunkReloadMarks(); }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
                <ViewModeProvider>
                  <Suspense fallback={<AppLoading />}>
                    <AppRoutes />
                  </Suspense>
                  {/* Ctrl/⌘+K — tự ẩn khi chưa đăng nhập. */}
                  <IsolatedBoundary><CommandPalette /></IsolatedBoundary>
                  {/* Dải mời cài app — chỉ hiện khi trình duyệt thực sự cài được. */}
                  <IsolatedBoundary><InstallPrompt /></IsolatedBoundary>
                </ViewModeProvider>
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
