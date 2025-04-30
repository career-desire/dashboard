// This component used to fetch resume from server and handle resume operations

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllResumes } from '../services/resumeService';
import { AuthContext } from './AuthContext';

const ResumeContext = createContext();

export const getInitialResume = () => {
  return {
    resumeData: {
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      gitHub: "",
      portfolio: "",
      blogs: "",
      summary: { title: "Summary", content: "" },
      experience: { title: "Experience", content: [] },
      skills: { title: "Skills", content: "" },
      education: { title: "Education", content: [] },
      internship: { title: "Internship", content: [] },
      project: { title: "Project", content: [] },
      voluntary: { title: "Voluntary", content: [] },
      course: { title: "Courses", content: [] },
      awards: { title: "Awards", content: [] },
      languages: { title: "Languages", content: "" },
      custom: { title: "Custom", content: "" },
    },
    style: {
      theme: "#266CA9",
      fontName: "Arial",
      fontSize: "10",
      template: "Template1"
    },
    _id: null,
  }
};

export function ResumeProvider({ children }) {

  const [resume, setResume] = useState(getInitialResume);
  const [allResume, setAllResume] = useState([])
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isResumeLoaded, setIsResumeLoaded] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const quillDataCheck = ["summary", "skills", "languages", "custom"];
    setResume((prevState) => {
      const updatedResumeData = { ...prevState.resumeData };

      quillDataCheck.forEach((section) => {
        if (updatedResumeData[section].content === "<p><br></p>") {
          updatedResumeData[section].content = "";
        }
      });

      return {
        ...prevState,
        resumeData: updatedResumeData,
      };
    });
  }, []);

  const fetchResumes = async () => {
    try {
      await getAllResumes(setAllResume);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setAllResume([]);
    }
    if (user) {
      fetchResumes();
    }
  }, [user]);

  return (
    <ResumeContext.Provider
      value={{
        getInitialResume,
        resume,
        setResume,
        downloadUrl,
        setDownloadUrl,
        isResumeLoaded,
        setIsResumeLoaded,
        allResume,
        setAllResume,
        fetchResumes
      }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResumeData = () => useContext(ResumeContext);