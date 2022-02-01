const errorHandler = (error, _req, res, next) => {
    if (error) {
      res.status(error.statusCode || 500).send(error);
    } else {
      next();
    }
  };
  
  export default errorHandler;