import { Model } from "mongoose";

const updateModelById =
  (Model: Model<any>) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const id = args[0];
      const updateModelDTO = args[1];

      const document = await Model.findByIdAndUpdate(
        id,
        { $set: updateModelDTO },
        { new: true }
      ).exec();

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default updateModelById;
