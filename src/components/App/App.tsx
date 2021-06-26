import React, {useEffect, useMemo, useState} from 'react';
import 'components/App/App.css';
import PageProducts from "components/pages/PageProducts/PageProducts";
import MainLayout from "components/MainLayout/MainLayout";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import PageProductForm from "components/pages/PageProductForm/PageProductForm";
import PageCart from "components/pages/PageCart/PageCart";
import PageOrders from "components/pages/PageOrders/PageOrders";
import PageOrder from "components/pages/PageOrder/PageOrder";
import PageProductImport from "components/pages/admin/PageProductImport/PageProductImport";
import {PaletteOptions} from "@material-ui/core/styles/createPalette";
import {useSelector} from "react-redux";
import {selectDarkMode} from "../../store/themeSlice";
import {createMuiTheme, Snackbar} from "@material-ui/core";
import {MuiThemeProvider} from "@material-ui/core/styles";
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios";

const lightPalette: PaletteOptions = {
  primary: {
    main: '#ff3d00',
  },
  secondary: {
    main: '#00B383',
    contrastText: '#fff'
  }
}

const darkPalette: PaletteOptions = {
  type: 'dark',
  primary: {
    main: '#B32A00',
  },
  secondary: {
    main: '#00B383',
    contrastText: '#fff'
  }
}

function App() {
  const darkMode = useSelector(selectDarkMode)
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: darkMode ? darkPalette : lightPalette
      }),
    [darkMode]
  )
  const [error, setError] = useState<string | null>();
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      function (error) {
        if (error?.response?.status === 400) {
          alert(error.response.data?.data);
        }

        if (error?.response?.status === 401) {
          setError('Unauthorized');
          setShowError(true);
        }

        if (error?.response?.status === 403) {
          setError('Access denied');
          setShowError(true);
        }

        return Promise.reject(error?.response ?? error);
      }
    );
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/">
            <MainLayout>
              <Route exact path="/">
                <PageProducts/>
              </Route>
              <Route exact path={["/admin/product-form/:id", '/admin/product-form']}>
                <PageProductForm/>
              </Route>
              <Route exact path="/cart">
                <PageCart/>
              </Route>
              <Route exact path="/admin/orders">
                <PageOrders/>
              </Route>
              <Route exact path="/admin/order/:id">
                <PageOrder/>
              </Route>
              <Route exact path="/admin/products">
                <PageProductImport/>
              </Route>
            </MainLayout>
          </Route>
        </Switch>

        <Snackbar open={showError} autoHideDuration={3000} onClose={() => setShowError(false)}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
