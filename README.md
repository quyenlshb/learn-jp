# Learn JP (with Gamification)

## Mô tả
Dự án Learn JP được bổ sung hệ thống gamification: tính điểm, huy hiệu (badges), streak và bảng xếp hạng theo Tuần/Tháng/Tất cả.

## Hệ thống điểm
- Học từ mới: **+5** điểm
- Ôn tập: **+3** điểm
- Ôn tập nhanh: **+2** điểm
- Học từ khó: **+7** điểm

## Huy hiệu
- 🌟 **Rising Star**: >= 100 điểm
- 🏆 **Champion**: >= 500 điểm
- 👑 **Master**: >= 1000 điểm

## Cài đặt
1. Clone repo
2. `npm install`
3. `npm start`

## Triển khai
- Push code lên GitHub và Vercel sẽ tự deploy.

## Ghi chú
- Điểm và badges được lưu trong Firestore collections: `leaderboard`, `weeklyLeaderboard`, `monthlyLeaderboard`.
- Các thay đổi đã được tích hợp tự động vào các view tương ứng khi người dùng thực hiện các hành động học/ôn tập.
