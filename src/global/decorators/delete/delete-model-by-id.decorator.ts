import { Model } from "mongoose";

const deleteModelById =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const id = args[0];
      const document = await Model.findByIdAndDelete(id).exec();
      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default deleteModelById;
