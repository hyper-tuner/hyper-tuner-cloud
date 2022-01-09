import {
  Switch,
  Route,
  useLocation,
  matchPath,
} from 'react-router-dom';
import {
  Layout,
  Result,
  Skeleton,
} from 'antd';
import { connect } from 'react-redux';
import {
  lazy,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import useStorage from './hooks/useStorage';
import TopBar from './components/TopBar';
import StatusBar from './components/StatusBar';
import { Routes } from './routes';
import { loadTune } from './utils/api';
import store from './store';
import Log from './pages/Log';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';
import {
  AppState,
  NavigationState,
  UIState,
} from './types/state';

// TODO: fix this
// lazy loading this component causes a weird Curve canvas scaling
// const Log = lazy(() => import('./pages/Log'));

const Tune = lazy(() => import('./pages/Tune'));
const Diagnose = lazy(() => import('./pages/Diagnose'));
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Upload = lazy(() => import('./pages/Upload'));

const { Content } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  status: state.status,
  navigation: state.navigation,
});

const App = ({ ui, navigation }: { ui: UIState, navigation: NavigationState }) => {
  const margin = ui.sidebarCollapsed ? 80 : 250;
  // const [lastDialogPath, setLastDialogPath] = useState<string|null>();
  const { storageSet } = useStorage();
  // const lastDialogPath = storageGetSync('lastDialog');

  const { pathname } = useLocation();
  const matchedTunePath = useMemo(() => matchPath(pathname, {
    path: Routes.TUNE_ROOT,
  }), [pathname]);

  useEffect(() => {
    const tuneId = (matchedTunePath?.params as any)?.tuneId;
    if (tuneId) {
      loadTune(tuneId);
      storageSet('lastTuneId', tuneId);
      store.dispatch({ type: 'navigation/tuneId', payload: tuneId });
    }

    // storageGet('lastDialog')
    //   .then((path) => setLastDialogPath(path));

    // window.addEventListener('beforeunload', beforeUnload);
    // return () => {
    //   window.removeEventListener('beforeunload', beforeUnload);
    // };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ContentFor = useCallback((props: { children: ReactNode, marginLeft?: number }) => {
    const { children, marginLeft } = props;

    return (
      <Layout style={{ marginLeft }}>
        <Layout className="app-content">
          <Content>
            <Suspense fallback={<Skeleton
              active
              style={{
                maxWidth: 600,
                margin: '0 auto',
                padding: 20,
              }}
            />}>
              {children}
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    );
  }, []);

  return (
    <>
      <Layout>
        <TopBar tuneId={navigation.tuneId} />
        <Switch>
          <Route path={Routes.ROOT} exact>
            {/* <Route path={Routes.ROOT} exact>
              <Redirect to={lastDialogPath || Routes.TUNE_ROOT} />
            </Route> */}
            <ContentFor>
              <Result
                status="info"
                title="This page is under construction"
                style={{ marginTop: 50 }}
              />
            </ContentFor>
          </Route>
          <Route path={Routes.TUNE_TUNE}>
            <ContentFor marginLeft={margin}>
              <Tune />
            </ContentFor>
          </Route>
          <Route path={Routes.TUNE_LOG} exact>
            <ContentFor marginLeft={margin}>
              <Log />
            </ContentFor>
          </Route>
          <Route path={Routes.TUNE_DIAGNOSE} exact>
            <ContentFor marginLeft={margin}>
              <Diagnose />
            </ContentFor>
          </Route>
          <Route path={Routes.LOGIN} exact>
            <ContentFor>
              <Login />
            </ContentFor>
          </Route>
          <Route path={Routes.SIGN_UP} exact>
            <ContentFor>
              <SignUp />
            </ContentFor>
          </Route>
          <Route path={Routes.RESET_PASSWORD} exact>
            <ContentFor>
              <ResetPassword />
            </ContentFor>
          </Route>
          <Route path={Routes.UPLOAD} exact>
            <ContentFor>
              <Upload />
            </ContentFor>
          </Route>
        </Switch>
        <Result
          status="warning"
          title="Page not found"
          style={{ marginTop: 50 }}
        />
      </Layout>
      <StatusBar />
    </>
  );
};

export default connect(mapStateToProps)(App);
