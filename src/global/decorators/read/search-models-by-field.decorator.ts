import { Order } from "../../enums/order.enum";
import { Model } from "mongoose";

const searchModelsByField = (
  Model: Model<any>,
  searchModelsByFieldConfig: any
) => {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const { searchField, byField, sort, order, PAGE_SIZE, refs, refFields } =
      searchModelsByFieldConfig;

    const originalMethod = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const field = args[0];
      const regex = args[1];
      const page = args[2];

      const searchQuery = {
        [searchField]: { $regex: regex, $options: "i" },
        [byField]: { $regex: field, $options: "i" },
      };

      const totalElements = await Model.countDocuments(searchQuery).exec();

      let query = Model.find(searchQuery)
        .sort({ [sort]: order === Order.Ascending ? 1 : -1 })
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
        sort,
        firstPage: page === 0,
        lastPage: page === totalPages - 1,
        emptyPage: content.length === 0,
      };

      args.push(document);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

export default searchModelsByField;
