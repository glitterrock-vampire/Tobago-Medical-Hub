import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation, Redirect } from 'wouter';
import {
  ClerkProvider,
  useAuth,
  useClerk,
  SignIn,
  SignUp,
} from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { publishableKeyFromHost } from '@clerk/react/internal';

import NotFound from '@/pages/not-found';
import Home from '@/pages/public/Home';
import Services from '@/pages/public/Services';
import About from '@/pages/public/About';
import Contact from '@/pages/public/Contact';
import Book from '@/pages/public/Book';

import Dashboard from '@/pages/admin/Dashboard';
import Appointments from '@/pages/admin/Appointments';
import Patients from '@/pages/admin/Patients';
import Enquiries from '@/pages/admin/Enquiries';

// REQUIRED — resolves the publishable key from hostname so the same
// build serves multiple Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — empty in dev (Clerk hits dev FAPI directly), auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Clerk appearance matching the warm mocha/beige brand palette
const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk' as const,
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#7B4435',
    colorForeground: '#3D2E2E',
    colorMutedForeground: '#8B6F6F',
    colorDanger: '#c0392b',
    colorBackground: '#F9F5F2',
    colorInput: '#FFFFFF',
    colorInputForeground: '#3D2E2E',
    colorNeutral: '#C4A69A',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: '0.5rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#F9F5F2] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-[#E8C5B8]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#3D2E2E] font-semibold',
    headerSubtitle: 'text-[#8B6F6F]',
    socialButtonsBlockButtonText: 'text-[#3D2E2E]',
    formFieldLabel: 'text-[#3D2E2E]',
    footerActionLink: 'text-[#7B4435] hover:text-[#5C3328]',
    footerActionText: 'text-[#8B6F6F]',
    dividerText: 'text-[#8B6F6F]',
    identityPreviewEditButton: 'text-[#7B4435]',
    formFieldSuccessText: 'text-green-600',
    alertText: 'text-[#3D2E2E]',
    logoBox: 'mb-2',
    logoImage: 'h-12 w-auto',
    socialButtonsBlockButton: 'border border-[#C4A69A] bg-white hover:bg-[#F5EDE8]',
    formButtonPrimary: 'bg-[#7B4435] hover:bg-[#5C3328] text-white',
    formFieldInput: 'border-[#C4A69A] bg-white text-[#3D2E2E] focus:ring-[#7B4435]',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-[#C4A69A]',
    alert: 'border-[#C4A69A]',
    otpCodeFieldInput: 'border-[#C4A69A]',
    formFieldRow: '',
    main: '',
  },
};

// Invalidate query cache when user changes
function ClerkQueryClientSync() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

// Protected route — redirect to sign-in if not authenticated
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2]">
        <div className="animate-pulse text-[#7B4435]">Loading...</div>
      </div>
    );
  }
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <Component />;
}

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F5F2] px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F5F2] px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/book" component={Book} />

      {/* Auth routes — must use /*? wildcard for Clerk OAuth sub-paths */}
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />

      {/* Protected admin routes */}
      <Route path="/admin">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/admin/appointments">
        <ProtectedRoute component={Appointments} />
      </Route>
      <Route path="/admin/patients">
        <ProtectedRoute component={Patients} />
      </Route>
      <Route path="/admin/enquiries">
        <ProtectedRoute component={Enquiries} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientSync />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
