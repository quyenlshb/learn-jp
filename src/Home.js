import React from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({ title, desc, to, icon }) => (
  <Link to={to} className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-indigo-700">{title}</h3>
    </div>
    <p className="mt-4 text-gray-600">{desc}</p>
  </Link>
);

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 leading-tight">Học tiếng Nhật — nhanh, hiệu quả và vui vẻ</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Bộ bài học tương tác, luyện tập tốc độ và hệ thống bảng xếp hạng để bạn có động lực tiến bộ mỗi ngày.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/courses" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Bắt đầu học</Link>
            <Link to="/leaderboard" className="px-6 py-3 bg-white border border-gray-200 rounded-lg">Xem bảng xếp hạng</Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            to="/courses"
            title="Khóa học phong phú"
            desc="Từ cơ bản đến nâng cao — từng bài được thiết kế ngắn, dễ nắm bắt."
            icon={<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422A12.083 12.083 0 0118 20.5a12.083 12.083 0 01-6 0 12.083 12.083 0 01-0.16-9.922L12 14z"/></svg>}
          />
          <FeatureCard
            to="/leaderboard"
            title="Bảng xếp hạng"
            desc="Cạnh tranh bạn bè, thu thập huy hiệu và leo bảng xếp hạng hàng ngày."
            icon={<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 17h2M12 3v14M5 21h14"/></svg>}
          />
          <FeatureCard
            to="/learn"
            title="Luyện tập tốc độ"
            desc="Rèn kỹ năng phản xạ với bài kiểm tra tốc độ và ôn tập khó."
            icon={<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3"/></svg>}
          />
        </section>
      </div>
    </main>
  );
};

export default Home;
