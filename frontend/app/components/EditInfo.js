
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../userInfoContext';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

const EditInfo = ({ userId }) => {
  const { data: session, status: sessionStatus } = useSession();
  const { userBio, setUserBio, userSkills, setUserSkills, setImageProfile, isHiddenEditPage, setIsHiddenEditPage } = useAuth();

  const [currUserId, setCurrUserId] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("/images/placeholder.png");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStatus !== 'loading' && userId) {
      setCurrUserId(userId);
      const fetchUserInfo = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/get-user/${userId}`);
          const data = await res.json();
          if (res.ok) {
            setUserBio(data.user.bio || "");
            setUserSkills(data.user.skills || []);
            setImagePreview(data.user.profilePic || "/images/placeholder.png");
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      };
      fetchUserInfo();
    }
  }, [sessionStatus, userId, setUserBio, setUserSkills]);

  useEffect(() => {
    return () => {
      if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview, imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !userSkills.includes(skill)) {
      setUserSkills([...userSkills, skill]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToRemove) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bio", userBio);
      formData.append("skills", JSON.stringify(userSkills));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/update-user/${currUserId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("Profile updated successfully!");
      setIsHiddenEditPage(true);
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`max-h-[80vh] ${isHiddenEditPage ? "hidden" : "flex"} items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-200 p-6`}
    >
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-2xl max-h-[80vh] scrollbar-hidden overflow-y-auto bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-lg">Edit Profile</h1>
          <button
            type="button"
            onClick={() => setIsHiddenEditPage(true)}
            className="text-2xl font-bold text-indigo-500 hover:text-red-500 transition-all duration-200 transform hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-indigo-300 shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={imagePreview || "/images/placeholder.png"}
              alt="user avatar"
              className="w-full h-full object-cover"
            />
          </div>

 
          <label className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Change Image
            <input
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-indigo-700 font-semibold mb-2">Bio</label>
          <textarea
            name="bio"
            value={userBio}
            onChange={(e) => setUserBio(e.target.value)}
            rows={3}
            className="w-full resize-none px-4 py-3 border border-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-white/90 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Skills */}
        <div className="mb-8">
          <label className="block text-indigo-700 font-semibold mb-3">Skills</label>
          <div className="flex flex-wrap gap-3 mb-3">
            <AnimatePresence>
              {userSkills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill)}
                    className="ml-2 text-indigo-600 hover:text-red-600 font-bold transition-transform duration-200 hover:scale-125"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 px-4 py-2 border border-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-white/90 shadow-sm hover:shadow-md"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              disabled={loading}
              onClick={handleAddSkill}
              className="px-5 py-2 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"}`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

export default EditInfo;
