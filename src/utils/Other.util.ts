class OtherUtil {
  public genAutoID(): string{
    return Math.random().toString(36).substring(7).toUpperCase()+Date.now().toString();
  }
}
export default new OtherUtil();