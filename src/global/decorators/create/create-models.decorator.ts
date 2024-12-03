import { Model } from "mongoose";

const createModels =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const createModelsDTO = args[0];
      const documents = await Model.insertMany(createModelsDTO, {
        ordered: false,
      });
      args.push(documents);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default createModels;
