import { Model } from "mongoose";

const deleteModelsByField =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const deleteManyDTO = args[0];
      await Model.deleteMany(deleteManyDTO).exec();
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default deleteModelsByField;
