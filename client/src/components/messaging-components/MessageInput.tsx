"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Smile,
  Mic,
  Send,
  Image,
  Video,
  FileText,
  StopCircle,
} from "lucide-react";
import { QUICK_REPLIES } from "@/pages/constants";
import { motion, AnimatePresence } from "framer-motion";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onAttach: (type: string, file: File) => void;
  onVoiceMessage: (blob: Blob) => void;
}

export default function MessageInput({
  input,
  setInput,
  onSend,
  onAttach,
  onVoiceMessage,
}: MessageInputProps) {
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onVoiceMessage(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      // TODO: Show error message to user
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "document";
      onAttach(type, file);
      setShowAttachMenu(false);
    }
  };

  return (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
      <AnimatePresence>
        {/* Quick Replies */}
        {showQuickReplies && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex space-x-2 mb-2 overflow-x-auto pb-2"
          >
            {QUICK_REPLIES.map((reply, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(reply.text);
                  setShowQuickReplies(false);
                }}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
              >
                {reply.icon && <span>{reply.icon}</span>}
                <span className="text-sm dark:text-gray-200">{reply.text}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,application/*"
        />

        {/* Attachment Button */}
        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <Paperclip size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <AnimatePresence>
            {/* Attachment Menu */}
            {showAttachMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-48 z-10"
              >
                <button
                  onClick={() => {
                    fileInputRef.current!.accept = "image/*";
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Image size={20} className="text-blue-500" />
                  <span className="dark:text-gray-200">Image</span>
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current!.accept = "video/*";
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Video size={20} className="text-red-500" />
                  <span className="dark:text-gray-200">Video</span>
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current!.accept = ".pdf,.doc,.docx,.txt";
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <FileText
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="dark:text-gray-200">Document</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-transparent px-4 outline-none resize-none max-h-32 min-h-[2.5rem] dark:text-white"
          rows={1}
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            title="Quick Replies"
          >
            <Smile size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors ${
              isRecording ? "text-red-500" : "text-gray-600 dark:text-gray-300"
            }`}
            title={isRecording ? "Stop Recording" : "Voice Message"}
          >
            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
