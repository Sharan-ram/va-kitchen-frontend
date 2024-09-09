import { useState } from "react";
import classNames from "classnames";

import Loader from "@/components/Loader";
import { scheduleMail } from "@/services/reminders";
import { toast } from "react-toastify";

const ScheduleMail = () => {
  const [dateTime, setDateTime] = useState(""); // dateTime is initially an empty string
  const [subject, setSubject] = useState("");
  const [emailScheduleLoading, setEmailScheduleLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      setEmailScheduleLoading(true);
      await scheduleMail({ dateTime, subject, content });
      setEmailScheduleLoading(false);
      toast.success("Mail scheduled successfully!");
    } catch (e) {
      console.error(e);
      setEmailScheduleLoading(false);
      toast.error("Mail schedule failed!");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Schedule a Mail Reminder</h2>
        <label htmlFor="datetime" className="block font-semibold">
          Date and Time
        </label>
        <input
          aria-label="Date and time"
          type="datetime-local"
          id="datetime"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />

        <label htmlFor="subject" className="block font-semibold mt-4">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Email Subject"
        />
        <label htmlFor="content" className="block font-semibold mt-4">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Email Content"
        />

        <button
          type="submit"
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4 text-center",
            emailScheduleLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={emailScheduleLoading}
          onClick={handleSubmit}
        >
          {emailScheduleLoading ? <Loader /> : "Schedule Mail"}
        </button>
      </div>
    </div>
  );
};

export default ScheduleMail;
