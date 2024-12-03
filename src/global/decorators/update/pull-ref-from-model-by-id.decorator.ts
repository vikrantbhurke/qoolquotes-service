import { Model } from "mongoose";

const pullRefFromModelById =
  (Model: Model<any>, field: string) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const id = args[0];
      const refId = args[1];

      const document = await Model.findByIdAndUpdate(
        id,
        { $pull: { [field]: refId } },
        { new: true }
      );

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default pullRefFromModelById;
