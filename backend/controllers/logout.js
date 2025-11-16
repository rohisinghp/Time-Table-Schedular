

export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)  // expire immediately
  });

  res.json({ success: true, message: "Logged out successfully" });
};
