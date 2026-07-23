const { getAuth } = require("firebase-admin/auth");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);

    req.user = decoded;

    next();

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

module.exports = verifyToken;