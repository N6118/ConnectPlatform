import React, { useState, useRef } from "react";
import {
  Paperclip,
  Smile,
  Mic,
  Send,
  Image,
  Video,
  FileText,
  Calendar,
  X,
  StopCircle,
} from "lucide-react";
import { QUICK_REPLIES } from "../pages/constants";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onAttach: (type: string, file: File) => void;
  onSchedule: (date: Date) => void;
  onVoiceMessage: (blob: Blob) => void;
}

export default function MessageInput({
  input,
  setInput,
  onSend,
  onAttach,
  onSchedule,
  onVoiceMessage,
}: MessageInputProps) {
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
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
      const type = file.type.startsWith('image/') ? 'image' :
                  file.type.startsWith('video/') ? 'video' : 'document';
      onAttach(type, file);
    }
  };

  const handleSchedule = () => {
    if (selectedDate) {
      onSchedule(selectedDate);
      setShowScheduler(false);
      setSelectedDate(null);
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
          {QUICK_REPLIES.map((reply, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(reply.text);
                setShowQuickReplies(false);
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {reply.icon && <span>{reply.icon}</span>}
              <span className="text-sm">{reply.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Scheduler */}
      {showScheduler && (
        <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Schedule Message</h3>
            <button onClick={() => setShowScheduler(false)}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <input
            type="datetime-local"
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleSchedule}
            disabled={!selectedDate}
            className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Schedule
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="relative flex items-center bg-gray-100 rounded-lg p-2">
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
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Paperclip size={20} className="text-gray-600" />
          </button>

          {/* Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-2 w-48 z-10">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
              >
                <Image size={20} className="text-blue-500" />
                <span>Image</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
              >
                <Video size={20} className="text-red-500" />
                <span>Video</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
              >
                <FileText size={20} className="text-gray-500" />
                <span>Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-transparent px-4 outline-none resize-none max-h-32 min-h-[2.5rem]"
          rows={1}
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            title="Quick Replies"
          >
            <Smile size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => setShowScheduler(!showScheduler)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            title="Schedule Message"
          >
            <Calendar size={20} className="text-gray-600" />
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${
              isRecording ? 'text-red-500' : 'text-gray-600'
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