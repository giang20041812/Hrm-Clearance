# Hrm-Clearance

Hệ thống quản trị nhân sự (HRM): tổ chức, hồ sơ nhân viên, chấm công, nghỉ phép, lương, KPI,
dự án/công việc, tuyển dụng, đào tạo và trợ lý hỏi đáp.

- Giao diện: React + TypeScript + Vite (`client/`)
- API serverless: Vercel Functions (`api/`)
- Dữ liệu: Supabase (Auth, Database, Storage, Realtime) — migration trong `supabase/migrations/`

## Quy ước làm việc

- `main`: chỉ chứa bản đã phát hành, có tag `vX.Y.Z`.
- `develop`: nhánh tích hợp, mọi tính năng merge vào đây trước.
- Nhánh làm việc `feature/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*`, `release/*`, `hotfix/*`.
- Commit theo Conventional Commits.

Chi tiết và cách cài hook: [CONTRIBUTING.md](CONTRIBUTING.md).

## Tài liệu

- Production chạy frontend và API trên Vercel, dùng Supabase Cloud cho Auth, Database, Storage và Realtime.
- [Thiết lập Supabase local để kiểm tra migration](docs/supabase-local-setup.md) — dùng database clone/cô lập, không link hoặc chạy migration trực tiếp lên production.
- [Đánh giá đối chiếu SRS](docs/danh-gia-doi-chieu-srs-toan-du-an.md)
- [Tích hợp máy chấm công Ronald Jack / ZKTeco](docs/may-cham-cong.md)
- [Bàn giao Docker Compose](docs/docker-handover.md) — phương án self-hosted tùy chọn, không phải cấu hình production hiện tại.
