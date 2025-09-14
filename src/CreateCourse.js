// src/CreateCourse.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "./firebaseClient";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [rawWords, setRawWords] = useState(""); // nhp list t
  const navigate = useNavigate();

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(" Vui lng nhp tn kha hc");
      return;
    }

    try {
      //  to document kha hc trong Firestore (mc nh isPublic = false)
      const courseRef = await addDoc(collection(db, "courses"), {
        title,
        owner: auth.currentUser.uid,
        createdAt: new Date(),
        isPublic: false, //  mc nh ring t
      });

      const courseId = courseRef.id;

      // tch list t trong textarea
      const lines = rawWords
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      for (const line of lines) {
        // Format: Kanji Kana Ngha
        const parts = line.split(/\s+/);
        if (parts.length >= 3) {
          const kanji = parts[0];
          const kana = parts[1];
          const meaning = parts.slice(2).join(" ");

          await addDoc(collection(db, "courses", courseId, "words"), {
            kanji,
            kana,
            meaning,
          });
        }
      }

      alert(" To kha hc thnh cng!");
      navigate("/home");
    } catch (err) {
      console.error("Li to kha hc:", err);
      alert(" C li xy ra khi to kha hc.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>To kha hc mi</h2>
      <form onSubmit={handleCreateCourse}>
        <div style={{ marginBottom: "20px" }}>
          <label>Tn kha hc:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Danh sch t (mi dng: <b>Kanji Kana Ngha</b>):
          </label>
          <textarea
            rows="10"
            value={rawWords}
            onChange={(e) => setRawWords(e.target.value)}
            placeholder={`  Ch\n  Mo\n  Nht Bn`}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          To kha hc
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
