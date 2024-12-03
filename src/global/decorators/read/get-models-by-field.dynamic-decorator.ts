import { Order } from "../../enums/order.enum";
import { Model } from "mongoose";

const getModelsByFieldDynamic =
  (Model: Model<any>, getModelsByFieldDynamicConfig: any) =>
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const { PAGE_SIZE, refs, refFields } = getModelsByFieldDynamicConfig;

    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const queryParams = args[0];
      const fieldObj = args[1];
      let { page, sort, order, ...rest } = queryParams;

      const totalElements = await Model.countDocuments({
        ...fieldObj,
        ...rest,
      }).exec();

      let query = Model.find({ ...fieldObj, ...rest })
        .sort({ [sort]: order === Order.Asc ? 1 : -1 })
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean();

      if (refs && refFields) {
        for (let i = 0; i < refs.length; i++) {
          query = query.populate(refs[i], refFields[i]);
        }
      }

      const content = await query.exec();
      const totalPages = Math.ceil(totalElements / PAGE_SIZE);

      const document = {
        content,
        totalElements,
        totalPages,
        pageSize: PAGE_SIZE,
        page,
        sort: null,
        firstPage: page === 0,
        lastPage: page === totalPages - 1,
        emptyPage: content.length === 0,
      };

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export default getModelsByFieldDynamic;
