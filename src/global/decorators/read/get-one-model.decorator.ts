import { Model } from "mongoose";

const getOneModel =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      let query = Model.findOne().lean();
      const document = await query.exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getOneModel;
