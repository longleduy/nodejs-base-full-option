class OtherUtil {
  public genAutoID(): string{
    return Math.random().toString(36).substring(7).toUpperCase()+Date.now().toString();
  }
  public copyFieldInterface<C, I>(cls: C, object: any): I {
    const obj: any = {} as I;
    const propsArray: string[] = Object.keys(cls);
    propsArray.forEach((key) => {
      if (object[key]) {
        obj[key] = object[key];
      }
    });
    return obj;
  }
}
export default new OtherUtil();