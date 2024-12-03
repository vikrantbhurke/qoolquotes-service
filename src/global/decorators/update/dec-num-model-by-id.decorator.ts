import { Model } from "mongoose";

const decNumModelById =
  (Model: Model<any>, field: string) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const id = args[0];

      const document = await Model.findByIdAndUpdate(
        id,
        { $inc: { [field]: -1 } },
        { new: true }
      );

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default decNumModelById;
