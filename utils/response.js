const Response = (body) => {
  let returnObject = {};
  if (!Array.isArray(body) ) {
    returnObject = {
      object: body,
    };
  } else {
    returnObject = {
      list: body,
      count: body.length,
    };
  }
  return returnObject;
};

module.exports = Response;
