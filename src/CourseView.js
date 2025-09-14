// src/CourseView.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseClient";

const CourseView = () => {
  const { id } = useParams(); // id khoá học
  const [words, setWords] = useState([]);
  const [learnedCount, setLearnedCount] = useState(0);
  const [editWordId, setEditWordId] = useState(null);
  const [editData, setEditData] = useState({ kanji: "", kana: "", meaning: "" });
  const [course, setCourse] = useState(null);

  const fetchWords = async () => {
    try {
      const q = collection(db, "courses", id, "words");
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setWords(list);

      const learned = list.filter((w) => w.isLearned).length;
      setLearnedCount(learned);
    } catch (error) {
      console.error("Lỗi tải từ vựng:", error);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const snap = await getDoc(doc(db, "courses", id));
      if (snap.exists()) {
        setCourse({ id: snap.id, ...snap.data() });
      }
    } catch (error) {
      console.error("Lỗi tải thông tin khoá học:", error);
    }
  };

  useEffect(() => {
    fetchWords();
    fetchCourseInfo();
  }, [id]);

  const handleDeleteWord = async (wordId) => {
    try {
      await deleteDoc(doc(db, "courses", id, "words", wordId));
      fetchWords();
    } catch (error) {
      console.error("Lỗi xoá từ:", error);
    }
  };

  const handleUpdateWord = async (wordId) => {
    try {
      await updateDoc(doc(db, "courses", id, "words", wordId), editData);
      setEditWordId(null);
      setEditData({ kanji: "", kana: "", meaning: "" });
      fetchWords();
    } catch (error) {
      console.error("Lỗi cập nhật từ:", error);
    }
  };

  if (!course) {
    return <p>Đang tải thông tin khoá học...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        Số từ đã học: {learnedCount}/{words.length}
      </p>

      <div style={{ marginTop: "20px" }}>
        <Link to={`/learn/${course.id}`}>Học ngay</Link>
        <br />
        <Link to={`/review/${course.id}`}>Ôn tập</Link>
        <br />
        <Link to={`/difficult-review/${course.id}`}>Ôn tập từ khó</Link>
        <br />
        <Link to={`/speed-review/${course.id}`}>Ôn tập nhanh</Link>
      </div>

      <h2 style={{ marginTop: "30px" }}>Danh sách từ</h2>
      <ul>
        {words.map((w) => (
          <li key={w.id}>
            {editWordId === w.id ? (
              <>
                <input
                  placeholder="Kanji"
                  value={editData.kanji}
                  onChange={(e) =>
                    setEditData({ ...editData, kanji: e.target.value })
                  }
                />
                <input
                  placeholder="Kana"
                  value={editData.kana}
                  onChange={(e) =>
                    setEditData({ ...editData, kana: e.target.value })
                  }
                />
                <input
                  placeholder="Nghĩa"
                  value={editData.meaning}
                  onChange={(e) =>
                    setEditData({ ...editData, meaning: e.target.value })
                  }
                />
                <button onClick={() => handleUpdateWord(w.id)}>Lưu</button>
                <button onClick={() => setEditWordId(null)}>Huỷ</button>
              </>
            ) : (
              <>
                {w.kanji} ({w.kana}) - {w.meaning}
                <button
                  onClick={() => {
                    setEditWordId(w.id);
                    setEditData({
                      kanji: w.kanji,
                      kana: w.kana,
                      meaning: w.meaning,
                    });
                  }}
                >
                  Sửa
                </button>
                <button onClick={() => handleDeleteWord(w.id)}>Xoá</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseView;
