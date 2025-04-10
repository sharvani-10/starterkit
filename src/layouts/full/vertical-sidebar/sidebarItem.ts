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
      title: 'Todo List',
      icon: BrandChromeIcon,
      to: '/'
  },
  {
      title: 'Todo Task',
      icon: BrandChromeIcon,
      to: '/DragDrop'
  },
  {
      title: 'Sorting',
      icon: BrandChromeIcon,
      to: '/Dummy'
  },
  {
    title: 'forms',
    icon: BrandChromeIcon,
    to: '/formcomplete'
},
  {
    title: 'BasicSyntax',
    icon: BrandChromeIcon,
    to: '/BasicSyntax'
},
  {
    title: 'Componentss',
    icon: BrandChromeIcon,
    to: '/componentss'
},
  {
    title: 'EventHandling',
    icon: BrandChromeIcon,
    to: '/EventHandling'
},
  {
    title: 'Reactive',
    icon: BrandChromeIcon,
    to: '/Reactive'
},
  {
    title: 'Ref',
    icon: BrandChromeIcon,
    to: '/Ref'
},
  {
    title: 'Computed',
    icon: BrandChromeIcon,
    to: '/Computed'
},
  {
    title: 'ConditionalRendering',
    icon: BrandChromeIcon,
    to: '/ConditionalRendering'
},
  {
    title: 'ForandV-model',
    icon: BrandChromeIcon,
    to: '/ForandV-model'
},
  {
    title: 'ParentComponent',
    icon: BrandChromeIcon,
    to: '/ParentComponent'
},
  {
    title: 'ChildComponent',
    icon: BrandChromeIcon,
    to: '/ChildComponent'
},
  {
    title: 'ComponentEvent',
    icon: BrandChromeIcon,
    to: '/ComponentEvent'
},
  {
    title: 'DefaultSlot',
    icon: BrandChromeIcon,
    to: '/DefaultSlot'
},
  {
    title: 'ProvideInject',
    icon: BrandChromeIcon,
    to: '/ProvideInject'
},
  {
    title: 'LifeCycle',
    icon: BrandChromeIcon,
    to: '/LifeCycle'
},
  {
    title: 'Watcher',
    icon: BrandChromeIcon,
    to: '/Watcher'
},
  {
    title: 'NewUser',
    icon: BrandChromeIcon,
    to: '/NewUser'
},
  {
    title: 'duplicateobject',
    icon: BrandChromeIcon,
    to: '/duplicateobject'
},

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
