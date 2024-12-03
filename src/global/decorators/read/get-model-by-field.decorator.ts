import { Model } from "mongoose";

const getModelByField =
  (Model: Model<any>, getModelByFieldConfig: any) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const { refs, refFields } = getModelByFieldConfig;

    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const fieldObj = args[0];
      let query = Model.findOne(fieldObj).lean();

      if (refs && refFields) {
        for (let i = 0; i < refs.length; i++) {
          query = query.populate(refs[i], refFields[i]);
        }
      }

      const document = await query.exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getModelByField;
