# Quy ước làm việc với Git

## 1. Nhánh

| Nhánh | Vai trò | Ai được ghi vào |
|-------|---------|-----------------|
| `main` | Chỉ chứa bản **đã phát hành** (production). Mỗi lần cập nhật đều có tag `vX.Y.Z`. | Chỉ merge từ `release/*` hoặc `hotfix/*` |
| `develop` | Nhánh **tích hợp**; mọi tính năng hoàn tất được gom về đây trước khi phát hành. | Chỉ merge từ `feature/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*` |

Không commit trực tiếp lên `main` hoặc `develop` (trừ commit khởi tạo repo).

### Nhánh làm việc

Tên nhánh: `<loại>/<mô-tả-ngắn-bằng-chữ-thường-gạch-ngang>`.

| Tiền tố | Tách từ | Merge vào | Dùng khi |
|---------|---------|-----------|----------|
| `feature/` | `develop` | `develop` | Thêm tính năng mới |
| `fix/` | `develop` | `develop` | Sửa lỗi chưa lên production |
| `refactor/` | `develop` | `develop` | Tái cấu trúc, không đổi hành vi |
| `chore/` | `develop` | `develop` | Cấu hình, build, hạ tầng, phụ thuộc |
| `docs/` | `develop` | `develop` | Chỉ sửa tài liệu |
| `release/x.y.z` | `develop` | `main` rồi `develop` | Chốt bản phát hành (đổi version, changelog, sửa lỗi cuối) |
| `hotfix/x.y.z` | `main` | `main` rồi `develop` | Sửa gấp lỗi đang chạy trên production |

Ví dụ đúng: `feature/payroll-formulas`, `fix/attendance-duplicate-checkin`, `release/1.0.0`.

Đặt tên theo **chức năng thực tế**. Không dùng mã/thuật ngữ trong tài liệu đặc tả
(mã phân hệ, mã yêu cầu, mã nghiệp vụ, tên viết tắt của tài liệu...) để đặt tên nhánh,
commit hay tag.

### Luồng

```
feature/* ──► develop ──► release/x.y.z ──► main (tag vX.Y.Z)
                 ▲                              │
                 └────────── merge ngược ◄──────┘
hotfix/x.y.z ──► main (tag) ──► develop
```

- Merge nhánh vào `develop`/`main` bằng `git merge --no-ff` (hoặc Pull Request) để giữ lịch sử nhánh.
- Xóa nhánh làm việc sau khi merge xong trên remote nếu không cần giữ.

## 2. Commit — Conventional Commits

```
<type>(<scope>): <mô tả ngắn>

<thân: vì sao thay đổi — tùy chọn>
```

- Dòng đầu **≤ 72 ký tự**, thể mệnh lệnh, bắt đầu chữ thường, không dấu chấm cuối.
- Mỗi commit là **một thay đổi có ý nghĩa**, không gộp việc không liên quan.

### type

| type | Ý nghĩa |
|------|---------|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `docs` | Chỉ tài liệu |
| `style` | Định dạng, không đổi logic |
| `refactor` | Tái cấu trúc, không thêm tính năng/không sửa lỗi |
| `perf` | Cải thiện hiệu năng |
| `test` | Thêm/sửa kiểm thử |
| `build` | Hệ thống build, phụ thuộc |
| `ci` | Cấu hình CI |
| `chore` | Việc vặt khác (cấu hình, hạ tầng, release) |
| `revert` | Hoàn tác commit trước |

### scope

`auth` · `access` · `org` · `employee` · `leave` · `attendance` · `device` · `payroll` · `kpi` ·
`project` · `recruitment` · `training` · `assistant` · `notify` · `db` · `deploy` · `ui` · `tooling`

Thay đổi `!` sau scope (hoặc dòng `BREAKING CHANGE:` ở thân) cho thay đổi phá vỡ tương thích.

Ví dụ:

```
feat(payroll): add payslip layout editor
fix(attendance): ignore duplicate device punches within a minute
chore(release): prepare 1.0.0
```

## 3. Tag và phát hành

- Version theo SemVer: `MAJOR.MINOR.PATCH`.
- Tag dạng `vX.Y.Z` đặt trên commit merge vào `main`.
- Thay đổi của mỗi bản ghi trong `CHANGELOG.md`.

## 4. Cài hook cục bộ (một lần sau khi clone)

```bash
git config core.hooksPath .githooks
git config commit.template .gitmessage
```

- `commit-msg`: kiểm tra tiêu đề commit đúng quy ước và không chứa mã/thuật ngữ của tài liệu đặc tả.
- `pre-push`: chặn file `.env*` bị theo dõi, chặn tên nhánh sai quy ước. Đặt `HRM_PUSH_TYPECHECK=1` để kiểm tra TypeScript trước khi push.
