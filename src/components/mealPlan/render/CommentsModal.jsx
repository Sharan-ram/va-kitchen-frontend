import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addComment, deleteComment } from "@/services/mealPlan";
import classNames from "classnames";
import Loader from "@/components/Loader";
import { format } from "date-fns";
import { Trash } from "phosphor-react";

const CommentsModal = ({
  mealPlanId,
  date,
  meal,
  comments,
  setActiveMealForComments,
  fetchMealPlan,
}) => {
  const [commentSaveLoading, setCommentSaveLoading] = useState(false);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [user, setUser] = useState();
  const commentRef = useRef(null); // Create a ref for the textarea

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user.username);
  }, []);

  // console.log({ mealPlanId, date, meal, comments });

  const handleSubmit = async () => {
    const comment = commentRef.current.value; // Access the value of the textarea
    if (comment.trim() === "") {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      setCommentSaveLoading(true);
      // Call the addComment function, passing the necessary data
      await addComment({ mealPlanId, date, meal, comment });
      toast.success("Comment added successfully!");
      commentRef.current.value = ""; // Clear the textarea after submission
      fetchMealPlan();
      setCommentSaveLoading(false);
      setActiveMealForComments(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
      setCommentSaveLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeleteCommentLoading(true);
      await deleteComment({ mealPlanId, date, meal, commentId });
      fetchMealPlan();
      toast.success("Comment deleted successfully!");
      setDeleteCommentLoading(false);
      setActiveMealForComments(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete comment.");
      setDeleteCommentLoading(false);
    }
  };

  const disabled = commentSaveLoading;

  // console.log({ val: commentRef.current?.value });

  return (
    <div className="pb-[200px]">
      <h2 className="text-lg font-bold">
        {meal === "earlyMorning"
          ? "Early Morning".toUpperCase()
          : meal.toUpperCase()}
      </h2>

      {comments.map((commentObj, index) => {
        const { username, date, comment } = commentObj;
        return (
          <div key={index} className="w-full mt-5">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold">{username}</div>
              <div className="text-xs">
                {format(new Date(date), "dd-MM-yyyy")}
              </div>
            </div>

            <div className="w-full flex justify-between items-center mt-1">
              <div className="text-sm w-[87%]">{comment}</div>
              <div className="w-[10%] flex justify-end">
                <div className="flex justify-end">
                  {user === username && (
                    <Trash
                      size={18}
                      color="#bb2124"
                      className={classNames(
                        deleteCommentLoading
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      )}
                      onClick={() => {
                        deleteCommentLoading
                          ? () => {}
                          : handleDeleteComment(commentObj._id);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="fixed bottom-0 pb-3 z-[99]">
        <button
          onClick={handleSubmit}
          className={classNames(
            "text-white font-semibold py-2 px-4 rounded mr-2",
            disabled ? "bg-[#bbacac] cursor-not-allowed" : "bg-[#8e7576]"
          )}
        >
          {commentSaveLoading ? <Loader /> : "Add Comment"}
        </button>
        <textarea
          ref={commentRef}
          rows="4"
          placeholder="Add your comment here"
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        ></textarea>
      </div>
    </div>
  );
};

export default CommentsModal;
