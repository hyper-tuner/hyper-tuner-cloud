import { useEffect, useMemo } from 'react';
import {
  useLocation,
  Switch,
  Route,
  matchPath,
  Redirect,
  generatePath,
} from 'react-router-dom';
import { Layout, Result } from 'antd';
import { connect } from 'react-redux';
import Dialog from './components/Dialog';
import { loadAll } from './utils/api';
import SideBar, { DialogMatchedPathType } from './components/SideBar';
import { AppState, UIState } from './types/state';
import BurnButton from './components/BurnButton';
import TopBar from './components/TopBar';
import StatusBar from './components/StatusBar';
import { isDesktop } from './utils/env';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './App.less';
import { Routes } from './routes';
import { Config as ConfigType } from './types/config';
import { storageGet } from './utils/storage';
import Log from './components/Log';

const { Content } = Layout;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
  status: state.status,
  config: state.config,
});

const App = ({ ui, config }: { ui: UIState, config: ConfigType }) => {
  const margin = ui.sidebarCollapsed ? 80 : 250;
  const { pathname } = useLocation();
  const dialogMatchedPath: DialogMatchedPathType = useMemo(() => matchPath(pathname, {
    path: Routes.DIALOG,
    exact: true,
  }) || { url: '', params: { category: '', dialog: '' } }, [pathname]);

  const lastDialogPath = storageGet('lastDialog');
  const firstDialogPath = useMemo(() => {
    if (!config.menus) {
      return null;
    }

    const firstCategory = Object.keys(config.menus)[0];
    const firstDialog = Object.keys(config.menus[firstCategory].subMenus)[0];
    return generatePath(Routes.DIALOG, { category: firstCategory, dialog: firstDialog });
  }, [config.menus]);

  useEffect(() => {
    loadAll();
    // window.addEventListener('beforeunload', beforeUnload);

    // return () => {
    //   window.removeEventListener('beforeunload', beforeUnload);
    // };
  }, []);

  return (
    <>
      <Layout>
        <TopBar />
        <Switch>
          <Route path={Routes.ROOT} exact>
            <Redirect to={lastDialogPath || Routes.TUNE} />
          </Route>
          <Route path={Routes.TUNE}>
            <Route path={Routes.TUNE} exact>
              {firstDialogPath && <Redirect to={lastDialogPath || firstDialogPath} />}
            </Route>
            <Layout style={{ marginLeft: margin }}>
              <SideBar matchedPath={dialogMatchedPath} />
              <Layout className="app-content">
                <Content>
                  <Dialog
                    name={dialogMatchedPath.params.dialog}
                    url={dialogMatchedPath.url}
                    burnButton={isDesktop && <BurnButton />}
                  />
                </Content>
              </Layout>
            </Layout>
          </Route>
          <Route path={Routes.LOG}>
            <Layout style={{ marginLeft: margin }}>
              <Layout className="app-content">
                <Content>
                  <Log />
                </Content>
              </Layout>
            </Layout>
          </Route>
          <Route>
            <Result
              status="warning"
              title="There is nothing here"
              style={{ marginTop: 50 }}
            />
          </Route>
        </Switch>
      </Layout>
      <StatusBar />
    </>
  );
};

export default connect(mapStateToProps)(App);
