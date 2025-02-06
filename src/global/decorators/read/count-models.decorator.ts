import { Model } from "mongoose";

const countModels =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const query = Model.countDocuments();
      const count = await query.exec();
      args.push(count);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default countModels;
