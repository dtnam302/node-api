const Response = (body) => {
  let returnObject = {};
  if (!body.length) {
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
