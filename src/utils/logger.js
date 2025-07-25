// MindMate frontend - Logger,js
const fs = require('fs');
const path = require('path');

// ensures log directory exists
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFilePath = path.join(logDirectory, 'mindmate.log');

const log = (message, type = "info") => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}]: ${message}\n`;

  // colour of log message
  const color = {
    info: "\x1b[36m%s\x1b[0m",     // Cyan
    success: "\x1b[32m%s\x1b[0m",  // Green
    warning: "\x1b[33m%s\x1b[0m",  // Yellow
    error: "\x1b[31m%s\x1b[0m"     // Red
  }[type] || "\x1b[36m%s\x1b[0m";

  console.log(color, logMessage.trim());

  // files are saved
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

module.exports = { log };
