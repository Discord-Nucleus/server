export abstract class RegExp {
  public static readonly NodeModule = /^([^\.].*)(?<!\.d)\.(t|j)s$/;
  public static readonly RouteExtra = /(?:index)?\.(t|j)s$/;
  public static readonly Bracket = /\[(.*?)\]/g;
}
