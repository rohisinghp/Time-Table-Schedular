export const logout = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err) {
    return { success: false, message: "Logout failed" };
  }
};
