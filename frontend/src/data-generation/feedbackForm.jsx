import React, { useState } from "react";

function FeedbackForm() {
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      essay: essay,
      feedback: feedback,
    };

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data); // Handle the success response here
      } else {
        console.error("Error:", response.status, response.statusText); // Handle the error response here
      }
    } catch (error) {
      console.error("Error:", error); // Handle any unexpected errors here
    }
    // alert("submit");
  };

  return (
    <div>
      <h1>Feedback Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="essay">Essay:</label>
        <textarea
          name="essay"
          id="essay"
          rows="4"
          cols="50"
          value={essay}
          onChange={(e) => {
            setEssay(e.target.value);
            // console.log(e.target.value);
          }}
          required
        ></textarea>
        <br />
        <label htmlFor="feedback">Feedback:</label>
        <textarea
          name="feedback"
          id="feedback"
          rows="4"
          cols="50"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            // console.log(e.target.value);
          }}
          required
        ></textarea>
        <br />
        <button type="submit" id="submitBtn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
