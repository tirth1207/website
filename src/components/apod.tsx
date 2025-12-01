"use client"
import { error } from "console";
import React, { useState, useEffect } from "react";

function Space() {
  const [photoData, setPhotoData] = useState(null);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=Gxem1oKOJfRk3qmBcsYw3jzHf5skwlKL6ka4OUQR`
        );

        if (!res.ok) throw new Error("Failed to fetch APOD");

        const data = await res.json();
        setPhotoData(data);
      } catch (err) {
        console.error(err);
        setPhotoData({ error: true });
      }
    }

    fetchPhoto();
  }, []);

  if (!photoData) {
    return (
      <div className="flex h-screen items-center justify-center text-white text-xl font-semibold">
        Loading the cosmos…
      </div>
    );
  }

  if (photoData.error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-2">⚠ API Error</h2>
        <p>NASA APOD service is temporarily unavailable.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 dark:text-white text-black grid grid-cols-2 gap-4">
      {/* Media */}
      {photoData.media_type === "image" ? (
        <img
          src={photoData.url}
          alt={photoData.title}
          className="w-full rounded-xl shadow-lg mb-6"
        />
      ) : (
        <iframe
          title="space-video"
          src={photoData.url}
          allowFullScreen
          className="w-full h-96 rounded-xl shadow-lg mb-6"
        />
      )}

      {/* Content */}
      <h1 className="text-4xl font-bold mb-3">{photoData.title}</h1>
      <p className="dark:text-gray-300 text-gray-800 mb-5">{photoData.date}</p>
      <p className="leading-relaxed dark:text-gray-200 text-gray-800">{photoData.explanation}</p>
    </div>
  );
}

export default Space;
