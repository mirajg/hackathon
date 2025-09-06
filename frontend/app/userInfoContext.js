
'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userBio, setUserBio] = useState("");
    const [userSkills, setUserSkills] = useState([]);
    const [isHiddenEditPage, setIsHiddenEditPage] = useState(true);
    const [isHiddenPostContent, setIsHiddenPostContent] = useState(true);
    const [isHiddenCommentSection, setIsHiddenCommentSection] = useState(true);
    const [activeCommentPostId, setActiveCommentPostId] = useState(""); 
    const [notificationreceive, setNotificationReceive] = useState([]);
    const [notificationOpen, setNotificationOpen] = useState(false);

    return (
        <AuthContext.Provider value={{ user, setUser, userBio, setUserBio, userSkills, setUserSkills, isHiddenEditPage, setIsHiddenEditPage, isHiddenPostContent, setIsHiddenPostContent, isHiddenCommentSection, setIsHiddenCommentSection, activeCommentPostId, setActiveCommentPostId, notificationreceive, setNotificationReceive, notificationOpen, setNotificationOpen }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}