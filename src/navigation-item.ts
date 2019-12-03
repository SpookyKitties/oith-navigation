export class NavigationItem {
  public title: string;
  public shortTitle: string;
  public dateState?: string;
  public dateEnd?: string;
  public navigationItems?: NavigationItem[];
  public href?: string;
  public id?: string;
  public imgUrl?: string;
  public display?: boolean;

  public constructor(
    title: string,
    shortTitle: string,
    href?: string,
    navigationItems?: NavigationItem[],
    dateState?: string,
    dateEnd?: string,
    id?: string,
  ) {
    this.title = title;
    this.shortTitle = shortTitle;
    if (shortTitle.includes('Come Follow')) {
      console.log(shortTitle);
    }

    if (href && !href.includes('#map')) {
      const regHref = /(^.+)\.html/g.exec(href ? href : '');

      this.href = regHref ? regHref[1] : href;
    } else {
      this.href = undefined;
    }

    this.id = id;
    this.navigationItems = navigationItems;
    this.dateState = dateState;
    this.dateEnd = dateEnd;
  }
}
