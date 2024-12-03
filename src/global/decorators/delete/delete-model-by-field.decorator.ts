import { Model } from "mongoose";

const deleteModelByField =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const fieldObj = args[0];
      const document = await Model.findOneAndDelete(fieldObj).exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default deleteModelByField;
