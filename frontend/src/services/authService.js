
export const authRequest = async (data, isLogin, isStudent) => {
  const API_BASE = "http://localhost:5000/api/auth";

  try {
    // Decide which API endpoint to call
    const url = isLogin
      ? `${API_BASE}/${isStudent ? "student/login" : "teacher/login"}`
      : `${API_BASE}/${isStudent ? "student/register" : "teacher/register"}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",   // IMPORTANT -> allows cookies/JWT
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // If request is successful
    if (response.ok) {
      return { success: true, data: result };
    }

    // If backend sends an error message
    return {
      success: false,
      message: result.message || "Something went wrong",
    };

  } catch (error) {
    // Network or server error
    return {
      success: false,
      message: "Network Error — Cannot connect to server",
    };
  }
};
