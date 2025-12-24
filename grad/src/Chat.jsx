import React from "react";
import { useState, useEffect, useRef } from "react";
import { PanelLeft, ArrowUp, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Chat() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  const { summary, sessionId } = location.state || {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  async function sendQuestion() {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };
    // ضيف رسالة المستخدم فورًا
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/upload/ask/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      // ضيف الرسائل الجديدة من الباك إند بدون مسح القديمة
      setMessages((prev) => [...prev, ...data.messages]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


return (
  <div className="chat">
    <div className="title d-flex align-items-center gap-2">
      <div className="icon">
        <PanelLeft />
      </div>
      <div className="span">chat</div>
    </div>

    <div className="chat-content">
      <div className="chat-container">
        <div className="messages-area">
          <div className="summary">
            <div className="sumtitle">Summary</div>
            <div className="sumcontent">
              {summary ? summary : "No summary available yet."}
            </div>
          </div>
           <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}

          {loading && <div className="message bot">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>
          {/* هنا ممكن تضيفي chat messages بعد الـ summary */}
        </div>
       

        <div className="textbox">
          <div className="fileTitle d-flex align-items-center gap-1">
            <div className="icon">
              <PanelLeft />
            </div>
            <div className="filename">File Name</div>
          </div>

          <div className="inputbox d-flex align-items-center justify-content-between">
            <input
              type="text"
              placeholder="ask this file a question ..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
            />
            <div className="buttons d-flex align-items-center gap-3">
              <div className="send">
                <Plus size={20} />
              </div>
              <div className="upload" onClick={sendQuestion}>
                <ArrowUp size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}