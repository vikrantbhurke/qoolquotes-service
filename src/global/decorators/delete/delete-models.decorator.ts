import { Model } from "mongoose";

const deleteModels =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      await Model.deleteMany().exec();
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default deleteModels;
