import { Model } from "mongoose";

const countModelsByField =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const fieldDTO = args[0];
      const query = Model.countDocuments(fieldDTO);
      const count = await query.exec();
      args.push(count);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default countModelsByField;
