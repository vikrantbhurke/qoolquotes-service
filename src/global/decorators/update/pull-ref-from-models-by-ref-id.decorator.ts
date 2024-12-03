import { Model } from "mongoose";

const pullRefFromModelsByRefId =
  (Model: Model<any>, field: string) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const refId = args[0];
      await Model.updateMany({ [field]: refId }, { $pull: { [field]: refId } });
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default pullRefFromModelsByRefId;
