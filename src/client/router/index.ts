import { isLoading } from "../store/isloading";
import { createRouter, createWebHistory } from "vue-router";
import "jquery";
import { onMountApp } from "../store/onMountApp";
import { isAdmin } from "../store/isAdmin";
import { signedIn } from "../store/signedIn"
import { useStoreAuth } from "../store/userStoreAuth";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () =>
        import(/* webpackChunkName: "Landing" */ "../views/LandingNew.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () =>
        import(/* webpackChunkName: "Register" */ "../views/Register.vue"),
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: () =>
        import(
          /* webpackChunkName: "Forgotpassword" */ "../views/Forgotpassword.vue"
        ),
    },
    {
      path: "/EditPostsList",
      name: "editpostslist",
      beforeEnter: guardRouteUser,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "EditPostsList" */ "../views/EditPostsList.vue"),
    },
    {
      path: "/AdminPage",
      name: "adminpage",
      beforeEnter: guardRouteAdmin,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "AdminPage" */ "../views/AdminPage.vue"),
    },
    {
      path: "/CreatePost/:createSlug",
      name: "createpost",
      beforeEnter: guardRouteUser,

      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "CreatePost" */ "../views/CreatePostNew.vue"),
    },
{
    path: "/CreateEvent/:createEvent",
    name: "createevent",
    beforeEnter: guardRouteUser,

    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "CreateEvent" */ "../views/CreatePostNew.vue"),
  },

    {
      path: "/Profile",
      name: "profile",
      beforeEnter: guardRouteUser,

      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "Profile" */ "../views/Profile.vue"),
      meta: { title: "Home" },
    },
    {
      path: "/rulebook",
      name: "rulebook",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "Rulebook" */ "../views/Rulebook.vue"),
    },
    {
      path: "/News",
      name: "news",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "News" */ "../views/News.vue"),
    },
    {
      path: "/bsl",
      name: "bsl",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "BSL" */ "../views/Blog.vue"),
    },
    {
      path: "/custom-teams",
      name: "customteams",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "Custom-teams" */ "../views/Custom-teams.vue"
        ),
    },
    {
      path: "/contact",
      name: "contact",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "Contact" */ "../views/Contact.vue"),
    },
    {
      path: "/pathMatch(.*)*",
      name: "not-found",
      component: () =>
        import(
          /* webpackChunkName: "PageNotFound" */ "../views/PageNotFound.vue"
        ),
    },
    {
      path: "/news/:newsSlug",
      name: "newspost",
      component: () =>
        import(/* webpackChunkName: "NewsPosts" */ "../views/NewsPost.vue"),
    },
    {
      path: "/blog/:blogSlug",
      name: "blogpost",
      component: () =>
        import(/* webpackChunkName: "BlogPost" */ "../views/BlogPost.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () =>
        import(/* webpackChunkName: "BlogPost" */ "../views/PageNotFound.vue"),
    },
    {
      path: "/regactivation/:userID",
      name: "regactivation",
      component: () =>
        import(/* webpackChunkName: "BlogPost" */ "../views/RegActivation.vue"),
    },
    {
      path: "/registertest/",
      name: "registertest",
      component: () =>
        import(/* webpackChunkName: "BlogPost" */ "../views/RegisterTest.vue"),
    },
    {
      path: "/logintest/",
      name: "logintest",
      component: () =>
        import(/* webpackChunkName: "BlogPost" */ "../views/LoginTest.vue"),
    },
    {
      path: "/transition/",
      name: "logintest",
      component: () =>
        import(/* webpackChunkName: "BlogPost" */ "../views/TransitionTest.vue"),
    },
  ],
});


router.afterEach((to, from) => {
  const mountApp = onMountApp();
  const isLoadingCheck = isLoading();

  if (to.path === "/news" || to.path === "/bsl") {

  } else {
    isLoadingCheck.state = true

    setTimeout(() => {
      if (mountApp.state) {
        isLoadingCheck.state = false
      }
    }, 300);
  }
});

router.beforeEach((to, from, next) => {

  const isAuthenticated = signedIn()

  if (
    (to.name == "profile" && !isAuthenticated) ||
    (to.name == "editpostslist" && !isAuthenticated) ||
    (to.name == "createpost" && !isAuthenticated)
  )
    next({ name: "login" });
  else if (to.name == "adminpage") {
    setTimeout(() => {
      next();
    }, 10);
  } else next();
});


async function guardRouteUser(to: any, from: any, next: any) {
    const storeAuth = useStoreAuth()
    await storeAuth.init()
    
    if (storeAuth.clearance === "admin" || storeAuth.clearance === "regular") {
      next()
    } else {
      next('/')
    }

}

async function guardRouteAdmin(to: any, from: any, next: any) {

  const isAdminCheck = isAdmin()

  if (isAdminCheck.state) {
    next()
  } else {

    const storeAuth = useStoreAuth()
    await storeAuth.init()
    if (storeAuth.clearance) {
      next()
    } else {
      next('/')
    }
  }
}

export default router;
