import type { recentTransaction,productPerformance,topCards } from "@/types/components/dashboards/EcommerceDash";
/*import tabler icons*/
import {  BoxIcon, ChartBarIcon, CheckIcon, CreditCardIcon, CurrencyDollarIcon, RefreshIcon, ShieldIcon, UsersIcon, } from 'vue-tabler-icons';
import img1 from '@/assets/images/products/1.jpg';
import img2 from '@/assets/images/products/2.jpg';
import img3 from '@/assets/images/products/3.jpg';
import img4 from '@/assets/images/products/4.jpg';

const recentTransactionData: recentTransaction[] = [
    {
        color: "info",
        bgcolor: "primary",
        icon: CurrencyDollarIcon,
        title: "PayPal Transfer",
        desc: "Money Added",
        price: "+$350",
        status: "text-success",
    },
    {
        color: "success",
        bgcolor: "success",
        icon: ShieldIcon,
        title: "Wallet",
        desc: "Bill Payment",
        price: "-$560",
        status: "text-error",
    },
    {
        color: "error",
        bgcolor: "error",
        icon: CreditCardIcon,
        title: "Credit Card",
        desc: "Money reversed",
        price: "+$350",
        status: "text-success",
    },
    {
        color: "warning",
        bgcolor: "warning",
        icon: CheckIcon,
        title: "Bank Transfer",
        desc: "Money added",
        price: "+$350",
        status: "text-success",
    },
    {
        color: "info",
        bgcolor: "primary",
        icon: CurrencyDollarIcon,
        title: "Refund",
        desc: "Payment Sent",
        price: "-$50",
        status: "text-error",
    },
]

const productPerformanceData: productPerformance[] = [
    {
        avatar: img1,
        name: "Is it good butterscotch ice-cream?",
        category: "Ice-Cream, Milk, Powder",
        earn: "546,000",
        percent: 45,
      },
      {
        avatar: img2,
        name: "Supreme fresh tomato available",
        category: "Market, Mall",
        earn: "780,000",
        percent: 20,
      },
      {
        avatar: img3,
        name: "Red color candy from Gucci",
        category: "Chocolate, Yummy",
        earn: "457,000",
        percent: 60,
      },
      {
        avatar: img4,
        name: "Stylish night lamp for night",
        category: "Elecric, Wire, Current",
        earn: "125,000",
        percent: 40,
      },
]

const topCardsData: topCards[] = [
  {
    color: "secondary",
    bgcolor: "lightprimary",
    icon: UsersIcon,
    title: "39,354",
    desc: "Customers",
    price: "-$9",
    status: "text-error",
},
{
    color: "warning",
    bgcolor: "lightwarning",
    icon: BoxIcon,
    title: "4,396",
    desc: "Products",
    price: "+$23",
    status: "text-success",
},
{
    color: "error",
    bgcolor: "lighterror",
    icon: ChartBarIcon,
    title: "423,39",
    desc: "Sales",
    price: "+$38",
    status: "text-error",
},
{
    color: "success",
    bgcolor: "lightsuccess",
    icon: RefreshIcon,
    title: "835 ",
    desc: "Refunds",
    price: "-$12",
    status: "text-error",
},
]

export { recentTransactionData,productPerformanceData,topCardsData };