export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
  priority: number;
}