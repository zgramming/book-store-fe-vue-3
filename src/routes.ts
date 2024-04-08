import { createRouter, createWebHistory } from 'vue-router';
import MasterBookPage from './pages/MasterBookPage.vue';
import MasterStudentPage from './pages/MasterStudentPage.vue';
import InventoryPage from './pages/InventoryPage.vue';
import TransactionPage from './pages/TransactionPage.vue';
import HistoryPage from './pages/HistoryPage.vue';
import NotFoundPage from './pages/errors/NotFoundPage.vue';
import MasterBookFormPage from './pages/MasterBookFormPage.vue';
import MasterStudentFormPage from './pages/MasterStudentFormPage.vue';
import InventoryFormPage from './pages/InventoryFormPage.vue';
import TransactionFormPage from './pages/TransactionFormPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/master-book',
    },

    // Master Book Routes
    {
      path: '/master-book',
      name: 'master-book',
      component: MasterBookPage,
    },
    {
      path: '/master-book/:id',
      name: 'master-book-form',
      component: MasterBookFormPage,
    },
    // End of Master Book Routes

    // Master Student Routes
    {
      path: '/master-student',
      name: 'master-student',
      component: MasterStudentPage,
    },
    {
      path: '/master-student/:id',
      name: 'master-student-form',
      component: MasterStudentFormPage,
    },
    // End of Master Student Routes

    // Inventory Routes

    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryPage,
    },
    {
      path: '/inventory/:id',
      name: 'inventory-form',
      component: InventoryFormPage,
    },
    // End of Inventory Routes

    // Transaction Routes
    {
      path: '/transaction',
      name: 'transaction',
      component: TransactionPage,
    },
    {
      path: '/transaction/:id',
      name: 'transaction-form',
      component: TransactionFormPage,
    },
    // End of Transaction Routes

    // History Routes
    {
      path: '/history',
      name: 'history',
      component: HistoryPage,
    },
    // End of History Routes

    // Redirect to NotFound page
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
  ],
});

export default router;
