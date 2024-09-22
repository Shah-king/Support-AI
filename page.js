"use client"; // Add this line to enable strict mode

import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { GoogleGenerativeAI } from "@google/generative-ai";

import "dotenv/config";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [responseText, setResponseText] = useState("");
  const [history, setHistory] = useState([
    {
      text: "are you my customer service support?",
      response: "yes! do discuss your problems with me.",
    },
  ]);
  const inputValueRef = useRef(inputValue);

  // Handle chat bot logic
  const handleSubmit = async () => {
    const prompt =
      inputValue +
      " (and tell me this in a small paragraph and no bullets or anything like that)";
    const formattedPrompt = `Customer service: ${prompt}`;
    inputValueRef.current = inputValue;
    setInputValue(""); // Clear the input field immediately after the input is used

    try {
      // Send message to the AI model
      const response = await model.generateContent([formattedPrompt]);
      const responseText = response.response.text;

      // Update state with new chat entry
      setResponseText(responseText);
    } catch (error) {
      console.error("Error communicating with AI service:", error);
    }
  };

  useEffect(() => {
    if (responseText) {
      const boxElement = document.getElementById("responseBox");
      if (boxElement) {
        setHistory((prevHistory) => [
          {
            text: inputValueRef.current,
            response: boxElement.textContent,
          },
          ...prevHistory,
        ]);
      }
    }
  }, [responseText]); // The effect depends on responseText

  // Styling
  const baseStyle = {
    display: "flex",
    flexDirection: "column",
    height: "97vh",
    backgroundColor: "#f5f5f5",
    padding: "0 20px",
    margin: "0",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  };

  const iconStyle = {
    fontSize: 40,
    marginRight: 1,
    color: "#4285f4",
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: "bold",
  };

  const messageContainerStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
  };

  const chatHistoryStyle = {
    flexGrow: 1,
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column-reverse",
  };

  const messageStyle = {
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "10px",
    maxWidth: "60%",
  };

  const userMessageStyle = {
    ...messageStyle,
    backgroundColor: "#e0f7fa",
    alignSelf: "flex-end",
  };

  const aiMessageStyle = {
    ...messageStyle,
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  };

  const inputFieldStyle = {
    width: "90%",
    marginRight: "10px",
    marginBottom: "10px",
  };

  const buttonStyle = {
    width: "9%",
    height: "85%",
  };

  const inputSubmit = {
    flexDirection: "row",
    width: "100%",
    marginTop: "10px",
  };

  return (
    <Box sx={baseStyle}>
      <Box sx={headerStyle}>
        <SupportAgentIcon sx={iconStyle} />
        <Box sx={titleStyle}>SupportAi</Box>
      </Box>

      <Box sx={chatHistoryStyle}>
        {history.map((entry, index) => (
          <Box key={index} sx={messageContainerStyle}>
            <Box sx={userMessageStyle}>{entry.text}</Box>
            <Box sx={aiMessageStyle}>{entry.response}</Box>
          </Box>
        ))}
        {responseText && (
          <Box
            id="responseBox"
            sx={{ ...aiMessageStyle, visibility: "hidden" }}
          >
            {responseText}
          </Box>
        )}
      </Box>
      <Box sx={inputSubmit}>
        <TextField
          id="outlined-basic"
          sx={inputFieldStyle}
          label="Type your message"
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button variant="contained" sx={buttonStyle} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  )};
