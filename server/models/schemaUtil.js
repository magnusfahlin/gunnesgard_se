const createSchemaOptions = (toJSONSpecfic, toObjectSpecific) => {
  let options = {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (toJSONSpecfic) toJSONSpecfic(doc, ret, options);
      },
      toObject: {
        transform: function(doc, ret, options) {
          ret._id = ret.id;
          delete ret.id;
          if (toObjectSpecific) toObjectSpecific(doc, ret, options);
        }
      }
    }
  };
  return options;
};

module.exports = { createSchemaOptions };
