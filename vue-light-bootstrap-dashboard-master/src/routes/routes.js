import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

import Login from '../pages/LoginView.vue'
import Register from '../pages/RegisterView.vue'


// Admin pages
import Overview from 'src/pages/Overview.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import FamilyOverview from 'src/pages/FamilyOverview.vue'
import FamilyProfile from 'src/pages/FamilyProfile.vue'
import TableList from 'src/pages/TableList.vue'
import FamilyTableList from 'src/pages/FamilyTableList.vue'
import Typography from 'src/pages/Typography.vue'
import Icons from 'src/pages/Icons.vue'
import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'
import AI from 'src/pages/TongYi2.vue'
// import { component } from 'vue/types/umd.js'
import { name } from 'v-tooltip'

import Vue from 'vue';
import Router from 'vue-router';
import FamilyScore from '../pages/FamilyScore.vue'

Vue.use(Router);

const routes = [
  {
    path: '/',
    // component: DashboardLayout,
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path:'/register',
    component:Register
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect:'/admin/overview/'+localStorage.getItem("userId"),
    children: [
      {
        path: 'overview/:userId',
        name: 'Overview',
        component: Overview
      },
      {
        path: 'familyOverview/:userId',
        name: 'FamilyOverview',
        component: FamilyOverview
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile
      },
      {
        path: 'family',
        name: 'Family',
        component: FamilyProfile
      },
      {
        path: 'familyscore',
        name: 'FamilyScore',
        component: FamilyScore
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'familytable-list',
        name: 'Family Table List',
        component: FamilyTableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'maps',
        name: 'Maps',
        component: Maps
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'upgrade',
        name: 'Upgrade to PRO',
        component: Upgrade
      },
      {
        path: 'ai',
        name: 'Ai',
        component: AI
      },
    ]
  },
  { path: '*', component: NotFound }
]

const router = new Router({
  mode: 'history', // 如果希望去掉 URL 中的 #，使用 history 模式
  routes
});

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
