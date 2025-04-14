import {
  MenuIcon,
  CircleIcon,
  CircleOffIcon,
  BrandChromeIcon,
  MoodSmileIcon,
  StarIcon,
  AwardIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  {
      title: 'Dashboard',
      icon: BrandChromeIcon,
      to: '/'
  },
  {
      title: 'Users',
      icon: BrandChromeIcon,
      to: '/Users'
  }, 
  {
      title: 'TodoTasks',
      icon: BrandChromeIcon,
      to: '/TodoTasks'
  }, 
  
  
//   {
//     title: 'NewUser',
//     icon: BrandChromeIcon,
//     to: '/PostUser'
// },
//   {
//     title: 'duplicateobject',
//     icon: BrandChromeIcon,
//     to: '/duplicateobject'
// },

//   {
//       title: 'Menu Level',
//       icon: MenuIcon,
//       to: '#',
//       children: [
//           {
//               title: 'Level 1',
//               icon: CircleIcon,
//               to: '/level1'
//           },
//           {
//               title: 'Level 1',
//               icon: CircleIcon,
//               to: '/2level',
//               children: [
//                   {
//                       title: 'Level 2',
//                       icon: CircleIcon,
//                       to: '/barry'
//                   },
//                   {
//                       title: 'Level 2',
//                       icon: CircleIcon,
//                       to: '/2.2level',
//                       children: [
//                           {
//                               title: 'Level 3',
//                               icon: CircleIcon,
//                               to: '/barry'
//                           }
//                       ]
//                   }
//               ]
//           }
//       ]
//   },
];

export default sidebarItem;
