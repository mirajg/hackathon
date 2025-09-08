

// yo actually ma profile page ho, user's ko. This is actually profile page of user. From it, user edit, post and more. 
'use client';

import Loading from '../../components/Loading';
import Link from 'next/link';
import { useAuth } from '@/app/userInfoContext';
import EditInfo from '@/app/components/EditInfo';
import { UseOwnInfo } from '../../components/FetchOwnInfo';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import PostContent from '@/app/components/PostContent';
import NavPart from '@/app/components/NavPart';
import { useParams } from 'next/navigation';
import NotificationPage from '@/app/components/NotificationPage';
import { motion } from 'framer-motion';
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKENDPATH);

const Page = () => {
  const params = useParams();
  const { userBio, setUserBio, notificationOpen, setNotificationOpen, notificationreceive, setNotificationReceive, userSkills, setUserSkills, isHiddenEditPage, setIsHiddenEditPage, isHiddenPostContent, setIsHiddenPostContent } = useAuth();
  const { user, loadingBackend, sessionStatus: backendStatus } = UseOwnInfo();
  const { data: session, status: sessionStatus } = useSession();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [imageSrc, setImageSrc] = useState('');

  const [isUser, setIsUser] = useState(false);
  const [profileInfo, setProfileInfo] = useState([]);
  const [skills, setSkills] = useState([]);
  const [idOfUser, setIdOfUser] = useState('');

  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
  }, [session, sessionStatus]);

  useEffect(() => {
    if (imageSrc) console.log(imageSrc)
  }, [imageSrc])



  useEffect(() => {
    if (!params?.id) return;
    setIdOfUser(params.id);

    if (user?.userId) {
      socket.emit("register-user", { userId: user?.userId });
    }



    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/get-user/${params.id}`);
        const data = await res.json();
        console.log(data);

        if (data?.user?.profilePic) {
          setImageSrc(data.user.profilePic);
        }

        if (res.ok && data) {
          setIsUser(true);
          setProfileInfo(data.user);
          setUserBio(data.user.bio || "");
          setUserSkills(data.user.skills || []);

          setFollowersCount(data.user.followers.length);
          setIsFollowing(data.user.followers.includes(user?.userId));

        } else {
          setIsUser(false);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setIsUser(false);
      }
    };

    fetchUserInfo();
  }, [params.id, user?.userId]);



  useEffect(() => {
    if (!isUser) return;

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/get-user/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setProfileInfo(data.user);
          setUserBio(data.user.bio || "");
          setUserSkills(data.user.skills || []);
          setImageSrc(data.user.profilePic);

        } else {
          setIsUser(false);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setIsUser(false);
      }
    };

    fetchUserInfo();
  }, [isUser]);



  useEffect(() => {
    if (user?.userId) {
      const fetchNotificationInfo = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/notifications/${user.userId}`);
          const data = await res.json();
          if (res.ok) {
            setNotificationReceive(data.notifications || []);
          } else {
            console.error("Error fetching notifications:", data.message);
          }
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      };
      fetchNotificationInfo();
    }

  }, [user?.userId]);

  if (loadingBackend || backendStatus === 'loading' || !profileInfo || isUser === null) return <Loading />;
  if (!isUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600 mt-10 space-y-4"
      >
        <p>User not found or unauthorized.</p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go To Profile Page
        </Link>
      </motion.div>
    );
  }


  if (!user) return <p className="text-center text-gray-600 mt-10">User not logged in.</p>;

  const handleFollow = async () => {
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/follow/${idOfUser}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendFollowRequestId: user?.userId }),
      });

      let data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setFollowersCount(data.followersCount);
      setIsFollowing(data.isFollowing);

    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const isOwner = idOfUser === user?.userId;

  return (
    <>
      <NavPart />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex overflow-auto justify-center items-start w-full min-h-[100vh] p-6 bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-200"
      >
        {!isHiddenEditPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl border border-white/30 w-[90%] max-w-2xl p-6 relative"
            >
              <EditInfo userId={idOfUser} />
            </motion.div>
          </motion.div>
        )}

        {notificationOpen && <NotificationPage />}

        {!isHiddenPostContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          >
            <PostContent userId={idOfUser} />
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl w-full mx-auto mt-12 p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30"
        >

          <motion.div
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 bg-white p-5 rounded-2xl shadow-md border border-gray-200"
          >
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-indigo-300 shadow-lg hover:scale-105 transition-transform duration-300">
                <img
                  src={imageSrc || "/images/placeholder.png"}
                  alt="user avatar"
                  className="w-full h-full object-cover"
                />
              </div>


            <div className="flex-1 space-y-3">
              {/* name of the user show into here,  */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                {profileInfo?.name || 'User Profile'}
              </h1>

              {/* only show email to own, from below lines of code. */}
              {isOwner ? (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-all italic">
                  {user.email}
                </p>

              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFollow()}
                  className="relative overflow-hidden px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <span className="relative z-10">
                    {isFollowing ? "Unfollow" : "Follow"}
                  </span>
                  <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button>
              )}

              {!isOwner && (
                <Link
                  href={`/user-chat/${params.id}`}
                  className="relative max-w-[200px] flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"

                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.964 9.964 0 01-4.712-1.192L3 20l1.192-4.712A9.964 9.964 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>

                  <span className="hidden sm:inline">Let's Chat</span>
                </Link>
              )}

              {isOwner && (
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  {/* edit info section , */}
                  <motion.button

                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsHiddenEditPage(false)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
                  >
                    Edit Info
                  </motion.button>

                  <motion.button
                    onClick={() => setIsHiddenPostContent(false)}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
                  >
                    Post Content
                  </motion.button>


                  <button
                    onClick={() => setNotificationOpen(true)}
                    className="relative flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"

                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a3 3 0 00-6 0v.083A6 6 0 002 11v3.159c0 .538-.214 1.055-.595 1.436L0 17h5m10 0a3 3 0 01-6 0h6z"
                        />
                      </svg>


                      {notificationreceive.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                      )}
                    </div>

                    <span className="hidden sm:inline">Notifications</span>
                  </button>

                </div>
              )}

              {/* Followers Count */}
              <motion.button
                whileHover={{ scale: 1.05 }}

                whileTap={{ scale: 0.95 }}
                className="m-2 inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold 
             bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full 
             shadow-md hover:shadow-lg transition-all"
              >
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                  {followersCount}
                </span>
                Followers
              </motion.button>

            </div>


          </motion.div>

          {/* this one is the bio card of the user. like, it contains, user's about text  */}
          <Card title="Bio">

            <p className="text-gray-700">{userBio || "I'm a User."}</p>
          </Card>

          {/* this one is the card related to the skills  */}
          <Card title="Skills">
            <div className="flex flex-wrap gap-2 mt-3">
              {userSkills.length ? (
                userSkills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed.</p>
              )}
            </div>
          </Card>

          {/* Job Post Form */}
          {isOwner && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">💼</span> Post a Job
              </h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();


                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/jobs`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        title: jobTitle,
                        company: companyName,

                        location: location,
                        salary: salary,

                        description: description,
                        userId: idOfUser
                      }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      alert(" Job posted successfully!");
                      setJobTitle("");
                      setCompanyName("");
                      setLocation("");
                      setSalary("");
                      setDescription("");
                    } else {
                      alert(` failed: ${data.message || "Something went wrong"}`);
                    }
                  } catch (error) {
                    console.error("Error posting job:", error);
                    alert(" error posting job. Please try again.");
                  }
                }}
                className="flex flex-col gap-4"
              >
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-1"
                >
                  <label className="text-sm font-medium text-gray-600">Job Title</label>
                  <input
                    type="text"
                    required

                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className={`${inputClass} rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}

                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col gap-1"
                >
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}

                    placeholder="e.g. OpenAI"
                    className={`${inputClass} rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </motion.div>

                {/* this one below for the location  */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}

                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col gap-1"
                >
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chitwan"
                    className={`${inputClass} rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}

                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col gap-1"
                >
                  <label className="text-sm font-medium text-gray-600">Salary 💰</label>
                  <input
                    type="text"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $60k - $80k / year or negotiable"
                    className={`${inputClass} pr-4 py-2 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition w-full`}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}

                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col gap-1"
                >
                  <label className="text-sm font-medium text-gray-600">Job Description</label>
                  <textarea
                    placeholder="Write a short job description..."
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClass} rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition`}
                  ></textarea>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}

                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "linear" }}
                  type="submit"
                  className={`${buttonClass} rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 shadow-md transition`}
                >
                  🚀 Post Job
                </motion.button>
              </form>
            </Card>
          )}

        </motion.div>
      </motion.div>
    </>
  );
};

const Card = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}

    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
    className="mt-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
  >
    {title && <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>}
    {children}
  </motion.div>
);

const inputClass =
  "px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
const buttonClass =
  "mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition";

export default Page;