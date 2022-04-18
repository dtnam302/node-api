async () =>
  await Mongoose.model("collectionName").updateMany(
    {},
    { $set: { newField: value } }
  );
