import { lazy } from 'react';
const Landing = lazy(() => import('../pages/landing/Landing'));
const NewsletterSubscriptions = lazy(() => import('../components/newsletter/SubscriptionView'));
const NewsletterSubUnsubscribe = lazy(() => import('../components/newsletter/UnsubscribeView'));
const Newsletters = lazy(() => import('../components/newsletter/Newsletters'));
const NewsletterTemplates = lazy(() => import('../components/newsletter/NewsletterTemplates'));
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));
const ServerError = lazy(() => import('../pages/error/ServerError'));
const Blogs = lazy(() => import('../components/blogs/Blogs'));
const ViewMore = lazy(() => import('../components/blogs/ViewMore'));
const Organizations = lazy(() => import('../pages/location/RenderOrganizations'));
const MobileMenu = lazy(() => import('../pages/menus/MobileMenu'));
const TeamMembers = lazy(() => import('../pages/teammembers/TeamMembers'));
const ContactUs = lazy(() => import('../pages/contactus/ContactUs'));
const PrivacyPolicy = lazy(() => import('../components/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('../components/cookies/CookiePolicy'));
const BlogsForm = lazy(() => import('../components/blogs/BlogsForm'));
const Timeline = lazy(() => import('../pages/landing/Timeline'));

const Register = lazy(() => import('../components/user/Register'));
const Login = lazy(() => import('../components/user/Login'));
const Confirm = lazy(() => import('../components/user/Confirm'));
const ForgotPassword = lazy(() => import('../components/user/ForgotPassword'));
const Faq = lazy(() => import('../pages/landing/FAQ'));
const ConfirmInvite = lazy(() => import('../components/user/ConfirmInvite'));
const CartCheckoutSuccess = lazy(() => import('../pages/cart/CartCheckoutSuccessPage'));
const ShareStoryPublic = lazy(() => import('../components/stories/ShareStoryPublic'));
const Checkout = lazy(() => import('../checkout/SubscriptionCheckout'));

const routes = [
    {
        path: '/faq',
        name: 'Faq',
        exact: true,
        element: Faq,
        roles: ['OrgAdmin', 'Customer'],
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/privacy',
        name: 'PrivacyPolicy',
        exact: true,
        element: PrivacyPolicy,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/cookies',
        name: 'CookiePolicy',
        exact: true,
        element: CookiePolicy,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/',
        name: 'Landing',
        exact: true,
        element: Landing,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/newsletters',
        name: 'Newsletters',
        element: Newsletters,
        roles: [],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/newslettersubscriptions',
        name: 'NewsletterSubscriptions',
        element: NewsletterSubscriptions,
        roles: [],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/newslettersubscriptions/unsubscribe',
        name: 'NewsLetterSubUnsubscribe',
        element: NewsletterSubUnsubscribe,
        roles: [],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/newslettertemplates',
        name: 'NewsletterTemplates',
        element: NewsletterTemplates,
        roles: [],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/sharestorypublic',
        name: 'ShareStoryPublic',
        exact: true,
        element: ShareStoryPublic,
        rolse: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const users = [
    {
        path: '/register',
        name: 'Register',
        exact: true,
        element: Register,
        roles: [],
        isAnonymous: true,
        isSimple: true,
    },
    {
        path: '/login',
        name: 'Login',
        exact: true,
        element: Login,
        roles: [],
        isAnonymous: true,
        isSimple: true,
    },
    {
        path: '/account/forgot-password',
        name: 'Forgot Password',
        exact: true,
        element: ForgotPassword,
        roles: [],
        isAnonymous: true,
        isSimple: true,
    },
    {
        path: '/confirm',
        name: 'Confirm Account',
        exact: true,
        element: Confirm,
        roles: [],
        isAnonymous: true,
        isSimple: true,
    },
    {
        path: '/cart/checkout',
        name: 'CartCheckoutSuccessPage',
        exact: true,
        element: CartCheckoutSuccess,
        roles: [],
        isAnonymous: true,
    },
    {
        path: '/orgs/:orgId/menus/mobile',
        name: 'MobileMenu',
        exact: true,
        element: MobileMenu,
        roles: [],
        isAnonymous: true,
    },
    {
        path: '/subscriptionscheckout',
        name: 'Checkout',
        exact: true,
        element: Checkout,
        roles: [],
        isAnonymous: true,
    },
    {
        path: '/users/invite',
        name: 'Confirm Invite by Token',
        exact: true,
        element: ConfirmInvite,
        roles: [],
        isAnonymous: true,
        isSimple: true,
    },
];

//     {
//         path: '/subscriptionscheckout',
//         name: 'Checkout',
//         exact: true,
//         element: Checkout,
//         roles: [],
//         isAnonymous: true,
//     },
//     {
//         path: '/users/invite',
//         name: 'Confirm Invite by Token',
//         exact: true,
//         element: ConfirmInvite,
//         roles: [],
//         isAnonymous: true,
//         isSimple: true,
//     },
// ];

const timelineRoutes = [
    {
        path: '/timeline',
        name: 'Timeline',
        exact: true,
        element: Timeline,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const organizationRoutes = [
    {
        path: '/locations',
        name: 'Organizations',
        exact: true,
        element: Organizations,
        roles: [],
        isAnonymous: true,
    },
];

const contactUsRoutes = [
    {
        path: '/contactus',
        name: 'ContactUs',
        exact: true,
        element: ContactUs,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const blogsRoutes = [
    {
        path: '/blogs',
        name: 'Blogs',
        exact: true,
        element: Blogs,
        roles: [],
        isAnonymous: true,
    },
    {
        path: '/blogs/:id',
        name: 'ViewMore',
        exact: true,
        element: ViewMore,
        roles: [],
        isAnonymous: true,
    },
];

const blogsForm = [
    {
        path: '/blogsadmin',
        name: 'blogsadmin',
        exact: true,
        element: BlogsForm,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const contentPages = [
    {
        path: '/teammembers',
        name: 'Team Members',
        exact: true,
        element: TeamMembers,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const errorRoutes = [
    {
        path: '/error-500',
        name: 'Error - 500',
        element: ServerError,
        roles: [],
        exact: true,
        isAnonymous: true,
        isSimple: true,
    },
    {
        path: '*',
        name: 'Error - 404',
        element: PageNotFound,
        roles: [],
        exact: true,
        isAnonymous: true,
        isSimple: true,
    },
];
const allRoutes = [
    ...routes,
    ...errorRoutes,
    ...timelineRoutes,
    ...users,
    ...blogsRoutes,
    ...blogsForm,
    ...organizationRoutes,
    ...contactUsRoutes,
    ...contentPages,
];

export default allRoutes;
