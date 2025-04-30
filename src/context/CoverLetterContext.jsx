// This component used to fetch cover letter from server and handle cover letter operations

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getAllCoverLetter } from "../services/coverLetterService";

export const CoverLetterContext = createContext();

function CoverLetterProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [isContentFilled, setIsContentFilled] = useState(false);
  const [allCoverLetter, setAllCoverLetter] = useState([]);
  const [coverLetter, setCoverLetter] = useState({
    coverLetterData: {
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      gitHub: "",
      portfolio: "",
      blogs: "",
      date: "",
      receiver: "",
      sign: "",
      content: "Dear Mr./Ms.",
    },
    style: {
      theme: "#266CA9",
      fontName: "Arial",
      fontSize: "10",
      template: "Template1",
    },
    _id: null,
  });

  useEffect(() => {
    const savedCoverLetter = localStorage.getItem("coverLetter");
    if (savedCoverLetter) {
      setCoverLetter(JSON.parse(savedCoverLetter));
    }
  }, []);

  const fetchCoverLetter = async () => {
    try {
      await getAllCoverLetter(setAllCoverLetter);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  }

  useEffect(() => {
    if (user) {
      fetchCoverLetter();
    }
  }, [user])

  return (
    <CoverLetterContext.Provider
      value={{
        coverLetter,
        setCoverLetter,
        allCoverLetter,
        setAllCoverLetter,
        isContentFilled,
        setIsContentFilled,
        fetchCoverLetter
      }}
    >
      {children}
    </CoverLetterContext.Provider>
  );
}

export default CoverLetterProvider;