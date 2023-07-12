import { ActivatedRoute } from "@angular/router";

export interface HeaderData {
  title: string;
  icon: string;
  buttonType: string | null;
  route: ActivatedRoute;
  arrowBack?: boolean;
  disableButton?: boolean;
  searchInput?: boolean;
}
