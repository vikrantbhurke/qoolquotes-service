import { Model } from "mongoose";

const checkModel =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const fieldDTO = args[0];
      const exists = await Model.exists(fieldDTO).exec();
      args.push(!!exists);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default checkModel;
