const checkCookies = (req, res, next) => {
  console.log(req.cookies);
  next();
};

export default checkCookies;
