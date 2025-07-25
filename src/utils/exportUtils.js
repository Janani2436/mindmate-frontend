// MindMate frontend - exportUtils.js

export const downloadChatAsTxt = () => {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  
    const formatted = chatHistory.map(msg =>
      `${msg.role === "user" ? "You" : "MindMate"}: ${msg.content}`
    ).join("\n\n");
  
    const blob = new Blob([formatted], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "MindMate_Chat_History.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  