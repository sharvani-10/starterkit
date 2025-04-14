import { useRouter } from 'vue-router';

const router=useRouter()

const handleAction = ({ action, item }: any) => {
    console.log('Action received in parent:', action, item);
    if (action === 'edit') {
      router.push('/NewUser')
      sessionStorage.setItem('item',JSON.stringify(item))
    }
  };


<!-- drag.vue -->